import type { ReactNode } from 'react'

interface KPICardProps {
  label: string
  value: string
  sub?: string
  trend?: number
  icon: ReactNode
  accentColor?: string
}

export default function KPICard({ label, value, sub, trend, icon, accentColor = '#00c9a7' }: KPICardProps) {
  const trendUp  = trend !== undefined && trend > 0
  const trendDown = trend !== undefined && trend < 0

  return (
    <div
      className="kpi-card glass relative overflow-hidden rounded-xl p-5 flex flex-col gap-3 cursor-default"
      style={{ '--accent': accentColor } as React.CSSProperties}
      onMouseEnter={e => {
        const el = e.currentTarget
        el.style.boxShadow = `0 0 30px ${accentColor}22, 0 0 0 1px ${accentColor}33`
      }}
      onMouseLeave={e => {
        e.currentTarget.style.boxShadow = ''
      }}
    >
      {/* Ambient glow blob */}
      <div
        className="absolute -top-8 -left-8 w-28 h-28 rounded-full opacity-[0.12] blur-2xl pointer-events-none"
        style={{ background: accentColor }}
      />

      <div className="flex items-start justify-between">
        <p className="text-xs font-semibold uppercase tracking-widest text-text-secondary">{label}</p>
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: `${accentColor}1a`, boxShadow: `0 0 12px ${accentColor}30` }}
        >
          <span style={{ color: accentColor }}>{icon}</span>
        </div>
      </div>

      <p className="text-3xl font-bold text-text-primary leading-none">{value}</p>

      <div className="flex items-center gap-2 mt-auto">
        {trend !== undefined && (
          <span
            className="text-xs font-semibold px-1.5 py-0.5 rounded"
            style={{
              color:       trendUp ? '#00c9a7' : trendDown ? '#ef4444' : '#7c8299',
              background:  trendUp ? '#00c9a720' : trendDown ? '#ef444420' : '#7c829920',
            }}
          >
            {trendUp ? '▲' : trendDown ? '▼' : '—'} {Math.abs(trend)}%
          </span>
        )}
        {sub && <p className="text-xs text-text-secondary">{sub}</p>}
      </div>
    </div>
  )
}
