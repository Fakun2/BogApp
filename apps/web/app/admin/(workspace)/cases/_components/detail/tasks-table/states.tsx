import {
  TableCell,
  TableRow
} from "@/components/ui/table";

export function TaskRowsSkeleton({ columnCount }: { columnCount: number }) {
  return Array.from({ length: 4 }).map((_, rowIndex) => (
    <TableRow className="h-16 border-border/40 hover:bg-transparent" key={rowIndex}>
      {Array.from({ length: columnCount }).map((__, cellIndex) => (
        <TableCell className="px-3 py-3" key={cellIndex}>
          <div className="h-4 rounded bg-muted/60" />
        </TableCell>
      ))}
    </TableRow>
  ));
}

export function TaskTableMessageRow({
  className = "text-muted-foreground",
  columnCount,
  message
}: {
  className?: string;
  columnCount: number;
  message: string;
}) {
  return (
    <TableRow className="h-[260px] hover:bg-transparent">
      <TableCell className={`px-3 py-10 text-center text-sm ${className}`} colSpan={columnCount}>
        {message}
      </TableCell>
    </TableRow>
  );
}
