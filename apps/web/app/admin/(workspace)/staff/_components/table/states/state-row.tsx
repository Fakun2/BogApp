import { TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

export function StateRow({
  columnCount,
  message,
  tone = "muted"
}: {
  columnCount: number;
  message: string;
  tone?: "muted" | "error";
}) {
  return (
    <TableRow>
      <TableCell
        colSpan={columnCount}
        className={cn(
          "h-[260px] px-5 text-center text-sm lg:h-[420px]",
          tone === "error" ? "text-destructive" : "text-muted-foreground"
        )}
      >
        {message}
      </TableCell>
    </TableRow>
  );
}
