import { useState } from 'react'

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December']

export default function JobCalendar() {
  const today = new Date()
  const [current, setCurrent] = useState({ month: today.getMonth(), year: today.getFullYear() })
  const [selected, setSelected] = useState(today.getDate())

  const firstDay = new Date(current.year, current.month, 1).getDay()
  const daysInMonth = new Date(current.year, current.month + 1, 0).getDate()
  const cells = Array(firstDay).fill(null).concat(Array.from({ length: daysInMonth }, (_, i) => i + 1))
  while (cells.length % 7 !== 0) cells.push(null)

  const isToday = d => d === today.getDate() && current.month === today.getMonth() && current.year === today.getFullYear()
  const isSelected = d => d === selected

  function prev() {
    setCurrent(c => c.month === 0 ? { month: 11, year: c.year - 1 } : { month: c.month - 1, year: c.year })
  }
  function next() {
    setCurrent(c => c.month === 11 ? { month: 0, year: c.year + 1 } : { month: c.month + 1, year: c.year })
  }

  return (
    <div style={{
      flex: 1, display: 'flex', gap: 16,
      padding: '16px 20px', overflow: 'hidden',
      fontFamily: 'Plus Jakarta Sans, sans-serif',
    }}>
      {/* Calendar grid */}
      <div style={{
        flex: 1, background: '#1c2333',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 12, display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}>
        {/* Month nav */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.07)', flexShrink: 0,
        }}>
          <button onClick={prev} style={navBtnStyle}
            onMouseEnter={e => { e.currentTarget.style.background = '#252f40'; e.currentTarget.style.color = '#edf0f3' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#8b98a9' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <span style={{ fontSize: 16, fontWeight: 700, color: '#edf0f3', letterSpacing: '-0.01em' }}>
            {MONTHS[current.month]} {current.year}
          </span>
          <button onClick={next} style={navBtnStyle}
            onMouseEnter={e => { e.currentTarget.style.background = '#252f40'; e.currentTarget.style.color = '#edf0f3' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#8b98a9' }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>

        {/* Day headers */}
        <div style={{
          display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)',
          borderBottom: '1px solid rgba(255,255,255,0.07)', flexShrink: 0,
        }}>
          {DAYS.map(d => (
            <div key={d} style={{
              padding: '10px 0', textAlign: 'center',
              fontSize: 12, fontWeight: 600, color: '#8b98a9',
              fontFamily: 'DM Mono, monospace', letterSpacing: '0.05em',
            }}>
              {d.toUpperCase()}
            </div>
          ))}
        </div>

        {/* Grid */}
        <div style={{
          flex: 1, display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gridTemplateRows: `repeat(${cells.length / 7}, 1fr)`,
          overflow: 'hidden',
        }}>
          {cells.map((day, i) => {
            const today_ = isToday(day)
            const sel = isSelected(day) && !today_
            return (
              <div
                key={i}
                onClick={() => day && setSelected(day)}
                style={{
                  borderRight: (i + 1) % 7 === 0 ? 'none' : '1px solid rgba(255,255,255,0.07)',
                  borderBottom: '1px solid rgba(255,255,255,0.07)',
                  padding: '8px 10px', minHeight: 80,
                  background: !day ? 'transparent' : sel ? 'rgba(224,90,34,0.08)' : 'transparent',
                  cursor: day ? 'pointer' : 'default',
                  transition: 'background 0.1s',
                }}
                onMouseEnter={e => { if (day && !sel) e.currentTarget.style.background = 'rgba(255,255,255,0.03)' }}
                onMouseLeave={e => { e.currentTarget.style.background = !day ? 'transparent' : sel ? 'rgba(224,90,34,0.08)' : 'transparent' }}
              >
                {day && (
                  <div style={{
                    width: 28, height: 28, borderRadius: '50%',
                    background: today_ ? '#e05a22' : 'transparent',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 13,
                    fontWeight: today_ ? 700 : sel ? 700 : 400,
                    color: today_ ? 'white' : sel ? '#e05a22' : '#8b98a9',
                  }}>
                    {day}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Upcoming sidebar */}
      <div style={{
        width: 288, background: '#1c2333',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 12, display: 'flex', flexDirection: 'column', overflow: 'hidden',
      }}>
        <div style={{
          padding: '14px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)',
          fontSize: 14, fontWeight: 600, color: '#edf0f3', flexShrink: 0,
        }}>
          Upcoming
        </div>
        <div style={{ flex: 1, padding: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <p style={{ fontSize: 12, color: '#5a6478', textAlign: 'center', lineHeight: 1.65, margin: 0 }}>
            Interview dates and deadlines will appear here once email extraction is set up.
          </p>
        </div>
      </div>
    </div>
  )
}

const navBtnStyle = {
  width: 32, height: 32, borderRadius: 8,
  background: 'transparent', border: 'none',
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  cursor: 'pointer', color: '#8b98a9', transition: 'all 0.15s',
}