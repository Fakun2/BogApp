import { TableCell, TableRow } from "@/components/ui/table";
import { StateBox } from "./state-box";

export function StateRow({
  columnCount,
  fill = false,
  message,
  tone = "muted"
}: {
  columnCount: number;
  fill?: boolean;
  message: string;
  tone?: "error" | "muted";
}) {
  return (
    <TableRow className={`${fill ? "block h-full" : ""} hover:bg-transparent`}>
      <TableCell colSpan={columnCount} className={`${fill ? "block h-full" : ""} p-0`}>
        <StateBox fill={fill} text={message} tone={tone} />
      </TableCell>
    </TableRow>
  );
}
