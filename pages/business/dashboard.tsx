import Head from 'next/head'
import { useState, useEffect } from 'react'

const AVATAR_COLORS = ['#1a3a2a','#7a6022','#4a1528','#185FA5','#3B6D11','#993C1D','#534AB7','#085041']

export default function BusinessDashboard() {
  const [creators, setCreators] = useState([])
  const [proposals, setProposals] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('browse')
  const [selected, setSelected] = useState(null)
  const [showProposal, setShowProposal] = useState(false)
  const [proposal, setProposal] = useState({ title:'', description:'', budget:'', platforms:[] })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)

  useEffect(() => {
    fetch('/api/creators?status=approved')
      .then(r=>r.json()).then(d=>{ setCreators(Array.isArray(d)?d:[]); setLoading(false) })
  }, [])

  const initials = c => `${c.first_name?.[0]||''}${c.last_name?.[0]||''}`
  const color = id => AVATAR_COLORS[parseInt((id||'0').replace(/\D/g,'').slice(0,3)||'0') % AVATAR_COLORS.length]

  async function sendProposal() {
    setSending(true)
    try {
      const res = await fetch('/api/proposals', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({...proposal, creator_id: selected?.id})
      })
      if (res.ok) { setSent(true); setShowProposal(false) }
    } catch(e) { alert('Failed to send proposal') }
    finally { setSending(false) }
  }

  return (
    <>
      <Head><title>Business Dashboard — Amplify</title></Head>
      <style>{`*{margin:0;padding:0;box-sizing:border-box}body{font-family:Inter,sans-serif;background:#0a0a0a;color:#fff}`}</style>

      <nav style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'1rem 2rem',borderBottom:'1px solid #333',background:'#0a0a0a',position:'sticky',top:0,zIndex:100}}>
        <a href="/" style={{fontFamily:'sans-serif',fontSize:'1.2rem',fontWeight:800,color:'#fff',textDecoration:'none'}}>AMPLI<span style={{color:'#c8f53a'}}>FY</span></a>
        <div style={{display:'flex',gap:'0.5rem'}}>
          {['browse','proposals','campaigns'].map(t=>(
            <button key={t} onClick={()=>setTab(t)} style={{padding:'0.5rem 1rem',borderRadius:'2rem',border:'1px solid',borderColor:tab===t?'#c8f53a':'#333',background:tab===t?'rgba(200,245,58,0.1)':'none',color:tab===t?'#c8f53a':'#888',fontSize:'0.8rem',cursor:'pointer',textTransform:'capitalize'}}>
              {t}
            </button>
          ))}
        </div>
        <a href="/#pricing" style={{background:'#c8f53a',color:'#0a0a0a',padding:'0.5rem 1.25rem',borderRadius:'2rem',fontSize:'0.82rem',fontWeight:700,textDecoration:'none'}}>Launch campaign</a>
      </nav>

      <div style={{maxWidth:'1200px',margin:'0 auto',padding:'2rem'}}>

        {tab==='browse' && (
          <>
            <div style={{marginBottom:'2rem'}}>
              <h1 style={{fontFamily:'sans-serif',fontSize:'1.75rem',fontWeight:800,marginBottom:'0.5rem'}}>Browse creators</h1>
              <p style={{color:'#888',fontSize:'0.875rem'}}>Click any creator to view their profile and send a campaign proposal.</p>
            </div>
            {loading ? <div style={{textAlign:'center',color:'#555',padding:'4rem'}}>Loading…</div> : (
              <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(280px,1fr))',gap:'1rem'}}>
                {creators.map(c=>(
                  <div key={c.id} onClick={()=>{setSelected(c);setShowProposal(false);setSent(false)}} style={{background:'#111',border:'1px solid #333',borderRadius:'1rem',padding:'1.5rem',cursor:'pointer'}} onMouseOver={e=>e.currentTarget.style.borderColor='#c8f53a'} onMouseOut={e=>e.currentTarget.style.borderColor='#333'}>
                    <div style={{display:'flex',alignItems:'center',gap:'0.75rem',marginBottom:'0.875rem'}}>
                      <div style={{width:'40px',height:'40px',borderRadius:'50%',background:color(c.id),display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontSize:'0.8rem',flexShrink:0}}>{initials(c)}</div>
                      <div>
                        <div style={{fontWeight:600,fontSize:'0.9rem'}}>{c.first_name} {c.last_name}</div>
                        <div style={{fontSize:'0.72rem',color:'#888'}}>{c.creator_type}</div>
                      </div>
                    </div>
                    <div style={{display:'flex',gap:'0.4rem',flexWrap:'wrap',marginBottom:'0.75rem'}}>
                      {(c.niches||[]).slice(0,3).map(n=><span key={n} style={{background:'rgba(200,245,58,0.08)',color:'#c8f53a',border:'1px solid rgba(200,245,58,0.2)',borderRadius:'2rem',padding:'2px 8px',fontSize:'0.65rem'}}>{n}</span>)}
                    </div>
                    <div style={{display:'flex',justifyContent:'space-between',fontSize:'0.78rem'}}>
                      <span style={{color:'#fff',fontWeight:600}}>{c.follower_range||'—'}</span>
                      <span style={{color:'#555'}}>{(c.platforms||[]).slice(0,2).join(', ')}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {tab==='proposals' && (
          <div>
            <h1 style={{fontFamily:'sans-serif',fontSize:'1.75rem',fontWeight:800,marginBottom:'0.5rem'}}>Your proposals</h1>
            <p style={{color:'#888',fontSize:'0.875rem',marginBottom:'2rem'}}>Track the status of your campaign proposals.</p>
            <div style={{background:'#111',border:'1px solid #333',borderRadius:'1rem',padding:'3rem',textAlign:'center'}}>
              <div style={{fontSize:'2rem',marginBottom:'1rem'}}>📋</div>
              <p style={{color:'#888'}}>No proposals yet. Browse creators and send your first proposal!</p>
              <button onClick={()=>setTab('browse')} style={{marginTop:'1.5rem',background:'#c8f53a',color:'#0a0a0a',border:'none',padding:'0.75rem 1.5rem',borderRadius:'2rem',fontSize:'0.875rem',fontWeight:700,cursor:'pointer'}}>Browse creators →</button>
            </div>
          </div>
        )}

        {tab==='campaigns' && (
          <div>
            <h1 style={{fontFamily:'sans-serif',fontSize:'1.75rem',fontWeight:800,marginBottom:'0.5rem'}}>Your campaigns</h1>
            <p style={{color:'#888',fontSize:'0.875rem',marginBottom:'2rem'}}>Manage your active and past campaigns.</p>
            <div style={{background:'#111',border:'1px solid #333',borderRadius:'1rem',padding:'3rem',textAlign:'center'}}>
              <div style={{fontSize:'2rem',marginBottom:'1rem'}}>🚀</div>
              <p style={{color:'#888'}}>No campaigns yet. Launch your first campaign to get started.</p>
              <button onClick={()=>window.location.href='/#pricing'} style={{marginTop:'1.5rem',background:'#c8f53a',color:'#0a0a0a',border:'none',padding:'0.75rem 1.5rem',borderRadius:'2rem',fontSize:'0.875rem',fontWeight:700,cursor:'pointer'}}>Launch campaign →</button>
            </div>
          </div>
        )}
      </div>

      {selected && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.7)',display:'flex',alignItems:'flex-start',justifyContent:'flex-end',zIndex:200}} onClick={()=>setSelected(null)}>
          <div style={{background:'#111',width:'440px',height:'100vh',overflowY:'auto',display:'flex',flexDirection:'column'}} onClick={e=>e.stopPropagation()}>
            <div style={{background:'#1a1a1a',padding:'1.5rem 2rem',borderBottom:'1px solid #333',display:'flex',justifyContent:'space-between',alignItems:'center'}}>
              <div style={{display:'flex',alignItems:'center',gap:'1rem'}}>
                <div style={{width:'44px',height:'44px',borderRadius:'50%',background:color(selected.id),display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700}}>{initials(selected)}</div>
                <div>
                  <div style={{fontWeight:800,fontSize:'1rem'}}>{selected.first_name} {selected.last_name}</div>
                  <div style={{fontSize:'0.75rem',color:'#888'}}>{selected.creator_type}</div>
                </div>
              </div>
              <button onClick={()=>setSelected(null)} style={{background:'rgba(255,255,255,0.1)',border:'none',color:'#fff',width:'28px',height:'28px',borderRadius:'50%',cursor:'pointer'}}>✕</button>
            </div>

            <div style={{padding:'1.5rem 2rem',flex:1}}>
              {selected.bio && <p style={{color:'#888',lineHeight:1.7,fontSize:'0.875rem',marginBottom:'1.5rem',paddingBottom:'1.5rem',borderBottom:'1px solid #222'}}>{selected.bio}</p>}
              {[['Email',selected.email],['Platforms',(selected.platforms||[]).join(', ')||'—'],['Reach',selected.follower_range||'—'],['Engagement',selected.engagement_rate?`${selected.engagement_rate}%`:'—'],['Niches',(selected.niches||[]).join(', ')||'—'],['Rate',selected.rate_range||'—'],['Location',selected.location||'—']].map(([k,v])=>(
                <div key={k} style={{display:'flex',justifyContent:'space-between',padding:'0.6rem 0',borderBottom:'1px solid #1a1a1a'}}>
                  <span style={{fontSize:'0.75rem',color:'#555'}}>{k}</span>
                  <span style={{fontSize:'0.82rem',color:k==='Email'?'#c8f53a':'#fff',textAlign:'right',flex:1,marginLeft:'1rem'}}>{v}</span>
                </div>
              ))}
              {selected.profile_link && <div style={{marginTop:'1rem'}}><a href={selected.profile_link} target="_blank" rel="noreferrer" style={{color:'#c8f53a',fontSize:'0.85rem'}}>View profile / media kit →</a></div>}
            </div>

            {!showProposal && !sent && (
              <div style={{padding:'1.5rem 2rem',borderTop:'1px solid #333'}}>
                <button onClick={()=>setShowProposal(true)} style={{width:'100%',background:'#c8f53a',color:'#0a0a0a',border:'none',padding:'0.875rem',borderRadius:'2rem',fontSize:'0.9rem',fontWeight:700,cursor:'pointer',marginBottom:'0.75rem'}}>
                  Send campaign proposal →
                </button>
              </div>
            )}

            {sent && (
              <div style={{padding:'1.5rem 2rem',borderTop:'1px solid #333',textAlign:'center'}}>
                <div style={{color:'#c8f53a',fontWeight:700,marginBottom:'0.5rem'}}>✓ Proposal sent!</div>
                <p style={{color:'#888',fontSize:'0.82rem'}}>We'll notify you when {selected.first_name} responds.</p>
              </div>
            )}

            {showProposal && (
              <div style={{padding:'1.5rem 2rem',borderTop:'1px solid #333'}}>
                <div style={{fontWeight:700,marginBottom:'1rem',fontSize:'0.9rem'}}>Campaign proposal</div>
                {[['Campaign title','title','text','e.g. Summer collection launch'],['Budget','budget','text','e.g. $500–$1,000']].map(([l,f,t,p])=>(
                  <div key={f} style={{marginBottom:'0.75rem'}}>
                    <label style={{fontSize:'0.75rem',color:'#888',display:'block',marginBottom:'0.35rem'}}>{l}</label>
                    <input type={t} value={proposal[f]} onChange={e=>setProposal(p=>({...p,[f]:e.target.value}))} placeholder={p} style={{width:'100%',padding:'0.6rem 0.875rem',borderRadius:'0.5rem',border:'1px solid #333',background:'#0a0a0a',color:'#fff',fontSize:'0.85rem',outline:'none'}}/>
                  </div>
                ))}
                <div style={{marginBottom:'0.75rem'}}>
                  <label style={{fontSize:'0.75rem',color:'#888',display:'block',marginBottom:'0.35rem'}}>Campaign description</label>
                  <textarea value={proposal.description} onChange={e=>setProposal(p=>({...p,description:e.target.value}))} placeholder="What do you want the creator to post? What's the campaign about?" style={{width:'100%',padding:'0.6rem 0.875rem',borderRadius:'0.5rem',border:'1px solid #333',background:'#0a0a0a',color:'#fff',fontSize:'0.85rem',outline:'none',minHeight:'80px',resize:'vertical',lineHeight:1.6}}/>
                </div>
                <div style={{display:'flex',gap:'0.75rem'}}>
                  <button onClick={sendProposal} disabled={sending} style={{flex:1,background:'#c8f53a',color:'#0a0a0a',border:'none',padding:'0.75rem',borderRadius:'2rem',fontSize:'0.875rem',fontWeight:700,cursor:'pointer'}}>
                    {sending?'Sending…':'Send proposal'}
                  </button>
                  <button onClick={()=>setShowProposal(false)} style={{background:'none',border:'1px solid #333',color:'#888',padding:'0.75rem 1rem',borderRadius:'2rem',fontSize:'0.875rem',cursor:'pointer'}}>Cancel</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  )
}
