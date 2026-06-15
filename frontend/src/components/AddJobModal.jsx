import { useState } from 'react'
import { ALL_STATUSES, STATUS_CONFIG } from './statusConfig'
import { useJobs } from '../context/JobsContext'
import { createJob } from '../api/jobs'

export default function AddJobModal({ onClose }) {
  const { fetchJobs } = useJobs()
  const [form, setForm] = useState({
    company: '',
    role: '',
    status: 'Applied',
    portal_url: '',
    notes: '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  async function handleSubmit() {
    if (!form.company.trim()) { setError('Company is required'); return }
    setSaving(true)
    setError(null)
    try {
      await createJob(form)
      await fetchJobs()
      onClose()
    } catch (e) {
      setError('Failed to create job. Please try again.' + (e.message ? `(${e.message})` : ''))
    } finally {
      setSaving(false)
    }
  }

  const statusCfg = STATUS_CONFIG[form.status] || STATUS_CONFIG['Applied']

  return (
    <div
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.6)',
        backdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        zIndex: 1000, fontFamily: 'Plus Jakarta Sans, sans-serif',
      }}
    >
      <div style={{
        background: '#1c2333',
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 24px 64px rgba(0,0,0,0.6)',
        borderRadius: 16, width: '100%', maxWidth: 480,
        margin: '0 16px', overflow: 'hidden',
      }}>
        {/* Top accent */}
        <div style={{ height: 2, background: statusCfg.color }} />

        {/* Header */}
        <div style={{
          padding: '20px 24px 16px',
          borderBottom: '1px solid rgba(255,255,255,0.07)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div>
            <h2 style={{ margin: 0, fontSize: 18, fontWeight: 700, color: '#edf0f3', letterSpacing: '-0.02em' }}>
              Add Application
            </h2>
            <p style={{ margin: '4px 0 0', fontSize: 13, color: '#8b98a9' }}>
              Manually track a new job or internship
            </p>
          </div>
          <button
            onClick={onClose}
            style={iconBtnStyle}
            onMouseEnter={e => { e.currentTarget.style.background = '#252f40'; e.currentTarget.style.color = '#edf0f3' }}
            onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = '#8b98a9' }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {/* Fields */}
        <div style={{ padding: '8px 0' }}>
          <Field label="Company" required>
            <input
              value={form.company}
              onChange={e => setForm(f => ({ ...f, company: e.target.value }))}
              placeholder="e.g. Google"
              style={inputStyle}
              autoFocus
            />
          </Field>

          <Field label="Role">
            <input
              value={form.role}
              onChange={e => setForm(f => ({ ...f, role: e.target.value }))}
              placeholder="e.g. Software Engineer Intern"
              style={inputStyle}
            />
          </Field>

          <Field label="Status">
            <select
              value={form.status}
              onChange={e => setForm(f => ({ ...f, status: e.target.value }))}
              style={{ ...inputStyle, cursor: 'pointer' }}
            >
              {ALL_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>

          <Field label="Portal URL">
            <input
              value={form.portal_url}
              onChange={e => setForm(f => ({ ...f, portal_url: e.target.value }))}
              placeholder="https://..."
              style={inputStyle}
            />
          </Field>

          <Field label="Notes">
            <textarea
              value={form.notes}
              onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
              placeholder="Any notes about this application..."
              rows={3}
              style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.55 }}
            />
          </Field>
        </div>

        {/* Footer */}
        <div style={{
          padding: '14px 24px',
          borderTop: '1px solid rgba(255,255,255,0.07)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          {error
            ? <span style={{ fontSize: 12, color: '#f87171' }}>{error}</span>
            : <span />
          }
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={onClose} style={cancelBtnStyle}>Cancel</button>
            <button
              onClick={handleSubmit}
              disabled={saving}
              style={{ ...saveBtnStyle, opacity: saving ? 0.7 : 1 }}
            >
              {saving ? 'Adding…' : 'Add Application'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function Field({ label, required, children }) {
  return (
    <div style={{
      padding: '10px 24px',
      borderBottom: '1px solid rgba(255,255,255,0.04)',
    }}>
      <label style={{ display: 'block', fontSize: 12, color: '#8b98a9', marginBottom: 6, fontWeight: 500 }}>
        {label}{required && <span style={{ color: '#e05a22', marginLeft: 3 }}>*</span>}
      </label>
      {children}
    </div>
  )
}

const inputStyle = {
  width: '100%', background: '#252f40',
  border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8,
  padding: '8px 12px', color: '#edf0f3', fontSize: 14,
  fontFamily: 'Plus Jakarta Sans, sans-serif', outline: 'none',
  boxSizing: 'border-box', transition: 'border-color 0.15s',
}
const iconBtnStyle = {
  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 8, width: 32, height: 32,
  display: 'flex', alignItems: 'center', justifyContent: 'center',
  cursor: 'pointer', flexShrink: 0, color: '#8b98a9', transition: 'all 0.15s',
}
const saveBtnStyle = {
  background: '#e05a22', border: 'none', borderRadius: 8,
  padding: '8px 18px', color: 'white', fontSize: 13, fontWeight: 600,
  cursor: 'pointer', fontFamily: 'Plus Jakarta Sans, sans-serif', transition: 'opacity 0.15s',
}
const cancelBtnStyle = {
  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 8, padding: '8px 18px', color: '#8b98a9',
  fontSize: 13, cursor: 'pointer', fontFamily: 'Plus Jakarta Sans, sans-serif',
}