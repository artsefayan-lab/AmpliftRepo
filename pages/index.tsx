import Head from 'next/head'
import { useState } from 'react'
import styles from '@/styles/Home.module.css'

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

  async function startCheckout(plan: string) {
    setCheckoutLoading(plan)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ plan }),
      })
      const data = await res.json()
      if (data.url) window.location.href = data.url
    } catch (e) {
      alert('Something went wrong. Please try again.')
    } finally {
      setCheckoutLoading('')
    }
  }

  function set(field: keyof FormData, val: any) { setForm(f => ({...f, [field]: val})) }

  function toggleArr(field: 'niches'|'platforms', val: string) {
    setForm(f => ({
      ...f,
      [field]: f[field].includes(val) ? f[field].filter(x=>x!==val) : [...f[field], val]
    }))
  }

  async function submitApplication() {
    if (!agreed) { setError('Please agree to the creator terms to continue.'); return }
    setSubmitting(true); setError('')
    try {
      const res = await fetch('/api/apply', {
        method: 'POST',
        headers: {'Content-Type':'application/json'},
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Submission failed')
      setSubmitted(true)
    } catch(e:any) {
      setError(e.message)
    } finally {
      setSubmitting(false)
    }
  }

  function reset() { setForm(empty); setStep(1); setSubmitted(false); setAgreed(false); setError('') }

  const steps = ['Your info','Platforms','About you']

  return (
    <>
      <Head>
        <title>Amplify — Multi-platform creator network</title>
        <meta name="description" content="Connect your brand to a curated network of influencers, bloggers, writers, and social media creators." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <nav className="nav">
        <div className="logo">Ampli<span>fy</span></div>
        <ul className="nav-links">
          <li><a href="#how">How it works</a></li>
          <li><a href="#creators">Creators</a></li>
          <li><a href="#pricing">Pricing</a></li>
          <li><button className="nav-link-btn" onClick={()=>setActiveView('apply')}>Join as creator</button></li>
        </ul>
        <button className="nav-cta" onClick={()=>document.getElementById('pricing')?.scrollIntoView({behavior:'smooth'})}>Start for free</button>
      </nav>

      {activeView === 'home' && (
        <main>
          {/* HERO */}
          <section className="hero">
            <div className="hero-text">
              <div className="tag">Multi-platform advertising network</div>
              <h1>One brief.<br/><em>Every</em> platform.<br/>Unlimited reach.</h1>
              <p className="hero-sub">Connect your brand to a curated network of influencers, bloggers, writers, and social media creators — all from a single campaign, at a single price.</p>
              <div className="hero-actions">
                <button className="btn-primary" onClick={()=>document.getElementById('pricing')?.scrollIntoView({behavior:'smooth'})}>Launch your campaign</button>
                <button className="btn-ghost" onClick={()=>document.getElementById('how')?.scrollIntoView({behavior:'smooth'})}>See how it works</button>
              </div>
            </div>
            <div className="hero-visual">
              <div className="platform-card pc-main">
                <div className="pc-label">Your matched creators</div>
                <div className="pc-title">Nike Air Max launch</div>
                {[{i:'KL',bg:'#1a3a2a',n:'Kira Lund',r:'2.4M followers · Instagram',s:'98%'},
                  {i:'MJ',bg:'#7a6022',n:'Marco Jimenez',r:'890K · YouTube + Blog',s:'94%'},
                  {i:'SR',bg:'#4a1528',n:'Sasha Reeves',r:'410K · TikTok + Substack',s:'91%'}].map(c=>(
                  <div className="creator-row" key={c.n}>
                    <div className="avatar" style={{background:c.bg}}>{c.i}</div>
                    <div className="creator-info"><div className="creator-name">{c.n}</div><div className="creator-reach">{c.r}</div></div>
                    <div className="match-score">{c.s}</div>
                  </div>
                ))}
              </div>
              <div className="platform-card pc-notif">
                <div className="notif-row">
                  <div className="notif-icon">★</div>
                  <div className="notif-text">Campaign live on <strong>12 platforms</strong> — 3.2M impressions in 4hrs</div>
                </div>
              </div>
              <div className="platform-card pc-stat">
                <div className="stat-big">$0.004</div>
                <div className="stat-lbl">avg. cost per impression</div>
              </div>
            </div>
          </section>

          {/* STATS */}
          <div className="stats-bar">
            {[['14,800+','verified creators'],['60+','platforms covered'],['3,200','brands launched'],['4.8B','total impressions']].map(([n,l])=>(
              <div className="stat-item" key={l}><div className="snum">{n}</div><div className="sdesc">{l}</div></div>
            ))}
          </div>

          {/* HOW */}
          <section className="section" id="how">
            <div className="section-tag">How it works</div>
            <h2>Three steps to everywhere</h2>
            <p className="section-sub">No agency middlemen. No platform-by-platform negotiations. Just your message reaching the right audiences at scale.</p>
            <div className="how-grid">
              {[['01','Submit your brief','Tell us about your brand, goals, target audience, and budget. Our system intelligently matches you with the most relevant creators across platforms.'],
                ['02','Approve your network','Review matched creators — influencers, bloggers, TikTokers, newsletter writers, and more. Approve, swap, or customize your team in minutes.'],
                ['03','Watch it scale','Creators publish simultaneously across their platforms. You get a live dashboard tracking impressions, engagement, clicks, and ROI in real time.']].map(([n,t,d])=>(
                <div className="step-card" key={n}><div className="step-num">{n}</div><h3>{t}</h3><p>{d}</p></div>
              ))}
            </div>
          </section>

          {/* CREATORS SECTION */}
          <section className="creators-dark" id="creators">
            <div className="section-tag" style={{color:'var(--accent3)'}}>Creator network</div>
            <h2 style={{color:'#fff'}}>Every voice, every platform</h2>
            <p className="section-sub" style={{color:'rgba(255,255,255,0.6)'}}>From micro-influencers with tight-knit communities to macro names with millions of followers — across every medium that matters.</p>
            <div className="type-grid">
              {[['📸','Social influencers','Instagram, TikTok, YouTube, Pinterest, X'],
                ['✍️','Writers & bloggers','Substack, Medium, personal blogs, editorial'],
                ['🎙️','Podcasters','Spotify, Apple, indie shows across niches'],
                ['📧','Newsletter authors','High-engagement email audiences by industry']].map(([i,t,d])=>(
                <div className="type-card" key={t}>
                  <span className="type-icon">{i}</span>
                  <h4>{t}</h4><p>{d}</p>
                </div>
              ))}
            </div>
            <div style={{marginTop:'2.5rem',textAlign:'center'}}>
              <button className="btn-creator" onClick={()=>setActiveView('apply')}>Apply to join as a creator →</button>
            </div>
          </section>

          {/* PRICING */}
          <section className="section" id="pricing">
            <div className="section-tag">Pricing</div>
            <h2>One price, everything</h2>
            <p className="section-sub">No per-platform fees, no creator negotiation costs. Pay once, reach everywhere.</p>
            <div className="pricing-grid">
              {[
                {name:'Starter',price:'499',period:'per campaign',desc:'Perfect for testing influencer marketing with a focused campaign.',features:['Up to 10 creators','5 platforms covered','Basic analytics','1 revision round','Email support'],featured:false},
                {name:'Growth',price:'1,499',period:'per campaign',desc:'For brands ready to go wide with a multi-platform creator push.',features:['Up to 50 creators','Unlimited platforms','Full analytics + ROI','Dedicated campaign manager','3 revision rounds','Priority support'],featured:true},
                {name:'Enterprise',price:'Custom',period:'monthly retainer',desc:'Ongoing creator partnerships at scale for large brands and agencies.',features:['Unlimited creators','White-label options','API access','Custom reporting','Dedicated account team','SLA guarantee'],featured:false},
              ].map(p=>(
                <div className={`price-card${p.featured?' featured':''}`} key={p.name}>
                  {p.featured && <div className="featured-badge">Most popular</div>}
                  <div className="price-name">{p.name}</div>
                  <div className="price-amount">{p.price !== 'Custom' ? <><sup>$</sup>{p.price}</> : 'Custom'}</div>
                  <div className="price-period">{p.period}</div>
                  <div className="price-desc">{p.desc}</div>
                  <ul className="price-features">{p.features.map(f=><li key={f}>{f}</li>)}</ul>
                  <button className={`price-btn${p.featured?' price-btn-primary':''}`} onClick={()=>p.name==='Enterprise'?window.location.href='mailto:hello@amplify.com':startCheckout(p.name.toLowerCase())} disabled={checkoutLoading===p.name.toLowerCase()}>{checkoutLoading===p.name.toLowerCase()?'Loading…':p.name==='Enterprise'?'Contact sales':'Get started'}</button>
                </div>
              ))}
            </div>
          </section>

          {/* CTA */}
          <section className="cta-section">
            <div className="cta-inner">
              <div className="section-tag" style={{display:'inline-block',marginBottom:'0.75rem'}}>Get started today</div>
              <h2>Your next campaign, everywhere at once.</h2>
              <p>Join 3,200+ brands already reaching millions through Amplify's creator network.</p>
              <div className="cta-actions">
                <button className="btn-primary" onClick={()=>document.getElementById('pricing')?.scrollIntoView({behavior:'smooth'})}>Launch your campaign</button>
                <button className="btn-ghost" onClick={()=>setActiveView('apply')}>Join as a creator</button>
              </div>
            </div>
          </section>

          <footer className="footer">
            <div className="footer-logo">Ampli<span>fy</span></div>
            <div className="footer-text">© 2026 Amplify Inc. · Privacy · Terms · Contact</div>
          </footer>
        </main>
      )}

      {activeView === 'apply' && (
        <div>
          <div className="apply-back">
            <button onClick={()=>{setActiveView('home');reset()}} className="back-btn">← Back to Amplify</button>
          </div>
          <div className="form-hero">
            <div className="form-tag">Join the network</div>
            <h1 className="form-h1">Create with Amplify</h1>
            <p className="form-sub">Apply to join our curated creator network and get matched with brand campaigns across your platforms.</p>
            <div className="perks">
              {['Campaigns matched to your niche','Single brief, multiple platforms','Transparent, on-time payments','No exclusivity required'].map(p=>(
                <div className="perk" key={p}><div className="perk-dot"></div>{p}</div>
              ))}
            </div>
          </div>

          <div className="form-body">
            {!submitted ? (
              <>
                {/* Step indicators */}
                <div className="step-indicators">
                  {steps.map((s,i)=>{
                    const n=i+1
                    const cls = n<step?'done':n===step?'current':'pending'
                    return (
                      <div className="step-ind" key={s}>
                        <div className={`step-circle ${cls}`}>{n<step?'✓':n}</div>
                        <span className={`step-label${n===step?' step-current':''}`}>{s}</span>
                        {i<steps.length-1 && <div className="step-line"></div>}
                      </div>
                    )
                  })}
                </div>

                {/* STEP 1 */}
                {step===1 && (
                  <div>
                    <div className="fsec-title">Personal info</div>
                    <div className="field-grid">
                      <div className="field"><label>First name *</label><input value={form.first_name} onChange={e=>set('first_name',e.target.value)} placeholder="Jane"/></div>
                      <div className="field"><label>Last name *</label><input value={form.last_name} onChange={e=>set('last_name',e.target.value)} placeholder="Doe"/></div>
                      <div className="field"><label>Email address *</label><input type="email" value={form.email} onChange={e=>set('email',e.target.value)} placeholder="jane@example.com"/></div>
                      <div className="field"><label>Phone (optional)</label><input value={form.phone} onChange={e=>set('phone',e.target.value)} placeholder="+1 555 000 0000"/></div>
                      <div className="field full"><label>Location / city</label><input value={form.location} onChange={e=>set('location',e.target.value)} placeholder="Los Angeles, CA"/></div>
                    </div>
                    <div className="fsec-title" style={{marginTop:'1.5rem'}}>Creator type</div>
                    <div className="field">
                      <label>Primary creator type</label>
                      <select value={form.creator_type} onChange={e=>set('creator_type',e.target.value)}>
                        <option value="">Select one…</option>
                        {['Social media influencer','Blogger / website owner','Newsletter / Substack writer','Podcaster','YouTube creator','Journalist / editorial writer','Videographer / short-form creator','Other'].map(o=><option key={o}>{o}</option>)}
                      </select>
                    </div>
                    <div className="field">
                      <label>Content niches (select all that apply)</label>
                      <div className="niche-grid">
                        {NICHES.map(n=><div key={n} className={`niche-tag${form.niches.includes(n)?' selected':''}`} onClick={()=>toggleArr('niches',n)}>{n}</div>)}
                      </div>
                    </div>
                    <div className="form-nav"><span/><button className="btn-next" onClick={()=>setStep(2)}>Continue →</button></div>
                  </div>
                )}

                {/* STEP 2 */}
                {step===2 && (
                  <div>
                    <div className="fsec-title">Platform presence</div>
                    <div className="field">
                      <label>Platforms you post on</label>
                      <div className="platform-grid">
                        {PLATFORMS.map(p=><div key={p} className={`plat-toggle${form.platforms.includes(p)?' selected':''}`} onClick={()=>toggleArr('platforms',p)}>{p}</div>)}
                      </div>
                    </div>
                    <div className="field-grid">
                      <div className="field">
                        <label>Largest following (platform)</label>
                        <select value={form.primary_platform} onChange={e=>set('primary_platform',e.target.value)}>
                          <option value="">Select platform…</option>
                          {['Instagram','TikTok','YouTube','X / Twitter','Substack','Blog / website','Podcast','Other'].map(o=><option key={o}>{o}</option>)}
                        </select>
                      </div>
                      <div className="field">
                        <label>Follower / subscriber count</label>
                        <select value={form.follower_range} onChange={e=>set('follower_range',e.target.value)}>
                          <option value="">Select range…</option>
                          {['Under 10K (nano)','10K – 50K (micro)','50K – 250K (mid-tier)','250K – 1M (macro)','1M+ (mega)'].map(o=><option key={o}>{o}</option>)}
                        </select>
                      </div>
                      <div className="field full">
                        <label>Average engagement rate (%)</label>
                        <input value={form.engagement_rate} onChange={e=>set('engagement_rate',e.target.value)} placeholder="e.g. 4.2"/>
                      </div>
                    </div>
                    <div className="field">
                      <label>Link to your best-performing platform or media kit</label>
                      <input type="url" value={form.profile_link} onChange={e=>set('profile_link',e.target.value)} placeholder="https://instagram.com/yourhandle"/>
                    </div>
                    <div className="form-nav">
                      <button className="btn-back" onClick={()=>setStep(1)}>← Back</button>
                      <button className="btn-next" onClick={()=>setStep(3)}>Continue →</button>
                    </div>
                  </div>
                )}

                {/* STEP 3 */}
                {step===3 && (
                  <div>
                    <div className="fsec-title">About you</div>
                    <div className="field">
                      <label>Bio / elevator pitch</label>
                      <textarea value={form.bio} onChange={e=>set('bio',e.target.value)} placeholder="Tell brands who you are, what you create, and what makes your audience unique…"/>
                    </div>
                    <div className="field">
                      <label>Past brand collaborations (if any)</label>
                      <textarea value={form.past_brands} onChange={e=>set('past_brands',e.target.value)} placeholder="e.g. Nike, a sustainable skincare brand — or 'none yet' is totally fine." style={{minHeight:'70px'}}/>
                    </div>
                    <div className="field-grid">
                      <div className="field">
                        <label>Typical rate per post / article</label>
                        <select value={form.rate_range} onChange={e=>set('rate_range',e.target.value)}>
                          <option value="">Select range…</option>
                          {['Under $250','$250 – $500','$500 – $1,500','$1,500 – $5,000','$5,000+','Open to negotiation'].map(o=><option key={o}>{o}</option>)}
                        </select>
                      </div>
                      <div className="field">
                        <label>Content turnaround</label>
                        <select value={form.turnaround} onChange={e=>set('turnaround',e.target.value)}>
                          <option value="">Select…</option>
                          {['3–5 days','1 week','2 weeks','Depends on brief'].map(o=><option key={o}>{o}</option>)}
                        </select>
                      </div>
                    </div>
                    <div className="field">
                      <label>Anything else you'd like us to know?</label>
                      <textarea value={form.extra_notes} onChange={e=>set('extra_notes',e.target.value)} placeholder="Awards, press features, audience demographics…" style={{minHeight:'65px'}}/>
                    </div>
                    <div className="agree-row">
                      <input type="checkbox" id="terms" checked={agreed} onChange={e=>setAgreed(e.target.checked)}/>
                      <label htmlFor="terms">I agree to Amplify's creator terms and understand my profile will be visible to brand partners upon approval.</label>
                    </div>
                    {error && <div className="form-error">{error}</div>}
                    <div className="form-nav">
                      <button className="btn-back" onClick={()=>setStep(2)}>← Back</button>
                      <button className="btn-next" onClick={submitApplication} disabled={submitting}>{submitting?'Submitting…':'Submit application'}</button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="success-screen">
                <div className="success-icon">✓</div>
                <h2>Application received!</h2>
                <p>Thanks for applying to the Amplify creator network. Our team reviews applications within 3–5 business days. Check your inbox for a confirmation email.</p>
                <button className="btn-next" onClick={reset}>Submit another application</button>
              </div>
            )}
          </div>
        </div>
      )}

      <style jsx>{`
        /* NAV */
        .nav{display:flex;justify-content:space-between;align-items:center;padding:1.25rem 3rem;border-bottom:1px solid var(--cream3);background:var(--cream);position:sticky;top:0;z-index:100}
        .logo{font-family:'DM Serif Display',serif;font-size:1.5rem;color:var(--accent)}
        .logo span{color:var(--gold)}
        .nav-links{display:flex;gap:2rem;list-style:none;align-items:center}
        .nav-links a,.nav-link-btn{text-decoration:none;color:var(--ink2);font-size:0.875rem;background:none;border:none;cursor:pointer;padding:0}
        .nav-links a:hover,.nav-link-btn:hover{color:var(--accent)}
        .nav-cta{background:var(--accent);color:#fff;padding:0.6rem 1.4rem;border-radius:2rem;font-size:0.875rem;font-weight:500;border:none;cursor:pointer}
        /* HERO */
        .hero{padding:6rem 3rem 5rem;display:grid;grid-template-columns:1fr 1fr;gap:4rem;max-width:1200px;margin:0 auto;align-items:center}
        .tag{display:inline-flex;align-items:center;gap:0.5rem;background:var(--cream2);border:1px solid var(--cream3);border-radius:2rem;padding:0.35rem 0.9rem;font-size:0.75rem;color:var(--gold3);font-weight:500;letter-spacing:0.05em;text-transform:uppercase;margin-bottom:1.5rem}
        h1{font-family:'DM Serif Display',serif;font-size:3.75rem;line-height:1.05;color:var(--ink);letter-spacing:-1px;margin-bottom:1.5rem}
        h1 em{color:var(--accent);font-style:italic}
        .hero-sub{font-size:1.05rem;color:var(--ink2);line-height:1.75;max-width:440px;margin-bottom:2.5rem;font-weight:300}
        .hero-actions{display:flex;gap:1rem;align-items:center}
        .btn-primary{background:var(--accent);color:#fff;padding:0.85rem 2rem;border-radius:2rem;font-size:0.9rem;font-weight:500;border:none;cursor:pointer}
        .btn-ghost{color:var(--ink2);font-size:0.9rem;background:none;border:1px solid var(--cream3);padding:0.85rem 1.5rem;border-radius:2rem;cursor:pointer}
        /* HERO VISUAL */
        .hero-visual{position:relative;height:380px}
        .platform-card{background:#fff;border-radius:1.25rem;border:1px solid var(--cream3);padding:1.25rem;position:absolute}
        .pc-main{width:280px;top:0;right:0}
        .pc-stat{width:180px;bottom:40px;left:0}
        .pc-notif{width:220px;top:90px;left:10px}
        .pc-label{font-size:0.7rem;color:var(--ink3);font-weight:500;letter-spacing:0.06em;text-transform:uppercase;margin-bottom:0.6rem}
        .pc-title{font-family:'DM Serif Display',serif;font-size:1rem;color:var(--ink);margin-bottom:0.75rem}
        .creator-row{display:flex;align-items:center;gap:0.6rem;margin-bottom:0.5rem}
        .avatar{width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:0.7rem;font-weight:500;color:#fff;flex-shrink:0}
        .creator-info{flex:1}
        .creator-name{font-size:0.8rem;font-weight:500;color:var(--ink)}
        .creator-reach{font-size:0.7rem;color:var(--ink3)}
        .match-score{font-size:0.75rem;font-weight:500;color:var(--accent)}
        .stat-big{font-family:'DM Serif Display',serif;font-size:2rem;color:var(--accent)}
        .stat-lbl{font-size:0.72rem;color:var(--ink3);margin-top:0.2rem}
        .notif-row{display:flex;align-items:center;gap:0.75rem}
        .notif-icon{width:36px;height:36px;border-radius:0.6rem;background:var(--accent);color:#a8d4be;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:1rem}
        .notif-text{font-size:0.8rem;color:var(--ink);line-height:1.4}
        /* STATS */
        .stats-bar{background:var(--cream2);border-top:1px solid var(--cream3);border-bottom:1px solid var(--cream3);padding:2rem 3rem;display:grid;grid-template-columns:repeat(4,1fr);gap:2rem;text-align:center}
        .snum{font-family:'DM Serif Display',serif;font-size:2.25rem;color:var(--accent)}
        .sdesc{font-size:0.8rem;color:var(--ink3);margin-top:0.25rem}
        /* SECTIONS */
        .section{max-width:1200px;margin:0 auto;padding:5rem 3rem}
        .section-tag{font-size:0.75rem;font-weight:500;letter-spacing:0.1em;text-transform:uppercase;color:var(--gold3);margin-bottom:0.75rem}
        h2{font-family:'DM Serif Display',serif;font-size:2.75rem;color:var(--ink);letter-spacing:-0.5px;line-height:1.1;margin-bottom:1rem}
        .section-sub{font-size:1rem;color:var(--ink2);max-width:520px;line-height:1.75;font-weight:300}
        /* HOW */
        .how-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:2rem;margin-top:3.5rem}
        .step-card{background:#fff;border:1px solid var(--cream3);border-radius:1.25rem;padding:2rem}
        .step-num{font-family:'DM Serif Display',serif;font-size:4rem;color:var(--cream2);line-height:1;margin-bottom:0.75rem}
        .step-card h3{font-size:1rem;font-weight:500;color:var(--ink);margin-bottom:0.5rem}
        .step-card p{font-size:0.875rem;color:var(--ink2);line-height:1.65;font-weight:300}
        /* CREATORS DARK */
        .creators-dark{background:var(--accent);padding:4rem 3rem;margin:0 0 0 0;text-align:left}
        .type-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:1.5rem;margin-top:3rem;max-width:1200px}
        .type-card{background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.12);border-radius:1rem;padding:1.5rem;text-align:center}
        .type-icon{font-size:1.75rem;margin-bottom:0.75rem;display:block}
        .type-card h4{font-size:0.9rem;font-weight:500;color:#fff;margin-bottom:0.25rem}
        .type-card p{font-size:0.78rem;color:rgba(255,255,255,0.55);line-height:1.5}
        .btn-creator{background:rgba(255,255,255,0.12);color:#fff;border:1px solid rgba(255,255,255,0.3);padding:0.8rem 2rem;border-radius:2rem;font-size:0.9rem;font-weight:500;cursor:pointer;font-family:'DM Sans',sans-serif}
        /* PRICING */
        .pricing-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:1.5rem;margin-top:3rem}
        .price-card{background:#fff;border:1px solid var(--cream3);border-radius:1.25rem;padding:2rem;position:relative}
        .price-card.featured{border:2px solid var(--accent)}
        .featured-badge{position:absolute;top:-13px;left:50%;transform:translateX(-50%);background:var(--accent);color:#fff;font-size:0.7rem;font-weight:500;padding:4px 16px;border-radius:2rem;white-space:nowrap}
        .price-name{font-size:0.8rem;font-weight:500;letter-spacing:0.08em;text-transform:uppercase;color:var(--ink3);margin-bottom:0.75rem}
        .price-amount{font-family:'DM Serif Display',serif;font-size:3rem;color:var(--ink);line-height:1}
        .price-amount sup{font-size:1.25rem;vertical-align:super}
        .price-period{font-size:0.8rem;color:var(--ink3);margin-bottom:1.25rem}
        .price-desc{font-size:0.85rem;color:var(--ink2);line-height:1.6;margin-bottom:1.5rem;font-weight:300}
        .price-features{list-style:none;margin-bottom:2rem}
        .price-features li{font-size:0.85rem;color:var(--ink2);padding:0.45rem 0;border-bottom:1px solid var(--cream2);display:flex;align-items:center;gap:0.5rem}
        .price-features li::before{content:'';width:5px;height:5px;border-radius:50%;background:var(--accent);flex-shrink:0}
        .price-btn{width:100%;padding:0.8rem;border-radius:2rem;font-size:0.875rem;font-weight:500;cursor:pointer;border:1px solid var(--cream3);background:var(--cream);color:var(--ink);font-family:'DM Sans',sans-serif}
        .price-btn-primary{background:var(--accent);color:#fff;border-color:var(--accent)}
        /* CTA */
        .cta-section{background:var(--cream2);border-top:1px solid var(--cream3);padding:5rem 3rem;text-align:center}
        .cta-inner{max-width:600px;margin:0 auto}
        .cta-inner h2{font-family:'DM Serif Display',serif;font-size:3rem;margin-bottom:1rem;letter-spacing:-0.5px}
        .cta-inner p{color:var(--ink2);font-weight:300;line-height:1.7;margin-bottom:2rem}
        .cta-actions{display:flex;gap:1rem;justify-content:center}
        /* FOOTER */
        .footer{padding:2rem 3rem;border-top:1px solid var(--cream3);display:flex;justify-content:space-between;align-items:center}
        .footer-logo{font-family:'DM Serif Display',serif;font-size:1.1rem;color:var(--accent)}
        .footer-logo span{color:var(--gold)}
        .footer-text{font-size:0.8rem;color:var(--ink3)}
        /* APPLY */
        .apply-back{padding:1rem 3rem;background:var(--cream);border-bottom:1px solid var(--cream3)}
        .back-btn{background:none;border:none;color:var(--ink2);font-size:0.875rem;cursor:pointer;font-family:'DM Sans',sans-serif}
        .back-btn:hover{color:var(--accent)}
        .form-hero{background:var(--accent);padding:3.5rem 3rem 2.5rem;color:#fff}
        .form-tag{font-size:0.7rem;font-weight:500;letter-spacing:0.1em;text-transform:uppercase;color:var(--accent3);margin-bottom:0.75rem}
        .form-h1{font-family:'DM Serif Display',serif;font-size:2.5rem;line-height:1.1;margin-bottom:0.75rem;color:#fff}
        .form-sub{font-size:0.9rem;color:rgba(255,255,255,0.65);max-width:500px;line-height:1.7;font-weight:300}
        .perks{display:flex;gap:2rem;margin-top:2rem;flex-wrap:wrap}
        .perk{display:flex;align-items:center;gap:0.5rem;font-size:0.8rem;color:rgba(255,255,255,0.8)}
        .perk-dot{width:6px;height:6px;border-radius:50%;background:var(--accent3);flex-shrink:0}
        .form-body{max-width:760px;margin:0 auto;padding:2.5rem 3rem}
        /* STEPS */
        .step-indicators{display:flex;align-items:center;margin-bottom:2.5rem}
        .step-ind{display:flex;align-items:center;gap:0.5rem;flex:1}
        .step-ind:last-child{flex:none}
        .step-circle{width:28px;height:28px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:0.75rem;font-weight:500;flex-shrink:0;background:var(--cream2);color:var(--ink3);border:1px solid var(--cream3)}
        .step-circle.done,.step-circle.current{background:var(--accent);color:#fff;border-color:var(--accent)}
        .step-label{font-size:0.78rem;color:var(--ink3)}
        .step-current{color:var(--accent);font-weight:500}
        .step-line{flex:1;height:1px;background:var(--cream3);margin:0 0.75rem}
        /* FORM FIELDS */
        .fsec-title{font-size:0.75rem;font-weight:500;letter-spacing:0.08em;text-transform:uppercase;color:var(--gold3);margin-bottom:1.25rem;padding-bottom:0.5rem;border-bottom:1px solid var(--cream3)}
        .field-grid{display:grid;grid-template-columns:1fr 1fr;gap:1rem}
        .field{display:flex;flex-direction:column;gap:0.4rem;margin-bottom:1rem}
        .field.full{grid-column:1/-1}
        .field label{font-size:0.8rem;color:var(--ink2);font-weight:500}
        .field input,.field select,.field textarea{padding:0.65rem 0.875rem;border-radius:0.5rem;border:1px solid var(--cream3);background:#fff;font-size:0.875rem;color:var(--ink);font-family:'DM Sans',sans-serif;transition:border-color 0.2s;outline:none;width:100%}
        .field input:focus,.field select:focus,.field textarea:focus{border-color:var(--accent)}
        .field textarea{resize:vertical;min-height:80px;line-height:1.6}
        .platform-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:0.6rem;margin-bottom:0.5rem}
        .plat-toggle{padding:0.6rem 0.5rem;border-radius:0.6rem;border:1px solid var(--cream3);background:var(--cream2);font-size:0.78rem;color:var(--ink2);cursor:pointer;text-align:center;transition:all 0.2s;user-select:none}
        .plat-toggle.selected{border-color:var(--accent);background:#e8f3ed;color:var(--accent);font-weight:500}
        .niche-grid{display:flex;flex-wrap:wrap;gap:0.5rem;margin-bottom:0.5rem}
        .niche-tag{padding:0.4rem 0.9rem;border-radius:2rem;border:1px solid var(--cream3);background:var(--cream2);font-size:0.78rem;color:var(--ink2);cursor:pointer;transition:all 0.2s;user-select:none}
        .niche-tag.selected{border-color:var(--accent);background:#e8f3ed;color:var(--accent);font-weight:500}
        .agree-row{display:flex;align-items:flex-start;gap:0.5rem;margin-top:0.5rem}
        .agree-row input{margin-top:3px;width:auto;accent-color:var(--accent)}
        .agree-row label{font-size:0.8rem;color:var(--ink2);cursor:pointer;font-weight:400}
        .form-error{background:#fcebeb;border:1px solid #F09595;color:#A32D2D;border-radius:0.5rem;padding:0.75rem 1rem;font-size:0.85rem;margin-top:1rem}
        .form-nav{display:flex;justify-content:space-between;align-items:center;padding:1.5rem 0 0;border-top:1px solid var(--cream3);margin-top:1rem}
        .btn-back{background:none;border:1px solid var(--cream3);padding:0.7rem 1.5rem;border-radius:2rem;font-size:0.875rem;color:var(--ink2);cursor:pointer;font-family:'DM Sans',sans-serif}
        .btn-next{background:var(--accent);color:#fff;border:none;padding:0.7rem 2rem;border-radius:2rem;font-size:0.875rem;font-weight:500;cursor:pointer;font-family:'DM Sans',sans-serif}
        .btn-next:disabled{opacity:0.6;cursor:not-allowed}
        /* SUCCESS */
        .success-screen{text-align:center;padding:4rem 2rem}
        .success-icon{width:64px;height:64px;border-radius:50%;background:#e8f3ed;border:2px solid var(--accent3);display:flex;align-items:center;justify-content:center;margin:0 auto 1.5rem;font-size:1.75rem;color:var(--accent)}
        .success-screen h2{font-family:'DM Serif Display',serif;font-size:2rem;margin-bottom:0.75rem;color:var(--ink)}
        .success-screen p{color:var(--ink2);line-height:1.7;font-weight:300;max-width:400px;margin:0 auto 2rem}
      `}</style>
    </>
  )
}
