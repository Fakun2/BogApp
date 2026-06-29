import { Injectable } from "@nestjs/common";
import { PrismaService } from "../database/prisma.service";

@Injectable()
export class PracticeAreaTemplatesService {
  constructor(private readonly prisma: PrismaService) {}

  listActive() {
    return this.prisma.practiceAreaTemplate.findMany({
      where: { active: true },
      orderBy: [{ displayOrder: "asc" }, { name: "asc" }]
    });
  }
}
