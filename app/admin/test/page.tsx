"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export default function TestPage() {
  const [session, setSession] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [error, setError] = useState<any>(null)

  useEffect(() => {
    checkAuth()
  }, [])

  async function checkAuth() {
    try {
      // Check session
      const { data: { session }, error: sessionError } = await supabase.auth.getSession()
      setSession(session)

      if (sessionError) {
        setError({ type: 'session', error: sessionError })
        return
      }

      if (session) {
        // Check profile
        const { data: profile, error: profileError } = await supabase
          .from('admin_profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()

        setProfile(profile)

        if (profileError) {
          setError({ type: 'profile', error: profileError })
        }
      }
    } catch (err) {
      setError({ type: 'unexpected', error: err })
    }
  }

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-2xl font-bold mb-4">Auth Test Page</h1>

      <div className="space-y-4">
        <div className="bg-gray-900 p-4 rounded">
          <h2 className="font-bold mb-2">Session Status:</h2>
          <pre className="text-sm overflow-auto">
            {session ? JSON.stringify(session, null, 2) : 'No session'}
          </pre>
        </div>

        <div className="bg-gray-900 p-4 rounded">
          <h2 className="font-bold mb-2">Profile Status:</h2>
          <pre className="text-sm overflow-auto">
            {profile ? JSON.stringify(profile, null, 2) : 'No profile'}
          </pre>
        </div>

        {error && (
          <div className="bg-red-900 p-4 rounded">
            <h2 className="font-bold mb-2">Error:</h2>
            <pre className="text-sm overflow-auto">
              {JSON.stringify(error, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </div>
  )
}
