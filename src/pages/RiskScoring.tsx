import { useState } from 'react'
import { BarChart, Bar, Cell, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, ReferenceLine } from 'recharts'
import ChartCard from '../components/ChartCard'
import ViolinChart from '../components/ViolinChart'
import { riskScoreDist, boxWhiskerData, recoveryAmountBoxWhisker, scoreOriginVsDefault } from '../data/creditData'

const SCORE_COLORS = (range: string) => {
  const mid = parseInt(range.split('-')[0]) + 50
  if (mid < 500) return '#ef4444'
  if (mid < 600) return '#f59e0b'
  if (mid < 700) return '#6366f1'
  return '#00c9a7'
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="glass rounded-lg px-3 py-2 shadow-xl text-xs">
      <p className="text-text-secondary mb-1">Score band: <span className="text-text-primary font-bold">{label}</span></p>
      <p className="text-text-primary">Count: <span className="font-bold">{payload[0]?.value?.toLocaleString()}</span></p>
    </div>
  )
}

// ── Reusable inline Box-Whisker SVG ─────────────────────────────────────────
interface BwItem { min: number; q1: number; median: number; q3: number; max: number; mean: number; label: string; color: string }

function BoxWhiskerSVG({ data, yLabel = 'Value', yFmt = (v: number) => String(v) }: {
  data: BwItem[], yLabel?: string, yFmt?: (v: number) => string
}) {
  const [hov, setHov] = useState<string | null>(null)
  const ML = 52, MR = 16, MT = 16, MB = 32
  const VW = 560, VH = 300
  const IW = VW - ML - MR, IH = VH - MT - MB
  const allVals = data.flatMap(d => [d.min, d.max])
  const minV = Math.min(...allVals), maxV = Math.max(...allVals)
  const pad = (maxV - minV) * 0.08
  const yS = (v: number) => MT + (1 - (v - minV + pad) / (maxV - minV + pad * 2)) * IH
  const bw = (IW / data.length) * 0.42
  const ticks = 6

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${VW} ${VH}`} className="w-full" style={{ maxHeight: 300 }}>
        {/* Grid */}
        {Array.from({ length: ticks }, (_, i) => {
          const v = minV + (i / (ticks - 1)) * (maxV - minV)
          const y = yS(v)
          return (
            <g key={i}>
              <line x1={ML} x2={VW - MR} y1={y} y2={y} stroke="#1e2333" strokeDasharray="3 3" />
              <text x={ML - 6} y={y} textAnchor="end" dominantBaseline="middle" fill="#7c8299" fontSize={8}>{yFmt(v)}</text>
            </g>
          )
        })}
        <text x={12} y={VH / 2} textAnchor="middle" fill="#7c8299" fontSize={9} transform={`rotate(-90,12,${VH/2})`}>{yLabel}</text>

        {/* Boxes */}
        {data.map((d, i) => {
          const cx = ML + (IW / data.length) * i + (IW / data.length) / 2
          const isH = hov === d.label
          const c = d.color
          return (
            <g key={d.label} onMouseEnter={() => setHov(d.label)} onMouseLeave={() => setHov(null)} style={{ cursor: 'pointer' }}>
              {/* Whisker line */}
              <line x1={cx} x2={cx} y1={yS(d.min)} y2={yS(d.max)} stroke={c} strokeWidth={isH ? 2 : 1.5} strokeOpacity={0.7} />
              {/* Caps */}
              <line x1={cx - bw * 0.5} x2={cx + bw * 0.5} y1={yS(d.min)} y2={yS(d.min)} stroke={c} strokeWidth={1.5} />
              <line x1={cx - bw * 0.5} x2={cx + bw * 0.5} y1={yS(d.max)} y2={yS(d.max)} stroke={c} strokeWidth={1.5} />
              {/* IQR box */}
              <rect x={cx - bw} y={yS(d.q3)} width={bw * 2} height={Math.max(1, yS(d.q1) - yS(d.q3))}
                fill={c} fillOpacity={isH ? 0.32 : 0.15} stroke={c} strokeWidth={isH ? 2 : 1.5} rx={3}
                style={{ filter: isH ? `drop-shadow(0 0 6px ${c}80)` : undefined }} />
              {/* Median */}
              <line x1={cx - bw} x2={cx + bw} y1={yS(d.median)} y2={yS(d.median)} stroke={c} strokeWidth={2.5} />
              {/* Mean dot */}
              <circle cx={cx} cy={yS(d.mean)} r={3.5} fill={c} stroke="#08090d" strokeWidth={1.2} />
              {/* X label */}
              <text x={cx} y={VH - 8} textAnchor="middle" fill={isH ? c : '#7c8299'} fontSize={9}>{d.label}</text>

              {/* Hover tooltip */}
              {isH && (
                <g>
                  <rect x={cx - 56} y={yS(d.max) - 76} width={112} height={70} fill="rgba(22,25,34,0.95)" stroke={c} strokeWidth={0.8} rx={5} />
                  {[['Max', d.max], ['Q3', d.q3], ['Median', d.median], ['Q1', d.q1], ['Min', d.min]].map(([lbl, val], li) => (
                    <text key={String(lbl)} x={cx - 42} y={yS(d.max) - 64 + li * 12} fill="#f0f2f8" fontSize={9}>
                      <tspan fill="#7c8299">{lbl}: </tspan>
                      <tspan fill={c} fontWeight={600}>{yFmt(Number(val))}</tspan>
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

const COLORS = ['#00c9a7','#6366f1','#f59e0b','#ef4444','#8b5cf6']

const riskBands = [
  { name: 'Sub-prime (< 580)',    value: 18, color: '#ef4444' },
  { name: 'Near-prime (580–659)', value: 27, color: '#f59e0b' },
  { name: 'Prime (660–749)',      value: 38, color: '#6366f1' },
  { name: 'Super-prime (750+)',   value: 17, color: '#00c9a7' },
]

export default function RiskScoring() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold gradient-text">Risk Scoring</h1>
        <p className="text-text-secondary text-sm mt-1">Score distributions, DPD variability, recovery spread, and origination vs default comparison</p>
      </div>

      {/* Original DPD box-whisker */}
      <ChartCard title="Days-to-Collect — Box & Whisker" subtitle="IQR box = Q1–Q3 · line = median · dot = mean · whiskers = min/max — hover for details">
        <BoxWhiskerSVG
          data={boxWhiskerData.map((d, i) => ({ ...d, label: d.product, color: COLORS[i] }))}
          yLabel="Days to Collect"
          yFmt={v => `${Math.round(v)}d`}
        />
      </ChartCard>

      {/* Score Origination vs Default box-whisker */}
      <ChartCard title="Credit Score: Origination vs Default" subtitle="Distribution at loan approval vs at point of default — hover for full stats">
        <BoxWhiskerSVG
          data={scoreOriginVsDefault.map((d, i) => ({
            ...d, label: d.group,
            color: i === 0 ? '#00c9a7' : '#ef4444',
          }))}
          yLabel="Credit Score"
          yFmt={v => Math.round(v).toString()}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          {scoreOriginVsDefault.map((d, i) => (
            <div key={d.group} className="glass rounded-lg p-3 text-xs space-y-1">
              <p className="font-semibold" style={{ color: i === 0 ? '#00c9a7' : '#ef4444' }}>{d.group}</p>
              {[['Min', d.min],['Q1', d.q1],['Median', d.median],['Mean', d.mean],['Q3', d.q3],['Max', d.max]].map(([l, v]) => (
                <div key={String(l)} className="flex justify-between">
                  <span className="text-text-secondary">{l}</span>
                  <span className="text-text-primary font-medium">{v}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
      </ChartCard>

      {/* Recovery Amount box-whisker */}
      <ChartCard title="Recovery Amount per Account — Box & Whisker" subtitle="Amount recovered (R) per delinquent account by product — hover for details">
        <BoxWhiskerSVG
          data={recoveryAmountBoxWhisker.map((d, i) => ({ ...d, label: d.product, color: COLORS[i] }))}
          yLabel="Recovery (R)"
          yFmt={v => v >= 1000 ? `R${(v/1000).toFixed(0)}K` : `R${Math.round(v)}`}
        />
      </ChartCard>

      {/* Violin + histogram row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title="Credit Score — Violin Plot" subtitle="Probability density by risk band · IQR box overlaid">
          <ViolinChart />
        </ChartCard>

        <ChartCard title="Score Distribution Histogram" subtitle="Customer count by score band">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={riskScoreDist} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e2333" />
              <XAxis dataKey="range" tick={{ fill: '#7c8299', fontSize: 9 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: '#7c8299', fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={v => `${(v/1000).toFixed(0)}K`} />
              <ReferenceLine x="601-650" stroke="#6366f1" strokeDasharray="3 3" />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" name="Customers" radius={[3,3,0,0]}>
                {riskScoreDist.map(entry => <Cell key={entry.range} fill={SCORE_COLORS(entry.range)} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Risk band segmentation */}
      <ChartCard title="Risk Band Segmentation" subtitle="Portfolio % by credit tier with statistical summary">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-3">
            {riskBands.map(band => (
              <div key={band.name}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-text-secondary">{band.name}</span>
                  <span className="text-xs font-bold" style={{ color: band.color }}>{band.value}%</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.07)' }}>
                  <div className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${band.value}%`, background: band.color, boxShadow: `0 0 8px ${band.color}80` }} />
                </div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[['Avg Score','648'],['Median','671'],['Std Dev','±112'],['Min','300'],['Max','887'],['Mode Range','651–700']].map(([l,v]) => (
              <div key={l} className="glass rounded-lg p-2.5 text-center">
                <p className="text-sm font-bold text-accent">{v}</p>
                <p className="text-[10px] text-text-secondary mt-0.5">{l}</p>
              </div>
            ))}
          </div>
        </div>
      </ChartCard>
    </div>
  )
}
