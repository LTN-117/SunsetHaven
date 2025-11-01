import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: req.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          req.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: req.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          req.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: req.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

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

    console.log('Middleware - Profile check:', { profile, profileError, userId: session.user.id, path: req.nextUrl.pathname })

    if (profileError) {
      console.error('Middleware - Profile fetch error:', profileError)
      console.error('Middleware - Full error details:', JSON.stringify(profileError, null, 2))
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

  return response
}

export const config = {
  matcher: [],  // Temporarily disabled for testing
  // matcher: '/admin/:path*',  // Re-enable this after testing
}
