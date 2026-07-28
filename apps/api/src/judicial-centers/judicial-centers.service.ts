import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../database/prisma.service";
import { toCatalogPageInfo } from "../legal-catalogs/pagination.schemas";
import type { ListJudicialCentersQuery } from "./judicial-centers.schemas";

@Injectable()
export class JudicialCentersService {
  constructor(private readonly prisma: PrismaService) {}

  async listActive(query: ListJudicialCentersQuery) {
    const where: Prisma.JudicialCenterWhereInput = {
      active: true,
      ...(query.provinceId ? { provinceId: query.provinceId } : {})
    };
    const sortDirection = query.sort === "name:desc" ? "desc" : "asc";
    const [items, total] = await this.prisma.$transaction([
      this.prisma.judicialCenter.findMany({
        where,
        include: judicialCenterInclude,
        orderBy: [{ displayOrder: "asc" }, { name: sortDirection }],
        skip: query.offset,
        take: query.limit
      }),
      this.prisma.judicialCenter.count({ where })
    ]);

    return {
      items,
      pageInfo: toCatalogPageInfo({
        limit: query.limit,
        offset: query.offset,
        total
      })
    };
  }
}

const judicialCenterInclude = {
  province: {
    select: {
      code: true,
      id: true,
      name: true
    }
  }
} satisfies Prisma.JudicialCenterInclude;
