import { useState } from 'react'
import { StatusBadge, STATUS_CONFIG, ALL_STATUSES } from './statusConfig'
import { useJobs } from '../context/JobsContext'

export default function JobDetailModal({ job, onClose }) {
  const { patchJob, removeJob } = useJobs()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({
    company: job.company || '',
    role: job.role || '',
    status: job.status || 'Applied',
    portal_url: job.portal_url || '',
    notes: job.notes || '',
  })
  const [saving, setSaving] = useState(false)

  async function handleSave() {
    setSaving(true)
    await patchJob(job.id, form)
    setSaving(false)
    setEditing(false)
  }

  async function handleDelete() {
    if (!confirm('Delete this application?')) return
    await removeJob(job.id)
    onClose()
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
        borderRadius: 16, width: '100%', maxWidth: 512,
        margin: '0 16px', overflow: 'hidden',
      }}>
        {/* Top accent bar */}
        <div style={{ height: 2, background: statusCfg.color }} />

        {/* Header */}
        <div style={{ padding: '20px 24px 16px', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <div style={{ marginBottom: 8 }}><StatusBadge status={form.status} /></div>
              {editing ? (
                <>
                  <input value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} style={inputStyle} placeholder="Role" />
                  <input value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} style={{ ...inputStyle, marginTop: 6, fontSize: 13 }} placeholder="Company" />
                </>
              ) : (
                <>
                  <h2 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: '#edf0f3', letterSpacing: '-0.02em' }}>{form.role || '—'}</h2>
                  <p style={{ margin: '4px 0 0', fontSize: 14, color: '#8b98a9' }}>{form.company || '—'}</p>
                </>
              )}
            </div>
            <button onClick={onClose} style={iconBtnStyle}
              onMouseEnter={e => { e.currentTarget.style.background = '#252f40'; e.currentTarget.style.color = '#edf0f3' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = '#8b98a9' }}
            >
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 1l12 12M13 1L1 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/></svg>
            </button>
          </div>
        </div>

        {/* Fields */}
        <div>
          <Field icon={<BriefcaseIcon />} label="Company">
            {editing
              ? <input value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} style={inputStyle} />
              : <span style={fieldVal}>{form.company || '—'}</span>}
          </Field>
          <Field icon={<RoleIcon />} label="Role">
            {editing
              ? <input value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value }))} style={inputStyle} />
              : <span style={fieldVal}>{form.role || '—'}</span>}
          </Field>
          <Field icon={<TagIcon />} label="Status">
            {editing
              ? <select value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))} style={{ ...inputStyle, cursor: 'pointer' }}>
                  {ALL_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              : <StatusBadge status={form.status} />}
          </Field>
          <Field icon={<GlobeIcon />} label="Portal">
            {editing
              ? <input value={form.portal_url} onChange={e => setForm(f => ({ ...f, portal_url: e.target.value }))} style={inputStyle} placeholder="https://..." />
              : form.portal_url
                ? <a href={form.portal_url} target="_blank" rel="noopener noreferrer"
                    style={{ color: '#e05a22', fontSize: 14, textDecoration: 'none' }}
                    onMouseEnter={e => e.currentTarget.style.textDecoration = 'underline'}
                    onMouseLeave={e => e.currentTarget.style.textDecoration = 'none'}
                  >{form.portal_url} ↗</a>
                : <span style={{ ...fieldVal, color: '#5a6478' }}>—</span>}
          </Field>
          <Field icon={<NotesIcon />} label="Notes">
            {editing
              ? <textarea value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} rows={3} style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.5 }} placeholder="Add notes..." />
              : <span style={{ ...fieldVal, lineHeight: 1.65, whiteSpace: 'pre-wrap' }}>{form.notes || '—'}</span>}
          </Field>
        </div>

        {/* Footer */}
        <div style={{
          padding: '14px 24px', borderTop: '1px solid rgba(255,255,255,0.07)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <button onClick={handleDelete} style={deleteBtnStyle}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.2)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.1)'}
          >Delete</button>
          <div style={{ display: 'flex', gap: 8 }}>
            {editing ? (
              <>
                <button onClick={() => setEditing(false)} style={cancelBtnStyle}>Cancel</button>
                <button onClick={handleSave} disabled={saving} style={saveBtnStyle}>{saving ? 'Saving…' : 'Save'}</button>
              </>
            ) : (
              <button onClick={() => setEditing(true)} style={saveBtnStyle}>Edit</button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function Field({ icon, label, children }) {
  return (
    <div style={{
      display: 'flex', alignItems: 'flex-start', gap: 12,
      padding: '12px 24px', borderBottom: '1px solid rgba(255,255,255,0.07)',
    }}>
      <div style={{
        width: 28, height: 28, borderRadius: 8, background: '#252f40',
        color: '#8b98a9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
      }}>{icon}</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12, color: '#8b98a9', marginBottom: 4 }}>{label}</div>
        {children}
      </div>
    </div>
  )
}

const inputStyle = {
  width: '100%', background: '#252f40',
  border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8,
  padding: '7px 10px', color: '#edf0f3', fontSize: 14,
  fontFamily: 'Plus Jakarta Sans, sans-serif', outline: 'none', boxSizing: 'border-box',
}
const fieldVal = { fontSize: 14, color: '#edf0f3', display: 'block' }
const iconBtnStyle = {
  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: 8, width: 32, height: 32, display: 'flex', alignItems: 'center',
  justifyContent: 'center', cursor: 'pointer', flexShrink: 0, color: '#8b98a9', transition: 'all 0.15s',
}
const saveBtnStyle = {
  background: '#e05a22', border: 'none', borderRadius: 8,
  padding: '8px 18px', color: 'white', fontSize: 13, fontWeight: 600,
  cursor: 'pointer', fontFamily: 'Plus Jakarta Sans, sans-serif',
}
const cancelBtnStyle = {
  background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: 8, padding: '8px 18px', color: '#8b98a9', fontSize: 13,
  cursor: 'pointer', fontFamily: 'Plus Jakarta Sans, sans-serif',
}
const deleteBtnStyle = {
  background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
  borderRadius: 8, padding: '8px 18px', color: '#f87171', fontSize: 13,
  cursor: 'pointer', fontFamily: 'Plus Jakarta Sans, sans-serif', transition: 'background 0.15s',
}

function BriefcaseIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2"/></svg> }
function RoleIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> }
function TagIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg> }
function GlobeIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/></svg> }
function NotesIcon() { return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg> }