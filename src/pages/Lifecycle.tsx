import { useState } from 'react'
import {
  ComposedChart, Area, Line, XAxis, YAxis, Tooltip,
  CartesianGrid, ResponsiveContainer, ReferenceLine, Legend
} from 'recharts'
import ChartCard from '../components/ChartCard'
import { accountJourneys, STAGE_COLORS, sankeyNodes, sankeyLinks, dailyPTPData, nplForecast } from '../data/creditData'

const MONTHS = 15
const MONTH_LABELS = ['Jan 25','Feb 25','Mar 25','Apr 25','May 25','Jun 25','Jul 25','Aug 25','Sep 25','Oct 25','Nov 25','Dec 25','Jan 26','Feb 26','Mar 26']

// ── Gantt / Account Lifecycle Timeline ────────────────────────────────────────
function GanttChart() {
  const [hov, setHov] = useState<string | null>(null)
  const ML = 140, MR = 12, MT = 28, MB = 8
  const VW = 740, VH = 300
  const IW = VW - ML - MR, IH = VH - MT - MB
  const ROW_H = IH / accountJourneys.length
  const COL_W = IW / MONTHS

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${VW} ${VH}`} className="w-full" style={{ maxHeight: 300 }}>
        {/* Month headers */}
        {MONTH_LABELS.map((m, i) => (
          <text key={m} x={ML + i * COL_W + COL_W / 2} y={MT - 10} textAnchor="middle" fill="#7c8299" fontSize={8}>{m}</text>
        ))}
        {/* Vertical grid */}
        {MONTH_LABELS.map((_, i) => (
          <line key={i} x1={ML + i * COL_W} x2={ML + i * COL_W} y1={MT} y2={VH - MB} stroke="#1e2333" strokeWidth={0.5} />
        ))}

        {/* Rows */}
        {accountJourneys.map((acc, ri) => {
          const y = MT + ri * ROW_H
          const isH = hov === acc.id
          return (
            <g key={acc.id} onMouseEnter={() => setHov(acc.id)} onMouseLeave={() => setHov(null)} style={{ cursor: 'pointer' }}>
              {/* Row bg on hover */}
              {isH && <rect x={0} y={y} width={VW} height={ROW_H} fill="rgba(255,255,255,0.03)" />}
              {/* Account label */}
              <text x={ML - 4} y={y + ROW_H / 2} textAnchor="end" dominantBaseline="middle" fill={isH ? '#f0f2f8' : '#7c8299'} fontSize={8.5} fontWeight={isH ? 600 : 400}>{acc.id}</text>
              {/* Stage segments */}
              {(() => {
                let startM = 0
                return acc.segments.map((seg, si) => {
                  const x = ML + startM * COL_W
                  const w = seg.dur * COL_W
                  const c = STAGE_COLORS[seg.s] ?? '#444'
                  startM += seg.dur
                  return (
                    <g key={si}>
                      <rect x={x + 1} y={y + 3} width={w - 2} height={ROW_H - 6}
                        fill={c} fillOpacity={isH ? 0.9 : 0.65} rx={3}
                        style={{ filter: isH ? `drop-shadow(0 0 4px ${c}80)` : undefined }} />
                      {w > 28 && <text x={x + w / 2} y={y + ROW_H / 2} textAnchor="middle" dominantBaseline="middle" fill="#fff" fontSize={7.5} opacity={0.9}>{seg.s}</text>}
                    </g>
                  )
                })
              })()}
              {/* Outcome badge */}
              <text x={ML + MONTHS * COL_W + 2} y={y + ROW_H / 2} dominantBaseline="middle" fill="#7c8299" fontSize={7.5}>{acc.label}</text>
            </g>
          )
        })}
      </svg>

      {/* Stage legend */}
      <div className="flex flex-wrap gap-3 mt-3 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        {Object.entries(STAGE_COLORS).map(([s, c]) => (
          <div key={s} className="flex items-center gap-1.5 text-[10px] text-text-secondary">
            <span className="w-3 h-2.5 rounded-sm inline-block" style={{ background: c }} />{s}
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Simplified 2-column Sankey ─────────────────────────────────────────────────
function SankeyChart() {
  const [hovLink, setHovLink] = useState<number | null>(null)
  const VW = 580, VH = 320
  const ML = 90, MR = 90, MT = 16, MB = 16
  const IH = VH - MT - MB
  const GAP = 4
  const BOX_W = 18

  const srcNodes = sankeyNodes.filter(n => n.col === 0)
  const tgtNodes = sankeyNodes.filter(n => n.col === 1)
  const srcTotal = srcNodes.reduce((a, n) => a + n.value, 0)
  const tgtTotal = tgtNodes.reduce((a, n) => a + n.value, 0)

  // Compute y positions
  function positionNodes(nodes: typeof srcNodes, total: number) {
    let y = MT
    return nodes.map(n => {
      const h = Math.max(4, (n.value / total) * (IH - GAP * nodes.length))
      const pos = { ...n, y, h }
      y += h + GAP
      return pos
    })
  }
  const srcPos = positionNodes(srcNodes, srcTotal)
  const tgtPos = positionNodes(tgtNodes, tgtTotal)

  const xL = ML + BOX_W
  const xR = VW - MR - BOX_W

  // Track y-offsets into each box for links
  const srcOff = new Array(srcNodes.length).fill(0)
  const tgtOff = new Array(tgtNodes.length).fill(0)

  const links = sankeyLinks.map((lk, li) => {
    const src = srcPos[lk.s], tgt = tgtPos[lk.t]
    const scale = IH / srcTotal
    const lh = Math.max(1, lk.v * scale)
    const sy = src.y + srcOff[lk.s]
    const ty = tgt.y + tgtOff[lk.t]
    srcOff[lk.s] += lh
    tgtOff[lk.t] += lh
    const mx = (xL + xR) / 2
    const path = `M${xL},${sy} M${xL},${sy+lh} C${mx},${sy+lh} ${mx},${ty+lh} ${xR},${ty+lh} L${xR},${ty} C${mx},${ty} ${mx},${sy} ${xL},${sy} Z`
    return { path, color: src.color, lh, li }
  })

  return (
    <svg viewBox={`0 0 ${VW} ${VH}`} className="w-full" style={{ maxHeight: 320 }}>
      {/* Links */}
      {links.map((lk) => (
        <path key={lk.li} d={lk.path} fill={lk.color}
          fillOpacity={hovLink === lk.li ? 0.55 : 0.22}
          stroke={lk.color} strokeOpacity={0.4} strokeWidth={0.5}
          onMouseEnter={() => setHovLink(lk.li)} onMouseLeave={() => setHovLink(null)}
          style={{ cursor: 'pointer', transition: 'fill-opacity 0.2s' }} />
      ))}
      {/* Source boxes */}
      {srcPos.map(n => (
        <g key={n.id}>
          <rect x={ML} y={n.y} width={BOX_W} height={n.h} fill={n.color} rx={2}
            style={{ filter: `drop-shadow(0 0 4px ${n.color}60)` }} />
          <text x={ML - 4} y={n.y + n.h / 2} textAnchor="end" dominantBaseline="middle" fill={n.color} fontSize={9} fontWeight={600}>{n.label}</text>
          <text x={ML - 4} y={n.y + n.h / 2 + 10} textAnchor="end" dominantBaseline="middle" fill="#7c8299" fontSize={7.5}>{n.value.toLocaleString()}</text>
        </g>
      ))}
      {/* Target boxes */}
      {tgtPos.map(n => (
        <g key={n.id}>
          <rect x={xR} y={n.y} width={BOX_W} height={n.h} fill={n.color} rx={2}
            style={{ filter: `drop-shadow(0 0 4px ${n.color}60)` }} />
          <text x={xR + BOX_W + 4} y={n.y + n.h / 2} dominantBaseline="middle" fill={n.color} fontSize={9} fontWeight={600}>{n.label}</text>
          <text x={xR + BOX_W + 4} y={n.y + n.h / 2 + 10} dominantBaseline="middle" fill="#7c8299" fontSize={7.5}>{n.value.toLocaleString()}</text>
        </g>
      ))}
      {/* Column labels */}
      <text x={ML + BOX_W / 2} y={MT - 6} textAnchor="middle" fill="#7c8299" fontSize={8}>This Month</text>
      <text x={xR + BOX_W / 2} y={MT - 6} textAnchor="middle" fill="#7c8299" fontSize={8}>Next Month</text>
    </svg>
  )
}

// ── Calendar Heatmap ─────────────────────────────────────────────────────────
const CELL = 14, CELL_GAP = 2
const MONTHS_CAL = ['Feb 2026', 'Mar 2026', 'Apr 2026']
const DAYS = ['S','M','T','W','T','F','S']

function heatColor(rate: number) {
  if (rate >= 80) return '#00c9a7'
  if (rate >= 70) return '#4ade80'
  if (rate >= 60) return '#f59e0b'
  if (rate >= 50) return '#fb923c'
  return '#ef4444'
}

function CalendarHeatmap() {
  const [hovDay, setHovDay] = useState<typeof dailyPTPData[0] | null>(null)
  const weeks = Math.ceil(dailyPTPData.length / 7)

  return (
    <div>
      <div className="overflow-x-auto">
        <svg viewBox={`0 0 ${weeks * (CELL + CELL_GAP) + 80} 160`} className="w-full" style={{ maxHeight: 160 }}>
          {/* Day labels */}
          {DAYS.map((d, i) => (
            <text key={d+i} x={28} y={32 + i * (CELL + CELL_GAP) + CELL / 2} textAnchor="end" dominantBaseline="middle" fill="#7c8299" fontSize={8}>{d}</text>
          ))}
          {/* Month labels */}
          {MONTHS_CAL.map((m, mi) => (
            <text key={m} x={34 + mi * 4.33 * (CELL + CELL_GAP)} y={18} fill="#7c8299" fontSize={8}>{m}</text>
          ))}
          {/* Cells */}
          {dailyPTPData.map((d, i) => {
            const col = Math.floor(i / 7)
            const row = i % 7
            const x = 34 + col * (CELL + CELL_GAP)
            const y = 24 + row * (CELL + CELL_GAP)
            const c = heatColor(d.rate)
            return (
              <rect key={i} x={x} y={y} width={CELL} height={CELL} rx={2}
                fill={c} fillOpacity={0.75}
                style={{ filter: hovDay?.date===d.date ? `drop-shadow(0 0 4px ${c})` : undefined, cursor: 'pointer' }}
                onMouseEnter={() => setHovDay(d)} onMouseLeave={() => setHovDay(null)} />
            )
          })}
        </svg>
      </div>

      {/* Tooltip below */}
      <div className="h-8 flex items-center gap-4 px-1 mt-1">
        {hovDay ? (
          <>
            <span className="text-xs text-text-secondary">{hovDay.date}</span>
            <span className="text-xs font-bold text-accent">{hovDay.kept} PTPs kept</span>
            <span className="text-xs text-text-secondary">of {hovDay.total} made</span>
            <span className="text-xs font-bold" style={{ color: heatColor(hovDay.rate) }}>{hovDay.rate}% keep rate</span>
          </>
        ) : (
          <span className="text-xs text-text-secondary">Hover a cell to see daily detail</span>
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-2 mt-1">
        <span className="text-[10px] text-text-secondary">Low</span>
        {['#ef4444','#fb923c','#f59e0b','#4ade80','#00c9a7'].map(c => (
          <span key={c} className="w-3 h-3 rounded-sm inline-block" style={{ background: c }} />
        ))}
        <span className="text-[10px] text-text-secondary">High keep rate</span>
      </div>
    </div>
  )
}

// ── NPL Forecast (area band) ────────────────────────────────────────────────
const FTip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="glass rounded-lg px-3 py-2 shadow-xl text-xs">
      <p className="text-text-secondary font-medium mb-1">{label}</p>
      {payload.map((p: any) => p.value != null && (
        <p key={p.name} style={{ color: p.color ?? p.stroke }}>{p.name}: <span className="font-bold">{p.value}%</span></p>
      ))}
    </div>
  )
}

export default function Lifecycle() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold gradient-text">Account Lifecycle</h1>
        <p className="text-text-secondary text-sm mt-1">Gantt timeline, state-flow Sankey, PTP calendar heatmap, and NPL forecast</p>
      </div>

      {/* Gantt */}
      <ChartCard title="Account Lifecycle Timeline" subtitle="Archetypical account journeys across 15 months — hover a row to highlight · direct equivalent of F1 stint strategy">
        <GanttChart />
      </ChartCard>

      {/* Sankey + Calendar */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title="Account State-Flow (Sankey)" subtitle="Month-on-month transitions between DPD states — hover a flow to highlight">
          <SankeyChart />
        </ChartCard>

        <ChartCard title="Daily PTP Calendar Heatmap" subtitle="Feb–Apr 2026 · colour = daily keep rate · hover for detail">
          <CalendarHeatmap />
        </ChartCard>
      </div>

      {/* NPL Forecast */}
      <ChartCard title="NPL Forecast with Confidence Band" subtitle="Historical actual (solid) + 6-month projection (dashed) + 80% confidence interval (shaded) · reference line = 8% threshold">
        <ResponsiveContainer width="100%" height={280}>
          <ComposedChart data={nplForecast} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="bandGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#6366f1" stopOpacity={0.25} />
                <stop offset="100%" stopColor="#6366f1" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e2333" />
            <XAxis dataKey="month" tick={{ fill: '#7c8299', fontSize: 10 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fill: '#7c8299', fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={v => `${v}%`} domain={[4, 10]} />
            <Tooltip content={<FTip />} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <ReferenceLine y={8} stroke="#ef4444" strokeDasharray="4 4" label={{ value: 'Threshold 8%', fill: '#ef4444', fontSize: 9, position: 'right' }} />
            {/* Confidence band — upper to lower area */}
            <Area dataKey="upper" name="Upper bound" stroke="none" fill="url(#bandGrad)" dot={false} legendType="none" />
            <Area dataKey="lower" name="Lower bound" stroke="none" fill="#08090d" dot={false} legendType="none" />
            {/* Forecast line */}
            <Line type="monotone" dataKey="forecast" name="Forecast" stroke="#6366f1" strokeWidth={2} strokeDasharray="5 4" dot={{ r: 3 }} connectNulls />
            {/* Actual line */}
            <Line type="monotone" dataKey="actual" name="Actual NPL" stroke="#ef4444" strokeWidth={2.5} dot={{ r: 3.5, fill: '#ef4444' }} connectNulls />
          </ComposedChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  )
}
