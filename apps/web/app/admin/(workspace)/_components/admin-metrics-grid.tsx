import type { LucideIcon } from "lucide-react";
import { AdminMetricCard } from "./admin-metric-card";

export type AdminMetricItem = {
  badge?: string;
  detail?: string;
  icon: LucideIcon;
  label: string;
  loading?: boolean;
  tooltipItems?: Array<{
    label: string;
    value: number | string;
  }>;
  value?: number | string;
};

export function AdminMetricsGrid({ metrics }: { metrics: AdminMetricItem[] }) {
  return (
    <div className="grid shrink-0 grid-cols-2 gap-2 sm:gap-6 lg:grid-cols-4 lg:gap-8">
      {metrics.map((metric) => (
        <AdminMetricCard
          icon={metric.icon}
          key={metric.label}
          badge={metric.badge}
          detail={metric.detail}
          label={metric.label}
          loading={metric.loading}
          tooltipItems={metric.tooltipItems}
          value={metric.value}
        />
      ))}
    </div>
  );
}
