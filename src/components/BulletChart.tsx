interface BulletMetric {
  label: string
  actual: number
  target: number
  benchmark: number
  max: number
  unit: string
}

interface BulletChartProps {
  data: BulletMetric[]
}

export default function BulletChart({ data }: BulletChartProps) {
  return (
    <div className="space-y-4">
      {data.map(d => {
        const actualPct    = (d.actual    / d.max) * 100
        const targetPct    = (d.target    / d.max) * 100
        const benchmarkPct = (d.benchmark / d.max) * 100
        const isAboveTarget = d.actual >= d.target
        const barColor = isAboveTarget ? '#00c9a7' : d.actual >= d.benchmark ? '#f59e0b' : '#ef4444'

        return (
          <div key={d.label}>
            {/* Label row */}
            <div className="flex justify-between items-baseline mb-1.5">
              <span className="text-xs text-text-secondary">{d.label}</span>
              <div className="flex items-center gap-3 text-[10px]">
                <span className="text-text-secondary">Benchmark <span className="font-semibold text-text-primary">{d.benchmark}{d.unit}</span></span>
                <span className="text-text-secondary">Target <span className="font-semibold text-text-primary">{d.target}{d.unit}</span></span>
                <span style={{ color: barColor }} className="font-bold text-sm">{d.actual}{d.unit}</span>
              </div>
            </div>

            {/* Bullet track */}
            <div className="relative h-6 rounded-md overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)' }}>
              {/* Poor zone (0–benchmark) */}
              <div className="absolute top-0 left-0 h-full rounded-l-md"
                style={{ width: `${benchmarkPct}%`, background: 'rgba(239,68,68,0.12)' }} />
              {/* Satisfactory zone (benchmark–target) */}
              <div className="absolute top-0 h-full"
                style={{ left: `${benchmarkPct}%`, width: `${targetPct - benchmarkPct}%`, background: 'rgba(245,158,11,0.12)' }} />
              {/* Good zone (target–max) */}
              <div className="absolute top-0 h-full rounded-r-md"
                style={{ left: `${targetPct}%`, width: `${100 - targetPct}%`, background: 'rgba(0,201,167,0.10)' }} />

              {/* Actual value bar (centred vertically, 40% height) */}
              <div className="absolute rounded-sm transition-all duration-700"
                style={{
                  top: '30%', height: '40%',
                  left: 0, width: `${actualPct}%`,
                  background: barColor,
                  boxShadow: `0 0 8px ${barColor}90`,
                }} />

              {/* Benchmark marker */}
              <div className="absolute top-0 bottom-0 w-0.5"
                style={{ left: `${benchmarkPct}%`, background: '#f59e0b', opacity: 0.7 }} />

              {/* Target marker */}
              <div className="absolute top-0 bottom-0 w-0.5"
                style={{ left: `${targetPct}%`, background: 'white', opacity: 0.5 }} />
            </div>
          </div>
        )
      })}

      {/* Legend */}
      <div className="flex gap-4 pt-1">
        {[['Actual', '#00c9a7'], ['Benchmark', '#f59e0b'], ['Target', 'rgba(255,255,255,0.5)']].map(([l, c]) => (
          <div key={l} className="flex items-center gap-1.5 text-[10px] text-text-secondary">
            <span className="w-3 h-0.5 rounded-full inline-block" style={{ background: c }} />{l}
          </div>
        ))}
      </div>
    </div>
  )
}
