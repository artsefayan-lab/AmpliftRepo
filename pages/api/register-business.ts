import type { NextApiRequest, NextApiResponse } from 'next'
import { getAdminClient } from '@/lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const admin = getAdminClient()
  const { name, email, phone, industry, website, description } = req.body
  if (!name || !email) return res.status(400).json({ error: 'Name and email required' })
  const { data, error } = await admin.from('businesses').insert([{ name, email, phone, industry, website, description }]).select().single()
  if (error) {
    if (error.code === '23505') return res.status(409).json({ error: 'An account with this email already exists.' })
    return res.status(500).json({ error: error.message })
  }
  return res.status(200).json({ success: true, id: data.id })
}
