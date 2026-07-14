import { TableCell, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";

export function StateRow({ message, tone = "muted" }: { message: string; tone?: "muted" | "error" }) {
  return (
    <TableRow>
      <TableCell
        colSpan={8}
        className={cn(
          "h-[420px] px-5 text-center text-sm",
          tone === "error" ? "text-destructive" : "text-muted-foreground"
        )}
      >
        {message}
      </TableCell>
    </TableRow>
  );
}
