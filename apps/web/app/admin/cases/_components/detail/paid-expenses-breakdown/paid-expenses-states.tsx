export function PaidExpensesBreakdownSkeleton() {
  return (
    <section className="grid gap-4" aria-label="Cargando gastos pagados">
      <div className="mx-auto h-[170px] w-[170px] rounded-full bg-muted/60" />
      <div className="grid gap-2">
        {Array.from({ length: 4 }).map((_, index) => (
          <div className="grid grid-cols-[1fr_80px_36px] gap-3" key={index}>
            <div className="h-4 rounded bg-muted/60" />
            <div className="h-4 rounded bg-muted/60" />
            <div className="h-4 rounded bg-muted/60" />
          </div>
        ))}
      </div>
    </section>
  );
}

export function PaidExpensesBreakdownError({ message }: { message: string }) {
  return (
    <p className="flex min-h-[220px] items-center justify-center rounded-2xl border border-destructive/20 bg-destructive/5 px-4 text-center text-sm font-medium text-destructive">
      {message}
    </p>
  );
}

export function PaidExpensesBreakdownRestricted() {
  return (
    <p className="flex min-h-[220px] items-center justify-center rounded-2xl border border-dashed border-border/60 px-4 text-center text-sm text-muted-foreground">
      No tenes permisos para ver gastos.
    </p>
  );
}
