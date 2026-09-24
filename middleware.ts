import { NextRequest, NextResponse } from 'next/server'
import { ADMIN_COOKIE, verifyAdminSession } from '@/lib/admin-session'

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  if (path === '/admin/login' || path === '/api/admin/session') return NextResponse.next()

  if (await verifyAdminSession(request.cookies.get(ADMIN_COOKIE)?.value)) return NextResponse.next()

  if (path.startsWith('/api/')) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const loginUrl = new URL('/admin/login', request.url)
  loginUrl.searchParams.set('redirect', path)
  return NextResponse.redirect(loginUrl)
}

export const config = { matcher: ['/admin/:path*', '/api/admin/:path*'] }
