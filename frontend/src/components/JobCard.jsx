import { useState } from 'react'
import { STATUS_CONFIG } from './statusConfig'
import { useJobs } from '../context/JobsContext'

export default function JobCard({ job, onClick }) {
  const { removeJob } = useJobs()
  const [hovered, setHovered] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const cfg = STATUS_CONFIG[job.status] || STATUS_CONFIG['Applied']

  async function handleDelete(e) {
    e.stopPropagation()
    if (!confirm('Delete this application?')) return
    setDeleting(true)
    await removeJob(job.id)
  }

  return (
    <div
      onClick={() => onClick(job)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: '#1c2333',
        border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 8, padding: '12px 14px',
        cursor: 'pointer', position: 'relative',
        transition: 'border-color 0.15s, box-shadow 0.15s',
        fontFamily: 'Plus Jakarta Sans, sans-serif',
        borderColor: hovered ? `${cfg.color}50` : 'rgba(255,255,255,0.07)',
        boxShadow: hovered ? '0 2px 12px rgba(0,0,0,0.2)' : 'none',
      }}
    >
      {/* Delete button */}
      {hovered && (
        <button
          onClick={handleDelete}
          disabled={deleting}
          style={{
            position: 'absolute', top: 8, right: 8,
            width: 22, height: 22, borderRadius: 6,
            background: 'rgba(239,68,68,0.15)',
            border: '1px solid rgba(239,68,68,0.25)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            cursor: 'pointer', color: '#f87171',
            transition: 'background 0.15s',
            padding: 0,
          }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.3)'}
          onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.15)'}
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
          </svg>
        </button>
      )}

      <div style={{ fontSize: 14, fontWeight: 500, color: '#edf0f3', marginBottom: 4, paddingRight: hovered ? 28 : 0 }}>
        {job.role || '—'}
      </div>
      <div style={{ fontSize: 12, color: '#8b98a9', marginBottom: job.notes ? 8 : 0 }}>
        {job.company || '—'}
      </div>
      {job.notes && (
        <div style={{
          fontSize: 12, color: '#5a6478', lineHeight: 1.5,
          display: '-webkit-box', WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical', overflow: 'hidden',
        }}>
          {job.notes}
        </div>
      )}
    </div>
  )
}