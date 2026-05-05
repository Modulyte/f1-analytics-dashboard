interface GaugeChartProps {
  value: number      // 0–100
  label?: string
  sublabel?: string
}

// Helpers ─────────────────────────────────────────────────────────
function polar(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = (angleDeg - 180) * (Math.PI / 180)
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}

// Describe SVG arc from left (0%) to value%
// Arc spans 180° total (left=0%, top=50%, right=100%)
function arcPath(cx: number, cy: number, r: number, fromPct: number, toPct: number) {
  const startDeg = fromPct * 1.8        // 0→0°, 100→180°, shifted by -180 in polar()
  const endDeg   = toPct * 1.8
  const start    = polar(cx, cy, r, startDeg)
  const end      = polar(cx, cy, r, endDeg)
  const large    = (endDeg - startDeg) > 180 ? 1 : 0
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${large} 1 ${end.x} ${end.y}`
}

// Color zones
function zoneColor(v: number) {
  if (v >= 80) return '#10b981'
  if (v >= 60) return '#00c9a7'
  if (v >= 40) return '#f59e0b'
  return '#ef4444'
}

function zoneLabel(v: number) {
  if (v >= 80) return 'Excellent'
  if (v >= 60) return 'Good'
  if (v >= 40) return 'Watch'
  return 'Critical'
}

export default function GaugeChart({ value, label = 'Portfolio Health', sublabel }: GaugeChartProps) {
  const cx = 100, cy = 100, outerR = 80, innerR = 62
  const col = zoneColor(value)

  // Tick marks
  const ticks = [0, 20, 40, 60, 80, 100]

  return (
    <div className="flex flex-col items-center gap-2">
      <svg viewBox="0 0 200 110" className="w-full" style={{ maxHeight: 200 }}>
        <defs>
          <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#ef4444" />
            <stop offset="40%"  stopColor="#f59e0b" />
            <stop offset="65%"  stopColor="#00c9a7" />
            <stop offset="100%" stopColor="#10b981" />
          </linearGradient>
          <filter id="gaugeGlow">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        {/* Background track */}
        <path
          d={arcPath(cx, cy, outerR, 0, 100)}
          fill="none" stroke="#242836" strokeWidth={outerR - innerR}
          strokeLinecap="round"
        />
        {/* Coloured value arc */}
        {value > 0 && (
          <path
            d={arcPath(cx, cy, outerR, 0, value)}
            fill="none"
            stroke={col}
            strokeWidth={outerR - innerR}
            strokeLinecap="round"
            filter="url(#gaugeGlow)"
            style={{ transition: 'stroke-dasharray 0.8s ease' }}
          />
        )}

        {/* Tick marks */}
        {ticks.map(t => {
          const inner = polar(cx, cy, innerR - 4, t * 1.8)
          const outer = polar(cx, cy, outerR + 4, t * 1.8)
          return (
            <g key={t}>
              <line x1={inner.x} y1={inner.y} x2={outer.x} y2={outer.y}
                stroke="#3a3f52" strokeWidth={1} />
              <text
                x={polar(cx, cy, outerR + 13, t * 1.8).x}
                y={polar(cx, cy, outerR + 13, t * 1.8).y}
                textAnchor="middle" dominantBaseline="middle"
                fill="#7c8299" fontSize={6}
              >{t}</text>
            </g>
          )
        })}

        {/* Needle */}
        {(() => {
          const tip  = polar(cx, cy, outerR - 4, value * 1.8)
          const base = polar(cx, cy, innerR + 8, value * 1.8)
          const left = polar(cx, cy, 6, value * 1.8 - 90)
          const right = polar(cx, cy, 6, value * 1.8 + 90)
          return (
            <g>
              <polygon
                points={`${tip.x},${tip.y} ${left.x},${left.y} ${base.x},${base.y} ${right.x},${right.y}`}
                fill={col}
                filter="url(#gaugeGlow)"
              />
              <circle cx={cx} cy={cy} r={5} fill={col} />
              <circle cx={cx} cy={cy} r={3} fill="#08090d" />
            </g>
          )
        })()}

        {/* Centre text */}
        <text x={cx} y={cy - 14} textAnchor="middle" fill="white" fontSize={22} fontWeight={700}>{value}</text>
        <text x={cx} y={cy + 2} textAnchor="middle" fill={col} fontSize={7} fontWeight={600}
          style={{ filter: `drop-shadow(0 0 4px ${col})` }}>
          {zoneLabel(value).toUpperCase()}
        </text>
      </svg>

      <div className="text-center">
        <p className="text-sm font-semibold text-text-primary">{label}</p>
        {sublabel && <p className="text-xs text-text-secondary mt-0.5">{sublabel}</p>}
      </div>
    </div>
  )
}
