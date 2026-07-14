type VisualTileProps = {
  label: string;
  value: string;
};

export function VisualTile({ label, value }: VisualTileProps) {
  return (
    <div className="min-h-24 rounded-2xl border border-[var(--onboarding-panel-border)] bg-[var(--onboarding-panel-surface)] p-4 text-[var(--onboarding-panel-surface-foreground)] shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
      <span className="block text-xs text-[var(--onboarding-panel-muted)]">{label}</span>
      <span className="mt-2 line-clamp-2 block font-medium">{value}</span>
    </div>
  );
}
