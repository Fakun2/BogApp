import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { ExpenseOverdueUseCase } from "../use-cases/expense-overdue.use-case";

const buenosAiresTimeZone = "America/Argentina/Buenos_Aires";
const dailyRunHour = 0;
const dailyRunMinute = 10;

@Injectable()
export class ExpenseOverdueScheduler implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(ExpenseOverdueScheduler.name);
  private isRunning = false;
  private timer: NodeJS.Timeout | null = null;

  constructor(private readonly expenseOverdueUseCase: ExpenseOverdueUseCase) {}

  onModuleInit() {
    if (process.env.EXPENSE_OVERDUE_SCHEDULER_ENABLED === "false") {
      this.logger.log("Daily expense overdue scheduler disabled.");
      return;
    }

    this.scheduleNextRun();
  }

  onModuleDestroy() {
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  private scheduleNextRun() {
    const nextRunAt = getNextBuenosAiresRunAt(new Date());
    const delayMs = Math.max(0, nextRunAt.getTime() - Date.now());

    this.timer = setTimeout(() => {
      void this.run();
    }, delayMs);
    this.timer.unref?.();

    this.logger.log(`Next expense overdue recalculation scheduled at ${nextRunAt.toISOString()}.`);
  }

  private async run() {
    if (this.isRunning) {
      this.scheduleNextRun();
      return;
    }

    this.isRunning = true;

    try {
      const result = await this.expenseOverdueUseCase.recalculateActiveTenants();

      if (result.status === "skipped") {
        this.logger.log(
          "Expense overdue recalculation skipped because another worker owns the lock."
        );
      } else {
        this.logger.log(
          `Expense overdue recalculation finished. Updated rows: ${result.updatedCount}.`
        );
      }
    } catch (error) {
      this.logger.error("Expense overdue recalculation failed.", error);
    } finally {
      this.isRunning = false;
      this.scheduleNextRun();
    }
  }
}

function getNextBuenosAiresRunAt(now: Date) {
  const parts = getBuenosAiresDateTimeParts(now);
  let target = new Date(Date.UTC(parts.year, parts.month - 1, parts.day, 3, dailyRunMinute, 0, 0));

  if (
    parts.hour > dailyRunHour ||
    (parts.hour === dailyRunHour && parts.minute >= dailyRunMinute)
  ) {
    target = addUtcDays(target, 1);
  }

  return target;
}

function getBuenosAiresDateTimeParts(date: Date) {
  const parts = new Intl.DateTimeFormat("en-CA", {
    day: "2-digit",
    hour: "2-digit",
    hour12: false,
    minute: "2-digit",
    month: "2-digit",
    timeZone: buenosAiresTimeZone,
    year: "numeric"
  }).formatToParts(date);

  return {
    day: Number(getDateTimePart(parts, "day")),
    hour: Number(getDateTimePart(parts, "hour")),
    minute: Number(getDateTimePart(parts, "minute")),
    month: Number(getDateTimePart(parts, "month")),
    year: Number(getDateTimePart(parts, "year"))
  };
}

function getDateTimePart(parts: Intl.DateTimeFormatPart[], type: Intl.DateTimeFormatPartTypes) {
  return parts.find((part) => part.type === type)?.value ?? "0";
}

function addUtcDays(date: Date, days: number) {
  const nextDate = new Date(date);
  nextDate.setUTCDate(nextDate.getUTCDate() + days);
  return nextDate;
}
