import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Check if accessing admin routes (except login page)
  const isAdminRoute = req.nextUrl.pathname.startsWith('/admin')
  const isLoginPage = req.nextUrl.pathname === '/admin/login'

  if (isAdminRoute && !isLoginPage) {
    // Require authentication for all admin pages
    if (!session) {
      const redirectUrl = req.nextUrl.clone()
      redirectUrl.pathname = '/admin/login'
      redirectUrl.searchParams.set('redirect', req.nextUrl.pathname)
      return NextResponse.redirect(redirectUrl)
    }

    // Check if user has an active admin profile
    const { data: profile, error: profileError } = await supabase
      .from('admin_profiles')
      .select('is_active, role')
      .eq('id', session.user.id)
      .single()

    console.log('Middleware - Profile check:', { profile, profileError, userId: session.user.id })

    if (profileError) {
      console.error('Middleware - Profile fetch error:', profileError)
      // If there's an error fetching profile, redirect to login
      const redirectUrl = req.nextUrl.clone()
      redirectUrl.pathname = '/admin/login'
      redirectUrl.searchParams.set('error', 'profile_error')
      return NextResponse.redirect(redirectUrl)
    }

    if (!profile || !profile.is_active) {
      // User exists in auth but no admin profile or inactive
      const redirectUrl = req.nextUrl.clone()
      redirectUrl.pathname = '/admin/login'
      redirectUrl.searchParams.set('error', 'unauthorized')
      return NextResponse.redirect(redirectUrl)
    }
  }

  // Redirect to admin if already logged in and trying to access login page
  if (isLoginPage && session) {
    const { data: profile } = await supabase
      .from('admin_profiles')
      .select('is_active')
      .eq('id', session.user.id)
      .single()

    if (profile?.is_active) {
      const redirectUrl = req.nextUrl.clone()
      redirectUrl.pathname = '/admin'
      return NextResponse.redirect(redirectUrl)
    }
  }

  return res
}

export const config = {
  matcher: '/admin/:path*',
}
