import { createClient } from '@supabase/supabase-js'
import { sendTelegramMessage } from '@/lib/telegram'

export async function POST(req: Request) {
  const body = await req.json()
  const { name, phone, inquiry_type, message } = body

  if (!name || !phone || !inquiry_type || !message) {
    return Response.json({ error: 'All fields required' }, { status: 400 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { error } = await supabase
    .from('inquiries')
    .insert([{ name, phone, inquiry_type, message, status: 'new' }])

  if (error) {
    return Response.json({ error: 'Failed to submit inquiry' }, { status: 500 })
  }

  await sendTelegramMessage(
    `🏝️ <b>New Inquiry — Sunset Haven</b>\n\n` +
    `👤 <b>Name:</b> ${name}\n` +
    `📱 <b>Phone:</b> ${phone}\n` +
    `📋 <b>Type:</b> ${inquiry_type}\n` +
    `💬 <b>Message:</b> ${message}\n\n` +
    `<a href="https://www.sunsethaven.com.ng/admin/inquiries">View in Admin →</a>`
  )

  return Response.json({ success: true })
}
