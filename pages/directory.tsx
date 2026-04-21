import Head from 'next/head'
import { useState, useEffect } from 'react'

const AVATAR_COLORS = ['#1a3a2a','#7a6022','#4a1528','#185FA5','#3B6D11','#993C1D','#534AB7','#085041']

export default function Directory() {
  const [creators, setCreators] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [niche, setNiche] = useState('All')
  const [selected, setSelected] = useState(null)
  const [showPaywall, setShowPaywall] = useState(false)

  useEffect(() => {
    fetch('/api/creators?status=approved')
      .then(r => r.json())
      .then(d => { setCreators(Array.isArray(d) ? d : []); setLoading(false) })
  }, [])

  const filtered = creators.filter(c => {
    const matchNiche = niche === 'All' || (c.niches||[]).includes(niche)
    const matchSearch = !search || `${c.first_name} ${c.last_name} ${c.creator_type} ${(c.niches||[]).join(' ')}`.toLowerCase().includes(search.toLowerCase())
    return matchNiche && matchSearch
  })

  const initials = c => `${c.first_name?.[0]||''}${c.last_name?.[0]||''}`
  const color = id => AVATAR_COLORS[parseInt((id||'0').replace(/\D/g,'').slice(0,3)||'0') % AVATAR_COLORS.length]

  const NICHES = ['All','Fashion','Beauty','Fitness & health','Food & drink','Travel','Tech','Finance','Business','Gaming','Sustainability','Entertainment']

  return (
    <>
      <Head><title>Creator Directory — Amplify</title></Head>
      <style>{`
        *{margin:0;padding:0;box-sizing:border-box}
        body{font-family:Inter,sans-serif;background:#0a0a0a;color:#fff}
        @media(max-width:768px){.grid{grid-template-columns:1fr!important}.filters{flex-wrap:wrap}}
      `}</style>

      <nav style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'1.25rem 2.5rem',borderBottom:'1px solid #333',background:'#0a0a0a',position:'sticky',top:0,zIndex:100}}>
        <a href="/" style={{fontFamily:'sans-serif',fontSize:'1.4rem',fontWeight:800,color:'#fff',textDecoration:'none'}}>AMPLI<span style={{color:'#c8f53a'}}>FY</span></a>
        <div style={{display:'flex',gap:'1rem',alignItems:'center'}}>
          <a href="/register" style={{color:'#888',fontSize:'0.85rem',textDecoration:'none'}}>Register</a>
          <a href="/#pricing" style={{background:'#c8f53a',color:'#0a0a0a',padding:'0.5rem 1.25rem',borderRadius:'2rem',fontSize:'0.85rem',fontWeight:700,textDecoration:'none'}}>Launch campaign</a>
        </div>
      </nav>

      <div style={{background:'#111',borderBottom:'1px solid #333',padding:'3rem 2.5rem',textAlign:'center'}}>
        <div style={{fontSize:'0.72rem',color:'#c8f53a',letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:'0.75rem'}}>Creator network</div>
        <h1 style={{fontFamily:'sans-serif',fontSize:'2.5rem',fontWeight:800,letterSpacing:'-1px',marginBottom:'0.75rem'}}>Browse our creators</h1>
        <p style={{color:'#888',fontSize:'0.95rem',marginBottom:'2rem'}}>Free to browse. Pay to contact and launch a campaign.</p>
        <div className="filters" style={{display:'flex',gap:'0.75rem',justifyContent:'center',flexWrap:'wrap'}}>
          <div style={{position:'relative'}}>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search creators…" style={{padding:'0.6rem 1rem 0.6rem 2.25rem',borderRadius:'2rem',border:'1px solid #333',background:'#0a0a0a',color:'#fff',fontSize:'0.85rem',outline:'none',width:'220px'}}/>
            <span style={{position:'absolute',left:'0.75rem',top:'50%',transform:'translateY(-50%)',color:'#555'}}>⌕</span>
          </div>
          <select value={niche} onChange={e=>setNiche(e.target.value)} style={{padding:'0.6rem 1rem',borderRadius:'2rem',border:'1px solid #333',background:'#0a0a0a',color:'#fff',fontSize:'0.85rem',outline:'none'}}>
            {NICHES.map(n=><option key={n}>{n}</option>)}
          </select>
        </div>
      </div>

      <div style={{maxWidth:'1200px',margin:'0 auto',padding:'2.5rem'}}>
        {loading ? <div style={{textAlign:'center',color:'#555',padding:'4rem'}}>Loading creators…</div> :
        filtered.length === 0 ? <div style={{textAlign:'center',color:'#555',padding:'4rem'}}>No creators found.</div> : (
          <div className="grid" style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:'1.25rem'}}>
            {filtered.map(c => (
              <div key={c.id} onClick={()=>setSelected(c)} style={{background:'#111',border:'1px solid #333',borderRadius:'1rem',padding:'1.5rem',cursor:'pointer',transition:'border-color 0.2s'}} onMouseOver={e=>e.currentTarget.style.borderColor='#c8f53a'} onMouseOut={e=>e.currentTarget.style.borderColor='#333'}>
                <div style={{display:'flex',alignItems:'center',gap:'0.875rem',marginBottom:'1rem'}}>
                  <div style={{width:'44px',height:'44px',borderRadius:'50%',background:color(c.id),display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontSize:'0.85rem',flexShrink:0}}>{initials(c)}</div>
                  <div>
                    <div style={{fontWeight:700,fontSize:'0.95rem'}}>{c.first_name} {c.last_name}</div>
                    <div style={{fontSize:'0.75rem',color:'#888'}}>{c.creator_type||'Creator'}</div>
                  </div>
                </div>
                {c.bio && <p style={{fontSize:'0.82rem',color:'#888',lineHeight:1.6,marginBottom:'1rem'}}>{c.bio.slice(0,100)}{c.bio.length>100?'…':''}</p>}
                <div style={{display:'flex',gap:'0.4rem',flexWrap:'wrap',marginBottom:'0.75rem'}}>
                  {(c.niches||[]).slice(0,3).map(n=><span key={n} style={{background:'rgba(200,245,58,0.08)',color:'#c8f53a',border:'1px solid rgba(200,245,58,0.2)',borderRadius:'2rem',padding:'2px 8px',fontSize:'0.68rem'}}>{n}</span>)}
                </div>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                  <span style={{fontSize:'0.78rem',fontWeight:600,color:'#fff'}}>{c.follower_range||'—'}</span>
                  <span style={{fontSize:'0.75rem',color:'#555'}}>{c.location||''}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selected && !showPaywall && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.7)',display:'flex',alignItems:'flex-start',justifyContent:'flex-end',zIndex:200}} onClick={()=>setSelected(null)}>
          <div style={{background:'#111',width:'420px',height:'100vh',overflowY:'auto',display:'flex',flexDirection:'column'}} onClick={e=>e.stopPropagation()}>
            <div style={{background:'#1a1a1a',padding:'1.75rem 2rem',borderBottom:'1px solid #333',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div style={{display:'flex',alignItems:'center',gap:'1rem'}}>
                <div style={{width:'48px',height:'48px',borderRadius:'50%',background:color(selected.id),display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700}}>{initials(selected)}</div>
                <div>
                  <div style={{fontFamily:'sans-serif',fontSize:'1.1rem',fontWeight:800}}>{selected.first_name} {selected.last_name}</div>
                  <div style={{fontSize:'0.78rem',color:'#888'}}>{selected.creator_type}</div>
                </div>
              </div>
              <button onClick={()=>setSelected(null)} style={{background:'rgba(255,255,255,0.1)',border:'none',color:'#fff',width:'30px',height:'30px',borderRadius:'50%',cursor:'pointer',fontSize:'1rem'}}>✕</button>
            </div>
            <div style={{padding:'1.5rem 2rem',flex:1}}>
              {selected.bio && <p style={{color:'#888',lineHeight:1.7,fontSize:'0.875rem',marginBottom:'1.5rem',paddingBottom:'1.5rem',borderBottom:'1px solid #333'}}>{selected.bio}</p>}
              {[['Platforms',(selected.platforms||[]).join(', ')||'—'],['Reach',selected.follower_range||'—'],['Engagement',selected.engagement_rate?`${selected.engagement_rate}%`:'—'],['Niches',(selected.niches||[]).join(', ')||'—'],['Location',selected.location||'—'],['Rate',selected.rate_range||'—']].map(([k,v])=>(
                <div key={k} style={{display:'flex',justifyContent:'space-between',padding:'0.6rem 0',borderBottom:'1px solid #1a1a1a'}}>
                  <span style={{fontSize:'0.78rem',color:'#555'}}>{k}</span>
                  <span style={{fontSize:'0.82rem',color:'#fff',textAlign:'right',flex:1,marginLeft:'1rem'}}>{v}</span>
                </div>
              ))}
            </div>
            <div style={{padding:'1.5rem 2rem',borderTop:'1px solid #333'}}>
              <div style={{background:'rgba(200,245,58,0.06)',border:'1px solid rgba(200,245,58,0.2)',borderRadius:'0.75rem',padding:'1rem',marginBottom:'1rem',fontSize:'0.82rem',color:'#888',lineHeight:1.6}}>
                🔒 Contact details and direct messaging are available to paying campaign subscribers.
              </div>
              <button onClick={()=>setShowPaywall(true)} style={{width:'100%',background:'#c8f53a',color:'#0a0a0a',border:'none',padding:'0.875rem',borderRadius:'2rem',fontSize:'0.9rem',fontWeight:700,cursor:'pointer',marginBottom:'0.75rem'}}>
                Unlock & send proposal →
              </button>
              <button onClick={()=>setSelected(null)} style={{width:'100%',background:'none',border:'1px solid #333',color:'#888',padding:'0.75rem',borderRadius:'2rem',fontSize:'0.875rem',cursor:'pointer'}}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {showPaywall && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.8)',display:'flex',alignItems:'center',justifyContent:'center',zIndex:300}} onClick={()=>setShowPaywall(false)}>
          <div style={{background:'#111',border:'1px solid #333',borderRadius:'1.5rem',padding:'2.5rem',maxWidth:'480px',width:'90%',textAlign:'center'}} onClick={e=>e.stopPropagation()}>
            <div style={{fontSize:'2rem',marginBottom:'1rem'}}>🚀</div>
            <h2 style={{fontFamily:'sans-serif',fontSize:'1.5rem',fontWeight:800,marginBottom:'0.75rem'}}>Launch a campaign</h2>
            <p style={{color:'#888',lineHeight:1.7,marginBottom:'2rem',fontSize:'0.9rem'}}>To contact {selected?.first_name} and send a campaign proposal, start a campaign. Starting at $499.</p>
            <div style={{display:'flex',gap:'1rem',justifyContent:'center'}}>
              <button onClick={()=>window.location.href='/#pricing'} style={{background:'#c8f53a',color:'#0a0a0a',border:'none',padding:'0.875rem 2rem',borderRadius:'2rem',fontSize:'0.9rem',fontWeight:700,cursor:'pointer'}}>
                See pricing →
              </button>
              <button onClick={()=>setShowPaywall(false)} style={{background:'none',border:'1px solid #333',color:'#888',padding:'0.875rem 1.5rem',borderRadius:'2rem',fontSize:'0.875rem',cursor:'pointer'}}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
