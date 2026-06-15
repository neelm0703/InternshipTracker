export const STATUS_CONFIG = {
  Applied:      { color: '#60a5fa', bg: '#1e3a5f' },
  Assessment:   { color: '#f59e0b', bg: '#3d2c0a' },
  Interviewing: { color: '#a3e635', bg: '#1a2e0a' },
  Offer:        { color: '#34d399', bg: '#0d3626' },
  Rejected:     { color: '#f87171', bg: '#3d1515' },
  Withdrawn:    { color: '#8b98a9', bg: '#252f40' },
}

export const ALL_STATUSES = Object.keys(STATUS_CONFIG)

export function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG['Applied']
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '3px 10px', borderRadius: 9999,
      background: cfg.bg,
      color: cfg.color,
      border: `1px solid ${cfg.color}30`,
      fontSize: 12, fontWeight: 600,
      fontFamily: 'Plus Jakarta Sans, sans-serif',
      whiteSpace: 'nowrap',
    }}>
      <span style={{ width: 6, height: 6, borderRadius: '50%', background: cfg.color, flexShrink: 0 }} />
      {status}
    </span>
  )
}

const AVATAR_COLORS = ['#EF4444','#F59E0B','#22C55E','#3B82F6','#8B5CF6','#EC4899','#14B8A6','#F97316']
export function avatarColor(name = '') {
  let h = 0
  for (let i = 0; i < name.length; i++) h = name.charCodeAt(i) + ((h << 5) - h)
  return AVATAR_COLORS[Math.abs(h) % AVATAR_COLORS.length]
}

export function getInitials(name = '') {
  return name.trim().charAt(0).toUpperCase()
}