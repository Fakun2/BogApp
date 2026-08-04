export function CaseDetailItem({
  className = "",
  label,
  multiline = false,
  value
}: {
  className?: string;
  label: string;
  multiline?: boolean;
  value: string | null | undefined;
}) {
  return (
    <div className={`min-w-0 rounded-xl border border-border/40 bg-background/35 px-4 py-3 ${className}`}>
      <p className="text-xs font-medium uppercase tracking-normal text-muted-foreground">{label}</p>
      <p
        className={`mt-1 text-sm font-medium text-foreground ${
          multiline ? "whitespace-pre-wrap leading-6" : "truncate"
        }`}
      >
        {value || "Sin cargar"}
      </p>
    </div>
  );
}
