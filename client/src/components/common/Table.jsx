import Spinner from './Spinner';

const Table = ({ columns = [], data = [], loading = false, emptyMessage = 'No records found.' }) => {
  return (
    <div className="overflow-x-auto rounded-xl ring-1 ring-slate-700">
      <table className="min-w-full divide-y divide-slate-700">
        <thead className="bg-slate-800/80">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-4 py-3 text-left text-xs font-semibold text-slate-400 uppercase tracking-wider"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-slate-800 divide-y divide-slate-700/60">
          {loading ? (
            <tr>
              <td colSpan={columns.length} className="py-16 text-center">
                <Spinner size="md" />
              </td>
            </tr>
          ) : data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="py-16 text-center text-sm text-slate-500">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIdx) => (
              <tr key={row._id || rowIdx} className="hover:bg-slate-700/40 transition-colors">
                {columns.map((col) => (
                  <td key={col.key} className="px-4 py-3.5 text-sm text-slate-300 whitespace-nowrap">
                    {col.render ? col.render(row[col.key], row) : row[col.key] ?? '—'}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
