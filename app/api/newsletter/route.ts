import { createClient } from '@supabase/supabase-js'
import { sendTelegramMessage } from '@/lib/telegram'

export async function POST(req: Request) {
  const { email } = await req.json()

  if (!email || !email.includes('@')) {
    return Response.json({ error: 'Invalid email' }, { status: 400 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { error } = await supabase
    .from('event_newsletter_signups')
    .insert([{ email }])

  if (error) {
    if (error.code === '23505') {
      return Response.json({ error: 'already_subscribed' }, { status: 409 })
    }
    return Response.json({ error: 'Failed to subscribe' }, { status: 500 })
  }

  const now = new Date().toLocaleString('en-NG', { timeZone: 'Africa/Lagos', dateStyle: 'medium', timeStyle: 'short' })

  await sendTelegramMessage(
    `📧 <b>New Newsletter Signup</b>\n` +
    `🕐 <i>${now} (WAT)</i>\n\n` +
    `✉️ ${email}\n\n` +
    `<a href="https://www.sunsethaven.com.ng/admin/newsletter">View Subscribers →</a>`
  )

  return Response.json({ success: true })
}
