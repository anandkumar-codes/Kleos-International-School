import { useState } from 'react';
import { Text, View, Pressable } from 'react-native';
import Svg, { Rect, Line, Circle, G, Text as SvgText } from 'react-native-svg';
import { colors, fonts } from '@/lib/theme';
import { tap } from './ui';

// Same validated palette as the website charts (green / gold / blue) + reserved status colours.
export const SERIES = ['#177A5B', '#E8A53B', '#2D7DD2'];
export const STATUS = { good: '#177A5B', warning: '#D98A10', critical: '#C8323C' };

export function Legend({ items }) {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 14 }}>
      {items.map((i) => (
        <View key={i.label} style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
          <View style={{ width: 10, height: 10, borderRadius: 3, backgroundColor: i.color }} />
          <Text style={{ fontFamily: fonts.medium, fontSize: 12, color: colors.ink500 }}>{i.label}</Text>
        </View>
      ))}
    </View>
  );
}

/**
 * Vertical bars; tap a bar to read its value.
 * data: [{ label, values: [n, ...] }]  series: [{ name, color }]  (stacked when series > 1)
 */
export function BarChart({ data, series = [{ name: 'Value', color: SERIES[0] }], height = 180, format = (v) => String(v), max: forcedMax }) {
  const [width, setWidth] = useState(0);
  const [sel, setSel] = useState(null);
  const totals = data.map((d) => d.values.reduce((a, b) => a + b, 0));
  const max = forcedMax || Math.max(1, ...totals) * 1.12;
  const padL = 40, padB = 22, padT = 26;
  const plotH = height - padB - padT;
  const plotW = Math.max(0, width - padL);
  const slot = data.length ? plotW / data.length : 0;
  const barW = Math.min(30, slot * 0.56);
  const ticks = [0, 0.5, 1].map((t) => max * t);

  return (
    <View onLayout={(e) => setWidth(e.nativeEvent.layout.width)} style={{ height }}>
      {width > 0 && (
        <Svg width={width} height={height}>
          {ticks.map((t, i) => {
            const y = padT + plotH - (t / max) * plotH;
            return (
              <G key={i}>
                <Line x1={padL} x2={width} y1={y} y2={y} stroke="#EDF1EF" strokeWidth={1} />
                <SvgText x={padL - 6} y={y + 4} fontSize={10.5} fill={colors.ink400} textAnchor="end" fontFamily={fonts.medium}>{format(Math.round(t))}</SvgText>
              </G>
            );
          })}
          {data.map((d, i) => {
            const x = padL + slot * i + (slot - barW) / 2;
            let acc = 0;
            const active = sel === i;
            return (
              <G key={`${d.label}-${i}`} opacity={sel == null || active ? 1 : 0.45}>
                {d.values.map((v, si) => {
                  const h = (v / max) * plotH;
                  const y = padT + plotH - ((acc + v) / max) * plotH;
                  acc += v;
                  const top = si === d.values.length - 1;
                  return <Rect key={si} x={x} y={y} width={barW} height={Math.max(0, h - (si > 0 ? 1 : 0))} rx={top ? 4 : 0} fill={series[si]?.color || SERIES[si]} />;
                })}
                <SvgText x={x + barW / 2} y={height - 6} fontSize={10.5} fill={active ? colors.ink900 : colors.ink400} textAnchor="middle" fontFamily={active ? fonts.bold : fonts.medium}>{d.label}</SvgText>
                {active && (
                  <SvgText x={x + barW / 2} y={padT + plotH - (totals[i] / max) * plotH - 8} fontSize={11.5} fill={colors.ink900} textAnchor="middle" fontFamily={fonts.bold}>
                    {format(totals[i])}
                  </SvgText>
                )}
              </G>
            );
          })}
        </Svg>
      )}
      {/* Tap targets wider than the bars */}
      <View style={{ position: 'absolute', left: padL, top: 0, bottom: 0, right: 0, flexDirection: 'row' }}>
        {data.map((d, i) => (
          <Pressable key={`${d.label}-${i}`} accessibilityLabel={`${d.label}: ${format(totals[i])}`} style={{ flex: 1 }} onPress={() => { tap(); setSel(sel === i ? null : i); }} />
        ))}
      </View>
    </View>
  );
}

/** Ring for a single headline percentage. */
export function Ring({ value, size = 92, stroke = 10, color = colors.green600, track = '#E7EDEA', label, sub, light }) {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const v = Math.max(0, Math.min(100, value));
  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={size} height={size} style={{ position: 'absolute' }}>
        <Circle cx={size / 2} cy={size / 2} r={r} stroke={track} strokeWidth={stroke} fill="none" />
        <Circle cx={size / 2} cy={size / 2} r={r} stroke={color} strokeWidth={stroke} fill="none" strokeLinecap="round" strokeDasharray={`${(v / 100) * c} ${c}`} transform={`rotate(-90 ${size / 2} ${size / 2})`} />
      </Svg>
      <Text style={{ fontFamily: fonts.extrabold, fontSize: size * 0.2, color: light ? '#fff' : colors.ink900 }}>{label}</Text>
      {sub ? <Text style={{ fontFamily: fonts.medium, fontSize: 10.5, color: light ? 'rgba(255,255,255,.7)' : colors.ink500 }}>{sub}</Text> : null}
    </View>
  );
}

/** Horizontal funnel bars with a single-hue sequential ramp. */
export function Funnel({ rows }) {
  const ramp = ['#7CC3A4', '#3F9F7A', '#177A5B', '#0B4D3A'];
  const top = rows[0]?.count || 1;
  return (
    <View style={{ gap: 10 }}>
      {rows.map((r, i) => (
        <View key={r.stage} style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <Text style={{ width: 90, fontFamily: fonts.semibold, fontSize: 13, color: colors.ink700 }}>{r.stage}</Text>
          <View style={{ flex: 1, height: 30, borderRadius: 9, backgroundColor: colors.canvas, overflow: 'hidden' }}>
            <View style={{ width: `${Math.max(14, (r.count / top) * 100)}%`, height: '100%', borderRadius: 9, backgroundColor: ramp[i % ramp.length], justifyContent: 'center', paddingLeft: 10 }}>
              <Text style={{ color: '#fff', fontFamily: fonts.bold, fontSize: 12.5 }}>{r.count}</Text>
            </View>
          </View>
          <Text style={{ width: 38, textAlign: 'right', fontFamily: fonts.semibold, fontSize: 12, color: colors.ink500 }}>{Math.round((r.count / top) * 100)}%</Text>
        </View>
      ))}
    </View>
  );
}
