import { ApiProperty } from "@nestjs/swagger";

export class DashboardCurrencyDto {
  @ApiProperty({ example: "ARS" })
  code!: string;

  @ApiProperty({ example: "Peso argentino" })
  name!: string;

  @ApiProperty({ example: "$" })
  symbol!: string;
}

export class DashboardCashboxMetricDto {
  @ApiProperty({ example: "120000.00" })
  balance!: string;

  @ApiProperty({ type: DashboardCurrencyDto })
  currency!: DashboardCurrencyDto;

  @ApiProperty({ example: "2026-08-18" })
  date!: string;

  @ApiProperty({ example: "25000.00" })
  expenseToday!: string;

  @ApiProperty({ example: "50000.00" })
  incomeToday!: string;
}

export class DashboardDueTodayMetricDto {
  @ApiProperty({ example: 3 })
  paymentsCount!: number;

  @ApiProperty({ example: 5 })
  tasksCount!: number;
}

export class DashboardMetricsDto {
  @ApiProperty({ example: 24 })
  activeCasesCount!: number;

  @ApiProperty({ type: DashboardCashboxMetricDto })
  cashbox!: DashboardCashboxMetricDto;

  @ApiProperty({ type: DashboardDueTodayMetricDto })
  dueToday!: DashboardDueTodayMetricDto;
}
