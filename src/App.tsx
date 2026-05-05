import { Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Overview from './pages/Overview'
import Delinquency from './pages/Delinquency'
import Collections from './pages/Collections'
import Portfolio from './pages/Portfolio'
import RiskScoring from './pages/RiskScoring'
import Performance from './pages/Performance'
import Lifecycle from './pages/Lifecycle'

export default function App() {
  return (
    <div className="flex min-h-screen bg-background text-text-primary relative">

      {/* ── Background gradient orbs (give glassmorphism something to blur) ── */}
      <div className="bg-orb w-[700px] h-[700px] top-[-15%] left-[8%]"
        style={{ background: 'radial-gradient(circle, rgba(0,201,167,0.09) 0%, transparent 70%)' }} />
      <div className="bg-orb w-[600px] h-[600px] bottom-[-10%] right-[5%]"
        style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)' }} />
      <div className="bg-orb w-[400px] h-[400px] top-[40%] left-[40%]"
        style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.05) 0%, transparent 70%)' }} />

      <Sidebar />

      {/* ── Main content — offset by sidebar width ── */}
      <main className="flex-1 ml-56 min-h-screen relative z-10">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <Routes>
            <Route path="/"            element={<Overview />} />
            <Route path="/delinquency" element={<Delinquency />} />
            <Route path="/collections" element={<Collections />} />
            <Route path="/portfolio"   element={<Portfolio />} />
            <Route path="/risk"        element={<RiskScoring />} />
            <Route path="/performance" element={<Performance />} />
            <Route path="/lifecycle"   element={<Lifecycle />} />
          </Routes>
        </div>
      </main>
    </div>
  )
}
