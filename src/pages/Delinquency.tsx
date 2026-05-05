import { useState } from 'react'
import {
  AreaChart, Area, BarChart, Bar, Cell, ComposedChart,
  XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer,
  ReferenceLine, Legend
} from 'recharts'
import ChartCard from '../components/ChartCard'
import { delinquencyTrend, delinquencyBuckets, writeOffRecovery, timeInBucketBoxWhisker } from '../data/creditData'

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="glass rounded-lg px-3 py-2 shadow-xl text-xs">
      <p className="text-text-secondary mb-1 font-medium">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color }}>
          {p.name}: <span className="font-bold">
            {typeof p.value === 'number' && Math.abs(p.value) > 1000
              ? `R${(p.value/1e6).toFixed(1)}M`
              : p.value}
          </span>
        </p>
      ))}
    </div>
  )
}

const BUCKET_COLORS = ['#00c9a7', '#4ade80', '#f59e0b', '#fb923c', '#ef4444', '#dc2626']

// ── Waterfall data ───────────────────────────────────────────────────────────

const rawWaterfall = [
  { name: 'Opening',      value: 4_500_000_000,  type: 'total' as const },
  { name: 'Disbursements',value:  280_000_000,   type: 'pos'   as const },
  { name: 'Repayments',   value: -320_000_000,   type: 'neg'   as const },
  { name: 'Settlements',  value:  -45_000_000,   type: 'neg'   as const },
  { name: 'Write-offs',   value:  -86_000_000,   type: 'neg'   as const },
  { name: 'Recoveries',   value:   39_400_000,   type: 'pos'   as const },
  { name: 'Closing',      value: 4_368_400_000,  type: 'total' as const },
]

// Build waterfall chart data: invisible spacer + visible bar
function buildWaterfall(raw: typeof rawWaterfall) {
  let running = 0
  return raw.map((d, i) => {
    if (d.type === 'total') {
      const entry = { name: d.name, spacer: 0, bar: d.value, type: d.type, actualValue: d.value }
      if (i === 0) running = d.value
      else running = d.value
      return entry
    }
    const spacer = d.value < 0 ? running + d.value : running
    const bar = Math.abs(d.value)
    running += d.value
    return { name: d.name, spacer, bar, type: d.type, actualValue: d.value }
  })
}
const waterfallData = buildWaterfall(rawWaterfall)

// Colour per bar
const wfColor = (type: string) =>
  type === 'total' ? '#6366f1' : type === 'pos' ? '#00c9a7' : '#ef4444'

const WFTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  const bar = payload.find((p: any) => p.dataKey === 'bar')
  if (!bar) return null
  const entry = waterfallData.find(d => d.name === label)
  const signed = entry?.type === 'neg' ? -bar.value : bar.value
  return (
    <div className="glass rounded-lg px-3 py-2 shadow-xl text-xs">
      <p className="text-text-primary font-semibold mb-1">{label}</p>
      <p style={{ color: wfColor(entry?.type ?? 'total') }}>
        {signed > 0 ? '+' : ''}R{(signed/1e6).toFixed(0)}M
      </p>
    </div>
  )
}

const TIB_COLORS = ['#00c9a7','#4ade80','#f59e0b','#fb923c','#ef4444','#dc2626']

function TimeInBucketChart() {
  const [hov, setHov] = useState<string | null>(null)
  const ML = 44, MR = 16, MT = 16, MB = 32
  const VW = 560, VH = 260
  const IW = VW - ML - MR, IH = VH - MT - MB
  const minV = 0, maxV = 30
  const yS = (v: number) => MT + (1 - (v - minV) / (maxV - minV)) * IH
  const bw = (IW / timeInBucketBoxWhisker.length) * 0.38

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${VW} ${VH}`} className="w-full" style={{ maxHeight: 260 }}>
        {[0,5,10,15,20,25,30].map(v => {
          const y = yS(v)
          return (
            <g key={v}>
              <line x1={ML} x2={VW-MR} y1={y} y2={y} stroke="#1e2333" strokeDasharray="3 3" />
              <text x={ML-6} y={y} textAnchor="end" dominantBaseline="middle" fill="#7c8299" fontSize={8}>{v}d</text>
            </g>
          )
        })}
        <text x={12} y={VH/2} textAnchor="middle" fill="#7c8299" fontSize={9} transform={`rotate(-90,12,${VH/2})`}>Days in Bucket</text>

        {timeInBucketBoxWhisker.map((d, i) => {
          const cx = ML + (IW / timeInBucketBoxWhisker.length) * i + (IW / timeInBucketBoxWhisker.length) / 2
          const isH = hov === d.bucket
          const c = TIB_COLORS[i]
          return (
            <g key={d.bucket} onMouseEnter={() => setHov(d.bucket)} onMouseLeave={() => setHov(null)} style={{ cursor: 'pointer' }}>
              <line x1={cx} x2={cx} y1={yS(d.min)} y2={yS(d.max)} stroke={c} strokeWidth={isH?2:1.5} strokeOpacity={0.7} />
              <line x1={cx-bw*0.5} x2={cx+bw*0.5} y1={yS(d.min)} y2={yS(d.min)} stroke={c} strokeWidth={1.5} />
              <line x1={cx-bw*0.5} x2={cx+bw*0.5} y1={yS(d.max)} y2={yS(d.max)} stroke={c} strokeWidth={1.5} />
              <rect x={cx-bw} y={yS(d.q3)} width={bw*2} height={Math.max(1,yS(d.q1)-yS(d.q3))}
                fill={c} fillOpacity={isH?0.32:0.15} stroke={c} strokeWidth={isH?2:1.5} rx={3}
                style={{ filter: isH ? `drop-shadow(0 0 6px ${c}80)` : undefined }} />
              <line x1={cx-bw} x2={cx+bw} y1={yS(d.median)} y2={yS(d.median)} stroke={c} strokeWidth={2.5} />
              <circle cx={cx} cy={yS(d.mean)} r={3.5} fill={c} stroke="#08090d" strokeWidth={1.2} />
              <text x={cx} y={VH-8} textAnchor="middle" fill={isH?c:'#7c8299'} fontSize={8}>{d.bucket}</text>
              {isH && (
                <g>
                  <rect x={cx-54} y={yS(d.max)-72} width={108} height={66} fill="rgba(22,25,34,0.95)" stroke={c} strokeWidth={0.8} rx={5} />
                  {[['Max',d.max],['Q3',d.q3],['Median',d.median],['Q1',d.q1],['Min',d.min]].map(([l,v],li) => (
                    <text key={String(l)} x={cx-40} y={yS(d.max)-60+li*12} fill="#f0f2f8" fontSize={9}>
                      <tspan fill="#7c8299">{l}: </tspan><tspan fill={c} fontWeight={600}>{v}d</tspan>
                    </text>
                  ))}
                </g>
              )}
            </g>
          )
        })}
      </svg>
    </div>
  )
}

export default function Delinquency() {
  const [metric, setMetric] = useState<'npl'|'delinquent'>('npl')

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold gradient-text">Delinquency Analysis</h1>
        <p className="text-text-secondary text-sm mt-1">Arrears trends, bucket distribution, waterfall movement, and write-off tracking</p>
      </div>

      {/* Toggle */}
      <div className="flex gap-2">
        {(['npl','delinquent'] as const).map(m => (
          <button key={m} onClick={() => setMetric(m)}
            className="px-4 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200"
            style={{
              background: metric === m ? '#00c9a7' : 'rgba(255,255,255,0.05)',
              color:      metric === m ? '#08090d' : '#7c8299',
              boxShadow:  metric === m ? '0 0 16px rgba(0,201,167,0.45)' : undefined,
            }}>
            {m === 'npl' ? 'NPL Ratio' : 'Delinquency Rate'}
          </button>
        ))}
      </div>

      {/* Area chart */}
      <ChartCard title={metric === 'npl' ? 'Non-Performing Loan Ratio' : 'Delinquency Rate'} subtitle="12-month trailing — % of portfolio">
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={delinquencyTrend} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="gM" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%"  stopColor={metric === 'npl' ? '#ef4444' : '#f59e0b'} stopOpacity={0.4} />
                <stop offset="95%" stopColor={metric === 'npl' ? '#ef4444' : '#f59e0b'} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e2333" />
            <XAxis dataKey="month" tick={{ fill: '#7c8299', fontSize: 11 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fill: '#7c8299', fontSize: 11 }} tickLine={false} axisLine={false} tickFormatter={v => `${v}%`} />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={8} stroke="#ef4444" strokeDasharray="4 4" label={{ value: 'Threshold 8%', fill: '#ef4444', fontSize: 10 }} />
            <Area type="monotone" dataKey={metric} name={metric === 'npl' ? 'NPL %' : 'Delinquent %'}
              stroke={metric === 'npl' ? '#ef4444' : '#f59e0b'} fill="url(#gM)" strokeWidth={2.5}
              dot={{ r: 3, fill: metric === 'npl' ? '#ef4444' : '#f59e0b' }} />
          </AreaChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Waterfall + Write-off */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* ── Waterfall chart ── */}
        <ChartCard title="Net Portfolio Movement" subtitle="Monthly balance waterfall — opening to closing (Apr 2026)">
          <ResponsiveContainer width="100%" height={240}>
            <ComposedChart data={waterfallData} margin={{ top: 4, right: 8, left: 0, bottom: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e2333" vertical={false} />
              <XAxis dataKey="name" tick={{ fill: '#7c8299', fontSize: 9 }} tickLine={false} axisLine={false} angle={-30} textAnchor="end" interval={0} />
              <YAxis tick={{ fill: '#7c8299', fontSize: 9 }} tickLine={false} axisLine={false}
                tickFormatter={v => `R${(v/1e9).toFixed(1)}B`} domain={[0, 5_000_000_000]} />
              <Tooltip content={<WFTooltip />} />
              {/* Invisible spacer lifts bars to correct position */}
              <Bar dataKey="spacer" stackId="wf" fill="transparent" />
              {/* Visible coloured bar */}
              <Bar dataKey="bar" stackId="wf" radius={[4,4,0,0]}>
                {waterfallData.map((entry, i) => (
                  <Cell key={i} fill={wfColor(entry.type)}
                    style={{ filter: `drop-shadow(0 0 6px ${wfColor(entry.type)}80)` }} />
                ))}
              </Bar>
            </ComposedChart>
          </ResponsiveContainer>

          {/* Legend */}
          <div className="flex gap-4 mt-1">
            {[['Inflow','#00c9a7'],['Outflow','#ef4444'],['Balance','#6366f1']].map(([l,c]) => (
              <div key={l} className="flex items-center gap-1.5 text-[10px] text-text-secondary">
                <span className="w-2.5 h-2.5 rounded-sm" style={{ background: c }} />{l}
              </div>
            ))}
          </div>
        </ChartCard>

        {/* Write-off vs Recovery */}
        <ChartCard title="Write-off vs Recovery" subtitle="Monthly net credit loss">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={writeOffRecovery} barGap={4} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e2333" />
              <XAxis dataKey="month" tick={{ fill: '#7c8299', fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: '#7c8299', fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={v => `R${(v/1e6).toFixed(0)}M`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="writeOff"  name="Write-off"  fill="#ef4444" radius={[3,3,0,0]} />
              <Bar dataKey="recovered" name="Recovered"  fill="#00c9a7" radius={[3,3,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* DPD Bucket table */}
      <ChartCard title="Arrears Bucket Detail" subtitle="Current snapshot by DPD category">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                {['DPD Bucket','Accounts','Outstanding Value','% of Portfolio','Avg Balance'].map(h => (
                  <th key={h} className="text-left text-text-secondary font-medium py-2 px-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {delinquencyBuckets.map((row, i) => (
                <tr key={row.bucket} className="hover:bg-white/[0.02] transition-colors" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td className="py-2.5 px-3 font-semibold" style={{ color: BUCKET_COLORS[i] }}>{row.bucket} days</td>
                  <td className="py-2.5 px-3 text-text-primary">{row.count.toLocaleString()}</td>
                  <td className="py-2.5 px-3 text-text-primary">R{(row.value/1e6).toFixed(1)}M</td>
                  <td className="py-2.5 px-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
                        <div className="h-full rounded-full" style={{ width: `${row.pct}%`, background: BUCKET_COLORS[i], boxShadow: `0 0 6px ${BUCKET_COLORS[i]}80` }} />
                      </div>
                      <span className="text-text-primary w-8 text-right">{row.pct}%</span>
                    </div>
                  </td>
                  <td className="py-2.5 px-3 text-text-secondary">R{Math.round(row.value/row.count).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ChartCard>

      {/* Time-in-bucket box-whisker */}
      <ChartCard title="Time Spent in DPD Bucket — Box & Whisker" subtitle="Days accounts linger in each arrears bracket before moving · hover for full distribution">
        <TimeInBucketChart />
      </ChartCard>
    </div>
  )
}
