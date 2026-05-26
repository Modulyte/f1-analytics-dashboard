import { useState } from 'react'
import { BarChart, Bar, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Legend } from 'recharts'
import ChartCard from '../components/ChartCard'
import { agentPerformance, ptpOutcomes, agentMonthlyRankings, agentNames, agentColors } from '../data/creditData'

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

// ── Bump Chart (agent ranking over time) ─────────────────────────────────────
const MONTHS = agentMonthlyRankings.map(d => d.month as string)
const N_MONTHS = MONTHS.length
const N_AGENTS = agentNames.length
const BVW = 580, BVH = 280
const BML = 12, BMR = 72, BMT = 24, BMB = 32
const BIW = BVW - BML - BMR, BIH = BVH - BMT - BMB

const xPos = (mi: number) => BML + (mi / (N_MONTHS - 1)) * BIW
const yPos = (rank: number) => BMT + ((rank - 1) / (N_AGENTS - 1)) * BIH

function BumpChart() {
  const [hovAgent, setHovAgent] = useState<string | null>(null)

  return (
    <svg viewBox={`0 0 ${BVW} ${BVH}`} className="w-full" style={{ maxHeight: 280 }}>
      {/* Month labels */}
      {MONTHS.map((m, mi) => (
        <text key={m} x={xPos(mi)} y={BMT - 10} textAnchor="middle" fill="#7c8299" fontSize={9}>{m}</text>
      ))}
      {/* Rank labels on Y */}
      {Array.from({ length: N_AGENTS }, (_, i) => (
        <text key={i} x={BML + BIW + 6} y={yPos(i + 1)} dominantBaseline="middle" fill="#7c8299" fontSize={8}>#{i + 1}</text>
      ))}
      {/* Horizontal grid */}
      {Array.from({ length: N_AGENTS }, (_, i) => (
        <line key={i} x1={BML} x2={BML + BIW} y1={yPos(i + 1)} y2={yPos(i + 1)} stroke="#1e2333" strokeDasharray="3 3" />
      ))}

      {/* Lines + dots per agent */}
      {agentNames.map((name, ai) => {
        const col = agentColors[ai]
        const isHov = hovAgent === name
        const isOther = hovAgent !== null && !isHov
        const ranks = agentMonthlyRankings.map(m => Number(m[name]))

        // Build smooth bezier path
        const pathParts = ranks.map((rank, mi) => {
          const x = xPos(mi), y = yPos(rank)
          if (mi === 0) return `M${x},${y}`
          const px = xPos(mi - 1), py = yPos(ranks[mi - 1])
          const cpx = (px + x) / 2
          return `C${cpx},${py} ${cpx},${y} ${x},${y}`
        })

        return (
          <g key={name} style={{ cursor: 'pointer' }}
            onMouseEnter={() => setHovAgent(name)} onMouseLeave={() => setHovAgent(null)}>
            <path d={pathParts.join(' ')} fill="none" stroke={col}
              strokeWidth={isHov ? 2.5 : 1.5}
              strokeOpacity={isOther ? 0.15 : isHov ? 1 : 0.65}
              style={{ filter: isHov ? `drop-shadow(0 0 5px ${col})` : undefined }} />
            {ranks.map((rank, mi) => (
              <circle key={mi} cx={xPos(mi)} cy={yPos(rank)} r={isHov ? 5 : 3.5}
                fill={col} stroke="#08090d" strokeWidth={1.2}
                fillOpacity={isOther ? 0.2 : 1}
                style={{ filter: isHov ? `drop-shadow(0 0 4px ${col})` : undefined }} />
            ))}
            {/* Name label on the right */}
            {!isOther && (
              <text x={BML + BIW + 38} y={yPos(ranks[N_MONTHS - 1])} dominantBaseline="middle"
                fill={isHov ? col : '#7c8299'} fontSize={9} fontWeight={isHov ? 700 : 400}>
                {name.split(' ')[0]}
              </text>
            )}
          </g>
        )
      })}
    </svg>
  )
}

type SortKey = 'recovered' | 'rate' | 'calls' | 'ptps'

export default function Collections() {
  const [sort, setSort] = useState<SortKey>('recovered')
  const sorted = [...agentPerformance].sort((a, b) => b[sort] - a[sort])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold gradient-text">Collections Performance</h1>
        <p className="text-text-secondary text-sm mt-1">Funnel conversion, PTP outcomes, agent rankings, and efficiency analysis</p>
      </div>

      {/* Funnel + PTP */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title="Collections Conversion Funnel" subtitle="Accounts Due → Dialled → RPC → PTP Kept">
          <div className="space-y-2 mt-2">
            {[
              { name: 'Accounts Due',  value: 12430, fill: '#6366f1' },
              { name: 'Dialled',       value: 10840, fill: '#8b5cf6' },
              { name: 'Contacted',     value:  7620, fill: '#a78bfa' },
              { name: 'RPC Achieved',  value:  4980, fill: '#00c9a7' },
              { name: 'PTP Made',      value:  3150, fill: '#10b981' },
              { name: 'PTP Kept',      value:  2340, fill: '#34d399' },
            ].map((stage, i, arr) => {
              const pct = Math.round((stage.value / arr[0].value) * 100)
              const drop = i > 0 ? Math.round(((arr[i-1].value - stage.value) / arr[i-1].value) * 100) : 0
              return (
                <div key={stage.name}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-text-secondary">{stage.name}</span>
                    <div className="flex items-center gap-2">
                      {i > 0 && <span className="text-[10px] text-red-400">▼ {drop}%</span>}
                      <span className="text-xs font-bold text-text-primary">{stage.value.toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="relative h-7 rounded-md overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)' }}>
                    <div className="h-full rounded-md flex items-center pl-3 transition-all duration-700"
                      style={{ width: `${pct}%`, background: stage.fill, opacity: 0.85, boxShadow: `0 0 10px ${stage.fill}60` }}>
                      <span className="text-[10px] font-semibold text-white">{pct}%</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          <div className="grid grid-cols-3 gap-2 mt-4 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
            {[['Contact Rate','61%'],['RPC Rate','40%'],['PTP Rate','25%']].map(([l,v]) => (
              <div key={l} className="text-center">
                <p className="text-lg font-bold text-accent">{v}</p>
                <p className="text-[10px] text-text-secondary mt-0.5">{l}</p>
              </div>
            ))}
          </div>
        </ChartCard>

        <ChartCard title="Promise-to-Pay Outcomes" subtitle="Monthly made vs kept vs broken + keep rate">
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={ptpOutcomes} barGap={4} margin={{ top: 4, right: 16, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e2333" />
              <XAxis dataKey="month" tick={{ fill: '#7c8299', fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis yAxisId="left"  tick={{ fill: '#7c8299', fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis yAxisId="right" orientation="right" tick={{ fill: '#7c8299', fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={v => `${v}%`} domain={[60,80]} />
              <Tooltip content={<CustomTooltip />} />
              <Legend wrapperStyle={{ fontSize: 11 }} />
              <Bar yAxisId="left" dataKey="made"   name="PTPs Made"   fill="#6366f1" radius={[3,3,0,0]} />
              <Bar yAxisId="left" dataKey="kept"   name="PTPs Kept"   fill="#00c9a7" radius={[3,3,0,0]} />
              <Bar yAxisId="left" dataKey="broken" name="PTPs Broken" fill="#ef4444" radius={[3,3,0,0]} />
              <Line yAxisId="right" type="monotone" dataKey="keptRate" name="Keep Rate %" stroke="#f59e0b" strokeWidth={2} dot={{ r: 3 }} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* ── Bump Chart ── */}
      <ChartCard title="Agent Ranking Bump Chart" subtitle="Monthly rank by recovery amount — hover an agent to highlight · #1 = top performer">
        <BumpChart />
        <div className="flex flex-wrap gap-3 mt-3 pt-3" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          {agentNames.map((n, i) => (
            <div key={n} className="flex items-center gap-1.5 text-[10px] text-text-secondary">
              <span className="w-3 h-0.5 rounded-full inline-block" style={{ background: agentColors[i] }} />
              {n.split(' ')[0]}
            </div>
          ))}
        </div>
      </ChartCard>

      {/* Agent horizontal bars */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title="Recovery by Agent" subtitle="Total amount recovered (R'000)">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={[...agentPerformance].sort((a,b)=>b.recovered-a.recovered).map(a=>({name:a.agent.split(' ')[0],recovered:a.recovered/1000}))}
              layout="vertical" margin={{ top:4,right:16,left:8,bottom:0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e2333" horizontal={false} />
              <XAxis type="number" tick={{fill:'#7c8299',fontSize:10}} tickLine={false} axisLine={false} tickFormatter={v=>`R${v}K`} />
              <YAxis dataKey="name" type="category" tick={{fill:'#7c8299',fontSize:10}} tickLine={false} axisLine={false} width={52} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="recovered" name="Recovered (R'000)" fill="#00c9a7" radius={[0,4,4,0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title="PTP Keep Rate by Agent" subtitle="Percentage of promises honoured">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={[...agentPerformance].sort((a,b)=>b.rate-a.rate).map(a=>({name:a.agent.split(' ')[0],rate:a.rate}))}
              layout="vertical" margin={{ top:4,right:16,left:8,bottom:0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e2333" horizontal={false} />
              <XAxis type="number" domain={[60,85]} tick={{fill:'#7c8299',fontSize:10}} tickLine={false} axisLine={false} tickFormatter={v=>`${v}%`} />
              <YAxis dataKey="name" type="category" tick={{fill:'#7c8299',fontSize:10}} tickLine={false} axisLine={false} width={52} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="rate" name="Keep Rate %" fill="#6366f1" radius={[0,4,4,0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Leaderboard */}
      <ChartCard title="Agent Leaderboard" subtitle="Sort by metric"
        action={
          <div className="flex gap-1">
            {(['recovered','rate','calls','ptps'] as SortKey[]).map(k => (
              <button key={k} onClick={() => setSort(k)}
                className="px-2.5 py-1 rounded text-[10px] font-semibold uppercase tracking-wide transition-all"
                style={{ background: sort===k?'#00c9a7':'rgba(255,255,255,0.05)', color: sort===k?'#08090d':'#7c8299', boxShadow: sort===k?'0 0 12px rgba(0,201,167,0.4)':undefined }}>
                {k==='ptps'?'PTPs':k.charAt(0).toUpperCase()+k.slice(1)}
              </button>
            ))}
          </div>
        }>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr style={{ borderBottom:'1px solid rgba(255,255,255,0.07)' }}>
                {['Rank','Agent','Calls','PTPs Made','PTPs Kept','Keep Rate','Recovered'].map(h => (
                  <th key={h} className="text-left text-text-secondary font-medium py-2 px-3">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {sorted.map((a, i) => (
                <tr key={a.agent} className="hover:bg-white/[0.02] transition-colors" style={{ borderBottom:'1px solid rgba(255,255,255,0.04)' }}>
                  <td className="py-2.5 px-3">
                    <span className={`w-5 h-5 rounded-full inline-flex items-center justify-center font-bold text-[10px] ${i===0?'bg-accent/20 text-accent':'text-text-secondary'}`}>{i+1}</span>
                  </td>
                  <td className="py-2.5 px-3 text-text-primary font-medium">{a.agent}</td>
                  <td className="py-2.5 px-3 text-text-secondary">{a.calls}</td>
                  <td className="py-2.5 px-3 text-text-secondary">{a.ptps}</td>
                  <td className="py-2.5 px-3 text-text-secondary">{a.kept}</td>
                  <td className="py-2.5 px-3"><span className="font-semibold" style={{ color: a.rate>=76?'#00c9a7':a.rate>=72?'#f59e0b':'#ef4444' }}>{a.rate}%</span></td>
                  <td className="py-2.5 px-3 text-text-primary font-semibold">R{(a.recovered/1e6).toFixed(2)}M</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </ChartCard>
    </div>
  )
}
