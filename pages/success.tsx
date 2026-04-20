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
      </Head>
      <nav style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'1.25rem 2.5rem',borderBottom:'1px solid #333',background:'#0a0a0a'}}>
        <a href="/" style={{fontFamily:'Syne,sans-serif',fontSize:'1.4rem',fontWeight:800,color:'#fff',textDecoration:'none'}}>AMPLI<span style={{color:'#c8f53a'}}>FY</span></a>
      </nav>
      <div style={{background:'#0a0a0a',minHeight:'100vh',color:'#fff'}}>
        <div style={{background:'#c8f53a',padding:'1.25rem 2.5rem',textAlign:'center'}}>
          <span style={{fontFamily:'Syne,sans-serif',fontWeight:700,color:'#0a0a0a'}}>Payment successful! Book your free kickoff call below.</span>
        </div>
        <div style={{maxWidth:'800px',margin:'0 auto',padding:'4rem 2.5rem',textAlign:'center'}}>
          <h1 style={{fontFamily:'Syne,sans-serif',fontSize:'3rem',fontWeight:800,color:'#fff',marginBottom:'1rem'}}>Book your <span style={{color:'#c8f53a'}}>kickoff call</span></h1>
          <p style={{color:'#888',marginBottom:'3rem'}}>Pick a time and we will walk you through your creator lineup.</p>
          <div className="calendly-inline-widget" data-url={CALENDLY_URL + '?hide_gdpr_banner=1&background_color=111111&text_color=ffffff&primary_color=c8f53a'} style={{minWidth:'320px',height:'700px'}} />
          <div style={{marginTop:'2rem'}}>
            <button onClick={()=>router.push('/')} style={{background:'none',border:'1px solid #333',color:'#888',padding:'0.6rem 1.5rem',borderRadius:'2rem',fontSize:'0.82rem',cursor:'pointer'}}>
              I will book later
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
