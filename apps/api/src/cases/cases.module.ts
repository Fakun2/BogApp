import { Module } from "@nestjs/common";
import { PermissionsGuard } from "../auth/permissions.guard";
import { DatabaseModule } from "../database/database.module";
import { StorageModule } from "../storage/storage.module";
import { CasesController } from "./cases.controller";
import { CasesService } from "./cases.service";
import { CaseExpenseAttachmentUploadRateLimitGuard } from "./guards/case-expense-attachment-upload-rate-limit.guard";
import { ExpenseOverdueScheduler } from "./jobs/expense-overdue.scheduler";
import { CaseExpenseAttachmentsUseCase } from "./use-cases/case-expense-attachments.use-case";
import { CaseExpensesUseCase } from "./use-cases/case-expenses.use-case";
import { CaseHearingsUseCase } from "./use-cases/case-hearings.use-case";
import { CaseTasksUseCase } from "./use-cases/case-tasks.use-case";
import { ExpenseOverdueUseCase } from "./use-cases/expense-overdue.use-case";

@Module({
  imports: [DatabaseModule, StorageModule],
  controllers: [CasesController],
  providers: [
    CasesService,
    CaseExpenseAttachmentsUseCase,
    CaseExpensesUseCase,
    ExpenseOverdueUseCase,
    CaseHearingsUseCase,
    CaseTasksUseCase,
    ExpenseOverdueScheduler,
    CaseExpenseAttachmentUploadRateLimitGuard,
    PermissionsGuard
  ]
})
export class CasesModule {}
