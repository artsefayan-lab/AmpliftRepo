import Head from 'next/head'
import { useState } from 'react'
import { useRouter } from 'next/router'

export default function Register() {
  const router = useRouter()
  const [type, setType] = useState(null)
  const [done, setDone] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [biz, setBiz] = useState({name:'',email:'',phone:'',industry:'',website:'',description:''})
  const [cre, setCre] = useState({first_name:'',last_name:'',email:'',phone:'',location:'',creator_type:'',niches:[],platforms:[],follower_range:'',rate_range:'',profile_link:'',bio:''})

  const NICHES=['Fashion','Beauty','Fitness & health','Food & drink','Travel','Tech','Finance','Parenting','Gaming','Home & design','Sustainability','Business','Entertainment','Sports']
  const PLATFORMS=['Instagram','TikTok','YouTube','X / Twitter','Pinterest','LinkedIn','Substack','Blog / website','Podcast','Threads','Facebook','Twitch']
  const INDUSTRIES=['Restaurant & food','Retail & e-commerce','Health & wellness','Fashion & beauty','Technology','Finance','Travel & hospitality','Entertainment','Education','Other']

  function sb(f,v){setBiz(b=>({...b,[f]:v}))}
  function sc(f,v){setCre(c=>({...c,[f]:v}))}
  function tog(f,v){setCre(c=>({...c,[f]:c[f].includes(v)?c[f].filter(x=>x!==v):[...c[f],v]}))}

  async function submit(){
    setSubmitting(true);setError('')
    try{
      const res=await fetch(type==='business'?'/api/register-business':'/api/apply',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(type==='business'?biz:cre)})
      const data=await res.json()
      if(!res.ok)throw new Error(data.error||'Failed')
      setDone(true)
    }catch(e){setError(e.message)}
    finally{setSubmitting(false)}
  }

  const inp={padding:'0.65rem 0.875rem',borderRadius:'0.5rem',border:'1px solid #333',background:'#111',color:'#fff',fontSize:'0.875rem',outline:'none',width:'100%'}
  const btn={background:'#c8f53a',color:'#0a0a0a',border:'none',padding:'0.875rem 2rem',borderRadius:'2rem',fontSize:'0.9rem',fontWeight:700,cursor:'pointer',width:'100%'}

  return(
    <>
      <Head><title>Join Amplify</title></Head>
      <style>{`*{margin:0;padding:0;box-sizing:border-box}body{font-family:Inter,sans-serif;background:#0a0a0a;color:#fff}`}</style>
      <nav style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'1.25rem 2.5rem',borderBottom:'1px solid #333',background:'#0a0a0a'}}>
        <a href="/" style={{fontFamily:'sans-serif',fontSize:'1.4rem',fontWeight:800,color:'#fff',textDecoration:'none'}}>AMPLI<span style={{color:'#c8f53a'}}>FY</span></a>
      </nav>
      {done?(
        <div style={{maxWidth:'500px',margin:'0 auto',padding:'6rem 2rem',textAlign:'center'}}>
          <div style={{width:'72px',height:'72px',borderRadius:'50%',background:'rgba(200,245,58,0.1)',border:'2px solid #c8f53a',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 2rem',fontSize:'2rem',color:'#c8f53a'}}>✓</div>
          <h1 style={{fontFamily:'sans-serif',fontSize:'2rem',fontWeight:800,marginBottom:'1rem'}}>You are in!</h1>
          <p style={{color:'#888',lineHeight:1.8,marginBottom:'2rem'}}>{type==='business'?'Your business account is created. Start browsing creators and launch your first campaign.':'Your creator profile has been submitted. We will review it within 3 to 5 business days.'}</p>
          <button onClick={()=>router.push(type==='business'?'/business/dashboard':'/')} style={btn}>{type==='business'?'Go to your dashboard':'Back to homepage'}</button>
        </div>
      ):!type?(
        <>
          <div style={{background:'#111',borderBottom:'1px solid #333',padding:'4rem 2rem',textAlign:'center'}}>
            <div style={{fontSize:'0.72rem',color:'#c8f53a',letterSpacing:'0.12em',textTransform:'uppercase',marginBottom:'1rem'}}>Join Amplify</div>
            <h1 style={{fontFamily:'sans-serif',fontSize:'3rem',fontWeight:800,letterSpacing:'-1px',marginBottom:'0.75rem'}}>Who are you joining as?</h1>
            <p style={{color:'#888',fontSize:'1rem'}}>Both are completely free to sign up.</p>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',maxWidth:'900px',margin:'0 auto',minHeight:'60vh'}}>
            <div onClick={()=>setType('business')} style={{padding:'4rem 3rem',cursor:'pointer',borderRight:'1px solid #333'}} onMouseOver={e=>e.currentTarget.style.background='#111'} onMouseOut={e=>e.currentTarget.style.background='transparent'}>
              <div style={{fontSize:'3rem',marginBottom:'1.5rem'}}>🏢</div>
              <h2 style={{fontFamily:'sans-serif',fontSize:'1.75rem',fontWeight:800,marginBottom:'0.75rem'}}>I am a business owner</h2>
              <p style={{color:'#888',fontSize:'0.95rem',lineHeight:1.75,marginBottom:'2rem'}}>I want to advertise through influencers and creators across multiple platforms.</p>
              {['Free to browse all creators','Pay only to contact and launch','Full campaign dashboard','Proposals and tracking'].map(f=>(
                <div key={f} style={{display:'flex',alignItems:'center',gap:'0.75rem',fontSize:'0.875rem',color:'#888',marginBottom:'0.5rem'}}><span style={{color:'#c8f53a',fontWeight:700}}>✓</span>{f}</div>
              ))}
              <div style={{background:'#c8f53a',color:'#0a0a0a',padding:'1rem 2rem',borderRadius:'2rem',fontSize:'0.95rem',fontWeight:700,textAlign:'center',marginTop:'2rem'}}>Join as a business</div>
            </div>
            <div onClick={()=>setType('creator')} style={{padding:'4rem 3rem',cursor:'pointer'}} onMouseOver={e=>e.currentTarget.style.background='#111'} onMouseOut={e=>e.currentTarget.style.background='transparent'}>
              <div style={{fontSize:'3rem',marginBottom:'1.5rem'}}>✍️</div>
              <h2 style={{fontFamily:'sans-serif',fontSize:'1.75rem',fontWeight:800,marginBottom:'0.75rem'}}>I am a creator or freelancer</h2>
              <p style={{color:'#888',fontSize:'0.95rem',lineHeight:1.75,marginBottom:'2rem'}}>I am an influencer, blogger, writer, or podcaster looking for brand partnerships.</p>
              {['Always 100% free','Get matched with brands','Receive campaign proposals','No exclusivity required'].map(f=>(
                <div key={f} style={{display:'flex',alignItems:'center',gap:'0.75rem',fontSize:'0.875rem',color:'#888',marginBottom:'0.5rem'}}><span style={{color:'#c8f53a',fontWeight:700}}>✓</span>{f}</div>
              ))}
              <div style={{background:'#111',color:'#c8f53a',border:'1px solid #c8f53a',padding:'1rem 2rem',borderRadius:'2rem',fontSize:'0.95rem',fontWeight:700,textAlign:'center',marginTop:'2rem'}}>Join as a creator</div>
            </div>
          </div>
        </>
      ):type==='business'?(
        <div style={{maxWidth:'680px',margin:'0 auto',padding:'4rem 2rem'}}>
          <button onClick={()=>setType(null)} style={{background:'none',border:'none',color:'#888',cursor:'pointer',marginBottom:'2rem',fontSize:'0.875rem'}}>Back</button>
          <div style={{fontSize:'0.72rem',color:'#c8f53a',letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:'0.75rem'}}>Business registration</div>
          <h1 style={{fontFamily:'sans-serif',fontSize:'2rem',fontWeight:800,marginBottom:'2rem'}}>Tell us about your business</h1>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
            {[['Business name','name','text','Acme Inc.'],['Email','email','email','you@business.com'],['Phone','phone','tel','+1 555 000 0000'],['Website','website','url','https://yourbusiness.com']].map(([l,f,t,p])=>(
              <div key={f}><label style={{fontSize:'0.8rem',color:'#888',display:'block',marginBottom:'0.4rem'}}>{l}</label><input type={t} value={biz[f]} onChange={e=>sb(f,e.target.value)} placeholder={p} style={inp}/></div>
            ))}
            <div><label style={{fontSize:'0.8rem',color:'#888',display:'block',marginBottom:'0.4rem'}}>Industry</label>
              <select value={biz.industry} onChange={e=>sb('industry',e.target.value)} style={inp}><option value="">Select</option>{INDUSTRIES.map(i=><option key={i}>{i}</option>)}</select>
            </div>
            <div style={{gridColumn:'1/-1'}}><label style={{fontSize:'0.8rem',color:'#888',display:'block',marginBottom:'0.4rem'}}>About your brand</label>
              <textarea value={biz.description} onChange={e=>sb('description',e.target.value)} placeholder="What do you sell and who is your audience?" style={{...inp,minHeight:'90px',resize:'vertical'}}/>
            </div>
          </div>
          {error&&<div style={{background:'rgba(226,75,74,0.1)',border:'1px solid #E24B4A',color:'#F09595',borderRadius:'0.5rem',padding:'0.75rem',fontSize:'0.85rem',margin:'1rem 0'}}>{error}</div>}
          <button onClick={submit} disabled={submitting} style={{...btn,marginTop:'1.5rem'}}>{submitting?'Creating account':'Create free account'}</button>
        </div>
      ):(
        <div style={{maxWidth:'680px',margin:'0 auto',padding:'4rem 2rem'}}>
          <button onClick={()=>setType(null)} style={{background:'none',border:'none',color:'#888',cursor:'pointer',marginBottom:'2rem',fontSize:'0.875rem'}}>Back</button>
          <div style={{fontSize:'0.72rem',color:'#c8f53a',letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:'0.75rem'}}>Creator registration</div>
          <h1 style={{fontFamily:'sans-serif',fontSize:'2rem',fontWeight:800,marginBottom:'2rem'}}>Join the creator network</h1>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
            {[['First name','first_name','Jane'],['Last name','last_name','Doe'],['Email','email','jane@example.com'],['Phone','phone','+1 555'],['Location','location','Los Angeles, CA']].map(([l,f,p])=>(
              <div key={f} style={{gridColumn:f==='location'?'1/-1':'auto'}}><label style={{fontSize:'0.8rem',color:'#888',display:'block',marginBottom:'0.4rem'}}>{l}</label><input value={cre[f]} onChange={e=>sc(f,e.target.value)} placeholder={p} style={inp}/></div>
            ))}
            <div style={{gridColumn:'1/-1'}}><label style={{fontSize:'0.8rem',color:'#888',display:'block',marginBottom:'0.4rem'}}>Creator type</label>
              <select value={cre.creator_type} onChange={e=>sc('creator_type',e.target.value)} style={inp}><option value="">Select</option>{['Social media influencer','Blogger','Newsletter writer','Podcaster','YouTube creator','Journalist','Videographer','Other'].map(o=><option key={o}>{o}</option>)}</select>
            </div>
            <div style={{gridColumn:'1/-1'}}><label style={{fontSize:'0.8rem',color:'#888',display:'block',marginBottom:'0.4rem'}}>Your niches</label>
              <div style={{display:'flex',flexWrap:'wrap',gap:'0.5rem'}}>{NICHES.map(n=><div key={n} onClick={()=>tog('niches',n)} style={{padding:'0.4rem 0.9rem',borderRadius:'2rem',border:`1px solid ${cre.niches.includes(n)?'#c8f53a':'#333'}`,background:cre.niches.includes(n)?'rgba(200,245,58,0.1)':'#222',color:cre.niches.includes(n)?'#c8f53a':'#888',fontSize:'0.78rem',cursor:'pointer',userSelect:'none'}}>{n}</div>)}</div>
            </div>
            <div style={{gridColumn:'1/-1'}}><label style={{fontSize:'0.8rem',color:'#888',display:'block',marginBottom:'0.4rem'}}>Platforms</label>
              <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'0.5rem'}}>{PLATFORMS.map(p=><div key={p} onClick={()=>tog('platforms',p)} style={{padding:'0.5rem',borderRadius:'0.5rem',border:`1px solid ${cre.platforms.includes(p)?'#c8f53a':'#333'}`,background:cre.platforms.includes(p)?'rgba(200,245,58,0.1)':'#222',color:cre.platforms.includes(p)?'#c8f53a':'#888',fontSize:'0.72rem',cursor:'pointer',textAlign:'center',userSelect:'none'}}>{p}</div>)}</div>
            </div>
            <div><label style={{fontSize:'0.8rem',color:'#888',display:'block',marginBottom:'0.4rem'}}>Follower range</label>
              <select value={cre.follower_range} onChange={e=>sc('follower_range',e.target.value)} style={inp}><option value="">Select</option>{['Under 10K','10K-50K','50K-250K','250K-1M','1M+'].map(o=><option key={o}>{o}</option>)}</select>
            </div>
            <div><label style={{fontSize:'0.8rem',color:'#888',display:'block',marginBottom:'0.4rem'}}>Rate per post</label>
              <select value={cre.rate_range} onChange={e=>sc('rate_range',e.target.value)} style={inp}><option value="">Select</option>{['Under $250','$250-$500','$500-$1,500','$1,500-$5,000','$5,000+','Open'].map(o=><option key={o}>{o}</option>)}</select>
            </div>
            <div style={{gridColumn:'1/-1'}}><label style={{fontSize:'0.8rem',color:'#888',display:'block',marginBottom:'0.4rem'}}>Profile link</label><input value={cre.profile_link} onChange={e=>sc('profile_link',e.target.value)} placeholder="https://instagram.com/yourhandle" style={inp}/></div>
            <div style={{gridColumn:'1/-1'}}><label style={{fontSize:'0.8rem',color:'#888',display:'block',marginBottom:'0.4rem'}}>Bio</label><textarea value={cre.bio} onChange={e=>sc('bio',e.target.value)} placeholder="Tell brands who you are..." style={{...inp,minHeight:'80px',resize:'vertical'}}/></div>
          </div>
          {error&&<div style={{background:'rgba(226,75,74,0.1)',border:'1px solid #E24B4A',color:'#F09595',borderRadius:'0.5rem',padding:'0.75rem',fontSize:'0.85rem',margin:'1rem 0'}}>{error}</div>}
          <button onClick={submit} disabled={submitting} style={{...btn,marginTop:'1.5rem'}}>{submitting?'Submitting':'Apply to join free'}</button>
        </div>
      )}
    </>
  )
}
// Mon Apr 20 19:21:15 PDT 2026
