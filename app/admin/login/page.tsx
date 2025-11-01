"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { signIn, isAuthenticated } from "@/lib/auth"
import { Toaster } from "sonner"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)

  useEffect(() => {
    // Check if already logged in
    const checkAuth = async () => {
      const authed = await isAuthenticated()
      if (authed) {
        router.push('/admin')
      }
      setCheckingAuth(false)
    }
    checkAuth()
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email || !password) {
      toast.error('Please enter both email and password')
      return
    }

    setLoading(true)

    try {
      await signIn(email, password)
      toast.success('Welcome back!')
      router.push('/admin')
    } catch (error: any) {
      console.error('Login error:', error)
      toast.error(error.message || 'Invalid credentials')
    } finally {
      setLoading(false)
    }
  }

  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0a0a' }}>
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#FEBE03] border-r-transparent"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{
      background: '#0a0a0a',
      backgroundImage: 'linear-gradient(rgba(10, 10, 10, 0.9), rgba(10, 10, 10, 0.9)), url(/IMG_8277.JPG)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }}>
      <div className="w-full max-w-md">
        <div className="rounded-3xl border border-gray-800 p-8 neon-border" style={{
          background: 'rgba(20, 20, 30, 0.95)',
          backdropFilter: 'blur(10px)'
        }}>
          {/* Logo/Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Sunset Haven</h1>
            <p className="text-gray-400">Admin Portal</p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="email" className="text-gray-300">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@sunsethaven.com"
                className="mt-1 bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                disabled={loading}
                autoFocus
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-gray-300">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="mt-1 bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                disabled={loading}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-[#FF3F02] to-[#FEBE03] text-black hover:opacity-90 font-semibold"
              disabled={loading}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-black border-r-transparent"></div>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>

          {/* Back to Website Link */}
          <div className="mt-6 pt-6 border-t border-gray-800 text-center">
            <a
              href="/"
              className="text-sm text-gray-400 hover:text-white transition-colors"
            >
              ← Back to Website
            </a>
          </div>
        </div>

        {/* Info Box */}
        <div className="mt-6 rounded-2xl border border-gray-800 p-4 text-center" style={{
          background: 'rgba(20, 20, 30, 0.7)',
          backdropFilter: 'blur(10px)'
        }}>
          <p className="text-xs text-gray-400">
            Need access? Contact your administrator
          </p>
        </div>
      </div>

      {/* Branded Toast Notifications */}
      <Toaster
        position="top-right"
        richColors
        theme="dark"
        toastOptions={{
          style: {
            background: '#1a1a1a',
            border: '1px solid rgba(255, 190, 3, 0.2)',
          },
        }}
      />
    </div>
  )
}
