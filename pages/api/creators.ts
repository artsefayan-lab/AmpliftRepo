import type { NextApiRequest, NextApiResponse } from 'next'
import { getAdminClient } from '@/lib/supabase'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const admin = getAdminClient()

  if (req.method === 'GET') {
    const { status, search } = req.query

    let query = admin
      .from('creators')
      .select('*')
      .order('created_at', { ascending: false })

    if (status && status !== 'all') {
      query = query.eq('status', status as string)
    }

    if (search) {
      query = query.or(
        `first_name.ilike.%${search}%,last_name.ilike.%${search}%,email.ilike.%${search}%,creator_type.ilike.%${search}%`
      )
    }

    const { data, error } = await query

    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data)
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
