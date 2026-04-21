import Head from 'next/head'
import { useState, useEffect } from 'react'

export default function CreatorDashboard() {
  const [tab, setTab] = useState('proposals')
  const [profile, setProfile] = useState({ name:'Your Name', type:'Creator', platforms:['Instagram','TikTok'], niches:['Fashion','Beauty'], followers:'50K–250K' })

  return (
    <>
      <Head><title>Creator Dashboard — Amplify</title></Head>
      <style>{`*{margin:0;padding:0;box-sizing:border-box}body{font-family:Inter,sans-serif;background:#0a0a0a;color:#fff}`}</style>

      <nav style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'1rem 2rem',borderBottom:'1px solid #333',background:'#0a0a0a',position:'sticky',top:0,zIndex:100}}>
        <a href="/" style={{fontFamily:'sans-serif',fontSize:'1.2rem',fontWeight:800,color:'#fff',textDecoration:'none'}}>AMPLI<span style={{color:'#c8f53a'}}>FY</span></a>
        <div style={{display:'flex',gap:'0.5rem'}}>
          {['proposals','profile','earnings'].map(t=>(
            <button key={t} onClick={()=>setTab(t)} style={{padding:'0.5rem 1rem',borderRadius:'2rem',border:'1px solid',borderColor:tab===t?'#c8f53a':'#333',background:tab===t?'rgba(200,245,58,0.1)':'none',color:tab===t?'#c8f53a':'#888',fontSize:'0.8rem',cursor:'pointer',textTransform:'capitalize'}}>
              {t}
            </button>
          ))}
        </div>
        <div style={{width:'36px',height:'36px',borderRadius:'50%',background:'#1a3a2a',display:'flex',alignItems:'center',justifyContent:'center',fontWeight:700,fontSize:'0.8rem',color:'#c8f53a'}}>YN</div>
      </nav>

      <div style={{maxWidth:'900px',margin:'0 auto',padding:'2rem'}}>

        {tab==='proposals' && (
          <div>
            <h1 style={{fontFamily:'sans-serif',fontSize:'1.75rem',fontWeight:800,marginBottom:'0.5rem'}}>Campaign proposals</h1>
            <p style={{color:'#888',fontSize:'0.875rem',marginBottom:'2rem'}}>Brands that want to work with you will send proposals here.</p>

            <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'1rem',marginBottom:'2rem'}}>
              {[['0','New proposals'],['0','Active campaigns'],['$0','Total earned']].map(([n,l])=>(
                <div key={l} style={{background:'#111',border:'1px solid #333',borderRadius:'1rem',padding:'1.25rem'}}>
                  <div style={{fontFamily:'sans-serif',fontSize:'1.75rem',fontWeight:800,color:'#c8f53a'}}>{n}</div>
                  <div style={{fontSize:'0.78rem',color:'#888',marginTop:'0.25rem'}}>{l}</div>
                </div>
              ))}
            </div>

            <div style={{background:'#111',border:'1px solid #333',borderRadius:'1rem',padding:'3rem',textAlign:'center'}}>
              <div style={{fontSize:'2rem',marginBottom:'1rem'}}>📬</div>
              <h3 style={{fontFamily:'sans-serif',fontSize:'1.1rem',fontWeight:700,marginBottom:'0.5rem'}}>No proposals yet</h3>
              <p style={{color:'#888',fontSize:'0.875rem',lineHeight:1.7,maxWidth:'360px',margin:'0 auto'}}>Once your profile is approved, brands will be able to find you and send campaign proposals. Make sure your profile is complete!</p>
              <button onClick={()=>setTab('profile')} style={{marginTop:'1.5rem',background:'#c8f53a',color:'#0a0a0a',border:'none',padding:'0.75rem 1.5rem',borderRadius:'2rem',fontSize:'0.875rem',fontWeight:700,cursor:'pointer'}}>Complete your profile →</button>
            </div>
          </div>
        )}

        {tab==='profile' && (
          <div>
            <h1 style={{fontFamily:'sans-serif',fontSize:'1.75rem',fontWeight:800,marginBottom:'0.5rem'}}>Your profile</h1>
            <p style={{color:'#888',fontSize:'0.875rem',marginBottom:'2rem'}}>This is what brands see when they browse the creator directory.</p>

            <div style={{background:'#111',border:'1px solid #333',borderRadius:'1rem',overflow:'hidden',marginBottom:'1.5rem'}}>
              <div style={{background:'#1a3a2a',padding:'2rem',display:'flex',alignItems:'center',gap:'1.5rem'}}>
                <div style={{width:'64px',height:'64px',borderRadius:'50%',background:'#c8f53a',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:'sans-serif',fontSize:'1.5rem',fontWeight:800,color:'#0a0a0a',flexShrink:0}}>YN</div>
                <div>
                  <div style={{fontFamily:'sans-serif',fontSize:'1.25rem',fontWeight:800,color:'#fff'}}>Your Name</div>
                  <div style={{fontSize:'0.82rem',color:'#a8d4be',marginTop:'2px'}}>Creator · Pending approval</div>
                </div>
                <div style={{marginLeft:'auto'}}><span style={{background:'rgba(200,245,58,0.1)',color:'#c8f53a',border:'1px solid rgba(200,245,58,0.3)',borderRadius:'2rem',padding:'4px 12px',fontSize:'0.72rem',fontWeight:600}}>Pending review</span></div>
              </div>
              <div style={{padding:'1.5rem 2rem'}}>
                {[['Creator type','Social media influencer'],['Platforms','Instagram, TikTok'],['Niches','Fashion, Beauty'],['Follower range','50K–250K'],['Engagement rate','—'],['Typical rate','—'],['Location','—']].map(([k,v])=>(
                  <div key={k} style={{display:'flex',justifyContent:'space-between',padding:'0.6rem 0',borderBottom:'1px solid #1a1a1a'}}>
                    <span style={{fontSize:'0.78rem',color:'#555'}}>{k}</span>
                    <span style={{fontSize:'0.82rem',color:'#fff'}}>{v}</span>
                  </div>
                ))}
              </div>
            </div>

            <div style={{background:'rgba(200,245,58,0.06)',border:'1px solid rgba(200,245,58,0.2)',borderRadius:'1rem',padding:'1.25rem',display:'flex',gap:'1rem',alignItems:'flex-start'}}>
              <span style={{fontSize:'1.25rem',flexShrink:0}}>💡</span>
              <div>
                <div style={{fontWeight:600,fontSize:'0.875rem',marginBottom:'0.35rem'}}>Complete your profile to get discovered</div>
                <div style={{fontSize:'0.82rem',color:'#888',lineHeight:1.6}}>Add your bio, engagement rate, and media kit link to stand out to brands. Profiles with photos and detailed niches get 3x more proposals.</div>
              </div>
            </div>
          </div>
        )}

        {tab==='earnings' && (
          <div>
            <h1 style={{fontFamily:'sans-serif',fontSize:'1.75rem',fontWeight:800,marginBottom:'0.5rem'}}>Earnings</h1>
            <p style={{color:'#888',fontSize:'0.875rem',marginBottom:'2rem'}}>Track your campaign earnings and payment history.</p>
            <div style={{background:'#111',border:'1px solid #333',borderRadius:'1rem',padding:'3rem',textAlign:'center'}}>
              <div style={{fontSize:'2rem',marginBottom:'1rem'}}>💰</div>
              <p style={{color:'#888'}}>No earnings yet. Complete campaigns to start earning.</p>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
