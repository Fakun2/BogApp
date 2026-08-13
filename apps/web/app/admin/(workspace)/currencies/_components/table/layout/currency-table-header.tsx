import { flexRender } from "@tanstack/react-table";
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { currencyTableHeaderClassNameByColumn } from "../../../_constants/currency.constants";
import { useCurrencyTableContext } from "../context/currency-table-context";

export function CurrencyTableHeader() {
  const { table } = useCurrencyTableContext();

  return (
    <table className="w-full shrink-0 caption-bottom text-xs">
      <TableHeader className="bg-[color-mix(in_oklab,var(--muted)_28%,transparent)] [&_tr]:border-0">
        {table.getHeaderGroups().map((headerGroup) => (
          <TableRow className="hover:bg-transparent" key={headerGroup.id}>
            {headerGroup.headers.map((header) => (
              <TableHead
                className={`h-10 px-3 text-sm font-medium text-foreground ${
                  currencyTableHeaderClassNameByColumn[header.column.id] ?? ""
                }`}
                key={header.id}
              >
                {header.isPlaceholder
                  ? null
                  : flexRender(header.column.columnDef.header, header.getContext())}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
    </table>
  );
}
