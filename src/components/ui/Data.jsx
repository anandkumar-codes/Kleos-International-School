import { Link } from 'react-router-dom';
import { ArrowUpDown, ArrowUp, ArrowDown, ChevronLeft, ChevronRight, SearchX } from 'lucide-react';
import { EmptyState } from './Feedback';

export function Tabs({ tabs, value, onChange, variant, className = '' }) {
  return (
    <div className={`tabs ${variant ? `tabs--${variant}` : ''} ${className}`} role="tablist">
      {tabs.map((t) => {
        const id = typeof t === 'string' ? t : t.value;
        const label = typeof t === 'string' ? t : t.label;
        return (
          <button key={id} role="tab" aria-selected={value === id} className={`tab ${value === id ? 'is-active' : ''}`} onClick={() => onChange(id)}>
            {t.icon && <t.icon size={16} aria-hidden />}
            {label}
            {t.count != null && <span className="count">{t.count}</span>}
          </button>
        );
      })}
    </div>
  );
}

export function Pagination({ page, pages, total, pageSize, onPage }) {
  if (!total) return null;
  const from = (page - 1) * pageSize + 1;
  const to = Math.min(total, page * pageSize);
  const nums = [];
  for (let p = Math.max(1, page - 2); p <= Math.min(pages, page + 2); p++) nums.push(p);
  return (
    <div className="pagination">
      <span>
        Showing <strong className="tabular">{from}–{to}</strong> of <strong className="tabular">{total.toLocaleString('en-IN')}</strong>
      </span>
      <div className="pagination__pages">
        <button onClick={() => onPage(page - 1)} disabled={page === 1} aria-label="Previous page"><ChevronLeft /></button>
        {nums[0] > 1 && <><button onClick={() => onPage(1)}>1</button>{nums[0] > 2 && <button disabled>…</button>}</>}
        {nums.map((p) => (
          <button key={p} className={p === page ? 'is-active' : ''} onClick={() => onPage(p)} aria-current={p === page ? 'page' : undefined}>{p}</button>
        ))}
        {nums[nums.length - 1] < pages && <>{nums[nums.length - 1] < pages - 1 && <button disabled>…</button>}<button onClick={() => onPage(pages)}>{pages}</button></>}
        <button onClick={() => onPage(page + 1)} disabled={page === pages} aria-label="Next page"><ChevronRight /></button>
      </div>
    </div>
  );
}

/**
 * columns: [{ key, label, render?(row), sortKey?, align?: 'right', width? }]
 * table: result of useTable()
 */
export function DataTable({ columns, table, rows, onRowClick, empty, rowKey = 'id' }) {
  const data = table ? table.rows : rows;
  return (
    <>
      <div className="table-wrap">
        <table className="table">
          <thead>
            <tr>
              {columns.map((c) => {
                const sk = c.sortKey ?? (c.sortable ? c.key : null);
                const active = table?.sort && table.sort.key === sk;
                const Icon = active ? (table.sort.dir === 'asc' ? ArrowUp : ArrowDown) : ArrowUpDown;
                return (
                  <th key={c.key || c.label} className={`${sk && table ? 'sortable' : ''} ${c.align === 'right' ? 'num' : ''}`} style={{ width: c.width }} onClick={sk && table ? () => table.toggleSort(sk) : undefined} aria-sort={active ? (table.sort.dir === 'asc' ? 'ascending' : 'descending') : undefined}>
                    {c.label}
                    {sk && table && <Icon className="sort-ico" aria-hidden />}
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row[rowKey]} onClick={onRowClick ? () => onRowClick(row) : undefined} style={onRowClick ? { cursor: 'pointer' } : undefined}>
                {columns.map((c) => (
                  <td key={c.key || c.label} className={c.align === 'right' ? 'num' : ''}>{c.render ? c.render(row) : row[c.key]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {!data.length && (empty || <EmptyState icon={SearchX} title="No matching records" text="Try a different search term or clear the filters." />)}
      {table && <Pagination page={table.page} pages={table.pages} total={table.total} pageSize={table.pageSize} onPage={table.setPage} />}
    </>
  );
}

export function Breadcrumbs({ items }) {
  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      {items.map((it, i) => (
        <span key={it.label} style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          {i > 0 && <ChevronRight aria-hidden />}
          {it.to && i < items.length - 1 ? <Link to={it.to}>{it.label}</Link> : <span aria-current={i === items.length - 1 ? 'page' : undefined}>{it.label}</span>}
        </span>
      ))}
    </nav>
  );
}
