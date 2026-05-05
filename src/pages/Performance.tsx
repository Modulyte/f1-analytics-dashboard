import { useState } from 'react'
import {
  ComposedChart, Bar, Line, Scatter,
  XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend,
  ScatterChart, ZAxis
} from 'recharts'
import ChartCard from '../components/ChartCard'
import { agentPerformance, writeOffRecovery } from '../data/creditData'

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-xl text-xs">
      <p className="text-text-secondary mb-1 font-medium">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color }}>{p.name}: <span className="font-bold">{p.value}</span></p>
      ))}
    </div>
  )
}

const ScatterTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.length) return null
  const d = payload[0]?.payload
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-xl text-xs space-y-0.5">
      <p className="text-accent font-semibold">{d?.name}</p>
      <p className="text-text-secondary">Calls: <span className="text-text-primary font-bold">{d?.calls}</span></p>
      <p className="text-text-secondary">Recovered: <span className="text-text-primary font-bold">R{d?.recovered}K</span></p>
      <p className="text-text-secondary">Keep Rate: <span className="text-text-primary font-bold">{d?.rate}%</span></p>
    </div>
  )
}

// Monthly perf metrics
const monthlyMetrics = [
  { month: 'Nov 25', dialRate: 82, contactRate: 64, rpc: 48, ptpRate: 38 },
  { month: 'Dec 25', dialRate: 79, contactRate: 61, rpc: 46, ptpRate: 36 },
  { month: 'Jan 26', dialRate: 85, contactRate: 67, rpc: 52, ptpRate: 41 },
  { month: 'Feb 26', dialRate: 88, contactRate: 70, rpc: 55, ptpRate: 44 },
  { month: 'Mar 26', dialRate: 91, contactRate: 73, rpc: 58, ptpRate: 47 },
  { month: 'Apr 26', dialRate: 93, contactRate: 75, rpc: 61, ptpRate: 49 },
]

// Combined composed chart data (write-off + line)
const composedData = writeOffRecovery.map(d => ({
  ...d,
  recoveryRate: Math.round((d.recovered / d.writeOff) * 100),
}))

export default function Performance() {
  const [activeMetrics, setActiveMetrics] = useState<string[]>(['dialRate', 'contactRate', 'rpc', 'ptpRate'])

  const metrics = [
    { key: 'dialRate', label: 'Dial Rate', color: '#00c9a7' },
    { key: 'contactRate', label: 'Contact Rate', color: '#6366f1' },
    { key: 'rpc', label: 'RPC Rate', color: '#f59e0b' },
    { key: 'ptpRate', label: 'PTP Rate', color: '#ef4444' },
  ]

  const toggle = (key: string) =>
    setActiveMetrics(prev => prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key])

  const scatterPoints = agentPerformance.map(a => ({
    name: a.agent,
    calls: a.calls,
    recovered: Math.round(a.recovered / 1000),
    rate: a.rate,
  }))

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Operational Performance</h1>
        <p className="text-text-secondary text-sm mt-1">Call centre efficiency, funnel rates, and productivity scatter analysis</p>
      </div>

      {/* Metric toggles + line chart */}
      <ChartCard
        title="Collections Funnel Rates"
        subtitle="Monthly trend across dialling → contact → RPC → PTP"
        action={
          <div className="flex gap-1 flex-wrap justify-end">
            {metrics.map(m => (
              <button
                key={m.key}
                onClick={() => toggle(m.key)}
                className="px-2 py-0.5 rounded text-[10px] font-semibold border transition-all"
                style={{
                  borderColor: m.color,
                  background: activeMetrics.includes(m.key) ? `${m.color}25` : 'transparent',
                  color: activeMetrics.includes(m.key) ? m.color : '#7c8299',
                }}
              >
                {m.label}
              </button>
            ))}
          </div>
        }
      >
        <ResponsiveContainer width="100%" height={240}>
          <ComposedChart data={monthlyMetrics} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#242836" />
            <XAxis dataKey="month" tick={{ fill: '#7c8299', fontSize: 10 }} tickLine={false} axisLine={false} />
            <YAxis tick={{ fill: '#7c8299', fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={v => `${v}%`} domain={[20, 100]} />
            <Tooltip content={<CustomTooltip />} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            {metrics.filter(m => activeMetrics.includes(m.key)).map(m => (
              <Line
                key={m.key}
                type="monotone"
                dataKey={m.key}
                name={m.label}
                stroke={m.color}
                strokeWidth={2}
                dot={{ r: 3, fill: m.color }}
                activeDot={{ r: 5 }}
              />
            ))}
          </ComposedChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Scatter + composed */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Scatter: calls vs recovery */}
        <ChartCard title="Agent Efficiency Scatter" subtitle="Calls made vs amount recovered — bubble size = keep rate">
          <ResponsiveContainer width="100%" height={240}>
            <ScatterChart margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#242836" />
              <XAxis
                type="number" dataKey="calls" name="Calls"
                tick={{ fill: '#7c8299', fontSize: 10 }} tickLine={false} axisLine={false}
                label={{ value: 'Calls Made', position: 'insideBottom', offset: -2, fill: '#7c8299', fontSize: 10 }}
              />
              <YAxis
                type="number" dataKey="recovered" name="Recovered"
                tick={{ fill: '#7c8299', fontSize: 10 }} tickLine={false} axisLine={false}
                tickFormatter={v => `R${v}K`}
              />
              <ZAxis type="number" dataKey="rate" range={[80, 320]} />
              <Tooltip content={<ScatterTooltip />} />
              <Scatter data={scatterPoints} fill="#00c9a7" fillOpacity={0.75} stroke="#00c9a7" strokeWidth={1} />
            </ScatterChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Composed: write-off bar + recovery rate line */}
        <ChartCard title="Write-off & Recovery Rate" subtitle="Monthly write-off volume with recovery rate overlay">
          <ResponsiveContainer width="100%" height={240}>
            <ComposedChart data={composedData} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#242836" />
              <XAxis dataKey="month" tick={{ fill: '#7c8299', fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis yAxisId="left" tick={{ fill: '#7c8299', fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={v => `R${(v / 1e6).toFixed(0)}M`} />
              <YAxis yAxisId="right" orientation="right" tick={{ fill: '#7c8299', fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={v => `${v}%`} domain={[20, 50]} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar yAxisId="left" dataKey="writeOff" name="Write-off" fill="#ef4444" fillOpacity={0.6} radius={[3, 3, 0, 0]} />
              <Bar yAxisId="left" dataKey="recovered" name="Recovered" fill="#00c9a7" fillOpacity={0.6} radius={[3, 3, 0, 0]} />
              <Line yAxisId="right" type="monotone" dataKey="recoveryRate" name="Recovery Rate %" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
            </ComposedChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Agent performance table with mini bar inline */}
      <ChartCard title="Agent Score Card" subtitle="Comprehensive agent-level KPIs">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {agentPerformance.map(a => (
            <div
              key={a.agent}
              className="rounded-lg border border-border bg-surface p-3 hover:border-accent/30 transition-colors cursor-pointer"
            >
              <p className="text-xs font-semibold text-text-primary truncate">{a.agent}</p>
              <p className="text-xl font-bold mt-1" style={{ color: a.rate >= 76 ? '#00c9a7' : a.rate >= 72 ? '#f59e0b' : '#ef4444' }}>
                {a.rate}%
              </p>
              <p className="text-[10px] text-text-secondary">Keep Rate</p>
              <div className="mt-2 space-y-1">
                <div className="flex justify-between text-[10px] text-text-secondary">
                  <span>Calls</span><span className="text-text-primary">{a.calls}</span>
                </div>
                <div className="flex justify-between text-[10px] text-text-secondary">
                  <span>Recovered</span><span className="text-text-primary">R{(a.recovered / 1e6).toFixed(1)}M</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ChartCard>
    </div>
  )
}
