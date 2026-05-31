import { createClient } from '@supabase/supabase-js'
import { sendTelegramMessage, toWhatsAppNumber } from '@/lib/telegram'

// Escape user-provided text so it can't break Telegram's HTML parse_mode.
function escapeHtml(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

// Telegram's hard limit is 4096 chars; stay under it for the metadata header.
const TELEGRAM_LIMIT = 4096

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

  const now = new Date().toLocaleString('en-NG', { timeZone: 'Africa/Lagos', dateStyle: 'medium', timeStyle: 'short' })

  // Build the WhatsApp "reply" deep link to the customer, prefilled with a greeting
  // that ends open-ended ("…We ") for staff to finish before sending.
  const waNumber = toWhatsAppNumber(phone)
  // Keep the embedded message short enough that the wa.me URL stays valid; the full
  // message is always shown in the alert body below.
  const snippet = message.length > 300 ? message.slice(0, 300) + '…' : message
  const waText = `Hello, this is Sunset Haven, thank you for your inquiry. We saw you sent a message on ${now} (WAT) about "${snippet}". We `
  const waUrl = waNumber ? `https://wa.me/${waNumber}?text=${encodeURIComponent(waText)}` : null

  const keyboard: { text: string; url: string }[][] = []
  if (waUrl) keyboard.push([{ text: '💬 Reply on WhatsApp', url: waUrl }])
  keyboard.push([{ text: 'View in Admin →', url: 'https://www.sunsethaven.com.ng/admin/inquiries' }])
  const replyMarkup = { inline_keyboard: keyboard }

  const header =
    `🏝️ <b>New Inquiry — Sunset Haven</b>\n` +
    `🕐 <i>${now} (WAT)</i>\n\n` +
    `👤 <b>Name:</b> ${escapeHtml(name)}\n` +
    `📱 <b>Phone:</b> ${escapeHtml(phone)}\n` +
    `📋 <b>Type:</b> ${escapeHtml(inquiry_type)}\n` +
    `💬 <b>Message:</b> `
  const safeMessage = escapeHtml(message)

  if (header.length + safeMessage.length <= TELEGRAM_LIMIT) {
    // Fits in a single message — send with the inline keyboard attached.
    await sendTelegramMessage(header + safeMessage, replyMarkup)
  } else {
    // Long message: send the header + as much as fits, then the remainder in
    // follow-up chunks so nothing is dropped. Keyboard goes on the final chunk.
    const firstChunkLen = TELEGRAM_LIMIT - header.length
    const rest: string[] = []
    let remaining = safeMessage.slice(firstChunkLen)
    while (remaining.length > 0) {
      rest.push(remaining.slice(0, TELEGRAM_LIMIT))
      remaining = remaining.slice(TELEGRAM_LIMIT)
    }
    await sendTelegramMessage(header + safeMessage.slice(0, firstChunkLen))
    for (let i = 0; i < rest.length; i++) {
      const isLast = i === rest.length - 1
      await sendTelegramMessage(rest[i], isLast ? replyMarkup : undefined)
    }
  }

  return Response.json({ success: true })
}
