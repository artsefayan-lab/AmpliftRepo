import Head from 'next/head'
import { useState } from 'react'

const NICHES = ['Fashion','Beauty','Fitness & health','Food & drink','Travel','Tech','Finance','Parenting','Gaming','Home & design','Sustainability','Business','Entertainment','Sports','Pets','Wellness']
const PLATFORMS = ['Instagram','TikTok','YouTube','X / Twitter','Pinterest','LinkedIn','Substack','Blog / website','Podcast','Threads','Facebook','Twitch']

type FormData = {
  first_name: string; last_name: string; email: string; phone: string; location: string
  creator_type: string; niches: string[]
  platforms: string[]; primary_platform: string; follower_range: string; engagement_rate: string; profile_link: string
  bio: string; past_brands: string; rate_range: string; turnaround: string; extra_notes: string
}

const empty: FormData = {
  first_name:'',last_name:'',email:'',phone:'',location:'',
  creator_type:'',niches:[],
  platforms:[],primary_platform:'',follower_range:'',engagement_rate:'',profile_link:'',
  bio:'',past_brands:'',rate_range:'',turnaround:'',extra_notes:''
}

export default function Home() {
  const [activeView, setActiveView] = useState<'home'|'apply'>('home')
  const [step, setStep] = useState(1)
  const [form, setForm] = useState<FormData>(empty)
  const [agreed, setAgreed] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [checkoutLoading, setCheckoutLoading] = useState('')

  function set(field: keyof FormData, val: any) { setForm(f => ({...f, [field]: val})) }
  function toggleArr(field: 'niches'|'platforms', val: string) {
    setForm(f => ({ ...f, [field]: f[field].includes(val) ? f[field].filter((x:string)=>x!==val) : [...f[field], val] }))
  }

  async function startCheckout(plan: string) {
    setCheckoutLoading(plan)
    try {
      const res = await fetch('/api/checkout', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify({ plan }) })
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } catch { alert('Something went wrong. Please try again.') }
    finally { setCheckoutLoading('') }
  }

  async function submitApplication() {
    if (!agreed) { setError('Please agree to the creator terms.'); return }
    setSubmitting(true); setError('')
    try {
      const res = await fetch('/api/apply', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(form) })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Submission failed')
      setSubmitted(true)
    } catch(e:any) { setError(e.message) }
    finally { setSubmitting(false) }
  }

  function reset() { setForm(empty); setStep(1); setSubmitted(false); setAgreed(false); setError('') }

  const CREATORS = [
    {i:'MJ',bg:'#222',n:'Marco Jimenez',t:'YouTuber & blogger',p:['YouTube','Blog'],s:'890K',sl:'subscribers',b:'Tech'},
    {i:'SR',bg:'#1a1a1a',n:'Sasha Reeves',t:'Writer & creator',p:['Substack','TikTok'],s:'410K',sl:'readers',b:'Wellness'},
    {i:'DP',bg:'#181818',n:'Devon Park',t:'Podcaster',p:['Podcast','YouTube'],s:'220K',sl:'listeners',b:'Finance'},
    {i:'LH',bg:'#141414',n:'Lena Hofer',t:'Newsletter writer',p:['Substack','LinkedIn'],s:'85K',sl:'subscribers',b:'Business'},
    {i:'TN',bg:'#1c1c1c',n:'Ty Nguyen',t:'Multi-platform creator',p:['TikTok','Instagram','YouTube'],s:'1.1M',sl:'following',b:'Fitness'},
  ]

  return (
    <>
      <Head>
        <title>Amplify — Multi-platform creator network</title>
        <meta name="description" content="Connect your brand to influencers, bloggers, writers, and creators across every platform." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Syne:wght@400;700;800&family=Inter:wght@300;400;500&display=swap" />
      </Head>

      <nav className="nav">
        <div className="logo">AMPLI<span>FY</span></div>
        <ul className="nav-links">
          <li><a href="#how">How it works</a></li>
          <li><a href="#creators">Creators</a></li>
          <li><a href="#pricing">Pricing</a></li>
          <li><button className="nav-link-btn" onClick={()=>setActiveView('apply')}>Join as creator</button></li>
        </ul>
        <button className="nav-cta" onClick={()=>document.getElementById('pricing')?.scrollIntoView({behavior:'smooth'})}>Launch campaign</button>
      </nav>

      {activeView==='home' && <main>
        <section className="hero">
          <div className="what-it-is"><div className="wit-dot"></div><span><span className="wit-text">Influencer marketing platform</span> — for restaurants, brands &amp; businesses</span></div>
          <h1>One Payment.<br/>Every Platform.<br/><span className="accent">AMPLIFY.</span></h1>
          <p className="hero-explainer">Amplify connects <strong>your business</strong> with a network of <strong>influencers, bloggers, and creators</strong> — they post about you on Instagram, TikTok, YouTube, podcasts, newsletters, and more. <strong>One campaign. One price. Everywhere.</strong></p>
          <div className="how-strip">
            <div className="hs-step"><div className="hs-num">Step 1</div><div className="hs-label">Tell us about your brand</div></div>
            <div className="hs-step"><div className="hs-num">Step 2</div><div className="hs-label">Pick your creators</div></div>
            <div className="hs-step"><div className="hs-num">Step 3</div><div className="hs-label">They post, you grow</div></div>
          </div>
          <div className="hero-cta-row">
            <button className="btn-lime" onClick={()=>document.getElementById('pricing')?.scrollIntoView({behavior:'smooth'})}>Start your campaign →</button>
            <button className="btn-ghost" onClick={()=>document.getElementById('how')?.scrollIntoView({behavior:'smooth'})}>See how it works</button>
          </div>
          <div className="hero-proof">
            <div className="hp-item"><div className="hp-num">14,800+</div><div className="hp-lbl">Creators ready to post</div></div>
            <div className="hp-div"></div>
            <div className="hp-item"><div className="hp-num">60+</div><div className="hp-lbl">Platforms covered</div></div>
            <div className="hp-div"></div>
            <div className="hp-item"><div className="hp-num">$499</div><div className="hp-lbl">Starting price</div></div>
            <div className="hp-div"></div>
            <div className="hp-item"><div className="hp-num">48hrs</div><div className="hp-lbl">To go live</div></div>
          </div>
          <div className="example-box">
            <div className="ex-header">
              <div className="ex-title">Example — Restaurant campaign</div>
              <div className="ex-sub">Your brief → matched creators → they all post about you</div>
            </div>
            <div className="ex-body">
              <div className="ex-card"><div className="ex-platform">Instagram</div><div className="ex-creator">@foodie.kira</div><div className="ex-reach">410K followers · Food niche</div></div>
              <div className="ex-card"><div className="ex-platform">TikTok</div><div className="ex-creator">@eatswithtony</div><div className="ex-reach">280K followers · Restaurant reviews</div></div>
              <div className="ex-card"><div className="ex-platform">YouTube + Blog</div><div className="ex-creator">Marco Eats</div><div className="ex-reach">190K subscribers · Local food</div></div>
            </div>
            <div className="ex-footer">
              <div className="ex-total">Combined reach: <span>880K people</span> · All post the same week</div>
              <div className="ex-price">$499 flat</div>
            </div>
          </div>
        </section>

        <div className="ticker-wrap">
          <div className="ticker">
            {[...['Instagram','TikTok','YouTube','Substack','Podcasts','Blogs','Pinterest','LinkedIn','X / Twitter','Newsletters','Threads','Facebook'],
               ...['Instagram','TikTok','YouTube','Substack','Podcasts','Blogs','Pinterest','LinkedIn','X / Twitter','Newsletters','Threads','Facebook']].map((p,i)=>(
              <span className="t-item" key={i}>{p} <span className="t-sep">+</span></span>
            ))}
          </div>
        </div>

        <div className="trust-bar">
          <div className="trust-lbl">Our creators publish across top media outlets & platforms</div>
          <div className="trust-row">
            {[['THE DAILY DISH','Food & lifestyle'],['METRO EATS','Restaurant reviews'],['BRAND WEEKLY','Marketing'],['THE FEED','Social media'],['CULTURE DROP','Trends'],['GROWTH LAB','Business']].map(([n,s])=>(
              <div className="t-logo" key={n}><div className="t-name">{n}</div><div className="t-sub">{s}</div></div>
            ))}
          </div>
        </div>

        <div className="stats-strip">
          {[['14,800+','Verified creators'],['60+','Platforms covered'],['$0.004','Avg. cost per impression'],['4.8B','Impressions delivered']].map(([n,l])=>(
            <div className="s-block" key={l}><div className="s-big">{n}</div><div className="s-lbl">{l}</div></div>
          ))}
        </div>

        <div className="pill-strip">
          <div className="pill-lbl">Creator niches in our network</div>
          <div className="pill-row">
            {['Food & restaurant blogs','Fashion & beauty channels','Finance newsletters','Tech YouTube channels','Travel Instagram accounts','Fitness TikTok creators','Business podcasts','Parenting Substacks','Sustainability writers','Gaming streamers','Home & design blogs','Local lifestyle influencers'].map(n=>(
              <div className="npill" key={n}><div className="ndot"></div>{n}</div>
            ))}
          </div>
        </div>

        <section className="creators-sec" id="creators">
          <div className="sec-header">
            <div><div className="sec-lbl">Creator network</div><div className="sec-title">Who you're<br/>working with</div></div>
            <p className="sec-desc">14,800+ vetted creators across every niche and audience size.</p>
          </div>
          <div className="cwall">
            <div className="ctile featured">
              <div className="ct-top"><div className="cavatar" style={{background:'#0a0a0a'}}>KL</div><div className="cbadge">Top creator</div></div>
              <div className="cname">Kira Lund</div>
              <div className="ctype">Fashion & lifestyle influencer</div>
              <div className="cplats"><span>Instagram</span><span>TikTok</span><span>Pinterest</span></div>
              <div className="cstat">2.4M</div><div className="cstat-lbl">combined followers</div>
              <div className="carrow">→</div>
            </div>
            {CREATORS.map(c=>(
              <div className="ctile" key={c.n}>
                <div className="ct-top"><div className="cavatar" style={{background:c.bg}}>{c.i}</div><div className="cbadge">{c.b}</div></div>
                <div className="cname">{c.n}</div><div className="ctype">{c.t}</div>
                <div className="cplats">{c.p.map(p=><span key={p}>{p}</span>)}</div>
                <div className="cstat">{c.s}</div><div className="cstat-lbl">{c.sl}</div>
                <div className="carrow">→</div>
              </div>
            ))}
          </div>
        </section>

        <section className="how-sec" id="how">
          <div className="how-inner">
            <div className="sec-lbl">How it works</div>
            <div className="how-big">Three steps.<br/>Everywhere at once.</div>
            <div className="how-grid">
              {[['01','Submit your brief','Tell us your brand, goals, and budget. We match you with the best creators instantly.','5 minutes'],
                ['02','Book your kickoff call','After payment, book a free 30-min call. We walk you through your creator lineup and you pick who you want.','48 hours'],
                ['03','Go live everywhere','Creators publish simultaneously. Track impressions, clicks, and ROI in real time.','Real-time']].map(([n,t,d,tag])=>(
                <div className="hstep" key={n}>
                  <div className="hnum">{n}</div>
                  <div className="htitle">{t}</div>
                  <div className="hdesc">{d}</div>
                  <div className="htag">{tag}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="ind-sec">
          <div className="sec-lbl">Who we work with</div>
          <div className="sec-title">Every industry.<br/>Every scale.</div>
          <div className="ind-grid">
            {[['🍽','Restaurants & food','Food bloggers, TikTok chefs, local influencers who drive foot traffic.','2,400+'],
              ['🛍','Retail & e-commerce','Fashion, beauty, and product creators who convert browsers to buyers.','4,100+'],
              ['💼','Agencies & brands','Full-scale campaign management for agencies running multiple brands.','800+'],
              ['🚀','Startups & DTC','Launch-ready networks for new products that need immediate awareness.','3,200+']].map(([ic,n,d,c])=>(
              <div className="icard" key={String(n)}>
                <div className="iico">{ic}</div>
                <div className="iname">{n}</div>
                <div className="idesc">{d}</div>
                <div className="icount">{c}</div>
              </div>
            ))}
          </div>
        </section>

        <div className="awards-row">
          {[['🏆','Top creator platform 2025','Influencer Marketing Hub'],['⭐','4.9 / 5 rating','800+ brand reviews'],['🔒','SOC 2 compliant','Enterprise-grade security'],['⚡','48-hour launch','Fastest in the industry']].map(([ic,t,s])=>(
            <div className="acard" key={String(t)}><div className="aico">{ic}</div><div className="atitle">{t}</div><div className="asub">{s}</div></div>
          ))}
        </div>

        <section className="price-sec" id="pricing">
          <div className="price-inner">
            <div className="sec-lbl">Pricing</div>
            <div className="sec-title">One price.<br/>Every platform.</div>
            <div className="pgrid">
              {[{tier:'Starter',price:'499',period:'per campaign',feats:['Up to 10 creators','5 platforms','Basic analytics','1 revision','Email support'],hot:false,plan:'starter'},
                {tier:'Growth — most popular',price:'1,499',period:'per campaign',feats:['Up to 50 creators','Unlimited platforms','Full analytics + ROI','Dedicated manager','3 revisions','Priority support'],hot:true,plan:'growth'},
                {tier:'Enterprise',price:'Custom',period:'monthly retainer',feats:['Unlimited creators','White-label','API access','Custom reporting','Account team','SLA guarantee'],hot:false,plan:'enterprise'}].map(p=>(
                <div className={`pcard${p.hot?' hot':''}`} key={p.tier}>
                  <div className="ptier">{p.tier}</div>
                  <div className="pnum">{p.price!=='Custom'?<><sup>$</sup>{p.price}</>:'Custom'}</div>
                  <div className="pper">{p.period}</div>
                  <div className="pline"></div>
                  <ul className="pfeats">{p.feats.map(f=><li key={f}>{f}</li>)}</ul>
                  <button className="pbtn" onClick={()=>p.plan==='enterprise'?window.location.href='mailto:hello@amplify.com':startCheckout(p.plan)} disabled={checkoutLoading===p.plan}>
                    {checkoutLoading===p.plan?'Loading…':p.plan==='enterprise'?'Contact sales':'Get started →'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="proof-sec">
          <div className="sec-lbl">Results</div>
          <div className="sec-title">Brands that amplified.</div>
          <div className="tgrid">
            {[{q:'"We reached 8 platforms simultaneously. What used to take 6 weeks happened in 3 days."',n:'Amelia Lawson',r:'CMO, Verdant Skincare',res:'8.2M impressions in 72hrs'},
              {q:'"We finally know which creator type actually drives sales. No agency ever gave us this."',n:'Tom Nakamura',r:'Head of Brand, Flux Athletics',res:'340% ROAS on first campaign'},
              {q:'"Amplify felt like a full creative agency for a fraction of the cost."',n:'Priya Desai',r:'Founder, Kova Coffee',res:'Sold out in 4 days'}].map(t=>(
              <div className="tcard" key={t.n}>
                <div className="tq">{t.q}</div>
                <div className="tn">{t.n}</div><div className="tr">{t.r}</div>
                <div className="tres">{t.res}</div>
              </div>
            ))}
          </div>
        </section>

        <div className="guar-row">
          {[['✓','Results guarantee','If your campaign misses targets, we run it again free.'],
            ['🔒','Vetted creators only','Every creator manually reviewed. No bots, no fake followers.'],
            ['⚡','48-hour launch','Brief to live in 48 hours or your first month is free.']].map(([ic,t,d])=>(
            <div className="gcard" key={String(t)}><div className="gico">{ic}</div><div><div className="gtitle">{t}</div><div className="gdesc">{d}</div></div></div>
          ))}
        </div>

        <div className="cta-bar">
          <h2>Ready to go everywhere at once?</h2>
          <p>Join 3,200+ brands already reaching millions through Amplify.</p>
          <div className="cta-btns">
            <button className="cta-blk" onClick={()=>document.getElementById('pricing')?.scrollIntoView({behavior:'smooth'})}>Launch your campaign →</button>
            <button className="cta-ghost" onClick={()=>setActiveView('apply')}>Join as a creator</button>
          </div>
        </div>

        <footer className="footer">
          <div className="flogo">AMPLI<span>FY</span></div>
          <div className="ftxt">© 2026 Amplify Inc. · Privacy · Terms · Contact</div>
        </footer>
      </main>}

      {activeView==='apply' && <div>
        <div className="back-bar"><button className="back-btn" onClick={()=>{setActiveView('home');reset()}}>← Back to Amplify</button></div>
        <div className="fhero">
          <div className="ftag">Join the network</div>
          <h1 className="fh1">Create with Amplify</h1>
          <p className="fsub">Apply to join our curated creator network and get matched with brand campaigns.</p>
          <div className="fperks">
            {['Campaigns matched to your niche','Single brief, multiple platforms','Transparent payments','No exclusivity'].map(p=>(
              <div className="fperk" key={p}><div className="fpdot"></div>{p}</div>
            ))}
          </div>
        </div>
        <div className="fbody">
          {!submitted ? <>
            <div className="steprow">
              {['Your info','Platforms','About you'].map((s,i)=>{
                const n=i+1; const cls=n<step?'done':n===step?'cur':'pend'
                return <div className="sind" key={s}>
                  <div className={`scirc ${cls}`}>{n<step?'✓':n}</div>
                  <span className={`slbl${n===step?' scur':''}`}>{s}</span>
                  {i<2&&<div className="sline"></div>}
                </div>
              })}
            </div>

            {step===1 && <div>
              <div className="ftitle">Personal info</div>
              <div className="fgrid">
                <div className="ff"><label>First name *</label><input value={form.first_name} onChange={e=>set('first_name',e.target.value)} placeholder="Jane"/></div>
                <div className="ff"><label>Last name *</label><input value={form.last_name} onChange={e=>set('last_name',e.target.value)} placeholder="Doe"/></div>
                <div className="ff"><label>Email *</label><input type="email" value={form.email} onChange={e=>set('email',e.target.value)} placeholder="jane@example.com"/></div>
                <div className="ff"><label>Phone</label><input value={form.phone} onChange={e=>set('phone',e.target.value)} placeholder="+1 555 000 0000"/></div>
                <div className="ff full"><label>Location</label><input value={form.location} onChange={e=>set('location',e.target.value)} placeholder="Los Angeles, CA"/></div>
              </div>
              <div className="ftitle" style={{marginTop:'1.5rem'}}>Creator type</div>
              <div className="ff">
                <label>Primary type</label>
                <select value={form.creator_type} onChange={e=>set('creator_type',e.target.value)}>
                  <option value="">Select one…</option>
                  {['Social media influencer','Blogger / website owner','Newsletter / Substack writer','Podcaster','YouTube creator','Journalist / editorial writer','Videographer','Other'].map(o=><option key={o}>{o}</option>)}
                </select>
              </div>
              <div className="ff">
                <label>Content niches</label>
                <div className="ntags">{NICHES.map(n=><div key={n} className={`ntag${form.niches.includes(n)?' sel':''}`} onClick={()=>toggleArr('niches',n)}>{n}</div>)}</div>
              </div>
              <div className="fnav"><span/><button className="bnext" onClick={()=>setStep(2)}>Continue →</button></div>
            </div>}

            {step===2 && <div>
              <div className="ftitle">Platform presence</div>
              <div className="ff">
                <label>Platforms you post on</label>
                <div className="ptogs">{PLATFORMS.map(p=><div key={p} className={`ptog${form.platforms.includes(p)?' sel':''}`} onClick={()=>toggleArr('platforms',p)}>{p}</div>)}</div>
              </div>
              <div className="fgrid">
                <div className="ff"><label>Largest platform</label>
                  <select value={form.primary_platform} onChange={e=>set('primary_platform',e.target.value)}>
                    <option value="">Select…</option>
                    {['Instagram','TikTok','YouTube','X / Twitter','Substack','Blog','Podcast','Other'].map(o=><option key={o}>{o}</option>)}
                  </select>
                </div>
                <div className="ff"><label>Follower count</label>
                  <select value={form.follower_range} onChange={e=>set('follower_range',e.target.value)}>
                    <option value="">Select range…</option>
                    {['Under 10K','10K–50K','50K–250K','250K–1M','1M+'].map(o=><option key={o}>{o}</option>)}
                  </select>
                </div>
                <div className="ff full"><label>Avg. engagement rate (%)</label><input value={form.engagement_rate} onChange={e=>set('engagement_rate',e.target.value)} placeholder="e.g. 4.2"/></div>
              </div>
              <div className="ff"><label>Profile link or media kit</label><input type="url" value={form.profile_link} onChange={e=>set('profile_link',e.target.value)} placeholder="https://instagram.com/you"/></div>
              <div className="fnav"><button className="bback" onClick={()=>setStep(1)}>← Back</button><button className="bnext" onClick={()=>setStep(3)}>Continue →</button></div>
            </div>}

            {step===3 && <div>
              <div className="ftitle">About you</div>
              <div className="ff"><label>Bio</label><textarea value={form.bio} onChange={e=>set('bio',e.target.value)} placeholder="Who you are and what makes your audience unique…"/></div>
              <div className="ff"><label>Past brand collabs</label><textarea value={form.past_brands} onChange={e=>set('past_brands',e.target.value)} placeholder="e.g. Nike, a local coffee brand — none yet is fine." style={{minHeight:'70px'}}/></div>
              <div className="fgrid">
                <div className="ff"><label>Typical rate per post</label>
                  <select value={form.rate_range} onChange={e=>set('rate_range',e.target.value)}>
                    <option value="">Select…</option>
                    {['Under $250','$250–$500','$500–$1,500','$1,500–$5,000','$5,000+','Open to negotiation'].map(o=><option key={o}>{o}</option>)}
                  </select>
                </div>
                <div className="ff"><label>Turnaround</label>
                  <select value={form.turnaround} onChange={e=>set('turnaround',e.target.value)}>
                    <option value="">Select…</option>
                    {['3–5 days','1 week','2 weeks','Depends on brief'].map(o=><option key={o}>{o}</option>)}
                  </select>
                </div>
              </div>
              <div className="ff"><label>Anything else?</label><textarea value={form.extra_notes} onChange={e=>set('extra_notes',e.target.value)} placeholder="Awards, press, audience details…" style={{minHeight:'65px'}}/></div>
              <div className="agrow">
                <input type="checkbox" id="terms" checked={agreed} onChange={e=>setAgreed(e.target.checked)}/>
                <label htmlFor="terms">I agree to Amplify's creator terms and my profile will be visible to brand partners upon approval.</label>
              </div>
              {error&&<div className="ferr">{error}</div>}
              <div className="fnav"><button className="bback" onClick={()=>setStep(2)}>← Back</button><button className="bnext" onClick={submitApplication} disabled={submitting}>{submitting?'Submitting…':'Submit application'}</button></div>
            </div>}
          </> : <div className="succ">
            <div className="succ-ico">✓</div>
            <h2>Application received!</h2>
            <p>Our team reviews within 3–5 business days. Check your inbox for a confirmation email.</p>
            <button className="bnext" onClick={reset}>Submit another</button>
          </div>}
        </div>
      </div>}

      <style jsx global>{`
        *{margin:0;padding:0;box-sizing:border-box}
        body{font-family:'Inter',sans-serif;background:#0a0a0a;color:#fff}
      `}</style>
      <style jsx>{`
        .nav{display:flex;justify-content:space-between;align-items:center;padding:1.25rem 2.5rem;border-bottom:1px solid #333;background:#0a0a0a;position:sticky;top:0;z-index:100}
        .logo{font-family:'Syne',sans-serif;font-size:1.4rem;font-weight:800;color:#fff}.logo span{color:#c8f53a}
        .nav-links{display:flex;gap:2rem;list-style:none;align-items:center}
        .nav-links a,.nav-link-btn{text-decoration:none;color:#888;font-size:0.85rem;background:none;border:none;cursor:pointer;padding:0;font-family:'Inter',sans-serif}.nav-links a:hover,.nav-link-btn:hover{color:#fff}
        .nav-cta{background:#c8f53a;color:#0a0a0a;padding:0.6rem 1.5rem;border-radius:2rem;font-size:0.85rem;font-weight:600;border:none;cursor:pointer;font-family:'Syne',sans-serif}
        .hero{padding:5rem 2.5rem 4rem;max-width:1100px;margin:0 auto;text-align:center}
        .what-it-is{display:inline-flex;align-items:center;gap:0.75rem;background:#111;border:1px solid #333;border-radius:2rem;padding:0.6rem 1.25rem;font-size:0.85rem;color:#888;margin-bottom:2.5rem}
        .wit-dot{width:8px;height:8px;border-radius:50%;background:#c8f53a;flex-shrink:0}
        .wit-text{color:#fff;font-weight:500}
        h1{font-family:'Syne',sans-serif;font-size:4.5rem;font-weight:800;line-height:1.05;letter-spacing:-2px;color:#fff;margin-bottom:1.5rem}
        h1 .accent{color:#c8f53a}
        .hero-explainer{font-size:1.15rem;color:#888;line-height:1.8;font-weight:300;max-width:680px;margin:0 auto 2.5rem}
        .hero-explainer strong{color:#fff;font-weight:500}
        .how-strip{display:flex;align-items:center;margin:0 auto 2.5rem;background:#111;border:1px solid #333;border-radius:1rem;overflow:hidden;max-width:680px}
        .hs-step{padding:1.25rem 1.75rem;flex:1;text-align:center;border-right:1px solid #333}.hs-step:last-child{border-right:none}
        .hs-num{font-size:0.65rem;color:#c8f53a;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:0.35rem}
        .hs-label{font-size:0.85rem;color:#fff;font-weight:500}
        .hero-cta-row{display:flex;gap:1rem;justify-content:center;margin-bottom:2.5rem}
        .hero-proof{display:flex;align-items:center;justify-content:center;gap:2.5rem;padding:1.5rem;background:#111;border:1px solid #333;border-radius:1rem;max-width:680px;margin:0 auto 3rem}
        .hp-item{text-align:center}.hp-num{font-family:'Syne',sans-serif;font-size:1.75rem;font-weight:800;color:#fff}.hp-lbl{font-size:0.72rem;color:#888;margin-top:2px}
        .hp-div{width:1px;height:40px;background:#333}
        .example-box{background:#111;border:1px solid #333;border-radius:1rem;overflow:hidden;max-width:800px;margin:0 auto}
        .ex-header{background:#c8f53a;padding:1rem 1.5rem}
        .ex-title{font-family:'Syne',sans-serif;font-weight:700;font-size:0.9rem;color:#0a0a0a}
        .ex-sub{font-size:0.75rem;color:rgba(0,0,0,0.5);margin-top:2px}
        .ex-body{padding:1.25rem;display:grid;grid-template-columns:1fr 1fr 1fr;gap:0.75rem}
        .ex-card{background:#0a0a0a;border:1px solid #222;border-radius:0.75rem;padding:1rem}
        .ex-platform{font-size:0.65rem;color:#c8f53a;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;margin-bottom:0.35rem}
        .ex-creator{font-size:0.85rem;color:#fff;font-weight:500;margin-bottom:0.2rem}
        .ex-reach{font-size:0.75rem;color:#888}
        .ex-footer{padding:1rem 1.5rem;border-top:1px solid #333;display:flex;justify-content:space-between;align-items:center}
        .ex-total{font-size:0.82rem;color:#888}.ex-total span{color:#c8f53a;font-weight:600}
        .ex-price{font-family:'Syne',sans-serif;font-size:1.1rem;font-weight:700;color:#fff}
        .btn-lime{background:#c8f53a;color:#0a0a0a;padding:1rem 2.5rem;border-radius:2rem;font-size:1rem;font-weight:700;border:none;cursor:pointer;font-family:'Syne',sans-serif}
        .btn-ghost{background:none;color:#fff;padding:1rem 2rem;border-radius:2rem;font-size:0.9rem;border:1px solid #333;cursor:pointer}
        .ticker-wrap{border-top:1px solid #333;border-bottom:1px solid #333;padding:1rem 0;overflow:hidden;background:#111}
        .ticker{display:flex;white-space:nowrap;animation:tick 28s linear infinite}
        @keyframes tick{from{transform:translateX(0)}to{transform:translateX(-50%)}}
        .t-item{display:inline-flex;align-items:center;gap:0.75rem;padding:0 2rem;font-size:0.8rem;color:#888;letter-spacing:0.05em;text-transform:uppercase}
        .t-sep{color:#c8f53a}
        .trust-bar{padding:2.5rem;border-bottom:1px solid #333;background:#111}
        .trust-lbl{font-size:0.7rem;color:#888;letter-spacing:0.1em;text-transform:uppercase;text-align:center;margin-bottom:1.75rem}
        .trust-row{display:flex;justify-content:center;flex-wrap:wrap}
        .t-logo{padding:0.75rem 2rem;border-right:1px solid #333;text-align:center}.t-logo:last-child{border-right:none}
        .t-name{font-family:'Syne',sans-serif;font-size:1rem;font-weight:800;color:#555}.t-sub{font-size:0.6rem;color:#333;letter-spacing:0.08em;text-transform:uppercase;margin-top:2px}
        .stats-strip{display:grid;grid-template-columns:repeat(4,1fr);border-bottom:1px solid #333}
        .s-block{padding:2.5rem;border-right:1px solid #333;text-align:center}.s-block:last-child{border-right:none}
        .s-big{font-family:'Syne',sans-serif;font-size:3rem;font-weight:800;color:#c8f53a}.s-lbl{font-size:0.8rem;color:#888;margin-top:0.25rem}
        .pill-strip{padding:2.5rem;border-bottom:1px solid #333;background:#111}
        .pill-lbl{font-size:0.7rem;color:#888;letter-spacing:0.1em;text-transform:uppercase;margin-bottom:1.5rem}
        .pill-row{display:flex;gap:0.75rem;flex-wrap:wrap}
        .npill{background:#0a0a0a;border:1px solid #333;border-radius:2rem;padding:0.5rem 1rem;font-size:0.8rem;color:#888;display:flex;align-items:center;gap:0.5rem}
        .ndot{width:5px;height:5px;border-radius:50%;background:#c8f53a;flex-shrink:0}
        .creators-sec{padding:5rem 2.5rem;max-width:1200px;margin:0 auto}
        .sec-header{display:flex;justify-content:space-between;align-items:flex-end;margin-bottom:3rem}
        .sec-lbl{font-size:0.72rem;color:#c8f53a;letter-spacing:0.1em;text-transform:uppercase;font-weight:500;margin-bottom:0.5rem}
        .sec-title{font-family:'Syne',sans-serif;font-size:3rem;font-weight:800;color:#fff;letter-spacing:-1px;line-height:1.05}
        .sec-desc{font-size:0.9rem;color:#888;max-width:280px;line-height:1.7;text-align:right}
        .cwall{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:#333;border:1px solid #333;border-radius:1rem;overflow:hidden}
        .ctile{background:#111;padding:1.75rem;cursor:pointer;position:relative}.ctile:hover{background:#1a1a1a}
        .ctile.featured{background:#c8f53a;grid-column:span 2}.ctile.featured:hover{background:#b8e030}
        .ct-top{display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:1.25rem}
        .cavatar{width:48px;height:48px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-family:'Syne',sans-serif;font-size:1rem;font-weight:700;color:#fff;flex-shrink:0}
        .ctile.featured .cavatar{color:#0a0a0a}
        .cbadge{font-size:0.65rem;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;padding:4px 10px;border-radius:2rem;border:1px solid #333;color:#888}
        .ctile.featured .cbadge{border-color:rgba(0,0,0,0.2);color:rgba(0,0,0,0.6);background:rgba(0,0,0,0.08)}
        .cname{font-family:'Syne',sans-serif;font-size:1.1rem;font-weight:700;color:#fff;margin-bottom:0.2rem}
        .ctile.featured .cname{color:#0a0a0a;font-size:1.4rem}
        .ctype{font-size:0.78rem;color:#888;margin-bottom:1rem}.ctile.featured .ctype{color:rgba(0,0,0,0.55)}
        .cplats{display:flex;gap:0.4rem;flex-wrap:wrap;margin-bottom:1rem}
        .cplats span{font-size:0.65rem;padding:3px 8px;border-radius:2rem;background:#333;color:#888}
        .ctile.featured .cplats span{background:rgba(0,0,0,0.12);color:rgba(0,0,0,0.6)}
        .cstat{font-family:'Syne',sans-serif;font-size:1.5rem;font-weight:700;color:#fff}.ctile.featured .cstat{color:#0a0a0a;font-size:2rem}
        .cstat-lbl{font-size:0.7rem;color:#888;margin-top:2px}.ctile.featured .cstat-lbl{color:rgba(0,0,0,0.5)}
        .carrow{position:absolute;bottom:1.5rem;right:1.5rem;width:32px;height:32px;border-radius:50%;border:1px solid #333;display:flex;align-items:center;justify-content:center;color:#888}
        .ctile.featured .carrow{border-color:rgba(0,0,0,0.2);color:rgba(0,0,0,0.5)}
        .how-sec{background:#111;border-top:1px solid #333;border-bottom:1px solid #333;padding:5rem 2.5rem}
        .how-inner{max-width:1200px;margin:0 auto}
        .how-big{font-family:'Syne',sans-serif;font-size:3rem;font-weight:800;color:#fff;letter-spacing:-1px;margin-top:0.5rem}
        .how-grid{display:grid;grid-template-columns:repeat(3,1fr);margin-top:3rem;border:1px solid #333;border-radius:1rem;overflow:hidden}
        .hstep{padding:2.5rem;border-right:1px solid #333}.hstep:last-child{border-right:none}
        .hnum{font-family:'Syne',sans-serif;font-size:4rem;font-weight:800;color:#333;line-height:1;margin-bottom:1.5rem}
        .htitle{font-family:'Syne',sans-serif;font-size:1.1rem;font-weight:700;color:#fff;margin-bottom:0.75rem}
        .hdesc{font-size:0.85rem;color:#888;line-height:1.75;font-weight:300}
        .htag{display:inline-block;background:#c8f53a;color:#0a0a0a;font-size:0.65rem;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;padding:4px 10px;border-radius:2rem;margin-top:1.25rem}
        .ind-sec{padding:5rem 2.5rem;max-width:1200px;margin:0 auto}
        .ind-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:#333;border:1px solid #333;border-radius:1rem;overflow:hidden;margin-top:3rem}
        .icard{background:#111;padding:2rem 1.5rem}.icard:hover{background:#1a1a1a}
        .iico{font-size:1.4rem;margin-bottom:1.25rem;display:block}
        .iname{font-family:'Syne',sans-serif;font-size:1rem;font-weight:700;color:#fff;margin-bottom:0.5rem}
        .idesc{font-size:0.8rem;color:#888;line-height:1.6}
        .icount{font-family:'Syne',sans-serif;font-size:1.5rem;font-weight:700;color:#c8f53a;margin-top:1rem}
        .awards-row{display:grid;grid-template-columns:repeat(4,1fr);gap:1px;background:#333;border-top:1px solid #333;border-bottom:1px solid #333}
        .acard{background:#111;padding:1.5rem;text-align:center}
        .aico{font-size:1.5rem;margin-bottom:0.5rem;display:block}
        .atitle{font-family:'Syne',sans-serif;font-size:0.85rem;font-weight:700;color:#fff;margin-bottom:0.25rem}
        .asub{font-size:0.72rem;color:#888}
        .price-sec{background:#111;border-top:1px solid #333;padding:5rem 2.5rem}
        .price-inner{max-width:1200px;margin:0 auto}
        .pgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:#333;border:1px solid #333;border-radius:1rem;overflow:hidden;margin-top:3rem}
        .pcard{background:#111;padding:2.5rem}.pcard.hot{background:#c8f53a}
        .ptier{font-size:0.7rem;font-weight:600;letter-spacing:0.1em;text-transform:uppercase;color:#888;margin-bottom:1.25rem}.pcard.hot .ptier{color:rgba(0,0,0,0.5)}
        .pnum{font-family:'Syne',sans-serif;font-size:3.5rem;font-weight:800;color:#fff;line-height:1}.pcard.hot .pnum{color:#0a0a0a}
        .pnum sup{font-size:1.5rem;vertical-align:super}
        .pper{font-size:0.8rem;color:#888;margin-bottom:1.5rem}.pcard.hot .pper{color:rgba(0,0,0,0.5)}
        .pline{height:1px;background:#333;margin-bottom:1.5rem}.pcard.hot .pline{background:rgba(0,0,0,0.15)}
        .pfeats{list-style:none;margin-bottom:2rem}
        .pfeats li{font-size:0.85rem;color:#888;padding:0.4rem 0;display:flex;align-items:center;gap:0.5rem}
        .pcard.hot .pfeats li{color:rgba(0,0,0,0.7)}
        .pfeats li::before{content:'';width:4px;height:4px;border-radius:50%;background:#c8f53a;flex-shrink:0}
        .pcard.hot .pfeats li::before{background:#0a0a0a}
        .pbtn{width:100%;padding:0.85rem;border-radius:2rem;font-size:0.875rem;font-weight:600;cursor:pointer;border:1px solid #333;background:none;color:#fff;font-family:'Syne',sans-serif;transition:border-color 0.2s,color 0.2s}
        .pbtn:hover{border-color:#c8f53a;color:#c8f53a}.pbtn:disabled{opacity:0.6;cursor:not-allowed}
        .pcard.hot .pbtn{background:#0a0a0a;color:#fff;border-color:#0a0a0a}
        .proof-sec{padding:5rem 2.5rem;max-width:1200px;margin:0 auto}
        .tgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:#333;border:1px solid #333;border-radius:1rem;overflow:hidden;margin-top:3rem}
        .tcard{background:#111;padding:2rem}
        .tq{font-size:0.9rem;color:#888;line-height:1.75;font-style:italic;margin-bottom:1.5rem;font-weight:300}
        .tn{font-family:'Syne',sans-serif;font-size:0.9rem;font-weight:700;color:#fff}
        .tr{font-size:0.75rem;color:#888;margin-top:2px}
        .tres{display:inline-block;background:rgba(200,245,58,0.1);border:1px solid rgba(200,245,58,0.3);color:#c8f53a;font-size:0.72rem;font-weight:600;padding:3px 10px;border-radius:2rem;margin-top:0.75rem}
        .guar-row{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:#333;border-top:1px solid #333;border-bottom:1px solid #333}
        .gcard{background:#111;padding:2rem;display:flex;align-items:flex-start;gap:1rem}
        .gico{width:40px;height:40px;border-radius:0.6rem;background:rgba(200,245,58,0.1);border:1px solid rgba(200,245,58,0.2);display:flex;align-items:center;justify-content:center;font-size:1rem;flex-shrink:0}
        .gtitle{font-family:'Syne',sans-serif;font-size:0.95rem;font-weight:700;color:#fff;margin-bottom:0.35rem}
        .gdesc{font-size:0.8rem;color:#888;line-height:1.6}
        .cta-bar{background:#c8f53a;padding:4rem 2.5rem;text-align:center}
        .cta-bar h2{font-family:'Syne',sans-serif;font-size:3.5rem;font-weight:800;color:#0a0a0a;letter-spacing:-1px;margin-bottom:1rem}
        .cta-bar p{font-size:1rem;color:rgba(0,0,0,0.6);margin-bottom:2rem;font-weight:300}
        .cta-btns{display:flex;gap:1rem;justify-content:center}
        .cta-blk{background:#0a0a0a;color:#fff;padding:1rem 2.5rem;border-radius:2rem;font-size:1rem;font-weight:700;border:none;cursor:pointer;font-family:'Syne',sans-serif}
        .cta-ghost{background:none;color:#0a0a0a;padding:1rem 2rem;border-radius:2rem;font-size:0.9rem;border:1px solid rgba(0,0,0,0.3);cursor:pointer}
        .footer{padding:2rem 2.5rem;border-top:1px solid #333;display:flex;justify-content:space-between;align-items:center;background:#0a0a0a}
        .flogo{font-family:'Syne',sans-serif;font-size:1.1rem;font-weight:800;color:#fff}.flogo span{color:#c8f53a}
        .ftxt{font-size:0.78rem;color:#888}
        /* APPLY FORM */
        .back-bar{padding:1rem 2.5rem;background:#0a0a0a;border-bottom:1px solid #333}
        .back-btn{background:none;border:none;color:#888;font-size:0.875rem;cursor:pointer;font-family:'Inter',sans-serif}.back-btn:hover{color:#fff}
        .fhero{background:#111;border-bottom:1px solid #333;padding:3.5rem 2.5rem 2.5rem}
        .ftag{font-size:0.7rem;font-weight:500;letter-spacing:0.1em;text-transform:uppercase;color:#c8f53a;margin-bottom:0.75rem}
        .fh1{font-family:'Syne',sans-serif;font-size:2.5rem;font-weight:800;line-height:1.1;margin-bottom:0.75rem;color:#fff;letter-spacing:-1px}
        .fsub{font-size:0.9rem;color:#888;max-width:500px;line-height:1.7;font-weight:300}
        .fperks{display:flex;gap:2rem;margin-top:2rem;flex-wrap:wrap}
        .fperk{display:flex;align-items:center;gap:0.5rem;font-size:0.8rem;color:#888}
        .fpdot{width:6px;height:6px;border-radius:50%;background:#c8f53a;flex-shrink:0}
        .fbody{max-width:760px;margin:0 auto;padding:2.5rem}
        .steprow{display:flex;align-items:center;margin-bottom:2.5rem}
        .sind{display:flex;align-items:center;gap:0.5rem;flex:1}.sind:last-child{flex:none}
        .scirc{width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:0.75rem;font-weight:500;flex-shrink:0;background:#222;color:#888;border:1px solid #333}
        .scirc.done,.scirc.cur{background:#c8f53a;color:#0a0a0a;border-color:#c8f53a}
        .slbl{font-size:0.78rem;color:#888}.scur{color:#c8f53a;font-weight:500}
        .sline{flex:1;height:1px;background:#333;margin:0 0.75rem}
        .ftitle{font-size:0.75rem;font-weight:500;letter-spacing:0.08em;text-transform:uppercase;color:#888;margin-bottom:1.25rem;padding-bottom:0.5rem;border-bottom:1px solid #333}
        .fgrid{display:grid;grid-template-columns:1fr 1fr;gap:1rem}
        .ff{display:flex;flex-direction:column;gap:0.4rem;margin-bottom:1rem}.ff.full{grid-column:1/-1}
        .ff label{font-size:0.8rem;color:#888;font-weight:500}
        .ff input,.ff select,.ff textarea{padding:0.65rem 0.875rem;border-radius:0.5rem;border:1px solid #333;background:#0a0a0a;font-size:0.875rem;color:#fff;font-family:'Inter',sans-serif;outline:none;width:100%}
        .ff input:focus,.ff select:focus,.ff textarea:focus{border-color:#c8f53a}
        .ff textarea{resize:vertical;min-height:80px;line-height:1.6}
        .ff select option{background:#0a0a0a}
        .ptogs{display:grid;grid-template-columns:repeat(4,1fr);gap:0.6rem;margin-bottom:0.5rem}
        .ptog{padding:0.6rem 0.5rem;border-radius:0.6rem;border:1px solid #333;background:#222;font-size:0.78rem;color:#888;cursor:pointer;text-align:center;user-select:none}
        .ptog.sel{border-color:#c8f53a;background:rgba(200,245,58,0.1);color:#c8f53a;font-weight:500}
        .ntags{display:flex;flex-wrap:wrap;gap:0.5rem;margin-bottom:0.5rem}
        .ntag{padding:0.4rem 0.9rem;border-radius:2rem;border:1px solid #333;background:#222;font-size:0.78rem;color:#888;cursor:pointer;user-select:none}
        .ntag.sel{border-color:#c8f53a;background:rgba(200,245,58,0.1);color:#c8f53a;font-weight:500}
        .agrow{display:flex;align-items:flex-start;gap:0.5rem;margin-top:0.5rem}
        .agrow input{margin-top:3px;width:auto;accent-color:#c8f53a}
        .agrow label{font-size:0.8rem;color:#888;cursor:pointer}
        .ferr{background:rgba(226,75,74,0.1);border:1px solid #E24B4A;color:#F09595;border-radius:0.5rem;padding:0.75rem 1rem;font-size:0.85rem;margin-top:1rem}
        .fnav{display:flex;justify-content:space-between;align-items:center;padding:1.5rem 0 0;border-top:1px solid #333;margin-top:1rem}
        .bback{background:none;border:1px solid #333;padding:0.7rem 1.5rem;border-radius:2rem;font-size:0.875rem;color:#888;cursor:pointer;font-family:'Inter',sans-serif}
        .bnext{background:#c8f53a;color:#0a0a0a;border:none;padding:0.7rem 2rem;border-radius:2rem;font-size:0.875rem;font-weight:700;cursor:pointer;font-family:'Syne',sans-serif}
        .bnext:disabled{opacity:0.6;cursor:not-allowed}
        .succ{text-align:center;padding:4rem 2rem}
        .succ-ico{width:64px;height:64px;border-radius:50%;background:rgba(200,245,58,0.1);border:2px solid #c8f53a;display:flex;align-items:center;justify-content:center;margin:0 auto 1.5rem;font-size:1.75rem;color:#c8f53a}
        .succ h2{font-family:'Syne',sans-serif;font-size:2rem;font-weight:800;margin-bottom:0.75rem;color:#fff}
        .succ p{color:#888;line-height:1.7;font-weight:300;max-width:400px;margin:0 auto 2rem}
      `}</style>
    </>
  )
}
