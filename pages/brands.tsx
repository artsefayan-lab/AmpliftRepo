import Head from 'next/head'
import { useState, useEffect, useCallback } from 'react'

type Creator = {
  id: string; first_name: string; last_name: string
  creator_type: string; niches: string[]; platforms: string[]
  follower_range: string; engagement_rate: string; rate_range: string
  bio: string; profile_link: string; location: string; primary_platform: string
}

const NICHE_OPTIONS = ['All niches','Fashion','Beauty','Fitness & health','Food & drink','Travel','Tech','Finance','Parenting','Gaming','Home & design','Sustainability','Business','Entertainment','Sports','Pets','Wellness']
const REACH_OPTIONS = ['Any reach','Under 10K (nano)','10K – 50K (micro)','50K – 250K (mid-tier)','250K – 1M (macro)','1M+ (mega)']
const AVATAR_COLORS = ['#1a3a2a','#7a6022','#4a1528','#185FA5','#3B6D11','#993C1D','#534AB7','#085041']

export default function BrandsPage() {
  const [creators, setCreators] = useState<Creator[]>([])
  const [loading, setLoading] = useState(true)
  const [niche, setNiche] = useState('All niches')
  const [reach, setReach] = useState('Any reach')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<Creator | null>(null)

  const fetchCreators = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/creators?status=approved')
    const data = await res.json()
    setCreators(Array.isArray(data) ? data : [])
    setLoading(false)
  }, [])

  useEffect(() => { fetchCreators() }, [fetchCreators])

  const filtered = creators.filter(c => {
    const matchNiche = niche === 'All niches' || (c.niches||[]).includes(niche)
    const matchReach = reach === 'Any reach' || c.follower_range === reach
    const matchSearch = !search || `${c.first_name} ${c.last_name} ${c.creator_type} ${(c.niches||[]).join(' ')}`.toLowerCase().includes(search.toLowerCase())
    return matchNiche && matchReach && matchSearch
  })

  const initials = (c: Creator) => `${c.first_name?.[0]||''}${c.last_name?.[0]||''}`
  const avatarColor = (id: string) => AVATAR_COLORS[parseInt(id.replace(/\D/g,'').slice(0,3)||'0') % AVATAR_COLORS.length]

  return (
    <>
      <Head><title>Amplify — Browse Creators</title></Head>

      <nav className="nav">
        <a href="/" className="logo">Ampli<span>fy</span></a>
        <ul className="nav-links">
          <li><a href="/#how">How it works</a></li>
          <li><a href="/#pricing">Pricing</a></li>
          <li><a href="/apply">Join as creator</a></li>
        </ul>
        <button className="nav-cta">Launch campaign</button>
      </nav>

      <div className="page-hero">
        <div className="section-tag">Creator network</div>
        <h1>Browse our creator network</h1>
        <p>Explore approved creators across platforms. Every creator is vetted by our team and ready to partner with the right brand.</p>
      </div>

      <div className="page">
        {/* Filters */}
        <div className="filters">
          <div className="search-wrap">
            <span className="search-ico">⌕</span>
            <input className="search-input" placeholder="Search creators, niches, types…" value={search} onChange={e=>setSearch(e.target.value)}/>
          </div>
          <select className="fselect" value={niche} onChange={e=>setNiche(e.target.value)}>
            {NICHE_OPTIONS.map(n=><option key={n}>{n}</option>)}
          </select>
          <select className="fselect" value={reach} onChange={e=>setReach(e.target.value)}>
            {REACH_OPTIONS.map(r=><option key={r}>{r}</option>)}
          </select>
          <div className="result-count">{filtered.length} creator{filtered.length!==1?'s':''}</div>
        </div>

        {loading ? (
          <div className="loading">Loading creators…</div>
        ) : filtered.length === 0 ? (
          <div className="empty">No creators match your filters.</div>
        ) : (
          <div className="creator-grid">
            {filtered.map(c=>(
              <div className="creator-card" key={c.id} onClick={()=>setSelected(c)}>
                <div className="card-top">
                  <div className="card-avatar" style={{background:avatarColor(c.id)}}>{initials(c)}</div>
                  <div className="card-head">
                    <div className="card-name">{c.first_name} {c.last_name}</div>
                    <div className="card-type">{c.creator_type||'Creator'}</div>
                    {c.location && <div className="card-loc">📍 {c.location}</div>}
                  </div>
                </div>
                {c.bio && <p className="card-bio">{c.bio.slice(0,120)}{c.bio.length>120?'…':''}</p>}
                <div className="card-meta">
                  {c.follower_range && <div className="meta-item"><span className="meta-key">Reach</span><span className="meta-val">{c.follower_range}</span></div>}
                  {c.rate_range && <div className="meta-item"><span className="meta-key">Rate</span><span className="meta-val">{c.rate_range}</span></div>}
                </div>
                <div className="card-tags">
                  {(c.niches||[]).slice(0,3).map(n=><span className="ntag" key={n}>{n}</span>)}
                </div>
                <div className="card-plats">
                  {(c.platforms||[]).slice(0,4).map(p=><span className="ptag" key={p}>{p}</span>)}
                  {(c.platforms||[]).length>4 && <span className="ptag">+{c.platforms.length-4}</span>}
                </div>
                <button className="card-cta">View profile →</button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Profile drawer */}
      {selected && (
        <div className="modal-bg" onClick={()=>setSelected(null)}>
          <div className="modal" onClick={e=>e.stopPropagation()}>
            <div className="modal-header">
              <div style={{display:'flex',alignItems:'center',gap:'1rem'}}>
                <div className="modal-avatar" style={{background:avatarColor(selected.id)}}>{initials(selected)}</div>
                <div>
                  <div className="modal-name">{selected.first_name} {selected.last_name}</div>
                  <div className="modal-type">{selected.creator_type}</div>
                </div>
              </div>
              <button className="modal-close" onClick={()=>setSelected(null)}>✕</button>
            </div>
            <div className="modal-body">
              {selected.bio && <p className="profile-bio">{selected.bio}</p>}
              <div className="msec-title">Reach & rates</div>
              <div className="mrow"><span className="mkey">Primary platform</span><span className="mval">{selected.primary_platform||'—'}</span></div>
              <div className="mrow"><span className="mkey">Follower range</span><span className="mval">{selected.follower_range||'—'}</span></div>
              <div className="mrow"><span className="mkey">Engagement rate</span><span className="mval">{selected.engagement_rate ? `${selected.engagement_rate}%` : '—'}</span></div>
              <div className="mrow"><span className="mkey">Typical rate</span><span className="mval">{selected.rate_range||'—'}</span></div>
              <div className="mrow"><span className="mkey">Location</span><span className="mval">{selected.location||'—'}</span></div>
              <div className="msec-title" style={{marginTop:'1.25rem'}}>Platforms</div>
              <div className="plat-wrap">{(selected.platforms||[]).map(p=><span className="plat-pill" key={p}>{p}</span>)}</div>
              <div className="msec-title" style={{marginTop:'1.25rem'}}>Niches</div>
              <div className="plat-wrap">{(selected.niches||[]).map(n=><span className="niche-pill" key={n}>{n}</span>)}</div>
              {selected.profile_link && (
                <div style={{marginTop:'1.5rem'}}>
                  <a href={selected.profile_link} target="_blank" rel="noreferrer" className="profile-link-btn">View profile / media kit →</a>
                </div>
              )}
            </div>
            <div className="modal-actions">
              <button className="ma-primary" onClick={()=>window.location.href='/#pricing'}>Start a campaign with this creator</button>
              <button className="ma-ghost" onClick={()=>setSelected(null)}>Close</button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .nav{display:flex;justify-content:space-between;align-items:center;padding:1.25rem 3rem;border-bottom:1px solid var(--cream3);background:var(--cream);position:sticky;top:0;z-index:100}
        .logo{font-family:'DM Serif Display',serif;font-size:1.5rem;color:var(--accent);text-decoration:none}
        .logo span{color:var(--gold)}
        .nav-links{display:flex;gap:2rem;list-style:none;align-items:center}
        .nav-links a{text-decoration:none;color:var(--ink2);font-size:0.875rem}
        .nav-links a:hover{color:var(--accent)}
        .nav-cta{background:var(--accent);color:#fff;padding:0.6rem 1.4rem;border-radius:2rem;font-size:0.875rem;font-weight:500;border:none;cursor:pointer}
        .page-hero{background:var(--accent);padding:3.5rem 3rem 3rem;color:#fff;text-align:center}
        .section-tag{font-size:0.7rem;font-weight:500;letter-spacing:0.1em;text-transform:uppercase;color:var(--accent3);margin-bottom:0.75rem}
        .page-hero h1{font-family:'DM Serif Display',serif;font-size:2.5rem;color:#fff;margin-bottom:0.75rem}
        .page-hero p{font-size:0.95rem;color:rgba(255,255,255,0.65);max-width:500px;margin:0 auto;line-height:1.7;font-weight:300}
        .page{max-width:1200px;margin:0 auto;padding:2.5rem 3rem 4rem}
        .filters{display:flex;gap:0.75rem;align-items:center;margin-bottom:2rem;flex-wrap:wrap}
        .search-wrap{position:relative;flex:1;min-width:200px}
        .search-ico{position:absolute;left:0.75rem;top:50%;transform:translateY(-50%);color:var(--ink3);font-size:14px}
        .search-input{padding:0.6rem 0.875rem 0.6rem 2.25rem;border-radius:2rem;border:1px solid var(--cream3);background:#fff;font-size:0.85rem;color:var(--ink);font-family:'DM Sans',sans-serif;width:100%;outline:none}
        .search-input:focus{border-color:var(--accent)}
        .fselect{padding:0.6rem 1rem;border-radius:2rem;border:1px solid var(--cream3);background:#fff;font-size:0.85rem;color:var(--ink);font-family:'DM Sans',sans-serif;outline:none;cursor:pointer}
        .result-count{font-size:0.8rem;color:var(--ink3);white-space:nowrap;margin-left:0.25rem}
        .loading,.empty{text-align:center;color:var(--ink3);padding:3rem;font-size:0.9rem}
        .creator-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:1.5rem}
        .creator-card{background:#fff;border:1px solid var(--cream3);border-radius:1.25rem;padding:1.5rem;cursor:pointer;transition:border-color 0.2s}
        .creator-card:hover{border-color:var(--accent3)}
        .card-top{display:flex;align-items:flex-start;gap:0.875rem;margin-bottom:1rem}
        .card-avatar{width:44px;height:44px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:0.8rem;font-weight:500;color:#fff;flex-shrink:0}
        .card-name{font-weight:500;font-size:0.95rem;color:var(--ink)}
        .card-type{font-size:0.78rem;color:var(--ink3);margin-top:1px}
        .card-loc{font-size:0.72rem;color:var(--ink3);margin-top:3px}
        .card-bio{font-size:0.82rem;color:var(--ink2);line-height:1.6;margin-bottom:1rem;font-weight:300}
        .card-meta{display:flex;gap:1rem;margin-bottom:0.875rem}
        .meta-item{display:flex;flex-direction:column;gap:2px}
        .meta-key{font-size:0.68rem;color:var(--ink3);text-transform:uppercase;letter-spacing:0.06em}
        .meta-val{font-size:0.82rem;font-weight:500;color:var(--ink)}
        .card-tags{display:flex;flex-wrap:wrap;gap:4px;margin-bottom:0.5rem}
        .ntag{background:#e8f3ed;color:var(--accent);border:1px solid var(--accent3);border-radius:2rem;padding:2px 8px;font-size:0.7rem;font-weight:500}
        .card-plats{display:flex;flex-wrap:wrap;gap:4px;margin-bottom:1rem}
        .ptag{background:var(--cream2);color:var(--ink2);border:1px solid var(--cream3);border-radius:2rem;padding:2px 8px;font-size:0.68rem}
        .card-cta{width:100%;padding:0.65rem;border-radius:2rem;border:1px solid var(--accent);background:none;color:var(--accent);font-size:0.82rem;font-weight:500;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all 0.2s}
        .card-cta:hover{background:var(--accent);color:#fff}
        /* Modal */
        .modal-bg{position:fixed;inset:0;background:rgba(15,13,11,0.55);display:flex;align-items:flex-start;justify-content:flex-end;z-index:200}
        .modal{background:var(--cream);width:460px;height:100vh;overflow-y:auto;display:flex;flex-direction:column}
        .modal-header{background:var(--accent);padding:1.75rem 2rem;display:flex;justify-content:space-between;align-items:center;flex-shrink:0}
        .modal-avatar{width:48px;height:48px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:0.85rem;font-weight:500;color:#fff}
        .modal-name{font-family:'DM Serif Display',serif;font-size:1.35rem;color:#fff}
        .modal-type{font-size:0.8rem;color:var(--accent3);margin-top:2px}
        .modal-close{background:rgba(255,255,255,0.15);border:none;color:#fff;width:30px;height:30px;border-radius:50%;cursor:pointer;font-size:1rem;display:flex;align-items:center;justify-content:center}
        .modal-body{padding:1.5rem 2rem;flex:1}
        .profile-bio{font-size:0.88rem;color:var(--ink2);line-height:1.7;font-weight:300;margin-bottom:1.25rem;padding-bottom:1.25rem;border-bottom:1px solid var(--cream3)}
        .msec-title{font-size:0.7rem;font-weight:500;letter-spacing:0.08em;text-transform:uppercase;color:var(--gold3);margin-bottom:0.75rem}
        .mrow{display:flex;justify-content:space-between;margin-bottom:0.5rem}
        .mkey{font-size:0.78rem;color:var(--ink3)}
        .mval{font-size:0.82rem;color:var(--ink);font-weight:500}
        .plat-wrap{display:flex;flex-wrap:wrap;gap:0.4rem}
        .plat-pill{background:var(--cream2);color:var(--ink2);border:1px solid var(--cream3);border-radius:2rem;padding:3px 10px;font-size:0.75rem}
        .niche-pill{background:#e8f3ed;color:var(--accent);border:1px solid var(--accent3);border-radius:2rem;padding:3px 10px;font-size:0.75rem}
        .profile-link-btn{display:inline-block;font-size:0.85rem;color:var(--accent);font-weight:500;text-decoration:none}
        .modal-actions{padding:1.25rem 2rem;border-top:1px solid var(--cream3);display:flex;flex-direction:column;gap:0.6rem;flex-shrink:0}
        .ma-primary{padding:0.8rem;border-radius:2rem;background:var(--accent);color:#fff;border:none;font-size:0.875rem;font-weight:500;cursor:pointer;font-family:'DM Sans',sans-serif}
        .ma-ghost{padding:0.8rem;border-radius:2rem;background:none;color:var(--ink2);border:1px solid var(--cream3);font-size:0.875rem;cursor:pointer;font-family:'DM Sans',sans-serif}
      `}</style>
    </>
  )
}
