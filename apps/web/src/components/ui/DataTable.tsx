import type { TableColumn } from "../../types";

export function DataTable<T extends { id: string }>({
  columns,
  rows,
}: {
  columns: TableColumn<T>[];
  rows: T[];
}) {
  return (
    <div className="overflow-hidden rounded-[1.5rem] border border-white/8">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-white/6">
          <thead className="bg-white/[0.02]">
            <tr>
              {columns.map((column) => (
                <th key={column.header} className="px-5 py-4 text-left mono-label text-on-surface-variant">
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-white/6">
            {rows.map((row) => (
              <tr key={row.id} className="hover:bg-white/[0.03]">
                {columns.map((column) => (
                  <td key={column.header} className="px-5 py-4 text-sm text-on-surface">
                    {column.render ? column.render(row) : String(row[column.key as keyof T] ?? "")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
