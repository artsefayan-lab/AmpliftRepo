import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabase'
import { sendAdminNewApplicationEmail, sendCreatorConfirmationEmail } from '@/lib/emails'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const body = req.body

  // Basic validation
  if (!body.first_name || !body.last_name || !body.email) {
    return res.status(400).json({ error: 'Name and email are required' })
  }

  // Insert into Supabase
  const { data, error } = await supabase
    .from('creators')
    .insert([{
      first_name: body.first_name,
      last_name: body.last_name,
      email: body.email,
      phone: body.phone || null,
      location: body.location || null,
      creator_type: body.creator_type || null,
      niches: body.niches || [],
      platforms: body.platforms || [],
      primary_platform: body.primary_platform || null,
      follower_range: body.follower_range || null,
      engagement_rate: body.engagement_rate || null,
      profile_link: body.profile_link || null,
      bio: body.bio || null,
      past_brands: body.past_brands || null,
      rate_range: body.rate_range || null,
      turnaround: body.turnaround || null,
      extra_notes: body.extra_notes || null,
      status: 'pending',
    }])
    .select()
    .single()

  if (error) {
    console.error('Supabase insert error:', error)
    // Handle duplicate email gracefully
    if (error.code === '23505') {
      return res.status(409).json({ error: 'An application with this email already exists.' })
    }
    return res.status(500).json({ error: 'Failed to save application.' })
  }

  // Send emails (non-blocking — don't fail the request if email fails)
  try {
    await Promise.all([
      sendAdminNewApplicationEmail(data),
      sendCreatorConfirmationEmail(data),
    ])
  } catch (emailErr) {
    console.error('Email send error:', emailErr)
  }

  return res.status(200).json({ success: true, id: data.id })
}
