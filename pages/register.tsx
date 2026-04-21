import Head from 'next/head'
import { useState } from 'react'
import { useRouter } from 'next/router'

const NICHES = ['Fashion','Beauty','Fitness & health','Food & drink','Travel','Tech','Finance','Parenting','Gaming','Home & design','Sustainability','Business','Entertainment','Sports','Pets','Wellness']
const PLATFORMS = ['Instagram','TikTok','YouTube','X / Twitter','Pinterest','LinkedIn','Substack','Blog / website','Podcast','Threads','Facebook','Twitch']
const INDUSTRIES = ['Restaurant & food','Retail & fashion','Beauty & wellness','Tech & software','Finance','Real estate','Entertainment','Sports & fitness','Travel & hospitality','Education','Healthcare','Other']

export default function Register() {
  const router = useRouter()
  const [type, setType] = useState<'business'|'creator'|null>(null)
  const [step, setStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  const [biz, setBiz] = useState({ name:'', email:'', phone:'', industry:'', website:'', description:'' })
  const [cre, setCre] = useState({ first_name:'', last_name:'', email:'', phone:'', location:'', creator_type:'', niches:[] as string[], platforms:[] as string[], primary_platform:'', follower_range:'', engagement_rate:'', profile_link:'', bio:'', rate_range:'', turnaround:'' })

  function setBizF(f: string, v: string) { setBiz((b:any) => ({...b,[f]:v})) }
  function setCreF(f: string, v: any) { setCre((c:any) => ({...c,[f]:v})) }
  function toggleArr(field: 'niches'|'platforms', val: string) {
    setCre((c:any) => ({...c,[field]: c[field].includes(val) ? c[field].filter((x:string)=>x!==val) : [...c[field],val]}))
  }

  async function submitBusiness() {
    setSubmitting(true); setError('')
    try {
      const res = await fetch('/api/register-business', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(biz) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setDone(true)
    } catch(e:any) { setError(e.message) }
    finally { setSubmitting(false) }
  }

  async function submitCreator() {
    setSubmitting(true); setError('')
    try {
      const res = await fetch('/api/apply', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(cre) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setDone(true)
    } catch(e:any) { setError(e.message) }
    finally { setSubmitting(false) }
  }

  return (
    <>
      <Head><title>Register — Amplify</title></Head>
      <nav style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'1.25rem 2.5rem',borderBottom:'1px solid #333',background:'#0a0a0a'}}>
        <a href="/" style={{fontFamily:'Syne,sans-serif',fontSize:'1.4rem',fontWeight:800,color:'#fff',textDecoration:'none'}}>AMPLI<span style={{color:'#c8f53a'}}>FY</span></a>
        <a href="/directory" style={{color:'#888',fontSize:'0.85rem',textDecoration:'none'}}>Browse creators</a>
      </nav>

      <div style={{background:'#0a0a0a',minHeight:'100vh',color:'#fff',padding:'4rem 1.5rem'}}>
        {done ? (
          <div style={{maxWidth:'500px',margin:'0 auto',textAlign:'center'}}>
            <div style={{width:'64px',height:'64px',borderRadius:'50%',background:'rgba(200,245,58,0.1)',border:'2px solid #c8f53a',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 1.5rem',fontSize:'1.75rem',color:'#c8f53a'}}>✓</div>
            <h1 style={{fontFamily:'Syne,sans-serif',fontSize:'2rem',fontWeight:800,marginBottom:'1rem'}}>You're registered!</h1>
            <p style={{color:'#888',lineHeight:1.7,marginBottom:'2rem'}}>
              {type==='business' ? "Welcome to Amplify! Browse our creator network and start sending proposals." : "Thanks for joining! Our team will review your profile within 3–5 days."}
            </p>
            {type==='business' && <button onClick={()=>router.push('/directory')} style={{background:'#c8f53a',color:'#0a0a0a',padding:'0.85rem 2rem',borderRadius:'2rem',fontSize:'0.9rem',fontWeight:700,border:'none',cursor:'pointer',fontFamily:'Syne,sans-serif'}}>Browse creators →</button>}
          </div>
        ) : !type ? (
          <div style={{maxWidth:'700px',margin:'0 auto'}}>
            <div style={{textAlign:'center',marginBottom:'3rem'}}>
              <div style={{fontSize:'0.72rem',color:'#c8f53a',letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:'0.75rem'}}>Get started</div>
              <h1 style={{fontFamily:'Syne,sans-serif',fontSize:'2.5rem',fontWeight:800,letterSpacing:'-1px',marginBottom:'1rem'}}>Join Amplify</h1>
              <p style={{color:'#888',fontSize:'1rem',lineHeight:1.7}}>Are you a business looking to advertise, or a creator looking to get paid?</p>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1px',background:'#333',border:'1px solid #333',borderRadius:'1rem',overflow:'hidden'}}>
              <div onClick={()=>setType('business')} style={{background:'#111',padding:'2.5rem',cursor:'pointer',transition:'background 0.2s'}}>
                <div style={{fontSize:'2rem',marginBottom:'1rem'}}>🏢</div>
                <h2 style={{fontFamily:'Syne,sans-serif',fontSize:'1.25rem',fontWeight:800,color:'#fff',marginBottom:'0.5rem'}}>I'm a business</h2>
                <p style={{color:'#888',fontSize:'0.85rem',lineHeight:1.65}}>Register free, browse creators, send campaign proposals and grow your brand.</p>
                <div style={{marginTop:'1.5rem',display:'inline-block',background:'#c8f53a',color:'#0a0a0a',padding:'0.6rem 1.25rem',borderRadius:'2rem',fontSize:'0.82rem',fontWeight:700,fontFamily:'Syne,sans-serif'}}>Register free →</div>
              </div>
              <div onClick={()=>setType('creator')} style={{background:'#111',padding:'2.5rem',cursor:'pointer',transition:'background 0.2s'}}>
                <div style={{fontSize:'2rem',marginBottom:'1rem'}}>✍️</div>
                <h2 style={{fontFamily:'Syne,sans-serif',fontSize:'1.25rem',fontWeight:800,color:'#fff',marginBottom:'0.5rem'}}>I'm a creator</h2>
                <p style={{color:'#888',fontSize:'0.85rem',lineHeight:1.65}}>Join our network free, get discovered by brands, and receive paid campaign proposals.</p>
                <div style={{marginTop:'1.5rem',display:'inline-block',background:'#111',color:'#c8f53a',padding:'0.6rem 1.25rem',borderRadius:'2rem',fontSize:'0.82rem',fontWeight:700,border:'1px solid #c8f53a',fontFamily:'Syne,sans-serif'}}>Apply free →</div>
              </div>
            </div>
          </div>
        ) : type==='business' ? (
          <div style={{maxWidth:'600px',margin:'0 auto'}}>
            <button onClick={()=>setType(null)} style={{background:'none',border:'none',color:'#888',cursor:'pointer',marginBottom:'2rem',fontSize:'0.875rem'}}>← Back</button>
            <div style={{fontSize:'0.72rem',color:'#c8f53a',letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:'0.75rem'}}>Business registration</div>
            <h1 style={{fontFamily:'Syne,sans-serif',fontSize:'2rem',fontWeight:800,marginBottom:'2rem',letterSpacing:'-0.5px'}}>Tell us about your business</h1>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem',marginBottom:'1rem'}}>
              <div style={{display:'flex',flexDirection:'column',gap:'0.4rem'}}>
                <label style={{fontSize:'0.8rem',color:'#888',fontWeight:500}}>Business name *</label>
                <input value={biz.name} onChange={e=>setBizF('name',e.target.value)} placeholder="Acme Restaurant" style={{padding:'0.65rem 0.875rem',borderRadius:'0.5rem',border:'1px solid #333',background:'#111',fontSize:'0.875rem',color:'#fff',outline:'none',width:'100%'}}/>
              </div>
              <div style={{display:'flex',flexDirection:'column',gap:'0.4rem'}}>
                <label style={{fontSize:'0.8rem',color:'#888',fontWeight:500}}>Email address *</label>
                <input type="email" value={biz.email} onChange={e=>setBizF('email',e.target.value)} placeholder="hello@acme.com" style={{padding:'0.65rem 0.875rem',borderRadius:'0.5rem',border:'1px solid #333',background:'#111',fontSize:'0.875rem',color:'#fff',outline:'none',width:'100%'}}/>
              </div>
              <div style={{display:'flex',flexDirection:'column',gap:'0.4rem'}}>
                <label style={{fontSize:'0.8rem',color:'#888',fontWeight:500}}>Phone</label>
                <input value={biz.phone} onChange={e=>setBizF('phone',e.target.value)} placeholder="+1 555 000 0000" style={{padding:'0.65rem 0.875rem',borderRadius:'0.5rem',border:'1px solid #333',background:'#111',fontSize:'0.875rem',color:'#fff',outline:'none',width:'100%'}}/>
              </div>
              <div style={{display:'flex',flexDirection:'column',gap:'0.4rem'}}>
                <label style={{fontSize:'0.8rem',color:'#888',fontWeight:500}}>Website</label>
                <input value={biz.website} onChange={e=>setBizF('website',e.target.value)} placeholder="https://acme.com" style={{padding:'0.65rem 0.875rem',borderRadius:'0.5rem',border:'1px solid #333',background:'#111',fontSize:'0.875rem',color:'#fff',outline:'none',width:'100%'}}/>
              </div>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:'0.4rem',marginBottom:'1rem'}}>
              <label style={{fontSize:'0.8rem',color:'#888',fontWeight:500}}>Industry</label>
              <select value={biz.industry} onChange={e=>setBizF('industry',e.target.value)} style={{padding:'0.65rem 0.875rem',borderRadius:'0.5rem',border:'1px solid #333',background:'#111',fontSize:'0.875rem',color:'#fff',outline:'none',width:'100%'}}>
                <option value="">Select industry…</option>
                {INDUSTRIES.map(i=><option key={i}>{i}</option>)}
              </select>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:'0.4rem',marginBottom:'2rem'}}>
              <label style={{fontSize:'0.8rem',color:'#888',fontWeight:500}}>Tell creators about your business</label>
              <textarea value={biz.description} onChange={e=>setBizF('description',e.target.value)} placeholder="What you do, what kind of campaigns you run, what you're looking for in a creator…" style={{padding:'0.65rem 0.875rem',borderRadius:'0.5rem',border:'1px solid #333',background:'#111',fontSize:'0.875rem',color:'#fff',outline:'none',width:'100%',minHeight:'100px',resize:'vertical',lineHeight:1.6}}/>
            </div>
            {error && <div style={{background:'rgba(226,75,74,0.1)',border:'1px solid #E24B4A',color:'#F09595',borderRadius:'0.5rem',padding:'0.75rem 1rem',fontSize:'0.85rem',marginBottom:'1rem'}}>{error}</div>}
            <button onClick={submitBusiness} disabled={submitting} style={{background:'#c8f53a',color:'#0a0a0a',border:'none',padding:'0.85rem 2rem',borderRadius:'2rem',fontSize:'0.9rem',fontWeight:700,cursor:'pointer',fontFamily:'Syne,sans-serif',opacity:submitting?0.6:1}}>
              {submitting ? 'Registering…' : 'Create free account →'}
            </button>
          </div>
        ) : (
          <div style={{maxWidth:'600px',margin:'0 auto'}}>
            <button onClick={()=>setType(null)} style={{background:'none',border:'none',color:'#888',cursor:'pointer',marginBottom:'2rem',fontSize:'0.875rem'}}>← Back</button>
            <div style={{fontSize:'0.72rem',color:'#c8f53a',letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:'0.75rem'}}>Creator registration</div>
            <h1 style={{fontFamily:'Syne,sans-serif',fontSize:'2rem',fontWeight:800,marginBottom:'2rem',letterSpacing:'-0.5px'}}>Join the creator network</h1>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem',marginBottom:'1rem'}}>
              <div style={{display:'flex',flexDirection:'column',gap:'0.4rem'}}>
                <label style={{fontSize:'0.8rem',color:'#888',fontWeight:500}}>First name *</label>
                <input value={cre.first_name} onChange={e=>setCreF('first_name',e.target.value)} placeholder="Jane" style={{padding:'0.65rem 0.875rem',borderRadius:'0.5rem',border:'1px solid #333',background:'#111',fontSize:'0.875rem',color:'#fff',outline:'none',width:'100%'}}/>
              </div>
              <div style={{display:'flex',flexDirection:'column',gap:'0.4rem'}}>
                <label style={{fontSize:'0.8rem',color:'#888',fontWeight:500}}>Last name *</label>
                <input value={cre.last_name} onChange={e=>setCreF('last_name',e.target.value)} placeholder="Doe" style={{padding:'0.65rem 0.875rem',borderRadius:'0.5rem',border:'1px solid #333',background:'#111',fontSize:'0.875rem',color:'#fff',outline:'none',width:'100%'}}/>
              </div>
              <div style={{display:'flex',flexDirection:'column',gap:'0.4rem'}}>
                <label style={{fontSize:'0.8rem',color:'#888',fontWeight:500}}>Email *</label>
                <input type="email" value={cre.email} onChange={e=>setCreF('email',e.target.value)} placeholder="jane@example.com" style={{padding:'0.65rem 0.875rem',borderRadius:'0.5rem',border:'1px solid #333',background:'#111',fontSize:'0.875rem',color:'#fff',outline:'none',width:'100%'}}/>
              </div>
              <div style={{display:'flex',flexDirection:'column',gap:'0.4rem'}}>
                <label style={{fontSize:'0.8rem',color:'#888',fontWeight:500}}>Location</label>
                <input value={cre.location} onChange={e=>setCreF('location',e.target.value)} placeholder="Los Angeles, CA" style={{padding:'0.65rem 0.875rem',borderRadius:'0.5rem',border:'1px solid #333',background:'#111',fontSize:'0.875rem',color:'#fff',outline:'none',width:'100%'}}/>
              </div>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:'0.4rem',marginBottom:'1rem'}}>
              <label style={{fontSize:'0.8rem',color:'#888',fontWeight:500}}>Creator type</label>
              <select value={cre.creator_type} onChange={e=>setCreF('creator_type',e.target.value)} style={{padding:'0.65rem 0.875rem',borderRadius:'0.5rem',border:'1px solid #333',background:'#111',fontSize:'0.875rem',color:'#fff',outline:'none',width:'100%'}}>
                <option value="">Select one…</option>
                {['Social media influencer','Blogger / website owner','Newsletter writer','Podcaster','YouTube creator','Journalist / writer','Videographer','Other'].map(o=><option key={o}>{o}</option>)}
              </select>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:'0.4rem',marginBottom:'1rem'}}>
              <label style={{fontSize:'0.8rem',color:'#888',fontWeight:500}}>Your niches</label>
              <div style={{display:'flex',flexWrap:'wrap',gap:'0.5rem'}}>
                {NICHES.map(n=>(
                  <div key={n} onClick={()=>toggleArr('niches',n)} style={{padding:'0.4rem 0.9rem',borderRadius:'2rem',border:`1px solid ${cre.niches.includes(n)?'#c8f53a':'#333'}`,background:cre.niches.includes(n)?'rgba(200,245,58,0.1)':'#222',fontSize:'0.78rem',color:cre.niches.includes(n)?'#c8f53a':'#888',cursor:'pointer',userSelect:'none'}}>
                    {n}
                  </div>
                ))}
              </div>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:'0.4rem',marginBottom:'1rem'}}>
              <label style={{fontSize:'0.8rem',color:'#888',fontWeight:500}}>Platforms</label>
              <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'0.5rem'}}>
                {PLATFORMS.map(p=>(
                  <div key={p} onClick={()=>toggleArr('platforms',p)} style={{padding:'0.5rem',borderRadius:'0.6rem',border:`1px solid ${cre.platforms.includes(p)?'#c8f53a':'#333'}`,background:cre.platforms.includes(p)?'rgba(200,245,58,0.1)':'#222',fontSize:'0.72rem',color:cre.platforms.includes(p)?'#c8f53a':'#888',cursor:'pointer',textAlign:'center',userSelect:'none'}}>
                    {p}
                  </div>
                ))}
              </div>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem',marginBottom:'1rem'}}>
              <div style={{display:'flex',flexDirection:'column',gap:'0.4rem'}}>
                <label style={{fontSize:'0.8rem',color:'#888',fontWeight:500}}>Follower range</label>
                <select value={cre.follower_range} onChange={e=>setCreF('follower_range',e.target.value)} style={{padding:'0.65rem 0.875rem',borderRadius:'0.5rem',border:'1px solid #333',background:'#111',fontSize:'0.875rem',color:'#fff',outline:'none',width:'100%'}}>
                  <option value="">Select…</option>
                  {['Under 10K','10K–50K','50K–250K','250K–1M','1M+'].map(o=><option key={o}>{o}</option>)}
                </select>
              </div>
              <div style={{display:'flex',flexDirection:'column',gap:'0.4rem'}}>
                <label style={{fontSize:'0.8rem',color:'#888',fontWeight:500}}>Typical rate per post</label>
                <select value={cre.rate_range} onChange={e=>setCreF('rate_range',e.target.value)} style={{padding:'0.65rem 0.875rem',borderRadius:'0.5rem',border:'1px solid #333',background:'#111',fontSize:'0.875rem',color:'#fff',outline:'none',width:'100%'}}>
                  <option value="">Select…</option>
                  {['Under $250','$250–$500','$500–$1,500','$1,500–$5,000','$5,000+','Open to negotiation'].map(o=><option key={o}>{o}</option>)}
                </select>
              </div>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:'0.4rem',marginBottom:'1rem'}}>
              <label style={{fontSize:'0.8rem',color:'#888',fontWeight:500}}>Profile link or media kit</label>
              <input type="url" value={cre.profile_link} onChange={e=>setCreF('profile_link',e.target.value)} placeholder="https://instagram.com/you" style={{padding:'0.65rem 0.875rem',borderRadius:'0.5rem',border:'1px solid #333',background:'#111',fontSize:'0.875rem',color:'#fff',outline:'none',width:'100%'}}/>
            </div>
            <div style={{display:'flex',flexDirection:'column',gap:'0.4rem',marginBottom:'2rem'}}>
              <label style={{fontSize:'0.8rem',color:'#888',fontWeight:500}}>Bio</label>
              <textarea value={cre.bio} onChange={e=>setCreF('bio',e.target.value)} placeholder="Who you are and what makes your audience unique…" style={{padding:'0.65rem 0.875rem',borderRadius:'0.5rem',border:'1px solid #333',background:'#111',fontSize:'0.875rem',color:'#fff',outline:'none',width:'100%',minHeight:'80px',resize:'vertical',lineHeight:1.6}}/>
            </div>
            {error && <div style={{background:'rgba(226,75,74,0.1)',border:'1px solid #E24B4A',color:'#F09595',borderRadius:'0.5rem',padding:'0.75rem 1rem',fontSize:'0.85rem',marginBottom:'1rem'}}>{error}</div>}
            <button onClick={submitCreator} disabled={submitting} style={{background:'#c8f53a',color:'#0a0a0a',border:'none',padding:'0.85rem 2rem',borderRadius:'2rem',fontSize:'0.9rem',fontWeight:700,cursor:'pointer',fontFamily:'Syne,sans-serif',opacity:submitting?0.6:1}}>
              {submitting ? 'Submitting…' : 'Join the network free →'}
            </button>
          </div>
        )}
      </div>
    </>
  )
}
