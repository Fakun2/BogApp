import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { ClientType, Prisma } from "@prisma/client";
import { PrismaService } from "../database/prisma.service";
import type {
  CreateClientInput,
  ListClientsQuery,
  UpdateClientInput
} from "./clients.schemas";

@Injectable()
export class ClientsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(tenantId: string, query: ListClientsQuery) {
    const where: Prisma.ClientWhereInput = {
      tenantId,
      ...(query.status ? { status: query.status } : {}),
      ...(query.type ? { type: query.type } : {}),
      ...(query.search
        ? {
            OR: [
              { firstName: contains(query.search) },
              { lastName: contains(query.search) },
              { businessName: contains(query.search) },
              { dni: { contains: query.search } },
              { cuil: { contains: query.search } },
              { cuit: { contains: query.search } },
              { email: contains(query.search) },
              { phone: { contains: query.search } }
            ]
          }
        : {})
    };

    const [clients, totalClients, activeClients, humanClients, legalEntityClients] =
      await this.prisma.$transaction([
        this.prisma.client.findMany({
          cursor: query.cursor ? { id: query.cursor } : undefined,
          where,
          orderBy: getOrderBy(query.sortBy, query.sortDirection),
          skip: query.cursor ? 1 : 0,
          take: query.limit + 1,
          include: clientInclude
        }),
        this.prisma.client.count({ where: { tenantId } }),
        this.prisma.client.count({ where: { tenantId, status: "active" } }),
        this.prisma.client.count({ where: { tenantId, type: "human" } }),
        this.prisma.client.count({ where: { tenantId, type: "legal_entity" } })
      ]);

    const hasNextPage = clients.length > query.limit;
    const pageItems = hasNextPage ? clients.slice(0, query.limit) : clients;

    return {
      items: pageItems.map(toClientDto),
      metrics: { totalClients, activeClients, humanClients, legalEntityClients },
      pageInfo: {
        limit: query.limit,
        nextCursor: hasNextPage ? (pageItems.at(-1)?.id ?? null) : null,
        hasNextPage
      }
    };
  }

  async create(tenantId: string, input: CreateClientInput) {
    assertClientTypeFields(input.type, input);
    await this.assertUniqueDocuments(tenantId, input);

    const client = await this.prisma.client.create({
      data: {
        tenantId,
        type: input.type,
        status: input.status,
        ...toWritableData(input.type, input)
      },
      include: clientInclude
    });

    return toClientDto(client);
  }

  async getDetail(tenantId: string, clientId: string) {
    const client = await this.findTenantClientOrThrow(tenantId, clientId);
    const primaryCases = client._count.primaryCases;
    const caseParticipations = client._count.caseParticipations;

    return {
      ...toClientDto(client),
      metrics: {
        primaryCases,
        caseParticipations,
        totalCases: primaryCases + caseParticipations
      }
    };
  }

  async update(tenantId: string, clientId: string, input: UpdateClientInput) {
    const current = await this.findTenantClientOrThrow(tenantId, clientId);
    const nextType = input.type ?? current.type;
    const merged = { ...current, ...input };

    assertClientTypeFields(nextType, merged);
    await this.assertUniqueDocuments(tenantId, merged, clientId);

    const client = await this.prisma.client.update({
      where: { id: clientId },
      data: {
        ...(input.type !== undefined ? { type: input.type } : {}),
        ...(input.status !== undefined ? { status: input.status } : {}),
        ...toWritableData(nextType, input, input.type !== undefined)
      },
      include: clientInclude
    });

    return toClientDto(client);
  }

  async archive(tenantId: string, clientId: string) {
    await this.findTenantClientOrThrow(tenantId, clientId);
    await this.prisma.client.update({
      where: { id: clientId },
      data: { status: "archived" }
    });

    return { status: "ok" as const, clientStatus: "archived" as const };
  }

  private async findTenantClientOrThrow(tenantId: string, clientId: string) {
    const client = await this.prisma.client.findFirst({
      where: { id: clientId, tenantId },
      include: clientInclude
    });

    if (!client) {
      throw new NotFoundException("El cliente no existe en el estudio activo.");
    }

    return client;
  }

  private async assertUniqueDocuments(
    tenantId: string,
    input: { dni?: string | null; cuil?: string | null; cuit?: string | null },
    excludedClientId?: string
  ) {
    const documents = [
      input.dni ? { dni: input.dni } : null,
      input.cuil ? { cuil: input.cuil } : null,
      input.cuit ? { cuit: input.cuit } : null
    ].filter((item): item is { dni: string } | { cuil: string } | { cuit: string } => item !== null);

    if (documents.length === 0) {
      return;
    }

    const duplicate = await this.prisma.client.findFirst({
      where: {
        tenantId,
        ...(excludedClientId ? { id: { not: excludedClientId } } : {}),
        OR: documents
      },
      select: { id: true }
    });

    if (duplicate) {
      throw new ConflictException("Ya existe un cliente con ese DNI, CUIL o CUIT.");
    }
  }
}

const clientInclude = {
  _count: {
    select: {
      caseParticipations: true,
      primaryCases: true
    }
  }
} satisfies Prisma.ClientInclude;

type ClientWithCounts = Prisma.ClientGetPayload<{ include: typeof clientInclude }>;
type ClientFields = {
  firstName?: string | null;
  lastName?: string | null;
  age?: number | null;
  dni?: string | null;
  cuil?: string | null;
  cuit?: string | null;
  businessName?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  notes?: string | null;
  statute?: string | null;
  salaryReceiptRef?: string | null;
  cbu?: string | null;
};

function assertClientTypeFields(type: ClientType, input: ClientFields) {
  if (type === "human" && (!input.firstName?.trim() || !input.lastName?.trim())) {
    throw new BadRequestException("Nombre y apellido son obligatorios para una persona humana.");
  }

  if (type === "legal_entity" && !input.businessName?.trim()) {
    throw new BadRequestException("La razon social es obligatoria para una persona juridica.");
  }
}

function toWritableData(type: ClientType, input: ClientFields, clearOtherType = true) {
  const data: Prisma.ClientUpdateInput = {};
  const commonFields = ["email", "phone", "address", "notes", "cbu"] as const;
  const humanFields = ["firstName", "lastName", "age", "dni", "cuil", "salaryReceiptRef"] as const;
  const legalFields = ["businessName", "cuit", "statute"] as const;

  for (const field of commonFields) {
    if (input[field] !== undefined) {
      data[field] = nullable(input[field]) as never;
    }
  }

  if (type === "human") {
    for (const field of humanFields) {
      if (input[field] !== undefined) {
        data[field] = nullable(input[field]) as never;
      }
    }
    if (clearOtherType) {
      data.businessName = null;
      data.cuit = null;
      data.statute = null;
    }
  } else {
    for (const field of legalFields) {
      if (input[field] !== undefined) {
        data[field] = nullable(input[field]) as never;
      }
    }
    if (clearOtherType) {
      data.firstName = null;
      data.lastName = null;
      data.age = null;
      data.dni = null;
      data.cuil = null;
      data.salaryReceiptRef = null;
    }
  }

  return data;
}

function nullable(value: string | number | null | undefined) {
  if (typeof value === "string") {
    return value.trim() || null;
  }
  return value ?? null;
}

function contains(value: string) {
  return { contains: value, mode: Prisma.QueryMode.insensitive } as const;
}

function toClientDto(client: ClientWithCounts) {
  return {
    id: client.id,
    type: client.type,
    status: client.status,
    displayName:
      client.type === "legal_entity"
        ? (client.businessName ?? "Sin razon social")
        : [client.firstName, client.lastName].filter(Boolean).join(" ") || "Sin nombre",
    firstName: client.firstName,
    lastName: client.lastName,
    age: client.age,
    dni: client.dni,
    cuil: client.cuil,
    cuit: client.cuit,
    businessName: client.businessName,
    email: client.email,
    phone: client.phone,
    address: client.address,
    notes: client.notes,
    statute: client.statute,
    salaryReceiptRef: client.salaryReceiptRef,
    cbu: client.cbu,
    casesCount: client._count.primaryCases + client._count.caseParticipations,
    createdAt: client.createdAt,
    updatedAt: client.updatedAt
  };
}

function getOrderBy(sortBy: ListClientsQuery["sortBy"], direction: "asc" | "desc") {
  const tieBreaker = { id: direction } as const;

  if (sortBy === "createdAt") {
    return [{ createdAt: direction }, tieBreaker];
  }
  if (sortBy === "status") {
    return [{ status: direction }, tieBreaker];
  }
  if (sortBy === "type") {
    return [{ type: direction }, tieBreaker];
  }

  return [
    { businessName: { sort: direction, nulls: "last" as const } },
    { lastName: { sort: direction, nulls: "last" as const } },
    { firstName: { sort: direction, nulls: "last" as const } },
    tieBreaker
  ];
}
