import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const DUMMY_JOBS = [
  { id:1,  role:'Software Engineer Intern', company:'Google',    status:'Interviewing', notes:'Passed phone screen. Technical interview scheduled for next week.' },
  { id:2,  role:'Frontend Engineer',        company:'Meta',      status:'Applied',      notes:'Applied through a referral from a former colleague.' },
  { id:3,  role:'Product Engineer Intern',  company:'Stripe',    status:'Assessment',   notes:'Take-home coding challenge due Friday. 3 hours.' },
  { id:4,  role:'Software Engineer',        company:'Notion',    status:'Offer',        notes:'Received offer — $165k base + equity. Deadline to respond is June 25.' },
  { id:5,  role:'Design Engineer Intern',   company:'Figma',     status:'Rejected',     notes:'Rejection after final round. They cited a strong candidate pool.' },
  { id:6,  role:'Frontend Engineer',        company:'Linear',    status:'Applied',      notes:'' },
  { id:7,  role:'Platform Engineer',        company:'Vercel',    status:'Interviewing', notes:'Currently in second round of technical interviews.' },
  { id:8,  role:'Software Engineer',        company:'Anthropic', status:'Assessment',   notes:'Systems design assessment assigned.' },
  { id:9,  role:'Software Engineer Intern', company:'Airbnb',    status:'Withdrawn',    notes:'Withdrew after accepting another offer.' },
  { id:10, role:'Backend Engineer',         company:'Shopify',   status:'Applied',      notes:'Applied to the remote-first team.' },
]

const S = {
  Applied:      { color:'#60a5fa', bg:'#1e3a5f' },
  Assessment:   { color:'#f59e0b', bg:'#3d2c0a' },
  Interviewing: { color:'#a3e635', bg:'#1a2e0a' },
  Offer:        { color:'#34d399', bg:'#0d3626' },
  Rejected:     { color:'#f87171', bg:'#3d1515' },
  Withdrawn:    { color:'#8b98a9', bg:'#252f40' },
}

export default function Login() {
  const { user, loading } = useAuth()
  const navigate = useNavigate()

  useEffect(() => { if (!loading && user) navigate('/dashboard') }, [user, loading, navigate])

  return (
    <div style={{ position: 'relative', height: '100vh', overflow: 'hidden', fontFamily: 'Plus Jakarta Sans, sans-serif', background: '#14191f' }}>

      {/* Blurred dashboard background */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        backdropFilter: 'blur(10px) saturate(0.6) brightness(0.55)',
        zIndex: 1,
      }}>
        <BgDashboard />
      </div>
      <div style={{ position: 'absolute', inset: 0, backdropFilter: 'blur(10px) saturate(0.6) brightness(0.55)', zIndex: 2, pointerEvents: 'none' }} />

      {/* Layout */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', zIndex: 3 }}>

        {/* Left */}
        <div style={{
          flex: 1, display: 'flex', flexDirection: 'column',
          justifyContent: 'space-between', padding: 48,
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 36, height: 36, borderRadius: 12, background: '#e05a22', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', flexShrink: 0 }}>
              <img src="/logo.png" alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                onError={e => { e.target.style.display='none'; e.target.parentNode.innerHTML='<svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="3" y="3" width="7" height="18" rx="1" fill="white"/><rect x="14" y="3" width="7" height="11" rx="1" fill="white"/></svg>' }}
              />
            </div>
            <span style={{ fontSize: 17, fontWeight: 700, color: '#edf0f3', letterSpacing: '-0.01em' }}>Application Board</span>
          </div>

          {/* Headline + sub */}
          <div>
            <h1 style={{
              margin: '0 0 20px',
              fontWeight: 800,
              fontSize: 'clamp(36px, 5vw, 64px)',
              letterSpacing: '-0.04em',
              lineHeight: 1.08,
              color: '#edf0f3',
            }}>
              All Your<br />
              <span style={{ color: '#e05a22' }}>Applications.</span><br />
              One Place.
            </h1>
            <p style={{ margin: '0 0 28px', color: 'rgba(237,240,243,0.65)', fontSize: 17, lineHeight: 1.7, maxWidth: 400, fontWeight: 400 }}>
              Stop losing track of where you applied. Application Board brings every role, status, and deadline into a single, clear view.
            </p>
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
              {[
                { icon: '⚡', label: 'Automated tracking', iconColor: '#e05a22' },
                { icon: '⊞', label: 'Kanban & list view', iconColor: '#60a5fa' },
                { icon: '📅', label: 'Interview calendar', iconColor: '#34d399' },
              ].map(p => (
                <span key={p.label} style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '6px 14px', borderRadius: 9999,
                  background: 'rgba(28,35,51,0.75)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  backdropFilter: 'blur(8px)',
                  color: '#edf0f3', fontSize: 14, fontWeight: 500,
                }}>
                  <span>{p.icon}</span>{p.label}
                </span>
              ))}
            </div>
          </div>

          {/* Status legend */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {Object.entries(S).map(([s, cfg]) => (
              <span key={s} style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                padding: '4px 12px', borderRadius: 9999,
                background: 'rgba(28,35,51,0.7)',
                border: `1px solid ${cfg.color}40`,
                backdropFilter: 'blur(8px)',
                color: cfg.color, fontSize: 12, fontWeight: 500,
              }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: cfg.color }} />
                {s}
              </span>
            ))}
          </div>
        </div>

        {/* Right panel */}
        <div style={{
          width: 400, flexShrink: 0,
          background: 'rgba(20,28,42,0.88)',
          backdropFilter: 'blur(28px) saturate(1.2)',
          borderLeft: '1px solid rgba(255,255,255,0.08)',
          padding: 40, display: 'flex', flexDirection: 'column', gap: 20,
          overflowY: 'auto',
        }}>
          <div>
            <p style={{ margin: '0 0 8px', fontSize: 12, fontWeight: 600, color: '#8b98a9', textTransform: 'uppercase', letterSpacing: '0.15em' }}>
              Welcome back
            </p>
            <h2 style={{ margin: '0 0 8px', fontSize: 24, fontWeight: 700, color: '#edf0f3', letterSpacing: '-0.02em', lineHeight: 1.25 }}>
              Sign in to your account
            </h2>
            <p style={{ margin: 0, fontSize: 14, color: '#8b98a9', lineHeight: 1.65 }}>
              We use Google to keep your data secure. No passwords to remember.
            </p>
          </div>

          {/* Google button */}
          <a
            href="http://localhost:8000/auth/login"
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
              background: '#ffffff', borderRadius: 12, padding: '14px 0',
              fontSize: 15, fontWeight: 600, color: '#111827',
              textDecoration: 'none', letterSpacing: '-0.01em',
              transition: 'transform 0.15s, box-shadow 0.15s',
              fontFamily: 'Plus Jakarta Sans, sans-serif',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,0,0,0.45)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </a>

          {/* This week's events */}
          <div style={{ border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, overflow: 'hidden' }}>
            <div style={{
              padding: '10px 14px',
              background: 'rgba(255,255,255,0.04)',
              borderBottom: '1px solid rgba(255,255,255,0.07)',
              fontSize: 12, fontWeight: 600, color: '#8b98a9',
              textTransform: 'uppercase', letterSpacing: '0.1em',
            }}>
              This week's events
            </div>
            {[
              { co:'Google', ev:'Technical Interview', color:'#60a5fa', date:'Jun 17' },
              { co:'Google', ev:'System Design',       color:'#60a5fa', date:'Jun 24' },
              { co:'Stripe', ev:'Coding Challenge',    color:'#f59e0b', date:'Jun 13' },
              { co:'Notion', ev:'Offer Deadline',      color:'#f87171', date:'Jun 25' },
            ].map((e, i, arr) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '9px 14px',
                borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: e.color, flexShrink: 0 }} />
                  <span style={{ fontSize: 12, color: '#c8d0da' }}>{e.co} — {e.ev}</span>
                </div>
                <span style={{ fontSize: 10, color: '#8b98a9', fontFamily: 'DM Mono, monospace' }}>{e.date}</span>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 }}>
            {[
              { n: 3, label: 'Applied',  color: '#60a5fa' },
              { n: 4, label: 'Active',   color: '#a3e635' },
              { n: 1, label: 'Offers',   color: '#34d399' },
            ].map(s => (
              <div key={s.label} style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: 8, padding: '12px 0', textAlign: 'center',
              }}>
                <div style={{ fontSize: 22, fontWeight: 700, color: s.color, fontFamily: 'DM Mono, monospace' }}>{s.n}</div>
                <div style={{ fontSize: 12, color: '#8b98a9', marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Legal */}
          <p style={{ margin: 0, fontSize: 12, color: '#5a6478', textAlign: 'center' }}>
            By continuing you agree to our{' '}
            <a href="#" style={{ color: '#8b98a9', textDecoration: 'underline' }}>Terms</a>
            {' '}&amp;{' '}
            <a href="#" style={{ color: '#8b98a9', textDecoration: 'underline' }}>Privacy</a>
          </p>
        </div>
      </div>
    </div>
  )
}

function BgDashboard() {
  return (
    <div style={{ height: '100vh', background: '#14191f', display: 'flex', flexDirection: 'column', fontFamily: 'Plus Jakarta Sans, sans-serif', overflow: 'hidden' }}>
      {/* Navbar */}
      <div style={{ height: 52, background: '#1c2333', borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', padding: '0 20px', gap: 12, flexShrink: 0 }}>
        <div style={{ width: 28, height: 28, borderRadius: 8, background: '#e05a22' }} />
        <span style={{ color: '#edf0f3', fontSize: 15, fontWeight: 700 }}>Application Board</span>
      </div>
      {/* Filter bar */}
      <div style={{ height: 48, borderBottom: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', padding: '0 20px', gap: 10, flexShrink: 0 }}>
        <div style={{ width: 200, height: 32, background: '#252f40', borderRadius: 8 }} />
        <div style={{ width: 200, height: 32, background: '#252f40', borderRadius: 8 }} />
        <div style={{ width: 100, height: 32, background: '#252f40', borderRadius: 8 }} />
        <div style={{ marginLeft: 'auto', color: '#8b98a9', fontSize: 12, fontFamily: 'DM Mono, monospace' }}>10 / 10</div>
      </div>
      {/* List rows */}
      <div style={{ flex: 1, padding: '12px 20px', display: 'flex', flexDirection: 'column', gap: 6, overflow: 'hidden' }}>
        {DUMMY_JOBS.map(job => {
          const cfg = S[job.status] || S['Applied']
          return (
            <div key={job.id} style={{
              display: 'flex', alignItems: 'center', gap: 14,
              background: '#1c2333', border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: 12, padding: '13px 18px',
            }}>
              <div style={{ width: 36, height: 36, borderRadius: 8, background: cfg.bg, color: cfg.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, flexShrink: 0, fontFamily: 'DM Mono, monospace' }}>
                {job.company.charAt(0)}
              </div>
              <div style={{ flex: '0 0 220px' }}>
                <div style={{ fontSize: 14, fontWeight: 500, color: '#edf0f3' }}>{job.role}</div>
                <div style={{ fontSize: 12, color: '#8b98a9' }}>{job.company}</div>
              </div>
              <div style={{ flex: 1, fontSize: 12, color: '#5a6478', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{job.notes}</div>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 9999, background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}30`, fontSize: 12, fontWeight: 600, flexShrink: 0 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: cfg.color }} />{job.status}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}