import { NextRequest, NextResponse } from 'next/server'
import { ADMIN_COOKIE, adminCookieOptions, createAdminSession, verifyAdminSession } from '@/lib/admin-session'

export async function GET(request: NextRequest) {
  const authenticated = await verifyAdminSession(request.cookies.get(ADMIN_COOKIE)?.value)
  return NextResponse.json({ authenticated, email: authenticated ? process.env.ADMIN_LOGIN_EMAIL : null })
}

export async function POST(request: NextRequest) {
  const { email, password } = await request.json().catch(() => ({}))
  if (!process.env.ADMIN_LOGIN_EMAIL || !process.env.ADMIN_LOGIN_PASSWORD || !process.env.ADMIN_SESSION_SECRET) {
    return NextResponse.json({ error: 'Admin login is not configured' }, { status: 503 })
  }
  if (email !== process.env.ADMIN_LOGIN_EMAIL || password !== process.env.ADMIN_LOGIN_PASSWORD) {
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
  }
  const response = NextResponse.json({ authenticated: true, email })
  response.cookies.set(ADMIN_COOKIE, await createAdminSession(email), adminCookieOptions)
  return response
}

export async function DELETE() {
  const response = NextResponse.json({ authenticated: false })
  response.cookies.set(ADMIN_COOKIE, '', { ...adminCookieOptions, maxAge: 0 })
  return response
}
