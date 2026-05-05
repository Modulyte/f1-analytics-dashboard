import { DollarSign, TrendingDown, Phone, AlertTriangle, Percent, RefreshCcw } from 'lucide-react'
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend
} from 'recharts'
import KPICard from '../components/KPICard'
import ChartCard from '../components/ChartCard'
import GaugeChart from '../components/GaugeChart'
import BulletChart from '../components/BulletChart'
import { kpiData, delinquencyTrend, portfolioSegments, cashFlow, delinquencyBuckets, bulletMetrics } from '../data/creditData'

const PIE_COLORS = ['#00c9a7', '#6366f1', '#f59e0b', '#ef4444', '#8b5cf6']

const fmt = (n: number) =>
  n >= 1e9 ? `R${(n / 1e9).toFixed(1)}B` : n >= 1e6 ? `R${(n / 1e6).toFixed(0)}M` : `R${n.toLocaleString()}`

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null
  return (
    <div className="glass rounded-lg px-3 py-2 shadow-xl text-xs">
      <p className="text-text-secondary mb-1 font-medium">{label}</p>
      {payload.map((p: any) => (
        <p key={p.name} style={{ color: p.color }}>{p.name}: <span className="font-bold">{p.value}</span></p>
      ))}
    </div>
  )
}

export default function Overview() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold gradient-text">Portfolio Overview</h1>
        <p className="text-text-secondary text-sm mt-1">Credit-to-collections summary — April 2026</p>
      </div>

      {/* Top row: Gauge + KPIs */}
      <div className="grid grid-cols-4 gap-4">
        {/* Gauge hero card */}
        <ChartCard
          title="Health Score"
          subtitle="Weighted portfolio health"
          className="row-span-2"
        >
          <GaugeChart
            value={68}
            label="Portfolio Health"
            sublabel="Weighted across NPL · Collections · Recovery"
          />
          <div className="mt-3 space-y-2">
            {[
              { label: 'NPL Ratio',       val: '8.4%',  color: '#ef4444', pct: 44 },
              { label: 'Collections',     val: '72.3%', color: '#00c9a7', pct: 72 },
              { label: 'Recovery Rate',   val: '34.6%', color: '#f59e0b', pct: 35 },
            ].map(r => (
              <div key={r.label}>
                <div className="flex justify-between text-[10px] mb-0.5">
                  <span className="text-text-secondary">{r.label}</span>
                  <span style={{ color: r.color }} className="font-semibold">{r.val}</span>
                </div>
                <div className="h-1 rounded-full bg-border overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${r.pct}%`, background: r.color, boxShadow: `0 0 6px ${r.color}80` }} />
                </div>
              </div>
            ))}
          </div>
        </ChartCard>

        {/* 4 KPI cards on the right */}
        <KPICard label="Portfolio Value"   value={fmt(kpiData.totalPortfolioValue)} sub="Total outstanding"    trend={2.1}  icon={<DollarSign size={16}/>}   accentColor="#00c9a7" />
        <KPICard label="NPL Ratio"         value={`${kpiData.nonPerformingLoanRatio}%`} sub="Non-performing"  trend={-0.3} icon={<TrendingDown size={16}/>}  accentColor="#ef4444" />
        <KPICard label="Collections Rate"  value={`${kpiData.collectionsRate}%`}   sub="Amount recovered"     trend={1.2}  icon={<Phone size={16}/>}        accentColor="#6366f1" />
        <KPICard label="Avg Days Delinq."  value={`${kpiData.avgDaysDelinquent}d`} sub="Across all buckets"   trend={-3.8} icon={<AlertTriangle size={16}/>} accentColor="#f59e0b" />
        <KPICard label="New Applications"  value={kpiData.newApplications.toLocaleString()} sub="This month"  trend={5.4}  icon={<AlertTriangle size={16}/>} accentColor="#00c9a7" />
        <KPICard label="Approval Rate"     value={`${kpiData.approvalRate}%`}       sub="Accepted apps"        trend={-1.8} icon={<Percent size={16}/>}       accentColor="#6366f1" />
        <KPICard label="Write-off Ratio"   value={`${kpiData.writeOffRatio}%`}      sub="Bad debt write-offs"  trend={-0.2} icon={<AlertTriangle size={16}/>} accentColor="#ef4444" />
        <KPICard label="Recovery Rate"     value={`${kpiData.recoveryRate}%`}       sub="Post write-off"       trend={2.6}  icon={<RefreshCcw size={16}/>}   accentColor="#f59e0b" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-3 gap-4">
        <ChartCard title="Delinquency Trend" subtitle="NPL vs delinquent — 12 months" className="col-span-2">
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={delinquencyTrend} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="gNpl" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ef4444" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#ef4444" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="gDelinq" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#f59e0b" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e2333" />
              <XAxis dataKey="month" tick={{ fill: '#7c8299', fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: '#7c8299', fontSize: 10 }} tickLine={false} axisLine={false} domain={[0, 30]} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Area type="monotone" dataKey="npl"       name="NPL %"       stroke="#ef4444" fill="url(#gNpl)"   strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="delinquent" name="Delinquent %" stroke="#f59e0b" fill="url(#gDelinq)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="Portfolio Mix" subtitle="By product segment">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={portfolioSegments} cx="50%" cy="50%" innerRadius={55} outerRadius={80} paddingAngle={3} dataKey="value">
                {portfolioSegments.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v: any) => `${v}%`}
                contentStyle={{ background: 'rgba(22,25,34,0.9)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8, fontSize: 11 }} />
              <Legend wrapperStyle={{ fontSize: 10 }} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-2 gap-4">
        <ChartCard title="Cash Flow" subtitle="Monthly inflow vs outflow">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={cashFlow} barGap={4} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e2333" />
              <XAxis dataKey="month" tick={{ fill: '#7c8299', fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: '#7c8299', fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={v => `${(v/1e6).toFixed(0)}M`} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar dataKey="inflow"  name="Inflow"  fill="#00c9a7" radius={[3,3,0,0]} />
              <Bar dataKey="outflow" name="Outflow" fill="#6366f1" radius={[3,3,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="DPD Bucket Distribution" subtitle="Accounts by days past due">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={delinquencyBuckets} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e2333" />
              <XAxis dataKey="bucket" tick={{ fill: '#7c8299', fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fill: '#7c8299', fontSize: 10 }} tickLine={false} axisLine={false} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" name="Accounts" radius={[3,3,0,0]}>
                {delinquencyBuckets.map((_, i) => (
                  <Cell key={i} fill={i < 2 ? '#00c9a7' : i < 4 ? '#f59e0b' : '#ef4444'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Bullet chart — KPI vs Target vs Benchmark */}
      <ChartCard
        title="KPI vs Target vs Benchmark"
        subtitle="Actual performance (bar) · benchmark marker (amber) · target marker (white) · zones: poor / satisfactory / good"
      >
        <BulletChart data={bulletMetrics} />
      </ChartCard>
    </div>
  )
}
