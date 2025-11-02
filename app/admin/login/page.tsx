"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { signIn, isAuthenticated } from "@/lib/auth"
import { Toaster } from "sonner"
import { Eye, EyeOff } from "lucide-react"
import { supabase } from "@/lib/supabase"

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [showPassword, setShowPassword] = useState(false)

  useEffect(() => {
    // Check for error parameters
    const error = searchParams.get('error')
    if (error === 'profile_error') {
      toast.error('Unable to load your profile. Please contact support.')
    } else if (error === 'unauthorized') {
      toast.error('Your account is not authorized. Please contact an administrator.')
    }

    setCheckingAuth(false)
  }, [searchParams])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Hardcoded credentials for single admin user
    const ADMIN_EMAIL = 'admin@sunsethaven.com'
    const ADMIN_PASSWORD = 'SunsetHaven2024!@@'

    if (!email || !password) {
      toast.error('Please enter both email and password')
      return
    }

    // Simple credential check
    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      toast.error('Invalid email or password')
      return
    }

    setLoading(true)

    try {
      // Set a simple session flag in localStorage
      localStorage.setItem('isAdminLoggedIn', 'true')
      localStorage.setItem('adminEmail', ADMIN_EMAIL)

      toast.success('Welcome back!')

      // Redirect to admin dashboard
      setTimeout(() => {
        window.location.href = '/admin'
      }, 500)
    } catch (error: any) {
      console.error('Login error:', error)
      toast.error('Login failed')
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
                placeholder="Enter your email"
                className="mt-1 bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                disabled={loading}
                autoFocus
              />
            </div>

            <div>
              <Label htmlFor="password" className="text-gray-300">Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="mt-1 bg-gray-900 border-gray-700 text-white placeholder:text-gray-500 pr-10"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
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
