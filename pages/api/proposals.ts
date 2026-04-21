import type { NextApiRequest, NextApiResponse } from 'next'
import { getAdminClient } from '@/lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const admin = getAdminClient()

  if (req.method === 'POST') {
    const { creator_id, title, description, budget, platforms } = req.body
    if (!creator_id || !title) return res.status(400).json({ error: 'Missing required fields' })
    const { data, error } = await admin.from('proposals').insert([{ creator_id, title, description, budget, platforms: platforms||[] }]).select().single()
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ success: true, data })
  }

  if (req.method === 'GET') {
    const { creator_id, business_id } = req.query
    let query = admin.from('proposals').select('*').order('created_at', { ascending: false })
    if (creator_id) query = query.eq('creator_id', creator_id)
    if (business_id) query = query.eq('business_id', business_id)
    const { data, error } = await query
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data)
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
