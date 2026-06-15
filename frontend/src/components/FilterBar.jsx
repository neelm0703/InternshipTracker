import { useState, useRef, useEffect } from 'react'
import { useJobs } from '../context/JobsContext'
import { ALL_STATUSES, STATUS_CONFIG } from './statusConfig'
import AddJobModal from './AddJobModal'

export default function FilterBar({ total }) {
  const { filters, setFilters } = useJobs()
  const [statusOpen, setStatusOpen] = useState(false)
  const [showAdd, setShowAdd] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setStatusOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function toggleStatus(s) {
    setFilters(f => ({ ...f, status: f.status === s ? '' : s }))
  }

  return (
    <>
      <div style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '10px 20px',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
        fontFamily: 'Plus Jakarta Sans, sans-serif',
        flexWrap: 'wrap', flexShrink: 0,
      }}>
        <SearchInput
          placeholder="Search company..."
          value={filters.company}
          onChange={v => setFilters(f => ({ ...f, company: v }))}
        />
        <SearchInput
          placeholder="Search role..."
          value={filters.role}
          onChange={v => setFilters(f => ({ ...f, role: v }))}
        />

        {/* Status dropdown */}
        <div ref={dropdownRef} style={{ position: 'relative' }}>
          <button
            onClick={() => setStatusOpen(o => !o)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: '#252f40', border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 8, padding: '7px 12px',
              color: '#edf0f3', fontSize: 13, cursor: 'pointer',
              fontFamily: 'Plus Jakarta Sans, sans-serif', fontWeight: 500,
            }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#8b98a9" strokeWidth="2">
              <line x1="4" y1="6" x2="20" y2="6"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="11" y1="18" x2="13" y2="18"/>
            </svg>
            Status
            {filters.status && (
              <span style={{
                background: '#e05a22', color: 'white', fontSize: 10, fontWeight: 700,
                borderRadius: 9999, padding: '1px 5px', lineHeight: 1.4,
              }}>1</span>
            )}
            <svg width="10" height="10" viewBox="0 0 10 6" fill="none">
              <path d="M1 1l4 4 4-4" stroke="#8b98a9" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>

          {statusOpen && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 6px)', left: 0, zIndex: 100,
              background: '#212c3d', border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 12, padding: '6px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
              minWidth: 180,
            }}>
              {ALL_STATUSES.map(s => {
                const cfg = STATUS_CONFIG[s]
                const checked = filters.status === s
                return (
                  <button
                    key={s}
                    onClick={() => toggleStatus(s)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 8, width: '100%',
                      padding: '7px 10px', borderRadius: 7, border: 'none', cursor: 'pointer',
                      background: checked ? '#252f40' : 'transparent',
                      fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: 13,
                      color: '#edf0f3', textAlign: 'left', transition: 'background 0.1s',
                    }}
                    onMouseEnter={e => { if (!checked) e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
                    onMouseLeave={e => { if (!checked) e.currentTarget.style.background = 'transparent' }}
                  >
                    <span style={{ width: 7, height: 7, borderRadius: '50%', background: cfg.color, flexShrink: 0 }} />
                    <span style={{ flex: 1 }}>{s}</span>
                    {checked && (
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#e05a22" strokeWidth="2.5" strokeLinecap="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                    )}
                  </button>
                )
              })}
              {filters.status && (
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', marginTop: 4, paddingTop: 4 }}>
                  <button
                    onClick={() => { setFilters(f => ({ ...f, status: '' })); setStatusOpen(false) }}
                    style={{
                      width: '100%', padding: '6px 10px', border: 'none', borderRadius: 7,
                      background: 'transparent', cursor: 'pointer', textAlign: 'left',
                      color: '#8b98a9', fontSize: 12, fontFamily: 'Plus Jakarta Sans, sans-serif',
                    }}
                    onMouseEnter={e => e.currentTarget.style.color = '#edf0f3'}
                    onMouseLeave={e => e.currentTarget.style.color = '#8b98a9'}
                  >
                    Clear filter
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Count + Add button */}
        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={() => setShowAdd(true)}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: '#e05a22', border: 'none', borderRadius: 8,
              padding: '7px 13px', color: 'white',
              fontSize: 13, fontWeight: 600, cursor: 'pointer',
              fontFamily: 'Plus Jakarta Sans, sans-serif',
              transition: 'background 0.15s, transform 0.1s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background = '#f06a30'; e.currentTarget.style.transform = 'translateY(-1px)' }}
            onMouseLeave={e => { e.currentTarget.style.background = '#e05a22'; e.currentTarget.style.transform = 'translateY(0)' }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Add
          </button>
          <span style={{ color: '#8b98a9', fontSize: 12, fontFamily: 'DM Mono, monospace' }}>
            {total} / {total}
          </span>
        </div>
      </div>

      {showAdd && <AddJobModal onClose={() => setShowAdd(false)} />}
    </>
  )
}

function SearchInput({ placeholder, value, onChange }) {
  return (
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
      <svg style={{ position: 'absolute', left: 10, color: '#8b98a9', pointerEvents: 'none' }} width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
      <input
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          background: '#252f40', border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: 8, padding: '7px 12px 7px 30px',
          color: '#edf0f3', fontSize: 14,
          fontFamily: 'Plus Jakarta Sans, sans-serif',
          outline: 'none', width: 200,
        }}
      />
    </div>
  )
}