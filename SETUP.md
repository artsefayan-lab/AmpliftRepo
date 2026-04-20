# Amplify — Setup & Deployment Guide

Get your site live in about 20 minutes. Everything is free on the tiers we're using.

---

## What you're deploying

| Service | What it does | Cost |
|---|---|---|
| **Vercel** | Hosts your website | Free |
| **Supabase** | Stores creator profiles | Free (up to 500MB) |
| **Resend** | Sends notification emails | Free (3,000/mo) |
| **GitHub** | Stores your code | Free |

---

## Step 1 — Set up Supabase (your database)

1. Go to **https://supabase.com** and create a free account
2. Click **New project** → give it a name like `amplify` → set a database password → click Create
3. Wait ~2 minutes for the project to spin up
4. In the left sidebar, go to **SQL Editor** → click **New query**
5. Open the file `supabase-schema.sql` from this project and paste the entire contents into the editor
6. Click **Run** — you should see "Success"
7. Go to **Settings → API** and copy:
   - `Project URL` → this is your `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public` key → this is your `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `service_role secret` key → this is your `SUPABASE_SERVICE_ROLE_KEY` ⚠️ keep this secret

---

## Step 2 — Set up Resend (email notifications)

1. Go to **https://resend.com** and create a free account
2. Go to **API Keys** → click **Create API key** → name it `amplify`
3. Copy the key — this is your `RESEND_API_KEY`
4. Go to **Domains** → Add your domain (e.g. `yourdomain.com`)
   - If you don't have a domain yet, you can skip this for now and use `onboarding@resend.dev` as the `from` address (update `lib/emails.ts` line 7 to use that address)
5. Update the `from` fields in `lib/emails.ts` to use your verified domain

---

## Step 3 — Push to GitHub

1. Go to **https://github.com** → click **New repository** → name it `amplify-platform` → click Create
2. On your computer, open a terminal in this project folder and run:

```bash
git init
git add .
git commit -m "Initial Amplify platform"
git remote add origin https://github.com/YOUR_USERNAME/amplify-platform.git
git branch -M main
git push -u origin main
```

---

## Step 4 — Deploy to Vercel

1. Go to **https://vercel.com** → sign up with your GitHub account
2. Click **Add New → Project** → select your `amplify-platform` repo → click Import
3. Under **Environment Variables**, click **Add** for each of these:

```
NEXT_PUBLIC_SUPABASE_URL       = (paste from Supabase)
NEXT_PUBLIC_SUPABASE_ANON_KEY  = (paste from Supabase)
SUPABASE_SERVICE_ROLE_KEY      = (paste from Supabase)
RESEND_API_KEY                 = (paste from Resend)
ADMIN_EMAIL                    = your@email.com
NEXT_PUBLIC_SITE_URL           = https://your-project.vercel.app
```

4. Click **Deploy** — Vercel will build and deploy automatically (takes ~2 minutes)
5. Your site is live! Vercel gives you a URL like `https://amplify-platform.vercel.app`

---

## Step 5 — Custom domain (optional)

1. In Vercel, go to your project → **Settings → Domains**
2. Add your domain (e.g. `getamplify.co`)
3. Update your domain's DNS records as Vercel instructs
4. Update `NEXT_PUBLIC_SITE_URL` in Vercel env vars to your real domain

---

## Your pages

| URL | What it is |
|---|---|
| `/` | Main landing page + creator application form |
| `/admin` | Your creator roster + approve/reject panel |
| `/brands` | Public creator directory for brand partners |

---

## How applications work end-to-end

1. Creator fills in the form at `/` and clicks Submit
2. Their profile is saved to Supabase with status `pending`
3. You get an email notification at your `ADMIN_EMAIL`
4. The creator gets a confirmation email
5. You go to `/admin`, find them in the roster, review their profile
6. Click **Approve** → their status changes to `approved` + they get an approval email
7. They now appear in `/brands` for brand partners to discover

---

## Protecting the admin page

Right now `/admin` is public. To add a simple password, add this to `pages/admin.tsx` at the top of the component:

```tsx
const [authed, setAuthed] = useState(false)
const [pw, setPw] = useState('')
if (!authed) return (
  <div style={{padding:'4rem',textAlign:'center'}}>
    <input type="password" value={pw} onChange={e=>setPw(e.target.value)} placeholder="Admin password"/>
    <button onClick={()=>{ if(pw === process.env.NEXT_PUBLIC_ADMIN_PW) setAuthed(true) }}>Enter</button>
  </div>
)
```

Then add `NEXT_PUBLIC_ADMIN_PW=yourpassword` to your Vercel env vars.
For real auth, consider adding **Supabase Auth** or **NextAuth.js** later.

---

## Making updates

Any time you push code to GitHub, Vercel automatically redeploys. So your workflow is:

```bash
# make changes to files
git add .
git commit -m "describe your change"
git push
# Vercel deploys automatically in ~1 minute
```

---

## Need help?

- Supabase docs: https://supabase.com/docs
- Vercel docs: https://vercel.com/docs
- Resend docs: https://resend.com/docs
