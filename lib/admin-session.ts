export const ADMIN_COOKIE = 'sunset_admin_session'
const SESSION_SECONDS = 60 * 60 * 24 * 7

function base64url(bytes: Uint8Array) {
  return btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

function decodeBase64url(value: string) {
  const padded = value.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - value.length % 4) % 4)
  return Uint8Array.from(atob(padded), character => character.charCodeAt(0))
}

async function signature(payload: string) {
  const secret = process.env.ADMIN_SESSION_SECRET
  if (!secret || secret.length < 32) throw new Error('ADMIN_SESSION_SECRET must be at least 32 characters')
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  return base64url(new Uint8Array(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload))))
}

export async function createAdminSession(email: string) {
  const payload = base64url(new TextEncoder().encode(JSON.stringify({ email, exp: Math.floor(Date.now() / 1000) + SESSION_SECONDS })))
  return `${payload}.${await signature(payload)}`
}

export async function verifyAdminSession(value?: string) {
  if (!value) return false
  const [payload, suppliedSignature, extra] = value.split('.')
  if (!payload || !suppliedSignature || extra) return false
  try {
    const expected = await signature(payload)
    const a = decodeBase64url(expected)
    const b = decodeBase64url(suppliedSignature)
    if (a.length !== b.length) return false
    let difference = 0
    for (let i = 0; i < a.length; i++) difference |= a[i] ^ b[i]
    if (difference !== 0) return false
    const data = JSON.parse(new TextDecoder().decode(decodeBase64url(payload)))
    return data.email === process.env.ADMIN_LOGIN_EMAIL && typeof data.exp === 'number' && data.exp > Date.now() / 1000
  } catch {
    return false
  }
}

export const adminCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax' as const,
  path: '/',
  maxAge: SESSION_SECONDS,
}
