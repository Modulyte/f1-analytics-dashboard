import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { Menu, X, LayoutDashboard, TrendingDown, PhoneCall, BarChart3, ShieldAlert, Layers, Activity } from 'lucide-react'

const nav = [
  { to: '/',            label: 'Overview',     icon: LayoutDashboard },
  { to: '/delinquency', label: 'Delinquency',  icon: TrendingDown },
  { to: '/collections', label: 'Collections',  icon: PhoneCall },
  { to: '/portfolio',   label: 'Portfolio',    icon: Layers },
  { to: '/risk',        label: 'Risk Scoring', icon: ShieldAlert },
  { to: '/performance', label: 'Performance',  icon: BarChart3 },
  { to: '/lifecycle',   label: 'Lifecycle',    icon: Activity },
]

function SidebarInner({ onNavClick }: { onNavClick?: () => void }) {
  return (
    <>
      {/* Logo */}
      <div className="px-5 py-6" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
        <div className="flex items-center gap-2.5">
          <div
            className="w-7 h-7 rounded-md flex items-center justify-center flex-shrink-0"
            style={{ background: '#00c9a7', boxShadow: '0 0 16px rgba(0,201,167,0.55)' }}
          >
            <span className="text-[#08090d] font-black text-xs">CQ</span>
          </div>
          <div>
            <p className="text-text-primary font-bold text-sm leading-none">CreditIQ</p>
            <p className="text-text-secondary text-[10px] mt-0.5">Analytics Platform</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {nav.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            onClick={onNavClick}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                isActive ? 'nav-active-glow nav-glow-text text-accent' : 'text-text-secondary hover:text-text-primary hover:bg-white/[0.04]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <Icon
                  size={16}
                  className="transition-colors duration-200"
                  style={{ color: isActive ? '#00c9a7' : undefined, filter: isActive ? 'drop-shadow(0 0 6px rgba(0,201,167,0.8))' : undefined }}
                />
                <span>{label}</span>
                {isActive && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full live-dot" style={{ background: '#00c9a7' }} />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-5 py-4" style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}>
        <p className="text-[10px] text-text-secondary">Data as of Apr 2026</p>
        <div className="flex items-center gap-1.5 mt-1.5">
          <span className="w-1.5 h-1.5 rounded-full live-dot" style={{ background: '#00c9a7' }} />
          <p className="text-[10px] font-medium" style={{ color: '#00c9a7' }}>Live · Mock Data</p>
        </div>
      </div>
    </>
  )
}

export default function Sidebar() {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  return (
    <>
      {/* Hamburger — mobile only */}
      <button
        className="md:hidden fixed top-3.5 left-4 z-50 w-8 h-8 flex items-center justify-center rounded-lg glass"
        onClick={() => setOpen(true)}
        aria-label="Open navigation"
      >
        <Menu size={16} className="text-text-primary" />
      </button>

      {/* Backdrop — mobile only */}
      {open && (
        <div
          className="md:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          onClick={close}
          aria-hidden="true"
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={`
          fixed left-0 top-0 h-screen w-56 flex flex-col glass-sidebar z-50
          transition-transform duration-300 ease-in-out
          ${open ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:z-40
        `}
      >
        {/* Close button — mobile only */}
        <button
          className="md:hidden absolute top-4 right-3 p-1 text-text-secondary hover:text-text-primary transition-colors"
          onClick={close}
          aria-label="Close navigation"
        >
          <X size={14} />
        </button>

        <SidebarInner onNavClick={close} />
      </aside>
    </>
  )
}
