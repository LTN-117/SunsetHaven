import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

// Create Supabase client with service role key for admin operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

export async function POST(request: NextRequest) {
  try {
    // Get the current user's session from the request
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json(
        { code: 'unauthorized', message: 'Missing authorization header' },
        { status: 401 }
      )
    }

    // Verify the user is authenticated and is a super_admin
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token)

    if (authError || !user) {
      return NextResponse.json(
        { code: 'unauthorized', message: 'Invalid token' },
        { status: 401 }
      )
    }

    // Check if user is super_admin
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('admin_profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    if (profileError || !profile || profile.role !== 'super_admin') {
      return NextResponse.json(
        { code: 'forbidden', message: 'Only super admins can create users' },
        { status: 403 }
      )
    }

    // Get request body
    const body = await request.json()
    const { email, password, full_name, role } = body

    if (!email || !password || !full_name || !role) {
      return NextResponse.json(
        { code: 'invalid_request', message: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create the new user using admin API
    const { data: authData, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        full_name,
        role
      }
    })

    if (createError) {
      return NextResponse.json(
        { code: 'create_failed', message: createError.message },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      user: authData.user
    })

  } catch (error: any) {
    console.error('Error creating user:', error)
    return NextResponse.json(
      { code: 'server_error', message: error.message || 'Failed to create user' },
      { status: 500 }
    )
  }
}
