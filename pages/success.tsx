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
              Pick a time below. We'll walk you through your matched creator lineup and you choose who you want on your campaign.
            </p>
          </div>
          <div className="calendly-inline-widget" data-url={`${CALENDLY_URL}?hide_gdpr_banner=1&background_color=111111&text_color=ffffff&primary_color=c8f53a`} style={{minWidth:'320px',height:'700px'}} />
          <div style={{textAlign:'center',paddingTop:'2rem',borderTop:'1px solid #333',marginTop:'2rem'}}>
            <button onClick={()=>router.push('/')} style={{background:'none',border:'1px solid #333',color:'#888',padding:'0.6rem 1.5rem',borderRadius:'2rem',fontSize:'0.82rem',cursor:'pointer'}}>
              I'll book later — go to homepage
            </button>
          </div>
        </div>
      </div>
    </>
  )
}import Head from 'next/head'
import { useRouter } from 'next/router'

export default function SuccessPage() {
  const router = useRouter()

  return (
    <>
      <Head><title>Payment successful — Amplify</title></Head>

      <nav style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'1.25rem 3rem',borderBottom:'1px solid #e8e1d5',background:'#faf8f4',position:'sticky',top:0}}>
        <a href="/" style={{fontFamily:'DM Serif Display, serif',fontSize:'1.5rem',color:'#1a3a2a',textDecoration:'none'}}>
          Ampli<span style={{color:'#c9a84c'}}>fy</span>
        </a>
      </nav>

      <div style={{maxWidth:'560px',margin:'6rem auto',padding:'0 2rem',textAlign:'center'}}>
        <div style={{width:'72px',height:'72px',borderRadius:'50%',background:'#e8f3ed',border:'2px solid #a8d4be',display:'flex',alignItems:'center',justifyContent:'center',margin:'0 auto 2rem',fontSize:'2rem'}}>
          ✓
        </div>
        <h1 style={{fontFamily:'DM Serif Display, serif',fontSize:'2.5rem',color:'#0f0d0b',marginBottom:'1rem',letterSpacing:'-0.5px'}}>
          You're all set!
        </h1>
        <p style={{fontSize:'1rem',color:'#4a4540',lineHeight:'1.75',fontWeight:300,marginBottom:'2rem'}}>
          Your payment was successful. Our team will be in touch within 24 hours to kick off your campaign and introduce you to your matched creators.
        </p>
        <div style={{background:'#f2ede5',borderRadius:'1rem',padding:'1.5rem',marginBottom:'2rem',textAlign:'left'}}>
          <div style={{fontSize:'0.75rem',fontWeight:500,letterSpacing:'0.08em',textTransform:'uppercase',color:'#7a6022',marginBottom:'0.75rem'}}>What happens next</div>
          {['We match your campaign to the best creators in our network','You approve the creator lineup within 48 hours','Creators go live across their platforms simultaneously','You track results in real time on your dashboard'].map((s,i)=>(
            <div key={i} style={{display:'flex',gap:'0.75rem',alignItems:'flex-start',marginBottom:'0.6rem'}}>
              <div style={{width:'20px',height:'20px',borderRadius:'50%',background:'#1a3a2a',color:'#fff',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'0.7rem',fontWeight:500,flexShrink:0,marginTop:'1px'}}>{i+1}</div>
              <p style={{fontSize:'0.875rem',color:'#4a4540',lineHeight:'1.6',margin:0}}>{s}</p>
            </div>
          ))}
        </div>
        <button
          onClick={()=>router.push('/')}
          style={{background:'#1a3a2a',color:'#fff',padding:'0.85rem 2rem',borderRadius:'2rem',fontSize:'0.9rem',fontWeight:500,border:'none',cursor:'pointer',fontFamily:'DM Sans, sans-serif'}}
        >
          Back to Amplify
        </button>
      </div>
    </>
  )
}
