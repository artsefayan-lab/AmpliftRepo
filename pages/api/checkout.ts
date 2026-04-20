import type { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const key = process.env.STRIPE_SECRET_KEY || "sk_test_51TO7RpPotu9gS9lguvubCDBbvzGgTrNIV"
  if (!key) return res.status(500).json({ error: 'No Stripe key found', env: Object.keys(process.env).filter(k => k.includes('STRIPE')) })

  const stripe = new Stripe(key, { apiVersion: '2023-10-16' })

  const { plan } = req.body
  const PLANS: any = {
    starter: { name: 'Starter Campaign', amount: 49900, description: 'Up to 10 creators, 5 platforms' },
    growth: { name: 'Growth Campaign', amount: 149900, description: 'Up to 50 creators, unlimited platforms' },
    enterprise: { name: 'Enterprise Retainer', amount: 500000, description: 'Unlimited creators' },
  }

  const planData = PLANS[plan]
  if (!planData) return res.status(400).json({ error: 'Invalid plan: ' + plan })

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://amplift-repo-dyq8rc9an-artsefayan-labs-projects.vercel.app'

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price_data: { currency: 'usd', product_data: { name: planData.name, description: planData.description }, unit_amount: planData.amount }, quantity: 1 }],
      mode: 'payment',
      success_url: `${siteUrl}/success`,
      cancel_url: `${siteUrl}/#pricing`,
    })
    return res.status(200).json({ url: session.url })
  } catch (err: any) {
    return res.status(500).json({ error: err.message })
  }
}
