import Head from 'next/head'
import { useState, useEffect, useCallback } from 'react'

type Creator = {
  id: string; created_at: string; first_name: string; last_name: string
  email: string; phone: string; location: string; creator_type: string
  niches: string[]; platforms: string[]; primary_platform: string
  follower_range: string; engagement_rate: string; profile_link: string
  bio: string; past_brands: string; rate_range: string; turnaround: string
  extra_notes: string; status: string; admin_notes: string; approved_at: string
}

const STATUS_STYLES: Record<string, string> = {
  pending: 'pill-pending', approved: 'pill-approved',
  review: 'pill-review', rejected: 'pill-rejected'
}
const STATUS_LABELS: Record<string, string> = {
  pending: 'Pending', approved: 'Approved', review: 'In review', rejected: 'Rejected'
}
const AVATAR_COLORS = ['#1a3a2a','#7a6022','#4a1528','#185FA5','#3B6D11','#993C1D','#534AB7','#085041','#A32D2D','#633806']

export default function Admin() {
  const [creators, setCreators] = useState<Creator[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Creator | null>(null)
  const [adminNote, setAdminNote] = useState('')
  const [updating, setUpdating] = useState(false)
  const [toast, setToast] = useState('')

  const fetchCreators = useCallback(async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (filter !== 'all') params.set('status', filter)
    if (search) params.set('search', search)
    const res = await fetch(`/api/creators?${params}`)
    const data = await res.json()
    setCreators(Array.isArray(data) ? data : [])
    setLoading(false)
  }, [filter, search])

  useEffect(() => { fetchCreators() }, [fetchCreators])

  async function updateStatus(id: string, status: string) {
    setUpdating(true)
    const res = await fetch(`/api/creators/${id}`, {
      method: 'PATCH',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify({ status, admin_notes: adminNote })
    })
    if (res.ok) {
      showToast(status === 'approved' ? 'Creator approved — confirmation email sent!' : `Status updated to ${status}`)
      setSelected(null)
      fetchCreators()
    }
    setUpdating(false)
  }

  async function deleteCreator(id: string) {
    if (!confirm('Delete this creator profile? This cannot be undone.')) return
    await fetch(`/api/creators/${id}`, { method: 'DELETE' })
    setSelected(null)
    fetchCreators()
    showToast('Creator removed.')
  }

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 3500)
  }

  function openProfile(c: Creator) {
    setSelected(c)
    setAdminNote(c.admin_notes || '')
  }

  const stats = {
    total: creators.length,
    approved: creators.filter(c=>c.status==='approved').length,
    pending: creators.filter(c=>c.status==='pending').length,
    review: creators.filter(c=>c.status==='review').length,
  }

  const initials = (c: Creator) => `${c.first_name?.[0]||''}${c.last_name?.[0]||''}`
  const avatarColor = (id: string) => AVATAR_COLORS[parseInt(id.replace(/\D/g,'').slice(0,3)||'0') % AVATAR_COLORS.length]
  const fmtDate = (s: string) => s ? new Date(s).toLocaleDateString('en-US',{month:'short',day:'numeric',year:'numeric'}) : '—'

  return (
    <>
      <Head><title>Amplify — Creator Roster</title></Head>

      {toast && <div className="toast">{toast}</div>}

      <nav className="nav">
        <div className="logo">Ampli<span>fy</span> <span className="admin-badge">Admin</span></div>
        <div style={{display:'flex',gap:'1rem',alignItems:'center'}}>
          <a href="/" className="nav-link">← Public site</a>
          <a href="/brands" className="nav-link">Brand view</a>
        </div>
      </nav>

      <div className="page">
        <div className="header">
          <div>
            <h1>Creator roster</h1>
            <p className="subtitle">Manage applications and approved creator profiles</p>
          </div>
          <div className="controls">
            <div className="search-wrap">
              <span className="search-ico">⌕</span>
              <input placeholder="Search name, niche, type…" value={search} onChange={e=>setSearch(e.target.value)} className="search-input"/>
            </div>
            <a href="/apply" className="add-btn">+ Add creator</a>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-row">
          {[['Total',stats.total,''],['Approved',stats.approved,'green'],['Pending',stats.pending,'amber'],['In review',stats.review,'purple']].map(([l,n,c])=>(
            <div className="stat-card" key={String(l)}>
              <div className={`stat-num stat-${c}`}>{n}</div>
              <div className="stat-lbl">{l}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="filter-row">
          {['all','pending','review','approved','rejected'].map(f=>(
            <button key={f} className={`filter-btn${filter===f?' active':''}`} onClick={()=>setFilter(f)}>
              {f==='all'?'All':STATUS_LABELS[f]}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="table-wrap">
          {loading ? (
            <div className="loading">Loading creators…</div>
          ) : creators.length === 0 ? (
            <div className="empty">No creators found. <a href="/" onClick={e=>{e.preventDefault();window.location.href='/'}}>View application form →</a></div>
          ) : (
            <table className="rtable">
              <thead>
                <tr>
                  <th>Creator</th><th>Type</th><th>Platforms</th>
                  <th>Reach</th><th>Niche</th><th>Applied</th><th>Status</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {creators.map(c=>(
                  <tr key={c.id} onClick={()=>openProfile(c)} className="trow">
                    <td>
                      <div className="creator-cell">
                        <div className="avatar" style={{background:avatarColor(c.id)}}>{initials(c)}</div>
                        <div>
                          <div className="cname">{c.first_name} {c.last_name}</div>
                          <div className="cemail">{c.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="muted">{c.creator_type||'—'}</td>
                    <td>
                      <div className="plat-badges">
                        {(c.platforms||[]).slice(0,3).map(p=><span className="plat-badge" key={p}>{p}</span>)}
                        {(c.platforms||[]).length>3 && <span className="plat-badge">+{c.platforms.length-3}</span>}
                      </div>
                    </td>
                    <td className="bold">{c.follower_range||'—'}</td>
                    <td className="muted">{(c.niches||[]).slice(0,2).join(', ')||'—'}</td>
                    <td className="muted">{fmtDate(c.created_at)}</td>
                    <td><span className={`pill ${STATUS_STYLES[c.status]||''}`}>{STATUS_LABELS[c.status]||c.status}</span></td>
                    <td onClick={e=>e.stopPropagation()}>
                      <div className="act-btns">
                        <button className="act" onClick={()=>openProfile(c)}>View</button>
                        {(c.status==='pending'||c.status==='review') &&
                          <button className="act act-approve" onClick={()=>updateStatus(c.id,'approved')}>Approve</button>}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Profile modal */}
      {selected && (
        <div className="modal-bg" onClick={()=>setSelected(null)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="modal-header">
              <div style={{display:'flex',alignItems:'center',gap:'1rem'}}>
                <div className="modal-avatar" style={{background:avatarColor(selected.id)}}>{initials(selected)}</div>
                <div>
                  <div className="modal-name">{selected.first_name} {selected.last_name}</div>
                  <div className="modal-type">{selected.creator_type||'Creator'}</div>
                </div>
              </div>
              <button className="modal-close" onClick={()=>setSelected(null)}>✕</button>
            </div>

            <div className="modal-body">
              <div className="modal-section">
                <div className="msec-title">Contact</div>
                <div className="mrow"><span className="mkey">Email</span><a href={`mailto:${selected.email}`} className="mval mlink">{selected.email}</a></div>
                {selected.phone && <div className="mrow"><span className="mkey">Phone</span><span className="mval">{selected.phone}</span></div>}
                <div className="mrow"><span className="mkey">Location</span><span className="mval">{selected.location||'—'}</span></div>
                <div className="mrow"><span className="mkey">Applied</span><span className="mval">{fmtDate(selected.created_at)}</span></div>
                {selected.profile_link && <div className="mrow"><span className="mkey">Profile link</span><a href={selected.profile_link} target="_blank" className="mval mlink" rel="noreferrer">{selected.profile_link}</a></div>}
              </div>

              <div className="modal-section">
                <div className="msec-title">Platforms & reach</div>
                <div className="mrow"><span className="mkey">Platforms</span><span className="mval">{(selected.platforms||[]).join(', ')||'—'}</span></div>
                <div className="mrow"><span className="mkey">Primary</span><span className="mval">{selected.primary_platform||'—'}</span></div>
                <div className="mrow"><span className="mkey">Reach</span><span className="mval">{selected.follower_range||'—'}</span></div>
                <div className="mrow"><span className="mkey">Engagement</span><span className="mval">{selected.engagement_rate ? `${selected.engagement_rate}%` : '—'}</span></div>
                <div className="mrow"><span className="mkey">Niches</span><span className="mval">{(selected.niches||[]).join(', ')||'—'}</span></div>
              </div>

              <div className="modal-section">
                <div className="msec-title">About</div>
                {selected.bio && <div className="mrow col"><span className="mkey">Bio</span><span className="mval bio-text">{selected.bio}</span></div>}
                <div className="mrow"><span className="mkey">Past brands</span><span className="mval">{selected.past_brands||'None listed'}</span></div>
                <div className="mrow"><span className="mkey">Rate</span><span className="mval">{selected.rate_range||'—'}</span></div>
                <div className="mrow"><span className="mkey">Turnaround</span><span className="mval">{selected.turnaround||'—'}</span></div>
                {selected.extra_notes && <div className="mrow col"><span className="mkey">Notes</span><span className="mval bio-text">{selected.extra_notes}</span></div>}
              </div>

              <div className="modal-section">
                <div className="msec-title">Admin</div>
                <div className="mrow"><span className="mkey">Status</span><span className={`pill ${STATUS_STYLES[selected.status]}`}>{STATUS_LABELS[selected.status]||selected.status}</span></div>
                {selected.approved_at && <div className="mrow"><span className="mkey">Approved</span><span className="mval">{fmtDate(selected.approved_at)}</span></div>}
                <div className="field" style={{marginTop:'0.75rem'}}>
                  <label className="mkey" style={{marginBottom:'0.4rem',display:'block'}}>Admin notes</label>
                  <textarea value={adminNote} onChange={e=>setAdminNote(e.target.value)} placeholder="Internal notes about this creator…" className="admin-note-input"/>
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <button className="ma-btn ma-approve" onClick={()=>updateStatus(selected.id,'approved')} disabled={updating||selected.status==='approved'}>
                {updating?'Saving…':'Approve creator'}
              </button>
              <button className="ma-btn ma-review" onClick={()=>updateStatus(selected.id,'review')} disabled={updating}>Mark in review</button>
              <button className="ma-btn ma-reject" onClick={()=>updateStatus(selected.id,'rejected')} disabled={updating}>Decline</button>
              <button className="ma-btn ma-delete" onClick={()=>deleteCreator(selected.id)}>Delete</button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        .toast{position:fixed;bottom:2rem;left:50%;transform:translateX(-50%);background:var(--accent);color:#fff;padding:0.75rem 1.5rem;border-radius:2rem;font-size:0.875rem;font-weight:500;z-index:9999}
        .nav{display:flex;justify-content:space-between;align-items:center;padding:1rem 2.5rem;border-bottom:1px solid var(--cream3);background:var(--cream);position:sticky;top:0;z-index:100}
        .logo{font-family:'DM Serif Display',serif;font-size:1.35rem;color:var(--accent);display:flex;align-items:center;gap:0.75rem}
        .logo span:first-child{color:var(--gold)}
        .admin-badge{font-family:'DM Sans',sans-serif;font-size:0.65rem;font-weight:500;letter-spacing:0.08em;text-transform:uppercase;background:var(--cream2);color:var(--ink3);padding:3px 10px;border-radius:2rem;border:1px solid var(--cream3)}
        .nav-link{font-size:0.85rem;color:var(--ink2);text-decoration:none}
        .nav-link:hover{color:var(--accent)}
        .page{padding:0 2.5rem 4rem}
        .header{display:flex;justify-content:space-between;align-items:flex-start;padding:2rem 0 1rem}
        h1{font-family:'DM Serif Display',serif;font-size:2rem;color:var(--ink)}
        .subtitle{font-size:0.85rem;color:var(--ink3);margin-top:0.25rem}
        .controls{display:flex;gap:0.75rem;align-items:center}
        .search-wrap{position:relative}
        .search-ico{position:absolute;left:0.75rem;top:50%;transform:translateY(-50%);color:var(--ink3);font-size:14px}
        .search-input{padding:0.55rem 0.875rem 0.55rem 2.25rem;border-radius:2rem;border:1px solid var(--cream3);background:#fff;font-size:0.8rem;color:var(--ink);font-family:'DM Sans',sans-serif;width:220px;outline:none}
        .search-input:focus{border-color:var(--accent)}
        .add-btn{padding:0.55rem 1.2rem;border-radius:2rem;background:var(--accent);color:#fff;font-size:0.8rem;font-weight:500;text-decoration:none}
        /* Stats */
        .stats-row{display:grid;grid-template-columns:repeat(4,1fr);gap:0.75rem;margin-bottom:1.5rem}
        .stat-card{background:var(--cream2);border-radius:0.75rem;padding:1rem 1.25rem}
        .stat-num{font-family:'DM Serif Display',serif;font-size:2rem}
        .stat-lbl{font-size:0.72rem;color:var(--ink3);margin-top:2px}
        .stat-green{color:var(--accent)}
        .stat-amber{color:#854F0B}
        .stat-purple{color:#534AB7}
        /* Filters */
        .filter-row{display:flex;gap:0.5rem;margin-bottom:1.25rem}
        .filter-btn{padding:0.45rem 1rem;border-radius:2rem;border:1px solid var(--cream3);background:#fff;font-size:0.8rem;color:var(--ink2);cursor:pointer;font-family:'DM Sans',sans-serif;transition:all 0.15s}
        .filter-btn.active{border-color:var(--accent);color:var(--accent);background:#e8f3ed}
        .filter-btn:hover:not(.active){border-color:var(--ink3)}
        /* Table */
        .table-wrap{background:#fff;border:1px solid var(--cream3);border-radius:1rem;overflow:hidden}
        .loading,.empty{padding:3rem;text-align:center;color:var(--ink3);font-size:0.9rem}
        .empty a{color:var(--accent)}
        .rtable{width:100%;border-collapse:collapse;font-size:0.82rem}
        .rtable th{text-align:left;font-size:0.7rem;font-weight:500;letter-spacing:0.07em;text-transform:uppercase;color:var(--ink3);padding:0.75rem 1rem;border-bottom:1px solid var(--cream3);background:var(--cream2)}
        .rtable td{padding:0.875rem 1rem;border-bottom:1px solid var(--cream2);vertical-align:middle}
        .trow{cursor:pointer}
        .trow:last-child td{border-bottom:none}
        .trow:hover td{background:#faf8f4}
        .creator-cell{display:flex;align-items:center;gap:0.75rem}
        .avatar{width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:0.7rem;font-weight:500;color:#fff;flex-shrink:0}
        .cname{font-weight:500;color:var(--ink)}
        .cemail{font-size:0.72rem;color:var(--ink3)}
        .muted{color:var(--ink2)}
        .bold{font-weight:500;color:var(--ink)}
        .plat-badges{display:flex;gap:4px;flex-wrap:wrap}
        .plat-badge{background:var(--cream2);color:var(--ink2);border:1px solid var(--cream3);border-radius:2rem;padding:2px 8px;font-size:0.68rem;white-space:nowrap}
        .act-btns{display:flex;gap:6px}
        .act{padding:4px 10px;border-radius:1rem;font-size:0.72rem;font-weight:500;cursor:pointer;border:1px solid var(--cream3);background:#fff;color:var(--ink2);font-family:'DM Sans',sans-serif}
        .act:hover{border-color:var(--accent);color:var(--accent)}
        .act-approve{background:var(--accent);color:#fff;border-color:var(--accent)}
        .act-approve:hover{background:var(--accent2)}
        /* Status pills */
        .pill{display:inline-flex;padding:3px 10px;border-radius:2rem;font-size:0.7rem;font-weight:500}
        .pill-pending{background:#faf3e8;color:#854F0B;border:1px solid #EF9F27}
        .pill-approved{background:#e8f3ed;color:#1a3a2a;border:1px solid var(--accent3)}
        .pill-review{background:#eeedfe;color:#3C3489;border:1px solid #AFA9EC}
        .pill-rejected{background:#fcebeb;color:#A32D2D;border:1px solid #F09595}
        /* Modal */
        .modal-bg{position:fixed;inset:0;background:rgba(15,13,11,0.55);display:flex;align-items:flex-start;justify-content:flex-end;z-index:200;padding:0}
        .modal{background:var(--cream);width:480px;height:100vh;overflow-y:auto;display:flex;flex-direction:column}
        .modal-header{background:var(--accent);padding:1.75rem 2rem;display:flex;justify-content:space-between;align-items:center;flex-shrink:0}
        .modal-avatar{width:48px;height:48px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:0.85rem;font-weight:500;color:#fff}
        .modal-name{font-family:'DM Serif Display',serif;font-size:1.35rem;color:#fff}
        .modal-type{font-size:0.8rem;color:var(--accent3);margin-top:2px}
        .modal-close{background:rgba(255,255,255,0.15);border:none;color:#fff;width:30px;height:30px;border-radius:50%;cursor:pointer;font-size:1rem;display:flex;align-items:center;justify-content:center}
        .modal-body{padding:1.5rem 2rem;flex:1;overflow-y:auto}
        .modal-section{margin-bottom:1.5rem;padding-bottom:1.5rem;border-bottom:1px solid var(--cream3)}
        .modal-section:last-child{border-bottom:none;margin-bottom:0}
        .msec-title{font-size:0.7rem;font-weight:500;letter-spacing:0.08em;text-transform:uppercase;color:var(--gold3);margin-bottom:0.75rem}
        .mrow{display:flex;justify-content:space-between;align-items:flex-start;gap:1rem;margin-bottom:0.5rem}
        .mrow.col{flex-direction:column;gap:0.35rem}
        .mkey{font-size:0.78rem;color:var(--ink3);min-width:100px;flex-shrink:0}
        .mval{font-size:0.82rem;color:var(--ink);text-align:right;flex:1}
        .mrow.col .mval{text-align:left}
        .mlink{color:var(--accent);word-break:break-all}
        .bio-text{color:var(--ink2);line-height:1.6;font-size:0.82rem}
        .admin-note-input{width:100%;padding:0.65rem 0.875rem;border-radius:0.5rem;border:1px solid var(--cream3);background:#fff;font-size:0.85rem;color:var(--ink);font-family:'DM Sans',sans-serif;min-height:80px;resize:vertical;outline:none}
        .admin-note-input:focus{border-color:var(--accent)}
        .modal-actions{padding:1.25rem 2rem;border-top:1px solid var(--cream3);display:flex;gap:0.6rem;flex-shrink:0;background:var(--cream)}
        .ma-btn{flex:1;padding:0.65rem 0.5rem;border-radius:2rem;font-size:0.8rem;font-weight:500;cursor:pointer;border:1px solid var(--cream3);background:#fff;color:var(--ink);font-family:'DM Sans',sans-serif;transition:all 0.2s;white-space:nowrap}
        .ma-approve{background:var(--accent);color:#fff;border-color:var(--accent)}
        .ma-approve:disabled{opacity:0.5;cursor:not-allowed}
        .ma-review{color:#534AB7;border-color:#AFA9EC}
        .ma-reject{color:#A32D2D;border-color:#F09595}
        .ma-delete{color:var(--ink3);border-color:var(--cream3)}
        .ma-delete:hover{color:#A32D2D;border-color:#F09595}
      `}</style>
    </>
  )
}
