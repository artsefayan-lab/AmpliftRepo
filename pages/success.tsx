import Head from 'next/head'
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
