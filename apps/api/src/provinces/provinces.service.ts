import { Injectable } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";
import { toCatalogPageInfo } from "../legal-catalogs/pagination.schemas";
import type { ListProvincesQuery } from "./provinces.schemas";

@Injectable()
export class ProvincesService {
  constructor(private readonly prisma: PrismaService) {}

  async listActive(query: ListProvincesQuery) {
    const where = { active: true };
    const sortDirection = query.sort === "name:desc" ? "desc" : "asc";
    const [provinces, total] = await this.prisma.$transaction([
      this.prisma.province.findMany({
        where,
        orderBy: [{ name: sortDirection }, { displayOrder: "asc" }],
        skip: query.offset,
        take: query.limit
      }),
      this.prisma.province.count({ where })
    ]);

    return {
      items: provinces,
      pageInfo: toCatalogPageInfo({
        limit: query.limit,
        offset: query.offset,
        total
      })
    };
  }
}
