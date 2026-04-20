import type { NextApiRequest, NextApiResponse } from 'next'
import { getAdminClient } from '@/lib/supabase'
import { sendCreatorApprovedEmail } from '@/lib/emails'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query
  const admin = getAdminClient()

  if (req.method === 'PATCH') {
    const { status, admin_notes } = req.body

    if (!['approved', 'rejected', 'review', 'pending'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' })
    }

    const updates: any = { status, admin_notes }
    if (status === 'approved') updates.approved_at = new Date().toISOString()

    const { data, error } = await admin
      .from('creators')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) return res.status(500).json({ error: error.message })

    // Send approval email
    if (status === 'approved') {
      try {
        await sendCreatorApprovedEmail(data)
      } catch (e) {
        console.error('Approval email failed:', e)
      }
    }

    return res.status(200).json(data)
  }

  if (req.method === 'DELETE') {
    const { error } = await admin.from('creators').delete().eq('id', id)
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ success: true })
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
