// ─── MOCK DATA — Credit to Collections Analytics ───────────────────────────

// KPI Overview
export const kpiData = {
  totalPortfolioValue: 4_820_000_000,
  nonPerformingLoanRatio: 8.4,
  collectionsRate: 72.3,
  avgDaysDelinquent: 47,
  newApplications: 12_430,
  approvalRate: 61.2,
  writeOffRatio: 3.1,
  recoveryRate: 34.6,
}

// Monthly delinquency buckets (0-30, 31-60, 61-90, 91-120, 121-150, 151-180+)
export const delinquencyBuckets = [
  { bucket: '0-30', value: 38_200_000, count: 14_230, pct: 42.1 },
  { bucket: '31-60', value: 22_100_000, count: 8_420, pct: 24.4 },
  { bucket: '61-90', value: 14_800_000, count: 5_610, pct: 16.3 },
  { bucket: '91-120', value: 8_500_000, count: 3_100, pct: 9.4 },
  { bucket: '121-150', value: 4_200_000, count: 1_560, pct: 4.6 },
  { bucket: '151-180+', value: 3_100_000, count: 1_080, pct: 3.2 },
]

// 12-month delinquency trend
export const delinquencyTrend = [
  { month: 'May 25',  npl: 6.1, delinquent: 14.2, current: 79.7 },
  { month: 'Jun 25',  npl: 6.4, delinquent: 14.8, current: 78.8 },
  { month: 'Jul 25',  npl: 6.8, delinquent: 15.3, current: 77.9 },
  { month: 'Aug 25',  npl: 7.2, delinquent: 16.1, current: 76.7 },
  { month: 'Sep 25',  npl: 7.6, delinquent: 16.9, current: 75.5 },
  { month: 'Oct 25',  npl: 7.8, delinquent: 17.2, current: 75.0 },
  { month: 'Nov 25',  npl: 8.0, delinquent: 17.8, current: 74.2 },
  { month: 'Dec 25',  npl: 8.3, delinquent: 18.5, current: 73.2 },
  { month: 'Jan 26',  npl: 8.7, delinquent: 19.2, current: 72.1 },
  { month: 'Feb 26',  npl: 8.6, delinquent: 18.9, current: 72.5 },
  { month: 'Mar 26',  npl: 8.5, delinquent: 18.6, current: 72.9 },
  { month: 'Apr 26',  npl: 8.4, delinquent: 18.2, current: 73.4 },
]

// Collections performance by agent
export const agentPerformance = [
  { agent: 'Nomsa T.',   calls: 312, ptps: 187, kept: 142, recovered: 1_820_000, rate: 76.0 },
  { agent: 'Sipho M.',   calls: 285, ptps: 162, kept: 118, recovered: 1_540_000, rate: 72.8 },
  { agent: 'Lerato K.',  calls: 298, ptps: 175, kept: 131, recovered: 1_690_000, rate: 74.9 },
  { agent: 'Thabo N.',   calls: 241, ptps: 128, kept: 89,  recovered: 1_150_000, rate: 69.5 },
  { agent: 'Ayanda P.',  calls: 322, ptps: 201, kept: 158, recovered: 2_040_000, rate: 78.6 },
  { agent: 'Zanele W.',  calls: 267, ptps: 148, kept: 103, recovered: 1_330_000, rate: 69.6 },
  { agent: 'Kabelo R.',  calls: 308, ptps: 179, kept: 139, recovered: 1_790_000, rate: 77.7 },
  { agent: 'Priya S.',   calls: 279, ptps: 154, kept: 111, recovered: 1_430_000, rate: 72.1 },
]

// Promise-to-Pay (PTP) outcomes by month
export const ptpOutcomes = [
  { month: 'Nov 25', made: 2840, kept: 2010, broken: 830, keptRate: 70.8 },
  { month: 'Dec 25', made: 3120, kept: 2180, broken: 940, keptRate: 69.9 },
  { month: 'Jan 26', made: 2960, kept: 2050, broken: 910, keptRate: 69.3 },
  { month: 'Feb 26', made: 3040, kept: 2180, broken: 860, keptRate: 71.7 },
  { month: 'Mar 26', made: 3280, kept: 2400, broken: 880, keptRate: 73.2 },
  { month: 'Apr 26', made: 3150, kept: 2340, broken: 810, keptRate: 74.3 },
]

// Portfolio segment breakdown
export const portfolioSegments = [
  { name: 'Personal Loans', value: 38.4 },
  { name: 'Credit Cards', value: 24.7 },
  { name: 'Home Loans', value: 18.2 },
  { name: 'Vehicle Finance', value: 12.1 },
  { name: 'Overdrafts', value: 6.6 },
]

// Risk score distribution (histogram buckets)
export const riskScoreDist = [
  { range: '300-400', count: 1_820 },
  { range: '401-500', count: 3_540 },
  { range: '501-550', count: 5_210 },
  { range: '551-600', count: 8_930 },
  { range: '601-650', count: 12_640 },
  { range: '651-700', count: 15_820 },
  { range: '701-750', count: 14_230 },
  { range: '751-800', count: 10_120 },
  { range: '801-850', count: 6_340 },
  { range: '851-900', count: 2_180 },
]

// Box-and-whisker data: days-to-collect by product
export const boxWhiskerData = [
  { product: 'Personal', min: 12, q1: 28, median: 47, q3: 72, max: 148, mean: 51 },
  { product: 'Credit Card', min: 8, q1: 22, median: 38, q3: 61, max: 125, mean: 42 },
  { product: 'Home Loan', min: 30, q1: 55, median: 82, q3: 110, max: 180, mean: 87 },
  { product: 'Vehicle', min: 18, q1: 35, median: 58, q3: 88, max: 140, mean: 63 },
  { product: 'Overdraft', min: 5, q1: 18, median: 31, q3: 52, max: 98, mean: 35 },
]

// Write-off vs Recovery trend
export const writeOffRecovery = [
  { month: 'Nov 25', writeOff: 8_200_000, recovered: 2_650_000, net: -5_550_000 },
  { month: 'Dec 25', writeOff: 9_400_000, recovered: 2_980_000, net: -6_420_000 },
  { month: 'Jan 26', writeOff: 10_200_000, recovered: 3_120_000, net: -7_080_000 },
  { month: 'Feb 26', writeOff: 9_800_000, recovered: 3_410_000, net: -6_390_000 },
  { month: 'Mar 26', writeOff: 9_100_000, recovered: 3_700_000, net: -5_400_000 },
  { month: 'Apr 26', writeOff: 8_600_000, recovered: 3_940_000, net: -4_660_000 },
]

// Collections efficiency scatter (agent-level)
export const scatterData = agentPerformance.map(a => ({
  name: a.agent,
  calls: a.calls,
  recovered: Math.round(a.recovered / 1000),
  rate: a.rate,
}))

// Monthly inflow vs outflow
export const cashFlow = [
  { month: 'Nov 25', inflow: 42_100_000, outflow: 38_400_000 },
  { month: 'Dec 25', inflow: 48_600_000, outflow: 45_200_000 },
  { month: 'Jan 26', inflow: 40_200_000, outflow: 37_800_000 },
  { month: 'Feb 26', inflow: 43_800_000, outflow: 39_100_000 },
  { month: 'Mar 26', inflow: 47_200_000, outflow: 41_600_000 },
  { month: 'Apr 26', inflow: 51_000_000, outflow: 44_300_000 },
]

// ── Stage 2 data ────────────────────────────────────────────────────────────

// Agent monthly rankings (1 = best recovery that month)
export const agentMonthlyRankings: { month: string; [agent: string]: number | string }[] = [
  { month: 'Nov 25', Ayanda: 1, Kabelo: 2, Nomsa: 3, Lerato: 4, Priya: 5, Sipho: 6, Zanele: 7, Thabo: 8 },
  { month: 'Dec 25', Ayanda: 1, Nomsa: 2, Kabelo: 3, Lerato: 4, Sipho: 5, Priya: 6, Thabo: 7, Zanele: 8 },
  { month: 'Jan 26', Kabelo: 1, Ayanda: 2, Nomsa: 3, Lerato: 4, Zanele: 5, Sipho: 6, Priya: 7, Thabo: 8 },
  { month: 'Feb 26', Ayanda: 1, Kabelo: 2, Lerato: 3, Nomsa: 4, Priya: 5, Sipho: 6, Zanele: 7, Thabo: 8 },
  { month: 'Mar 26', Ayanda: 1, Kabelo: 2, Nomsa: 3, Priya: 4, Lerato: 5, Sipho: 6, Zanele: 7, Thabo: 8 },
  { month: 'Apr 26', Ayanda: 1, Nomsa: 2, Kabelo: 3, Lerato: 4, Priya: 5, Sipho: 6, Zanele: 7, Thabo: 8 },
]
export const agentNames = ['Ayanda', 'Kabelo', 'Nomsa', 'Lerato', 'Priya', 'Sipho', 'Zanele', 'Thabo']
export const agentColors = ['#00c9a7','#6366f1','#f59e0b','#ef4444','#8b5cf6','#06b6d4','#a78bfa','#fb923c']

// Bullet chart — KPI vs target vs benchmark
export const bulletMetrics = [
  { label: 'Collections Rate', actual: 72.3, target: 80.0, benchmark: 75.0, max: 100, unit: '%' },
  { label: 'PTP Keep Rate',    actual: 74.3, target: 82.0, benchmark: 78.0, max: 100, unit: '%' },
  { label: 'Recovery Rate',    actual: 34.6, target: 50.0, benchmark: 42.0, max: 100, unit: '%' },
  { label: 'Contact Rate',     actual: 61.0, target: 75.0, benchmark: 68.0, max: 100, unit: '%' },
]

// Box-whisker: recovery amount per account (R) by product
export const recoveryAmountBoxWhisker = [
  { product: 'Personal',    min: 820,  q1: 2400,  median: 4200,  q3: 7800,  max: 28000,  mean: 5100  },
  { product: 'Credit Card', min: 480,  q1: 1200,  median: 2400,  q3: 4800,  max: 18000,  mean: 3200  },
  { product: 'Home Loan',   min: 4200, q1: 12000, median: 24000, q3: 48000, max: 180000, mean: 31000 },
  { product: 'Vehicle',     min: 1800, q1: 4800,  median: 9600,  q3: 18000, max: 72000,  mean: 12400 },
  { product: 'Overdraft',   min: 240,  q1: 720,   median: 1440,  q3: 2800,  max: 9600,   mean: 1920  },
]

// Box-whisker: credit score at origination vs at point of default
export const scoreOriginVsDefault = [
  { group: 'At Origination', min: 520, q1: 618, median: 664, q3: 712, max: 820, mean: 661 },
  { group: 'At Default',     min: 380, q1: 492, median: 548, q3: 612, max: 720, mean: 548 },
]

// Box-whisker: days spent in each DPD bucket before moving
export const timeInBucketBoxWhisker = [
  { bucket: '0–30',    min: 3,  q1: 8,  median: 16, q3: 24, max: 30, mean: 16 },
  { bucket: '31–60',   min: 4,  q1: 12, median: 22, q3: 28, max: 30, mean: 21 },
  { bucket: '61–90',   min: 5,  q1: 14, median: 23, q3: 28, max: 30, mean: 22 },
  { bucket: '91–120',  min: 8,  q1: 18, median: 26, q3: 29, max: 30, mean: 24 },
  { bucket: '121–150', min: 12, q1: 22, median: 28, q3: 30, max: 30, mean: 26 },
  { bucket: '151–180', min: 20, q1: 25, median: 29, q3: 30, max: 30, mean: 28 },
]

// ── Existing heatmap data (unchanged) ───────────────────────────────────────
// Risk band exposure heat-map data
export const riskHeatmap = [
  { segment: 'Personal', band: 'Low', exposure: 12_400_000, count: 4_820 },
  { segment: 'Personal', band: 'Medium', exposure: 18_600_000, count: 7_210 },
  { segment: 'Personal', band: 'High', exposure: 9_800_000, count: 3_840 },
  { segment: 'Credit Card', band: 'Low', exposure: 8_200_000, count: 5_610 },
  { segment: 'Credit Card', band: 'Medium', exposure: 11_400_000, count: 7_820 },
  { segment: 'Credit Card', band: 'High', exposure: 7_600_000, count: 5_230 },
  { segment: 'Home Loan', band: 'Low', exposure: 22_800_000, count: 1_420 },
  { segment: 'Home Loan', band: 'Medium', exposure: 18_200_000, count: 1_130 },
  { segment: 'Home Loan', band: 'High', exposure: 12_400_000, count: 780 },
  { segment: 'Vehicle', band: 'Low', exposure: 6_800_000, count: 2_140 },
  { segment: 'Vehicle', band: 'Medium', exposure: 9_200_000, count: 2_890 },
  { segment: 'Vehicle', band: 'High', exposure: 5_100_000, count: 1_600 },
  { segment: 'Overdraft', band: 'Low', exposure: 2_400_000, count: 3_280 },
  { segment: 'Overdraft', band: 'Medium', exposure: 3_600_000, count: 4_920 },
  { segment: 'Overdraft', band: 'High', exposure: 2_200_000, count: 3_010 },
]

// ── Stage 3 data ─────────────────────────────────────────────────────────────

export const STAGE_COLORS: Record<string, string> = {
  'Origination':'#6366f1','Current':'#00c9a7','Settled':'#06b6d4',
  '0–30 DPD':'#4ade80','31–60 DPD':'#f59e0b','61–90 DPD':'#fb923c',
  '91+ DPD':'#ef4444','Legal':'#dc2626','Write-off':'#4b1c1c','Recovery':'#8b5cf6',
}

export const accountJourneys = [
  { id:'ACC-001 · Personal',   label:'Resolved',    segments:[{s:'Origination',dur:1},{s:'Current',dur:8},{s:'0–30 DPD',dur:1},{s:'Current',dur:4},{s:'Settled',dur:1}] },
  { id:'ACC-002 · Credit Card',label:'Written Off', segments:[{s:'Origination',dur:1},{s:'Current',dur:3},{s:'0–30 DPD',dur:2},{s:'31–60 DPD',dur:2},{s:'61–90 DPD',dur:2},{s:'91+ DPD',dur:3},{s:'Legal',dur:2},{s:'Write-off',dur:1}] },
  { id:'ACC-003 · Home Loan',  label:'Recovering',  segments:[{s:'Origination',dur:1},{s:'Current',dur:5},{s:'0–30 DPD',dur:1},{s:'31–60 DPD',dur:2},{s:'61–90 DPD',dur:2},{s:'91+ DPD',dur:2},{s:'Write-off',dur:2},{s:'Recovery',dur:3}] },
  { id:'ACC-004 · Vehicle',    label:'Chronic',     segments:[{s:'Origination',dur:1},{s:'Current',dur:2},{s:'0–30 DPD',dur:1},{s:'Current',dur:2},{s:'0–30 DPD',dur:1},{s:'Current',dur:2},{s:'0–30 DPD',dur:2},{s:'31–60 DPD',dur:1},{s:'Current',dur:3}] },
  { id:'ACC-005 · Overdraft',  label:'Performing',  segments:[{s:'Origination',dur:1},{s:'Current',dur:14}] },
  { id:'ACC-006 · Personal',   label:'Early Settle',segments:[{s:'Origination',dur:1},{s:'Current',dur:5},{s:'Settled',dur:1}] },
  { id:'ACC-007 · Credit Card',label:'Legal',       segments:[{s:'Origination',dur:1},{s:'Current',dur:4},{s:'0–30 DPD',dur:2},{s:'31–60 DPD',dur:2},{s:'61–90 DPD',dur:2},{s:'91+ DPD',dur:2},{s:'Legal',dur:2}] },
  { id:'ACC-008 · Home Loan',  label:'Cured',       segments:[{s:'Origination',dur:1},{s:'Current',dur:6},{s:'0–30 DPD',dur:1},{s:'31–60 DPD',dur:1},{s:'Current',dur:6}] },
]

export const sankeyNodes = [
  {id:'s0',label:'Current',   value:74200,color:'#00c9a7',col:0},{id:'s1',label:'0–30 DPD', value:14230,color:'#4ade80',col:0},
  {id:'s2',label:'31–60 DPD',value: 8420,color:'#f59e0b',col:0},{id:'s3',label:'61–90 DPD',value: 5610,color:'#fb923c',col:0},
  {id:'s4',label:'91+ DPD',  value: 5740,color:'#ef4444',col:0},{id:'t0',label:'Performing',value:78200,color:'#00c9a7',col:1},
  {id:'t1',label:'New 0–30', value: 7820,color:'#4ade80',col:1},{id:'t2',label:'New 31–60',value: 6140,color:'#f59e0b',col:1},
  {id:'t3',label:'New 61–90',value: 4980,color:'#fb923c',col:1},{id:'t4',label:'Legal/120+',value: 3540,color:'#ef4444',col:1},
  {id:'t5',label:'Write-off',value: 2060,color:'#8b5cf6',col:1},
]
export const sankeyLinks = [
  {s:0,t:0,v:71820},{s:0,t:1,v:2380},
  {s:1,t:0,v:6240},{s:1,t:1,v:3180},{s:1,t:2,v:4810},
  {s:2,t:2,v:1330},{s:2,t:3,v:7090},
  {s:3,t:3,v:1890},{s:3,t:4,v:3720},
  {s:4,t:4,v:3540},{s:4,t:5,v:2060},{s:4,t:0,v:140},
]

export const dailyPTPData = Array.from({length:89},(_,i)=>{
  const d=new Date(2026,1,1); d.setDate(d.getDate()+i)
  const isW=d.getDay()===0||d.getDay()===6
  const base=isW?38:118
  const noise=Math.sin(i*2.3+1.7)*14+Math.cos(i*1.1)*8
  const kept=Math.max(10,Math.round(base+noise))
  const total=Math.round(kept/(0.68+Math.sin(i)*0.06))
  return{date:d.toISOString().split('T')[0],week:Math.floor(i/7),day:d.getDay(),kept,total,rate:Math.round((kept/total)*100)}
})

export const nplForecast=[
  {month:'May 25',actual:6.1, forecast:null as number|null,upper:null as number|null,lower:null as number|null},
  {month:'Jul 25',actual:6.8, forecast:null,upper:null,lower:null},
  {month:'Sep 25',actual:7.6, forecast:null,upper:null,lower:null},
  {month:'Nov 25',actual:8.0, forecast:null,upper:null,lower:null},
  {month:'Jan 26',actual:8.7, forecast:null,upper:null,lower:null},
  {month:'Mar 26',actual:8.5, forecast:null,upper:null,lower:null},
  {month:'Apr 26',actual:8.4, forecast:8.4, upper:8.4, lower:8.4 },
  {month:'May 26',actual:null as number|null,forecast:8.2,upper:8.7,lower:7.7},
  {month:'Jun 26',actual:null,forecast:8.0,upper:8.8,lower:7.2},
  {month:'Jul 26',actual:null,forecast:7.7,upper:8.8,lower:6.6},
  {month:'Aug 26',actual:null,forecast:7.3,upper:8.8,lower:5.8},
  {month:'Sep 26',actual:null,forecast:6.9,upper:8.7,lower:5.1},
]
