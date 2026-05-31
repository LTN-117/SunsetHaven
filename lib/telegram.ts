export async function sendTelegramMessage(text: string, replyMarkup?: object) {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_CHAT_ID
  if (!token || !chatId) return

  const body: Record<string, unknown> = { chat_id: chatId, text, parse_mode: 'HTML' }
  if (replyMarkup) body.reply_markup = replyMarkup

  await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }).catch(() => {})
}

/**
 * Normalize a user-entered phone number into a wa.me-ready international digit
 * string (Nigeria-first). Returns null when no plausible number can be formed.
 */
export function toWhatsAppNumber(raw: string): string | null {
  const digits = (raw || '').replace(/\D/g, '')
  if (!digits) return null

  // 0XXXXXXXXXX (local, 11 digits with leading 0) -> 234XXXXXXXXXX
  if (digits.length === 11 && digits.startsWith('0')) return '234' + digits.slice(1)
  // already 234XXXXXXXXXX (with or without a stripped +)
  if (digits.startsWith('234') && digits.length === 13) return digits
  // bare 10-digit national number (e.g. 80XXXXXXXX) -> prefix 234
  if (digits.length === 10) return '234' + digits
  // some other international number with a country code already
  if (digits.length >= 11 && digits.length <= 15) return digits

  return null
}
