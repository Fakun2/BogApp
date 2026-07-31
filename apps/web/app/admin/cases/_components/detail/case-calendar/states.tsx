export function CalendarSkeleton() {
  return (
    <ul
      className="grid grid-cols-7 overflow-hidden rounded-xl border-b border-l border-border/35"
      aria-label="Cargando calendario"
    >
      {Array.from({ length: 42 }).map((_, index) => (
        <li className="h-12 border-r border-t border-border/35 bg-muted/40" key={index} />
      ))}
    </ul>
  );
}

export function CalendarMessage({ message }: { message: string }) {
  return (
    <p className="flex min-h-[260px] items-center justify-center rounded-2xl border border-dashed border-border/60 px-4 text-center text-sm text-muted-foreground">
      {message}
    </p>
  );
}

export function CalendarError({ message }: { message: string }) {
  return (
    <p className="flex min-h-[260px] items-center justify-center rounded-2xl border border-destructive/20 bg-destructive/5 px-4 text-center text-sm font-medium text-destructive">
      {message}
    </p>
  );
}
