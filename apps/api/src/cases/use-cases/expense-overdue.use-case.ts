import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService, type TenantPrismaClient } from "../../database/prisma.service";

@Injectable()
export class ExpenseOverdueUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async recalculate(tenantId: string, options: { caseId?: string } = {}) {
    return this.prisma.runWithTenant(tenantId, (tx) =>
      this.recalculateWithClient(tx, tenantId, options)
    );
  }

  private async recalculateWithClient(
    prisma: TenantPrismaClient,
    tenantId: string,
    options: { caseId?: string } = {}
  ) {
    if (options.caseId) {
      await this.findTenantCaseOrThrow(prisma, tenantId, options.caseId);
    }

    const updatedCount = options.caseId
      ? await this.recalculateCaseOverdueExpenses(prisma, tenantId, options.caseId)
      : await this.recalculateTenantOverdueExpenses(prisma, tenantId);

    return {
      status: "ok" as const,
      updatedCount
    };
  }

  async recalculateActiveTenants() {
    return this.prisma.$transaction(async (tx) => {
      const [lock] = await tx.$queryRaw<Array<{ acquired: boolean }>>`
        SELECT pg_try_advisory_xact_lock(${expenseOverdueRecalculationLockId}) AS acquired
      `;

      if (!lock?.acquired) {
        return {
          status: "skipped" as const,
          updatedCount: 0
        };
      }

      const [result] = await tx.$queryRaw<Array<{ updated_count: number }>>`
        SELECT recalculate_overdue_expenses_for_active_tenants(
          ${getBuenosAiresTodayDate()}::date
        ) AS updated_count
      `;

      return {
        status: "ok" as const,
        updatedCount: Number(result?.updated_count ?? 0)
      };
    });
  }

  private async findTenantCaseOrThrow(
    prisma: TenantPrismaClient,
    tenantId: string,
    caseId: string
  ) {
    const existingCase = await prisma.case.findFirst({
      where: { id: caseId, tenantId },
      select: { id: true }
    });

    if (!existingCase) {
      throw new NotFoundException("El expediente no existe en el estudio activo.");
    }

    return existingCase;
  }

  private async recalculateCaseOverdueExpenses(
    prisma: TenantPrismaClient,
    tenantId: string,
    caseId: string
  ) {
    return prisma.$executeRaw`
      UPDATE case_expenses
      SET status = 'overdue'
      WHERE tenant_id = ${tenantId}::uuid
        AND case_id = ${caseId}::uuid
        AND status = 'pending'
        AND (
          payment_date < ${getBuenosAiresTodayDate()}::date
          OR expense_date > payment_date
        )
    `;
  }

  private async recalculateTenantOverdueExpenses(prisma: TenantPrismaClient, tenantId: string) {
    return prisma.$executeRaw`
      UPDATE case_expenses
      SET status = 'overdue'
      WHERE tenant_id = ${tenantId}::uuid
        AND status = 'pending'
        AND (
          payment_date < ${getBuenosAiresTodayDate()}::date
          OR expense_date > payment_date
        )
    `;
  }
}

const expenseOverdueRecalculationLockId = 803143000;

function getBuenosAiresTodayDate() {
  return new Intl.DateTimeFormat("en-CA", {
    day: "2-digit",
    month: "2-digit",
    timeZone: "America/Argentina/Buenos_Aires",
    year: "numeric"
  }).format(new Date());
}
