// Client-side exports: CSV, Excel (SpreadsheetML-compatible HTML table) and PDF (print view).

function download(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 500);
}

const cell = (row, col) => (typeof col.value === 'function' ? col.value(row) : row[col.key]) ?? '';
const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

export function exportCSV(filename, columns, rows) {
  const quote = (v) => `"${String(v).replace(/"/g, '""')}"`;
  const lines = [columns.map((c) => quote(c.label)).join(',')];
  rows.forEach((r) => lines.push(columns.map((c) => quote(cell(r, c))).join(',')));
  download(`${filename}.csv`, '﻿' + lines.join('\n'), 'text/csv;charset=utf-8');
}

export function exportExcel(filename, columns, rows) {
  const head = columns.map((c) => `<th style="background:#0b4d3a;color:#fff">${esc(c.label)}</th>`).join('');
  const body = rows.map((r) => `<tr>${columns.map((c) => `<td>${esc(cell(r, c))}</td>`).join('')}</tr>`).join('');
  const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel"><head><meta charset="utf-8"></head><body><table border="1">${`<tr>${head}</tr>`}${body}</table></body></html>`;
  download(`${filename}.xls`, html, 'application/vnd.ms-excel');
}

export function exportPDF(title, columns, rows, subtitle = '') {
  const w = window.open('', '_blank');
  if (!w) return false;
  const head = columns.map((c) => `<th>${esc(c.label)}</th>`).join('');
  const body = rows.map((r) => `<tr>${columns.map((c) => `<td>${esc(cell(r, c))}</td>`).join('')}</tr>`).join('');
  w.document.write(`<!doctype html><html><head><title>${esc(title)}</title><style>
    body{font-family:'Segoe UI',Arial,sans-serif;color:#1d2a26;margin:32px}
    header{display:flex;justify-content:space-between;align-items:flex-end;border-bottom:3px solid #0b4d3a;padding-bottom:12px;margin-bottom:20px}
    h1{font-size:20px;margin:0;color:#0b4d3a} p{margin:4px 0 0;color:#5b6b66;font-size:12px}
    table{width:100%;border-collapse:collapse;font-size:11px} th{background:#0b4d3a;color:#fff;text-align:left;padding:7px}
    td{padding:6px 7px;border-bottom:1px solid #e3e8e6} tr:nth-child(even) td{background:#f6f8f7}
    footer{margin-top:18px;font-size:10px;color:#8a9893}
  </style></head><body><header><div><h1>Kleos International School</h1><p>${esc(title)}${subtitle ? ' · ' + esc(subtitle) : ''}</p></div><p>Generated ${new Date().toLocaleString('en-IN')}</p></header>
  <table><thead><tr>${head}</tr></thead><tbody>${body}</tbody></table><footer>${rows.length} records · Confidential — for internal school use</footer>
  <script>window.onload=()=>{window.print()}<\/script></body></html>`);
  w.document.close();
  return true;
}
