// Violin Plot — credit score distribution by risk band
// Uses a Gaussian kernel approximation to show density shape

const SCORE_MIN = 300
const SCORE_MAX = 900
const STEPS = 70
const MAX_HALF_W = 38

function pdf(x: number, mu: number, sigma: number) {
  return Math.exp(-0.5 * ((x - mu) / sigma) ** 2) // unnormalized
}

const BANDS = [
  { name: 'Sub-prime',   color: '#ef4444', mu: 508, sigma: 52 },
  { name: 'Near-prime',  color: '#f59e0b', mu: 622, sigma: 26 },
  { name: 'Prime',       color: '#6366f1', mu: 703, sigma: 30 },
  { name: 'Super-prime', color: '#00c9a7', mu: 800, sigma: 40 },
]

const VW = 460, VH = 300
const ML = 42, MR = 10, MT = 16, MB = 36
const IW = VW - ML - MR
const IH = VH - MT - MB
const BAND_W = IW / BANDS.length

const yScale = (score: number) => MT + (1 - (score - SCORE_MIN) / (SCORE_MAX - SCORE_MIN)) * IH

function violinPath(band: typeof BANDS[0], cx: number): string {
  const scores = Array.from({ length: STEPS }, (_, i) => SCORE_MIN + (i / (STEPS - 1)) * (SCORE_MAX - SCORE_MIN))
  const densities = scores.map(s => pdf(s, band.mu, band.sigma))
  const maxD = Math.max(...densities)
  const pts = scores.map((s, i) => ({ y: yScale(s), hw: (densities[i] / maxD) * MAX_HALF_W }))
  const left  = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${(cx - p.hw).toFixed(1)},${p.y.toFixed(1)}`).join(' ')
  const right = [...pts].reverse().map(p => `L${(cx + p.hw).toFixed(1)},${p.y.toFixed(1)}`).join(' ')
  return `${left} ${right} Z`
}

export default function ViolinChart() {
  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${VW} ${VH}`} className="w-full" style={{ maxHeight: 300 }}>
        {/* Y-axis ticks */}
        {[300, 400, 500, 600, 700, 800, 900].map(s => {
          const y = yScale(s)
          return (
            <g key={s}>
              <line x1={ML - 4} x2={ML} y1={y} y2={y} stroke="#3a3f52" />
              <text x={ML - 7} y={y} textAnchor="end" dominantBaseline="middle" fill="#7c8299" fontSize={8}>{s}</text>
              <line x1={ML} x2={VW - MR} y1={y} y2={y} stroke="#1e2333" strokeDasharray="3 3" />
            </g>
          )
        })}

        {/* Y-axis label */}
        <text x={10} y={VH / 2} textAnchor="middle" fill="#7c8299" fontSize={9}
          transform={`rotate(-90, 10, ${VH / 2})`}>Credit Score</text>

        {/* Violins */}
        {BANDS.map((band, i) => {
          const cx = ML + BAND_W * i + BAND_W / 2
          const medY = yScale(band.mu)
          const q1Y  = yScale(band.mu - 0.674 * band.sigma)
          const q3Y  = yScale(band.mu + 0.674 * band.sigma)

          return (
            <g key={band.name}>
              {/* Violin shape */}
              <path d={violinPath(band, cx)} fill={band.color} fillOpacity={0.18} stroke={band.color} strokeWidth={1.2}
                style={{ filter: `drop-shadow(0 0 6px ${band.color}60)` }} />
              {/* IQR box */}
              <rect x={cx - 8} y={q3Y} width={16} height={q1Y - q3Y}
                fill={band.color} fillOpacity={0.35} rx={2} />
              {/* Median line */}
              <line x1={cx - 12} x2={cx + 12} y1={medY} y2={medY} stroke={band.color} strokeWidth={2.5}
                style={{ filter: `drop-shadow(0 0 4px ${band.color})` }} />
              {/* Mean dot */}
              <circle cx={cx} cy={medY} r={3.5} fill={band.color} stroke="#08090d" strokeWidth={1.2} />
              {/* X label */}
              <text x={cx} y={VH - 6} textAnchor="middle" fill={band.color} fontSize={9} fontWeight={600}>{band.name}</text>
            </g>
          )
        })}
      </svg>

      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-1 px-2">
        {[['Violin', 'density shape'], ['Box', 'IQR (Q1–Q3)'], ['Line', 'median'], ['Dot', 'mean']].map(([lbl, desc]) => (
          <div key={lbl} className="text-[10px] text-text-secondary"><span className="font-semibold text-text-primary">{lbl}</span> = {desc}</div>
        ))}
      </div>
    </div>
  )
}
