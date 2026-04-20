import type { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

const PLANS = {
  starter: {
    name: 'Starter Campaign',
    amount: 49900, // $499.00 in cents
    description: 'Up to 10 creators, 5 platforms, basic analytics',
  },
  growth: {
    name: 'Growth Campaign',
    amount: 149900, // $1,499.00 in cents
    description: 'Up to 50 creators, unlimited platforms, full analytics + dedicated manager',
  },
  enterprise: {
    name: 'Enterprise Retainer',
    amount: 500000, // $5,000.00 in cents — custom, just a placeholder
    description: 'Unlimited creators, white-label, API access, dedicated account team',
  },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const { plan, businessName, email } = req.body

  const planData = PLANS[plan as keyof typeof PLANS]
  if (!planData) return res.status(400).json({ error: 'Invalid plan' })

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: planData.name,
              description: planData.description,
            },
            unit_amount: planData.amount,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      customer_email: email || undefined,
      metadata: {
        plan,
        businessName: businessName || '',
      },
      success_url: `${siteUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/#pricing`,
    })
    return res.status(200).json({ url: session.url })
  } catch (err: any) {
    console.error('Stripe error:', err.message)
    return res.status(500).json({ error: err.message })
  }
}

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: planData.name,
            description: planData.description,
          },
          unit_amount: planData.amount,
        },
        quantity: 1,
      },
    ],
    mode: 'payment',
    customer_email: email || undefined,
    metadata: {
      plan,
      businessName: businessName || '',
    },
    success_url: `${siteUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${siteUrl}/#pricing`,
  })

  return res.status(200).json({ url: session.url })
}
