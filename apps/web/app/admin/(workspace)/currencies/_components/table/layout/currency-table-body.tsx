import { flexRender } from "@tanstack/react-table";
import { Table, TableBody, TableRow } from "@/components/ui/table";
import { CurrencyDataTableCell } from "../cells/currency-table-columns";
import { useCurrencyTableContext } from "../context/currency-table-context";
import { CurrencyTableState } from "../states/table-state";

export function CurrencyTableBody() {
  const { currencies, error, hasState, loading, pageRows, table } = useCurrencyTableContext();
  const columnCount = table.getVisibleFlatColumns().length;
  const shouldFillState = loading && currencies.length === 0;

  return (
    <Table className={`${shouldFillState ? "block" : ""} h-full min-w-full text-xs`}>
      <TableBody className={`${shouldFillState ? "block" : ""} h-full [&_tr:last-child]:border-0`}>
        <CurrencyTableState
          columnCount={columnCount}
          currencies={currencies}
          error={error}
          loading={loading}
        />
        {!hasState ? (
          <>
            {pageRows.map((row) => (
              <TableRow className="h-12 border-border/40 hover:bg-secondary/30" key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <CurrencyDataTableCell columnId={cell.column.id} key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </CurrencyDataTableCell>
                ))}
              </TableRow>
            ))}
          </>
        ) : null}
      </TableBody>
    </Table>
  );
}
