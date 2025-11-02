import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// This endpoint is called by a cron job to keep the app active
// and prevent free tier pausing due to inactivity
export async function GET() {
  try {
    // Initialize Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // Perform a lightweight database query to keep Supabase active
    // Just count the experiences - this is a simple, fast query
    const { count, error } = await supabase
      .from('experiences')
      .select('*', { count: 'exact', head: true })

    if (error) {
      console.error('Health check database error:', error)
      return NextResponse.json(
        {
          status: 'error',
          message: 'Database query failed',
          timestamp: new Date().toISOString()
        },
        { status: 500 }
      )
    }

    // Return success response
    return NextResponse.json({
      status: 'healthy',
      message: 'Application is active',
      timestamp: new Date().toISOString(),
      database: 'connected',
      experiencesCount: count
    })
  } catch (error) {
    console.error('Health check error:', error)
    return NextResponse.json(
      {
        status: 'error',
        message: 'Health check failed',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}
