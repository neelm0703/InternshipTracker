import { useAuth } from '../context/AuthContext'

export default function Navbar({ activeTab, setActiveTab }) {
  const { logout } = useAuth()

  const tabs = [
    {
      id: 'kanban', label: 'Kanban',
      icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="3" width="7" height="18" rx="1"/><rect x="14" y="3" width="7" height="11" rx="1"/></svg>
    },
    {
      id: 'list', label: 'List',
      icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
    },
    {
      id: 'calendar', label: 'Calendar',
      icon: <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
    },
  ]

  return (
    <nav style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 20px', height: 52,
      background: '#1c2333',
      borderBottom: '1px solid rgba(255,255,255,0.07)',
      flexShrink: 0,
      fontFamily: 'Plus Jakarta Sans, sans-serif',
    }}>
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
        <div style={{
          width: 28, height: 28, borderRadius: 8, background: '#e05a22',
          display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0,
        }}>
          <img src="/logo.png" alt="logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            onError={e => {
              e.target.style.display = 'none'
              e.target.parentNode.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="18" rx="1" fill="white"/><rect x="14" y="3" width="7" height="11" rx="1" fill="white"/></svg>'
            }}
          />
        </div>
        <span style={{ fontSize: 15, fontWeight: 700, color: '#edf0f3', letterSpacing: '-0.01em' }}>
          Application Board
        </span>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex', background: '#252f40', borderRadius: 8, padding: 4, gap: 2,
      }}>
        {tabs.map(tab => {
          const active = activeTab === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '6px 14px', borderRadius: 6, border: 'none', cursor: 'pointer',
                fontSize: 13, fontFamily: 'Plus Jakarta Sans, sans-serif',
                fontWeight: active ? 600 : 400,
                color: active ? '#edf0f3' : '#8b98a9',
                background: active ? '#1c2333' : 'transparent',
                boxShadow: active ? '0 1px 3px rgba(0,0,0,0.3)' : 'none',
                transition: 'all 0.15s',
                outline: 'none',
              }}
            >
              {tab.icon}
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* Sign out */}
      <button
        onClick={logout}
        style={{
          display: 'flex', alignItems: 'center', gap: 7,
          background: 'transparent', border: 'none', cursor: 'pointer',
          color: '#8b98a9', fontSize: 13,
          fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 500,
          padding: '6px 10px', borderRadius: 8, transition: 'all 0.15s',
        }}
        onMouseEnter={e => { e.currentTarget.style.background = '#252f40'; e.currentTarget.style.color = '#edf0f3' }}
        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#8b98a9' }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
        </svg>
        Sign out
      </button>
    </nav>
  )
}