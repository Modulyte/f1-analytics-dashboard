import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Treemap
} from 'recharts'
import ChartCard from '../components/ChartCard'
import { portfolioSegments, riskHeatmap } from '../data/creditData'

const PIE_COLORS = ['#00c9a7', '#6366f1', '#f59e0b', '#ef4444', '#8b5cf6']

const HEAT_COLORS: Record<string, string> = { Low: '#00c9a7', Medium: '#f59e0b', High: '#ef4444' }

const radarData = [
  { metric: 'Utilisation', personal: 78, card: 92, home: 62, vehicle: 71 },
  { metric: 'Delinquency', personal: 55, card: 68, home: 42, vehicle: 58 },
  { metric: 'Recovery', personal: 72, card: 65, home: 81, vehicle: 69 },
  { metric: 'NPL Rate', personal: 44, card: 62, home: 32, vehicle: 48 },
  { metric: 'Growth', personal: 83, card: 71, home: 58, vehicle: 76 },
  { metric: 'Margin', personal: 66, card: 79, home: 54, vehicle: 62 },
]

const treemapData = [
  { name: 'Personal Loans', size: 38.4, fill: '#00c9a7' },
  { name: 'Credit Cards', size: 24.7, fill: '#6366f1' },
  { name: 'Home Loans', size: 18.2, fill: '#f59e0b' },
  { name: 'Vehicle Finance', size: 12.1, fill: '#ef4444' },
  { name: 'Overdrafts', size: 6.6, fill: '#8b5cf6' },
]

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-xl text-xs">
      <p className="text-text-secondary mb-1 font-medium">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color ?? '#f0f2f8' }}>{p.name}: <span className="font-bold">{p.value}</span></p>
      ))}
    </div>
  )
}

const CustomTreemapContent = (props: any) => {
  const { x, y, width, height, name, size, fill } = props
  if (width < 40 || height < 30) return null
  return (
    <g>
      <rect x={x} y={y} width={width} height={height} fill={fill} fillOpacity={0.7} stroke="#08090d" strokeWidth={2} rx={4} />
      <text x={x + width / 2} y={y + height / 2 - 6} textAnchor="middle" fill="#fff" fontSize={12} fontWeight={600}>{name}</text>
      <text x={x + width / 2} y={y + height / 2 + 10} textAnchor="middle" fill="#fff" fontSize={10} opacity={0.8}>{size}%</text>
    </g>
  )
}

export default function Portfolio() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-text-primary">Portfolio Analysis</h1>
        <p className="text-text-secondary text-sm mt-1">Segment breakdown, risk exposure, and product performance radar</p>
      </div>

      {/* Row 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Donut */}
        <ChartCard title="Portfolio Composition" subtitle="Exposure by product type">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={portfolioSegments}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={100}
                paddingAngle={4}
                dataKey="value"
                label={({ name, value }) => `${name} ${value}%`}
                labelLine={false}
              >
                {portfolioSegments.map((_, i) => (
                  <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(v: number) => `${v}%`}
                contentStyle={{ background: '#161922', border: '1px solid #242836', borderRadius: 8, fontSize: 11 }}
              />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Treemap */}
        <ChartCard title="Portfolio Treemap" subtitle="Area proportional to exposure weight">
          <ResponsiveContainer width="100%" height={260}>
            <Treemap
              data={treemapData}
              dataKey="size"
              aspectRatio={4 / 3}
              content={<CustomTreemapContent />}
            />
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Radar */}
      <ChartCard title="Product Performance Radar" subtitle="Normalised scores across 6 metrics (0–100)">
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart cx="50%" cy="50%" outerRadius={110} data={radarData}>
            <PolarGrid stroke="#242836" />
            <PolarAngleAxis dataKey="metric" tick={{ fill: '#7c8299', fontSize: 11 }} />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#7c8299', fontSize: 9 }} />
            <Radar name="Personal" dataKey="personal" stroke="#00c9a7" fill="#00c9a7" fillOpacity={0.15} strokeWidth={2} />
            <Radar name="Credit Card" dataKey="card" stroke="#6366f1" fill="#6366f1" fillOpacity={0.15} strokeWidth={2} />
            <Radar name="Home Loan" dataKey="home" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.1} strokeWidth={2} />
            <Radar name="Vehicle" dataKey="vehicle" stroke="#ef4444" fill="#ef4444" fillOpacity={0.1} strokeWidth={2} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Tooltip contentStyle={{ background: '#161922', border: '1px solid #242836', borderRadius: 8, fontSize: 11 }} />
          </RadarChart>
        </ResponsiveContainer>
      </ChartCard>

      {/* Risk band heatmap table */}
      <ChartCard title="Risk Band Exposure Heatmap" subtitle="Outstanding value by segment × risk band">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left text-text-secondary font-medium py-2 px-3">Segment</th>
                {['Low', 'Medium', 'High'].map(b => (
                  <th key={b} className="text-left py-2 px-3" style={{ color: HEAT_COLORS[b] }}>{b} Risk</th>
                ))}
                <th className="text-left text-text-secondary font-medium py-2 px-3">Total</th>
              </tr>
            </thead>
            <tbody>
              {['Personal', 'Credit Card', 'Home Loan', 'Vehicle', 'Overdraft'].map(seg => {
                const rows = riskHeatmap.filter(r => r.segment === seg)
                const total = rows.reduce((s, r) => s + r.exposure, 0)
                return (
                  <tr key={seg} className="border-b border-border/50 hover:bg-white/[0.02] transition-colors">
                    <td className="py-2.5 px-3 font-medium text-text-primary">{seg}</td>
                    {['Low', 'Medium', 'High'].map(band => {
                      const r = rows.find(x => x.band === band)!
                      const pct = r ? Math.round((r.exposure / total) * 100) : 0
                      return (
                        <td key={band} className="py-2.5 px-3">
                          <div
                            className="px-2 py-1 rounded text-center font-semibold"
                            style={{
                              background: `${HEAT_COLORS[band]}20`,
                              color: HEAT_COLORS[band],
                            }}
                          >
                            R{r ? (r.exposure / 1e6).toFixed(1) : 0}M
                            <span className="text-[9px] ml-1 opacity-70">({pct}%)</span>
                          </div>
                        </td>
                      )
                    })}
                    <td className="py-2.5 px-3 text-text-primary font-semibold">R{(total / 1e6).toFixed(1)}M</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </ChartCard>
    </div>
  )
}
