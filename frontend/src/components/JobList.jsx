import { useState } from 'react'
import { useJobs } from '../context/JobsContext'
import { StatusBadge, STATUS_CONFIG } from './statusConfig'
import JobDetailModal from './JobDetailModal'
import FilterBar from './FilterBar'

export default function JobList() {
  const { jobs, loading } = useJobs()
  const [selectedJob, setSelectedJob] = useState(null)

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
      <FilterBar total={jobs.length} />

      {loading ? (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#5a6478', fontSize: 14 }}>
          Loading…
        </div>
      ) : (
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px 20px', display: 'flex', flexDirection: 'column', gap: 6 }}>
          {jobs.length === 0 && (
            <div style={{ textAlign: 'center', color: '#5a6478', fontSize: 14, marginTop: 60 }}>No applications yet.</div>
          )}
          {jobs.map(job => <JobRow key={job.id} job={job} onClick={() => setSelectedJob(job)} />)}
        </div>
      )}

      {selectedJob && <JobDetailModal job={selectedJob} onClose={() => setSelectedJob(null)} />}
    </div>
  )
}

function JobRow({ job, onClick }) {
  const { removeJob } = useJobs()
  const cfg = STATUS_CONFIG[job.status] || STATUS_CONFIG['Applied']
  const [hovered, setHovered] = useState(false)
  const [deleting, setDeleting] = useState(false)

  async function handleDelete(e) {
    e.stopPropagation()
    if (!confirm('Delete this application?')) return
    setDeleting(true)
    await removeJob(job.id)
  }

  return (
    <div
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 14,
        background: hovered ? '#252f40' : '#1c2333',
        border: `1px solid ${hovered ? 'rgba(255,255,255,0.14)' : 'rgba(255,255,255,0.07)'}`,
        borderRadius: 12, padding: '13px 18px',
        cursor: 'pointer', transition: 'all 0.15s', position: 'relative',
      }}
    >
      {/* Avatar */}
      <div style={{
        width: 36, height: 36, borderRadius: 8,
        background: cfg.bg, color: cfg.color,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 14, fontWeight: 700, flexShrink: 0,
        fontFamily: 'DM Mono, monospace',
      }}>
        {(job.company || '?').charAt(0).toUpperCase()}
      </div>

      {/* Role + company */}
      <div style={{ flex: '0 0 220px', minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: '#edf0f3', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {job.role || '—'}
        </div>
        <div style={{ fontSize: 12, color: '#8b98a9', marginTop: 2 }}>{job.company || '—'}</div>
      </div>

      {/* Notes snippet */}
      <div style={{
        flex: 1, fontSize: 12, color: '#5a6478',
        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', minWidth: 0,
      }}>
        {job.notes || ''}
      </div>

      {/* Status + delete + chevron */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
        <StatusBadge status={job.status} />

        {/* Delete button */}
        {hovered && (
          <button
            onClick={handleDelete}
            disabled={deleting}
            style={{
              width: 28, height: 28, borderRadius: 7,
              background: 'rgba(239,68,68,0.12)',
              border: '1px solid rgba(239,68,68,0.22)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: '#f87171', padding: 0,
              transition: 'background 0.15s', flexShrink: 0,
            }}
            onMouseEnter={e => { e.stopPropagation(); e.currentTarget.style.background = 'rgba(239,68,68,0.28)' }}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.12)'}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
            </svg>
          </button>
        )}

        <svg
          width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8b98a9" strokeWidth="2" strokeLinecap="round"
          style={{ opacity: hovered ? 1 : 0, transition: 'opacity 0.15s' }}
        >
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      </div>
    </div>
  )
}