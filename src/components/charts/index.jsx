import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell,
} from 'recharts';

// Validated categorical order (dataviz validator: CVD + normal-vision pass). Max 3 series per chart.
export const SERIES = ['#177a5b', '#e8a53b', '#2d7dd2'];
// Sequential single-hue ramp (light → dark) for magnitude.
export const GREEN_RAMP = ['#bfe0d1', '#7cc3a4', '#3f9f7a', '#177a5b', '#0b4d3a', '#083a2c'];
export const STATUS = { good: '#177a5b', warning: '#d98a10', critical: '#c8323c', neutral: '#b7c1bd' };

const axis = { tickLine: false, axisLine: false, tick: { fontSize: 12, fill: '#8b9893' } };

function Tip({ active, payload, label, format = (v) => v }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="chart-tip">
      <b>{label}</b>
      {payload.map((p) => (
        <div key={p.dataKey}>
          <span><i style={{ background: p.color || p.payload.fill }} />{p.name}</span>
          <strong>{format(p.value)}</strong>
        </div>
      ))}
    </div>
  );
}

export function Legend({ items }) {
  return (
    <div className="chart-legend">
      {items.map((it) => (
        <span key={it.label}><i style={{ background: it.color }} />{it.label}</span>
      ))}
    </div>
  );
}

export function ChartCard({ title, sub, action, legend, children, className = '' }) {
  return (
    <section className={`card ${className}`}>
      <div className="card__head" style={{ alignItems: 'flex-start' }}>
        <div>
          <h3 className="card__title">{title}</h3>
          {sub && <p className="card__sub">{sub}</p>}
        </div>
        {action}
      </div>
      <div className="card__body">
        {legend && <div style={{ marginBottom: 10 }}><Legend items={legend} /></div>}
        {children}
      </div>
    </section>
  );
}

/** series: [{ key, name, color? }] */
export function AreaTrend({ data, x = 'label', series, format, height = 280, domain }) {
  return (
    <div className="chart-box" style={{ height }}>
      <ResponsiveContainer>
        <AreaChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
          <defs>
            {series.map((s, i) => (
              <linearGradient key={s.key} id={`g-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={s.color || SERIES[i]} stopOpacity={0.22} />
                <stop offset="100%" stopColor={s.color || SERIES[i]} stopOpacity={0} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid vertical={false} stroke="#edf1ef" />
          <XAxis dataKey={x} {...axis} dy={6} />
          <YAxis {...axis} width={48} tickFormatter={format} domain={domain || ['auto', 'auto']} />
          <Tooltip content={<Tip format={format} />} cursor={{ stroke: '#b7c1bd', strokeDasharray: '4 4' }} />
          {series.map((s, i) => (
            <Area key={s.key} type="monotone" dataKey={s.key} name={s.name} stroke={s.color || SERIES[i]} strokeWidth={2} fill={`url(#g-${s.key})`} activeDot={{ r: 5, strokeWidth: 2, stroke: '#fff' }} animationDuration={900} />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function Bars({ data, x = 'label', series, format, height = 280, stacked, domain, colorBy }) {
  return (
    <div className="chart-box" style={{ height }}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }} barGap={2} barCategoryGap="28%">
          <CartesianGrid vertical={false} stroke="#edf1ef" />
          <XAxis dataKey={x} {...axis} dy={6} />
          <YAxis {...axis} width={48} tickFormatter={format} domain={domain || [0, 'auto']} />
          <Tooltip content={<Tip format={format} />} cursor={{ fill: 'rgba(15,40,32,.04)' }} />
          {series.map((s, i) => (
            <Bar key={s.key} dataKey={s.key} name={s.name} fill={s.color || SERIES[i]} stackId={stacked ? 'a' : undefined} radius={stacked && i < series.length - 1 ? 0 : [4, 4, 0, 0]} maxBarSize={34} animationDuration={900} stroke="#fff" strokeWidth={stacked ? 1 : 0}>
              {colorBy && data.map((d, j) => <Cell key={j} fill={colorBy(d)} />)}
            </Bar>
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function Lines({ data, x = 'label', series, format, height = 260, domain }) {
  return (
    <div className="chart-box" style={{ height }}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="#edf1ef" />
          <XAxis dataKey={x} {...axis} dy={6} />
          <YAxis {...axis} width={44} tickFormatter={format} domain={domain || ['auto', 'auto']} />
          <Tooltip content={<Tip format={format} />} cursor={{ stroke: '#b7c1bd', strokeDasharray: '4 4' }} />
          {series.map((s, i) => (
            <Line key={s.key} type="monotone" dataKey={s.key} name={s.name} stroke={s.color || SERIES[i]} strokeWidth={2} dot={{ r: 4, strokeWidth: 2, fill: '#fff' }} activeDot={{ r: 6 }} animationDuration={900} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

/** A donut for part-to-whole with ≤ 4 parts; centre shows the headline. */
export function Donut({ data, center, sub, format = (v) => v, height = 220 }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap' }}>
      <div style={{ width: height, height, position: 'relative', flex: 'none', margin: '0 auto' }}>
        <ResponsiveContainer>
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius="70%" outerRadius="100%" paddingAngle={2} stroke="#fff" strokeWidth={2} animationDuration={900}>
              {data.map((d) => <Cell key={d.name} fill={d.color} />)}
            </Pie>
            <Tooltip content={<Tip format={format} />} />
          </PieChart>
        </ResponsiveContainer>
        <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', textAlign: 'center', pointerEvents: 'none' }}>
          <div>
            <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--ink-900)' }}>{center}</div>
            <div style={{ fontSize: 12, color: 'var(--ink-500)' }}>{sub}</div>
          </div>
        </div>
      </div>
      <div style={{ display: 'grid', gap: 10, flex: 1, minWidth: 160 }}>
        {data.map((d) => (
          <div key={d.name} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13.5 }}>
            <i style={{ width: 10, height: 10, borderRadius: 3, background: d.color, flex: 'none' }} />
            <span style={{ color: 'var(--ink-700)', flex: 1 }}>{d.name}</span>
            <strong className="tabular" style={{ color: 'var(--ink-900)' }}>{format(d.value)}</strong>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Sparkline({ data, color = SERIES[0], height = 36 }) {
  return (
    <div style={{ height, width: '100%' }}>
      <ResponsiveContainer>
        <AreaChart data={data.map((v, i) => ({ i, v }))} margin={{ top: 2, bottom: 2, left: 0, right: 0 }}>
          <Area type="monotone" dataKey="v" stroke={color} strokeWidth={2} fill={color} fillOpacity={0.08} isAnimationActive={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
