import { flexRender } from "@tanstack/react-table";
import { Table, TableBody, TableRow } from "@/components/ui/table";
import { CategoryDataTableCell } from "../cells/category-table-columns";
import { useCategoryTableContext } from "../context/category-table-context";
import { CategoryTableState } from "../states/table-state";

export function CategoryTableBody() {
  const { categories, error, hasState, loading, pageRows, table } = useCategoryTableContext();
  const columnCount = table.getVisibleFlatColumns().length;
  const shouldFillState = loading && categories.length === 0;

  return (
    <Table className={`${shouldFillState ? "block" : ""} h-full min-w-full text-xs`}>
      <TableBody className={`${shouldFillState ? "block" : ""} h-full [&_tr:last-child]:border-0`}>
        <CategoryTableState
          categories={categories}
          columnCount={columnCount}
          error={error}
          loading={loading}
        />
        {!hasState ? (
          <>
            {pageRows.map((row) => (
              <TableRow className="h-12 border-border/40 hover:bg-secondary/30" key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <CategoryDataTableCell columnId={cell.column.id} key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </CategoryDataTableCell>
                ))}
              </TableRow>
            ))}
          </>
        ) : null}
      </TableBody>
    </Table>
  );
}
