import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../database/prisma.service";
import { toCatalogPageInfo } from "../legal-catalogs/pagination.schemas";
import type { ListForumsQuery } from "./forums.schemas";

@Injectable()
export class ForumsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(_tenantId: string, query: ListForumsQuery) {
    const where: Prisma.ForumTemplateWhereInput = {
      ...(query.includeInactive ? {} : { active: true }),
      ...(query.provinceId ? { provinceId: query.provinceId } : {}),
      ...(query.search
        ? { name: { contains: query.search, mode: Prisma.QueryMode.insensitive } }
        : {})
    };
    const sortDirection = query.sort === "name:desc" ? "desc" : "asc";
    const [forums, total] = await this.prisma.$transaction([
      this.prisma.forumTemplate.findMany({
        where,
        include: forumTemplateInclude,
        orderBy: [{ active: "desc" }, { name: sortDirection }, { province: { name: "asc" } }],
        skip: query.offset,
        take: query.limit
      }),
      this.prisma.forumTemplate.count({ where })
    ]);

    return {
      items: forums.map(toForumDto),
      pageInfo: toCatalogPageInfo({
        limit: query.limit,
        offset: query.offset,
        total
      })
    };
  }
}

const forumTemplateInclude = {
  province: {
    select: {
      code: true,
      country: true,
      id: true,
      name: true,
      province: true
    }
  }
} satisfies Prisma.ForumTemplateInclude;

type ForumTemplateWithProvince = Prisma.ForumTemplateGetPayload<{
  include: typeof forumTemplateInclude;
}>;

function toForumDto(forum: ForumTemplateWithProvince) {
  return {
    active: forum.active,
    createdAt: forum.createdAt,
    custom: false,
    description: forum.description,
    id: forum.id,
    isSystem: true,
    name: forum.name,
    province: forum.province,
    provinceId: forum.provinceId,
    template: {
      code: forum.code,
      id: forum.id
    },
    templateId: forum.id,
    updatedAt: forum.updatedAt
  };
}
