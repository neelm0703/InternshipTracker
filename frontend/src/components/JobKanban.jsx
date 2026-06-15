import { useState } from 'react'
import { useJobs } from '../context/JobsContext'
import { STATUS_CONFIG, ALL_STATUSES } from './statusConfig'
import JobCard from './JobCard'
import JobDetailModal from './JobDetailModal'
import FilterBar from './FilterBar'

export default function JobKanban() {
  const { jobs, loading } = useJobs()
  const [selectedJob, setSelectedJob] = useState(null)

  const byStatus = ALL_STATUSES.reduce((acc, s) => {
    acc[s] = jobs.filter(j => j.status === s)
    return acc
  }, {})

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
      <FilterBar total={jobs.length} />

      {loading ? (
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#5a6478', fontSize: 14 }}>
          Loading…
        </div>
      ) : (
        <div style={{
          flex: 1, display: 'flex', gap: 10,
          padding: '16px 20px', overflowX: 'auto', overflowY: 'hidden', alignItems: 'flex-start',
        }}>
          {ALL_STATUSES.map(status => {
            const cfg = STATUS_CONFIG[status]
            const statusJobs = byStatus[status] || []
            return (
              <div key={status} style={{
                flex: '0 0 265px',
                background: '#161f2e',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 12, display: 'flex', flexDirection: 'column',
                maxHeight: '100%', overflow: 'hidden',
              }}>
                {/* Column header */}
                <div style={{
                  padding: '12px 14px',
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  borderBottom: '1px solid rgba(255,255,255,0.05)', flexShrink: 0,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    <span style={{ width: 8, height: 8, borderRadius: '50%', background: cfg.color }} />
                    <span style={{ fontSize: 14, fontWeight: 600, color: '#edf0f3' }}>{status}</span>
                  </div>
                  <span style={{
                    background: statusJobs.length > 0 ? cfg.bg : 'rgba(255,255,255,0.05)',
                    color: statusJobs.length > 0 ? cfg.color : '#5a6478',
                    fontSize: 11, fontWeight: 600, borderRadius: 9999,
                    padding: '1px 8px', fontFamily: 'DM Mono, monospace',
                  }}>
                    {statusJobs.length}
                  </span>
                </div>

                {/* Cards */}
                <div style={{
                  padding: '10px', display: 'flex', flexDirection: 'column',
                  gap: 8, overflowY: 'auto', flex: 1,
                }}>
                  {statusJobs.map(job => (
                    <JobCard key={job.id} job={job} onClick={setSelectedJob} />
                  ))}
                  {statusJobs.length === 0 && (
                    <div style={{ fontSize: 12, color: '#5a6478', textAlign: 'center', padding: '20px 0' }}>
                      No applications
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}

      {selectedJob && <JobDetailModal job={selectedJob} onClose={() => setSelectedJob(null)} />}
    </div>
  )
}