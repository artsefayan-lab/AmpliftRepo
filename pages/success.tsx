import Head from 'next/head'
import { useEffect } from 'react'
import { useRouter } from 'next/router'

const CALENDLY_URL = 'https://calendly.com/amplify/amplify-kickoff'

export default function SuccessPage() {
  const router = useRouter()

  useEffect(() => {
    const script = document.createElement('script')
    script.src = 'https://assets.calendly.com/assets/external/widget.js'
    script.async = true
    document.body.appendChild(script)
    return () => { document.body.removeChild(script) }
  }, [])

  return (
    <>
      <Head>
        <title>Payment successful — Book your kickoff call</title>
        <link rel="stylesheet" href="https://assets.calendly.com/assets/external/widget.css" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Syne:wght@700;800&family=Inter:wght@300;400;500&display=swap" />
      </Head>
      <nav style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'1.25rem 2.5rem',borderBottom:'1px solid #333',background:'#0a0a0a'}}>
        <a href="/" style={{fontFamily:'Syne,sans-serif',fontSize:'1.4rem',fontWeight:800,color:'#fff',textDecoration:'none'}}>
          AMPLI<span style={{color:'#c8f53a'}}>FY</span>
        </a>
      </nav>
      <div style={{background:'#0a0a0a',minHeight:'100vh',fontFamily:'Inter,sans-serif',color:'#fff'}}>
        <div style={{background:'#c8f53a',padding:'1.25rem 2.5rem',display:'flex',alignItems:'center',justifyContent:'center',gap:'1rem'}}>
          <span style={{fontFamily:'Syne,sans-serif',fontWeight:700,fontSize:'1rem',color:'#0a0a0a'}}>✓ Payment successful! Book your free kickoff call below.</span>
        </div>
        <div style={{maxWidth:'800px',margin:'0 auto',padding:'4rem 2.5rem'}}>
          <div style={{textAlign:'center',marginBottom:'3rem'}}>
            <div style={{fontSize:'0.72rem',color:'#c8f53a',letterSpacing:'0.1em',textTransform:'uppercase',marginBottom:'0.75rem'}}>Next step</div>
            <h1 style={{fontFamily:'Syne,sans-serif',fontSize:'3rem',fontWeight:800,letterSpacing:'-1px',marginBottom:'1rem',lineHeight:1.1}}>
              Book your <span style={{color:'#c8f53a'}}>kickoff call</span>
            </h1>
            <p style={{fontSize:'1rem',color:'#888',lineHeight:1.75,fontWeight:300,maxWidth:'500px',margin:'0 auto'}}>
              Pick a time below. We will walk you through your matched creator lineup and you choose who you want.
            </p>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'1px',background:'#333',border:'1px solid #333',borderRadius:'1rem',overflow:'hidden',marginBottom:'3rem'}}>
            {[['30 min','Quick focused call'],['48 hrs','Creator lineup ready'],['You choose','Pick your creators']].map(([n,d]) => (
              <div key={n} style={{background:'#111',padding:'1.5rem',textAlign:'center'}}>
                <div style={{fontFamily:'Syne,sans-serif',fontSize:'1.5rem',fontWeight:800,color:'#c8f53a',marginBottom:'0.5rem'}}>{n}</div>
                <div style={{fontSize:'0.8rem',color:'#888',lineHeight:1.6}}>{d}</div>
              </div>
            ))}
          </div>
          <div className="calendly-inline-widget" data-url={`${CALENDLY_URL}?hide_gdpr_banner=1&background_color=111111&text_color=ffffff&primary_color=c8f53a`} style={{minWidth:'320px',height:'700px'}} />
          <div style={{textAlign:'center',paddingTop:'2rem',borderTop:'1px solid #333',marginTop:'2rem'}}>
            <button onClick={()=>router.push('/')} style={{background:'none',border:'1px solid #333',color:'#888',padding:'0.6rem 1.5rem',borderRadius:'2rem',fontSize:'0.82rem',cursor:'pointer'}}>
              I will book later
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
