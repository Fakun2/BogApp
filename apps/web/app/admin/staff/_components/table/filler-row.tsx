import { TableCell, TableRow } from "@/components/ui/table";

export function FillerRow() {
  return (
    <TableRow aria-hidden="true" className="h-[70px] border-border/40 hover:bg-transparent">
      <TableCell className="px-4 py-4" colSpan={8}>
        <span className="sr-only">Fila vacia</span>
      </TableCell>
    </TableRow>
  );
}
