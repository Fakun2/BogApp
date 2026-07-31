export function PaidExpensesPopupSkeleton() {
  return (
    <section className="overflow-hidden rounded-2xl border border-border/40" aria-label="Cargando gastos pagados">
      <div className="h-10 bg-[color-mix(in_oklab,var(--muted)_28%,transparent)]" />
      {Array.from({ length: 4 }).map((_, index) => (
        <div
          className="grid h-14 grid-cols-3 gap-4 border-t border-border/30 px-4 py-3"
          key={index}
        >
          <div className="h-4 rounded bg-muted/60" />
          <div className="h-4 rounded bg-muted/60" />
          <div className="h-4 rounded-full bg-muted/60" />
        </div>
      ))}
    </section>
  );
}

export function PaidExpensesPopupError({ message }: { message: string }) {
  return (
    <p className="flex min-h-[220px] items-center justify-center rounded-2xl border border-destructive/20 bg-destructive/5 px-4 text-center text-sm font-medium text-destructive">
      {message}
    </p>
  );
}

export function PaidExpensesPopupRestricted() {
  return (
    <p className="flex min-h-[220px] items-center justify-center rounded-2xl border border-dashed border-border/60 px-4 text-center text-sm text-muted-foreground">
      No tenes permisos para ver los gastos de este expediente.
    </p>
  );
}

export function PaidExpensesPopupEmpty() {
  return (
    <p className="flex min-h-[220px] items-center justify-center rounded-2xl border border-dashed border-border/60 px-4 text-center text-sm text-muted-foreground">
      Todavia no hay gastos pagados para este expediente.
    </p>
  );
}
