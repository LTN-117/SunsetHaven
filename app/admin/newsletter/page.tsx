"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import AdminLayout from "@/components/admin/AdminLayout"
import { supabase } from "@/lib/supabase"
import { getAdminProfile, getUserPermissions } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Mail, Download, Trash2, Calendar } from "lucide-react"
import { toast } from "sonner"

interface NewsletterSignup {
  id: string
  email: string
  created_at: string
}

export default function NewsletterPage() {
  const router = useRouter()
  const [signups, setSignups] = useState<NewsletterSignup[]>([])
  const [loading, setLoading] = useState(true)
  const [permissions, setPermissions] = useState<any>(null)

  useEffect(() => {
    checkPermissionsAndLoad()
  }, [])

  async function checkPermissionsAndLoad() {
    try {
      const profile = await getAdminProfile()
      if (!profile) {
        router.push('/admin/login')
        return
      }

      const perms = await getUserPermissions('newsletter')
      if (!perms || !perms.can_view) {
        toast.error('You do not have permission to view newsletter')
        router.push('/admin')
        return
      }
      setPermissions(perms)

      await loadSignups()
    } catch (error) {
      console.error('Error checking permissions:', error)
      router.push('/admin')
    }
  }

  async function loadSignups() {
    try {
      const { data, error } = await supabase
        .from('event_newsletter_signups')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      setSignups(data || [])
    } catch (error) {
      console.error('Error loading newsletter signups:', error)
      toast.error('Failed to load newsletter signups')
    } finally {
      setLoading(false)
    }
  }

  async function deleteSignup(id: string) {
    if (!permissions?.can_delete) {
      toast.error('You do not have permission to delete newsletter signups')
      return
    }

    if (!confirm('Are you sure you want to remove this email from the newsletter list?')) {
      return
    }

    try {
      const { error } = await supabase
        .from('event_newsletter_signups')
        .delete()
        .eq('id', id)

      if (error) throw error

      setSignups(prev => prev.filter(s => s.id !== id))
      toast.success('Email removed from newsletter list')
    } catch (error) {
      console.error('Error deleting signup:', error)
      toast.error('Failed to remove email')
    }
  }

  function exportToCSV() {
    if (signups.length === 0) {
      toast.error('No emails to export')
      return
    }

    const csvContent = [
      ['Email', 'Signup Date'],
      ...signups.map(s => [
        s.email,
        new Date(s.created_at).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `newsletter-signups-${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)

    toast.success('Newsletter list exported successfully')
  }

  function copyAllEmails() {
    if (signups.length === 0) {
      toast.error('No emails to copy')
      return
    }

    const emails = signups.map(s => s.email).join(', ')
    navigator.clipboard.writeText(emails)
    toast.success(`${signups.length} emails copied to clipboard`)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const stats = {
    total: signups.length,
    today: signups.filter(s => {
      const signupDate = new Date(s.created_at).toDateString()
      const today = new Date().toDateString()
      return signupDate === today
    }).length,
    thisWeek: signups.filter(s => {
      const signupDate = new Date(s.created_at)
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return signupDate >= weekAgo
    }).length,
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl p-4 border border-gray-800" style={{ background: 'rgba(20, 20, 30, 0.6)' }}>
            <p className="text-sm text-gray-400">Total Subscribers</p>
            <p className="text-2xl font-bold text-white mt-1">{stats.total}</p>
          </div>
          <div className="rounded-2xl p-4 border border-gray-800" style={{ background: 'rgba(20, 20, 30, 0.6)' }}>
            <p className="text-sm text-gray-400">This Week</p>
            <p className="text-2xl font-bold text-green-400 mt-1">{stats.thisWeek}</p>
          </div>
          <div className="rounded-2xl p-4 border border-gray-800" style={{ background: 'rgba(20, 20, 30, 0.6)' }}>
            <p className="text-sm text-gray-400">Today</p>
            <p className="text-2xl font-bold text-[#FEBE03] mt-1">{stats.today}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <Button
            onClick={exportToCSV}
            className="bg-gradient-to-r from-[#FF3F02] to-[#FEBE03] text-black hover:opacity-90"
            disabled={signups.length === 0 || !permissions?.can_view}
          >
            <Download className="h-4 w-4 mr-2" />
            Export to CSV
          </Button>
          <Button
            onClick={copyAllEmails}
            variant="outline"
            className="border-gray-700 text-white hover:bg-gray-800"
            disabled={signups.length === 0 || !permissions?.can_view}
          >
            <Mail className="h-4 w-4 mr-2" />
            Copy All Emails
          </Button>
        </div>

        {/* Newsletter List */}
        <div className="rounded-3xl border border-gray-800 p-6 neon-border" style={{ background: 'rgba(20, 20, 30, 0.6)' }}>
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white">Event Newsletter Subscribers</h2>
            <p className="text-gray-400 text-sm mt-1">
              People who signed up to be notified about upcoming events
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#FEBE03] border-r-transparent"></div>
              <p className="text-gray-400 mt-4 ml-4">Loading subscribers...</p>
            </div>
          ) : signups.length === 0 ? (
            <div className="p-8 text-center">
              <Mail className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No newsletter signups yet. When visitors sign up to be notified about events, they'll appear here.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {signups.map((signup) => (
                <Card
                  key={signup.id}
                  className="bg-gray-900 border-gray-800"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <div className="bg-gradient-to-r from-[#FF3F02] to-[#FEBE03] rounded-full p-2">
                          <Mail className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <p className="text-white font-medium">{signup.email}</p>
                          <div className="flex items-center gap-2 text-xs text-gray-400 mt-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(signup.created_at)}
                          </div>
                        </div>
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteSignup(signup.id)}
                        className="border-red-900 text-red-400 hover:bg-red-900/20"
                        disabled={!permissions?.can_delete}
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Remove
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
