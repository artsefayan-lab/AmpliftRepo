import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const ADMIN_EMAIL = process.env.ADMIN_EMAIL!
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

// ── Email to admin when a new creator applies ──────────────
export async function sendAdminNewApplicationEmail(creator: {
  first_name: string
  last_name: string
  email: string
  creator_type: string
  niches: string[]
  platforms: string[]
  follower_range: string
  location: string
}) {
  await resend.emails.send({
    from: 'Amplify <notifications@yourdomain.com>',
    to: ADMIN_EMAIL,
    subject: `New creator application — ${creator.first_name} ${creator.last_name}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#0f0d0b">
        <div style="background:#1a3a2a;padding:2rem;border-radius:12px 12px 0 0">
          <h1 style="color:#fff;font-size:1.5rem;margin:0">New creator application</h1>
          <p style="color:#a8d4be;margin:0.5rem 0 0;font-size:0.9rem">Someone just applied to join the Amplify network</p>
        </div>
        <div style="background:#faf8f4;padding:2rem;border:1px solid #e8e1d5;border-top:none;border-radius:0 0 12px 12px">
          <table style="width:100%;border-collapse:collapse;font-size:0.9rem">
            <tr><td style="padding:8px 0;color:#8a8480;width:140px">Name</td><td style="font-weight:500">${creator.first_name} ${creator.last_name}</td></tr>
            <tr><td style="padding:8px 0;color:#8a8480">Email</td><td><a href="mailto:${creator.email}" style="color:#1a3a2a">${creator.email}</a></td></tr>
            <tr><td style="padding:8px 0;color:#8a8480">Type</td><td>${creator.creator_type}</td></tr>
            <tr><td style="padding:8px 0;color:#8a8480">Location</td><td>${creator.location || '—'}</td></tr>
            <tr><td style="padding:8px 0;color:#8a8480">Reach</td><td>${creator.follower_range || '—'}</td></tr>
            <tr><td style="padding:8px 0;color:#8a8480">Platforms</td><td>${(creator.platforms || []).join(', ')}</td></tr>
            <tr><td style="padding:8px 0;color:#8a8480">Niches</td><td>${(creator.niches || []).join(', ')}</td></tr>
          </table>
          <div style="margin-top:1.5rem">
            <a href="${SITE_URL}/admin" style="background:#1a3a2a;color:#fff;padding:0.75rem 1.5rem;border-radius:2rem;text-decoration:none;font-size:0.875rem;font-weight:500">
              Review in roster →
            </a>
          </div>
        </div>
      </div>
    `,
  })
}

// ── Confirmation email to the creator ──────────────────────
export async function sendCreatorConfirmationEmail(creator: {
  first_name: string
  email: string
}) {
  await resend.emails.send({
    from: 'Amplify <hello@yourdomain.com>',
    to: creator.email,
    subject: 'We received your Amplify application!',
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#0f0d0b">
        <div style="background:#1a3a2a;padding:2rem;border-radius:12px 12px 0 0">
          <h1 style="color:#fff;font-size:1.5rem;margin:0">Application received</h1>
          <p style="color:#a8d4be;margin:0.5rem 0 0;font-size:0.9rem">Amplify Creator Network</p>
        </div>
        <div style="background:#faf8f4;padding:2rem;border:1px solid #e8e1d5;border-top:none;border-radius:0 0 12px 12px">
          <p style="font-size:1rem;line-height:1.7">Hi ${creator.first_name},</p>
          <p style="line-height:1.7;color:#4a4540">Thanks for applying to join the Amplify creator network. We've received your application and our team will review it within <strong>3–5 business days</strong>.</p>
          <p style="line-height:1.7;color:#4a4540">We'll be in touch via this email with next steps. In the meantime, feel free to reply with any questions.</p>
          <p style="line-height:1.7;color:#4a4540">— The Amplify team</p>
        </div>
      </div>
    `,
  })
}

// ── Email to creator when approved ─────────────────────────
export async function sendCreatorApprovedEmail(creator: {
  first_name: string
  email: string
}) {
  await resend.emails.send({
    from: 'Amplify <hello@yourdomain.com>',
    to: creator.email,
    subject: "You're approved! Welcome to Amplify",
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;color:#0f0d0b">
        <div style="background:#1a3a2a;padding:2rem;border-radius:12px 12px 0 0">
          <h1 style="color:#fff;font-size:1.5rem;margin:0">You're in!</h1>
          <p style="color:#a8d4be;margin:0.5rem 0 0;font-size:0.9rem">Welcome to the Amplify creator network</p>
        </div>
        <div style="background:#faf8f4;padding:2rem;border:1px solid #e8e1d5;border-top:none;border-radius:0 0 12px 12px">
          <p style="font-size:1rem;line-height:1.7">Hi ${creator.first_name},</p>
          <p style="line-height:1.7;color:#4a4540">Great news — your application has been <strong>approved</strong>. Your profile is now visible to brand partners on the Amplify network.</p>
          <p style="line-height:1.7;color:#4a4540">We'll reach out when you're matched to a campaign. Keep creating great content!</p>
          <p style="line-height:1.7;color:#4a4540">— The Amplify team</p>
        </div>
      </div>
    `,
  })
}
