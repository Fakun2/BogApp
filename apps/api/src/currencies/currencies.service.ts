import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../database/prisma.service";
import type {
  AddTenantCurrenciesInput,
  CreateCurrencyInput,
  ListAvailableTenantCurrenciesQuery,
  ListCurrenciesQuery,
  ListTenantCurrenciesQuery,
  UpdateCurrencyInput
} from "./currencies.schemas";

@Injectable()
export class CurrenciesService {
  constructor(private readonly prisma: PrismaService) {}

  async list(query: ListCurrenciesQuery) {
    const where = buildCurrencyWhere(query);

    const [items, total, active, inactive] = await this.prisma.$transaction([
      this.prisma.currency.findMany({
        where,
        orderBy: getOrderBy(query.sortBy, query.sortDirection),
        skip: query.offset,
        take: query.limit,
        select: currencySelect
      }),
      this.prisma.currency.count({ where }),
      this.prisma.currency.count({ where: { active: true } }),
      this.prisma.currency.count({ where: { active: false } })
    ]);

    return {
      items: items.map(toCurrencyDto),
      metrics: {
        active,
        inactive,
        total: active + inactive
      },
      pageInfo: {
        hasNextPage: query.offset + items.length < total,
        hasPreviousPage: query.offset > 0,
        limit: query.limit,
        offset: query.offset,
        total
      }
    };
  }

  async listTenantCurrencies(tenantId: string, query: ListTenantCurrenciesQuery) {
    const cursor = typeof query.cursor === "string" ? decodeTenantCurrencyCursor(query.cursor) : null;

    if (cursor && (cursor.sortBy !== query.sortBy || cursor.sortDirection !== query.sortDirection)) {
      throw new BadRequestException("El cursor no corresponde al orden seleccionado.");
    }

    const where = buildTenantCurrencyWhere(tenantId, query, cursor);

    const [items, active, available] = await this.prisma.$transaction([
      this.prisma.tenantCurrency.findMany({
        where,
        orderBy: getTenantCurrencyOrderBy(query.sortBy, query.sortDirection),
        take: query.limit + 1,
        select: tenantCurrencySelect
      }),
      this.prisma.tenantCurrency.count({ where: { active: true, tenantId } }),
      this.prisma.currency.count({
        where: {
          active: true,
          tenants: {
            none: {
              active: true,
              tenantId
            }
          }
        }
      })
    ]);

    const hasNextPage = items.length > query.limit;
    const pageItems = hasNextPage ? items.slice(0, query.limit) : items;

    return {
      items: pageItems.map(toTenantCurrencyDto),
      metrics: {
        active,
        available
      },
      pageInfo: {
        hasNextPage,
        limit: query.limit,
        nextCursor: hasNextPage
          ? encodeTenantCurrencyCursor(pageItems.at(-1), query.sortBy, query.sortDirection)
          : null
      }
    };
  }

  async addTenantCurrencies(tenantId: string, input: AddTenantCurrenciesInput) {
    const currencies = await this.prisma.currency.findMany({
      where: {
        active: true,
        code: { in: input.currencyCodes }
      },
      select: currencySelect
    });
    const foundCodes = new Set(currencies.map((currency) => currency.code));
    const invalidCodes = input.currencyCodes.filter((code) => !foundCodes.has(code));

    if (invalidCodes.length > 0) {
      throw new BadRequestException(`Monedas invalidas o inactivas: ${invalidCodes.join(", ")}.`);
    }

    await this.prisma.$transaction(
      input.currencyCodes.map((currencyCode) =>
        this.prisma.tenantCurrency.upsert({
          where: {
            tenantId_currencyCode: {
              currencyCode,
              tenantId
            }
          },
          update: { active: true },
          create: {
            currencyCode,
            tenantId
          }
        })
      )
    );

    const items = await this.prisma.currency.findMany({
      where: { code: { in: input.currencyCodes } },
      orderBy: [{ name: "asc" }, { id: "asc" }],
      select: currencySelect
    });

    return { items: items.map(toCurrencyDto) };
  }

  async disableTenantCurrency(tenantId: string, currencyCode: string) {
    const normalizedCode = normalizeCurrencyCode(currencyCode);

    await this.assertTenantCurrencyIsNotDefault(tenantId, normalizedCode);

    const tenantCurrency = await this.prisma.tenantCurrency.findUnique({
      where: {
        tenantId_currencyCode: {
          currencyCode: normalizedCode,
          tenantId
        }
      },
      select: tenantCurrencySelect
    });

    if (!tenantCurrency) {
      throw new NotFoundException("La moneda no esta habilitada en este estudio.");
    }

    const updated = await this.prisma.tenantCurrency.update({
      where: {
        tenantId_currencyCode: {
          currencyCode: normalizedCode,
          tenantId
        }
      },
      data: { active: false },
      select: tenantCurrencySelect
    });

    return toTenantCurrencyDto(updated);
  }

  async listAvailableTenantCurrencies(
    tenantId: string,
    query: ListAvailableTenantCurrenciesQuery
  ) {
    const items = await this.prisma.currency.findMany({
      where: {
        active: true,
        tenants: {
          none: {
            active: true,
            tenantId
          }
        },
        ...(query.search
          ? {
              OR: [
                { code: { contains: query.search, mode: Prisma.QueryMode.insensitive } },
                { name: { contains: query.search, mode: Prisma.QueryMode.insensitive } },
                { symbol: { contains: query.search, mode: Prisma.QueryMode.insensitive } }
              ]
            }
          : {})
      },
      orderBy: [{ name: "asc" }, { id: "asc" }],
      take: query.limit,
      select: currencySelect
    });

    return { items: items.map(toCurrencyDto) };
  }

  async create(input: CreateCurrencyInput) {
    try {
      const currency = await this.prisma.currency.create({
        data: {
          active: true,
          code: input.code,
          name: input.name,
          symbol: input.symbol
        },
        select: currencySelect
      });

      return toCurrencyDto(currency);
    } catch (error) {
      if (isUniqueConstraintError(error)) {
        throw new ConflictException("Ya existe una moneda con ese codigo.");
      }

      throw error;
    }
  }

  async update(currencyId: string, input: UpdateCurrencyInput) {
    await this.findCurrencyOrThrow(currencyId);

    if (input.active === false) {
      await this.assertCurrencyIsNotDefault(currencyId);
    }

    const currency = await this.prisma.currency.update({
      where: { id: currencyId },
      data: {
        active: input.active,
        name: input.name,
        symbol: input.symbol
      },
      select: currencySelect
    });

    return toCurrencyDto(currency);
  }

  async delete(currencyId: string) {
    await this.findCurrencyOrThrow(currencyId);
    await this.assertCurrencyIsNotDefault(currencyId);

    await this.prisma.currency.update({
      where: { id: currencyId },
      data: { active: false }
    });

    return { status: "ok" as const };
  }

  private async findCurrencyOrThrow(currencyId: string) {
    const currency = await this.prisma.currency.findUnique({
      where: { id: currencyId },
      select: { id: true }
    });

    if (!currency) {
      throw new NotFoundException("La moneda no existe.");
    }

    return currency;
  }

  private async assertCurrencyIsNotDefault(currencyId: string) {
    const currency = await this.prisma.currency.findUnique({
      where: { id: currencyId },
      select: {
        code: true,
        _count: {
          select: { tenantSettings: true }
        }
      }
    });

    if (!currency) {
      throw new NotFoundException("La moneda no existe.");
    }

    if (currency._count.tenantSettings > 0) {
      throw new BadRequestException(
        "No se puede desactivar una moneda usada como default por un estudio."
      );
    }
  }

  private async assertTenantCurrencyIsNotDefault(tenantId: string, currencyCode: string) {
    const tenantSettings = await this.prisma.tenantSettings.findUnique({
      where: { tenantId },
      select: { defaultCurrencyCode: true }
    });

    if (tenantSettings?.defaultCurrencyCode === currencyCode) {
      throw new BadRequestException("No se puede deshabilitar la moneda default del estudio.");
    }
  }
}

const currencySelect = {
  active: true,
  code: true,
  id: true,
  name: true,
  symbol: true
} satisfies Prisma.CurrencySelect;

type CurrencyWithSelect = Prisma.CurrencyGetPayload<{ select: typeof currencySelect }>;

const tenantCurrencySelect = {
  active: true,
  id: true,
  currency: {
    select: currencySelect
  }
} satisfies Prisma.TenantCurrencySelect;

type TenantCurrencyWithSelect = Prisma.TenantCurrencyGetPayload<{
  select: typeof tenantCurrencySelect;
}>;

type TenantCurrencyCursor = {
  id: string;
  sortBy: ListTenantCurrenciesQuery["sortBy"];
  sortDirection: ListTenantCurrenciesQuery["sortDirection"];
  value: string | boolean;
};

function buildCurrencyWhere(query: ListCurrenciesQuery): Prisma.CurrencyWhereInput {
  return {
    ...(query.active === undefined ? {} : { active: query.active }),
    ...(query.search
      ? {
          OR: [
            { code: { contains: query.search, mode: Prisma.QueryMode.insensitive } },
            { name: { contains: query.search, mode: Prisma.QueryMode.insensitive } },
            { symbol: { contains: query.search, mode: Prisma.QueryMode.insensitive } }
          ]
        }
      : {})
  };
}

function buildTenantCurrencyWhere(
  tenantId: string,
  query: ListTenantCurrenciesQuery,
  cursor: TenantCurrencyCursor | null
): Prisma.TenantCurrencyWhereInput {
  return {
    AND: [
      {
        tenantId,
        ...(query.active === undefined ? {} : { active: query.active }),
        ...(query.search
          ? {
              currency: {
                OR: [
                  { code: { contains: query.search, mode: Prisma.QueryMode.insensitive } },
                  { name: { contains: query.search, mode: Prisma.QueryMode.insensitive } },
                  { symbol: { contains: query.search, mode: Prisma.QueryMode.insensitive } }
                ]
              }
            }
          : {})
      },
      ...(cursor ? [{ OR: getTenantCurrencyCursorWhere(cursor) }] : [])
    ]
  };
}

function getOrderBy(sortBy: ListCurrenciesQuery["sortBy"], direction: "asc" | "desc") {
  const tieBreaker = { id: direction } as const;

  if (sortBy === "code") {
    return [{ code: direction }, tieBreaker];
  }

  if (sortBy === "active") {
    return [{ active: direction }, { name: "asc" as const }, tieBreaker];
  }

  return [{ name: direction }, tieBreaker];
}

function getTenantCurrencyOrderBy(
  sortBy: ListTenantCurrenciesQuery["sortBy"],
  direction: "asc" | "desc"
) {
  const tieBreaker = { id: direction } as const;

  if (sortBy === "code") {
    return [{ currency: { code: direction } }, tieBreaker];
  }

  if (sortBy === "active") {
    return [{ active: direction }, tieBreaker];
  }

  return [{ currency: { name: direction } }, tieBreaker];
}

function toCurrencyDto(currency: CurrencyWithSelect) {
  return currency;
}

function toTenantCurrencyDto(tenantCurrency: TenantCurrencyWithSelect) {
  return {
    ...tenantCurrency.currency,
    active: tenantCurrency.active
  };
}

function encodeTenantCurrencyCursor(
  tenantCurrency: TenantCurrencyWithSelect | undefined,
  sortBy: ListTenantCurrenciesQuery["sortBy"],
  sortDirection: ListTenantCurrenciesQuery["sortDirection"]
) {
  if (!tenantCurrency) {
    return null;
  }

  const cursor: TenantCurrencyCursor = {
    id: tenantCurrency.id,
    sortBy,
    sortDirection,
    value: getTenantCurrencyCursorValue(tenantCurrency, sortBy)
  };

  return Buffer.from(JSON.stringify(cursor)).toString("base64url");
}

function decodeTenantCurrencyCursor(cursor?: string): TenantCurrencyCursor | null {
  if (!cursor) {
    return null;
  }

  try {
    const parsed = JSON.parse(Buffer.from(cursor, "base64url").toString("utf8")) as Partial<
      TenantCurrencyCursor
    >;

    if (
      typeof parsed.id !== "string" ||
      !["name", "code", "active"].includes(String(parsed.sortBy)) ||
      !["asc", "desc"].includes(String(parsed.sortDirection))
    ) {
      throw new Error("Invalid cursor");
    }

    if (parsed.sortBy === "active" && typeof parsed.value !== "boolean") {
      throw new Error("Invalid cursor value");
    }

    if (parsed.sortBy !== "active" && typeof parsed.value !== "string") {
      throw new Error("Invalid cursor value");
    }

    return parsed as TenantCurrencyCursor;
  } catch {
    throw new BadRequestException("El cursor de monedas es invalido.");
  }
}

function getTenantCurrencyCursorValue(
  tenantCurrency: TenantCurrencyWithSelect,
  sortBy: ListTenantCurrenciesQuery["sortBy"]
) {
  if (sortBy === "code") {
    return tenantCurrency.currency.code;
  }

  if (sortBy === "active") {
    return tenantCurrency.active;
  }

  return tenantCurrency.currency.name;
}

function getTenantCurrencyCursorWhere(
  cursor: TenantCurrencyCursor
): Prisma.TenantCurrencyWhereInput[] {
  const operator = cursor.sortDirection === "asc" ? "gt" : "lt";

  if (cursor.sortBy === "code") {
    return [
      { currency: { code: { [operator]: cursor.value as string } } },
      { currency: { code: cursor.value as string }, id: { [operator]: cursor.id } }
    ];
  }

  if (cursor.sortBy === "active") {
    return getTenantCurrencyActiveCursorWhere(cursor);
  }

  return [
    { currency: { name: { [operator]: cursor.value as string } } },
    { currency: { name: cursor.value as string }, id: { [operator]: cursor.id } }
  ];
}

function getTenantCurrencyActiveCursorWhere(
  cursor: TenantCurrencyCursor
): Prisma.TenantCurrencyWhereInput[] {
  const direction = cursor.sortDirection;
  const active = cursor.value as boolean;
  const idOperator = direction === "asc" ? "gt" : "lt";
  const where: Prisma.TenantCurrencyWhereInput[] = [
    { active, id: { [idOperator]: cursor.id } }
  ];

  if (direction === "asc" && active === false) {
    where.unshift({ active: true });
  }

  if (direction === "desc" && active === true) {
    where.unshift({ active: false });
  }

  return where;
}

function isUniqueConstraintError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: string }).code === "P2002"
  );
}

function normalizeCurrencyCode(currencyCode: string) {
  const normalizedCode = currencyCode.trim().toUpperCase();

  if (!/^[A-Z]{3}$/.test(normalizedCode)) {
    throw new BadRequestException("El codigo de moneda es invalido.");
  }

  return normalizedCode;
}
