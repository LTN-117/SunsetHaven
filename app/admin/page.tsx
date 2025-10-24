"use client"

import { useEffect, useState } from "react"
import AdminLayout from "@/components/admin/AdminLayout"
import { supabase } from "@/lib/supabase"
import { Inbox, Images, MessageSquare, TrendingUp } from "lucide-react"

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalInquiries: 0,
    newInquiries: 0,
    galleryImages: 0,
    activeTestimonials: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  async function loadStats() {
    try {
      // Get inquiry stats
      const { count: totalInquiries } = await supabase
        .from('inquiries')
        .select('*', { count: 'exact', head: true })

      const { count: newInquiries } = await supabase
        .from('inquiries')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'new')

      // Get gallery stats
      const { count: galleryImages } = await supabase
        .from('gallery_images')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true)

      // Get testimonial stats
      const { count: activeTestimonials } = await supabase
        .from('testimonials')
        .select('*', { count: 'exact', head: true })
        .eq('is_active', true)

      setStats({
        totalInquiries: totalInquiries || 0,
        newInquiries: newInquiries || 0,
        galleryImages: galleryImages || 0,
        activeTestimonials: activeTestimonials || 0
      })
    } catch (error) {
      console.error('Error loading stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      name: 'Total Inquiries',
      value: stats.totalInquiries,
      icon: Inbox,
      change: '+12%',
      changeType: 'positive'
    },
    {
      name: 'New Inquiries',
      value: stats.newInquiries,
      icon: TrendingUp,
      change: 'Needs Response',
      changeType: 'neutral'
    },
    {
      name: 'Gallery Images',
      value: stats.galleryImages,
      icon: Images,
      change: 'Active',
      changeType: 'neutral'
    },
    {
      name: 'Testimonials',
      value: stats.activeTestimonials,
      icon: MessageSquare,
      change: 'Published',
      changeType: 'neutral'
    }
  ]

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">Welcome Back!</h2>
          <p className="text-gray-400">Here's what's happening with Sunset Haven today.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat) => (
            <div
              key={stat.name}
              className="rounded-3xl p-6 border border-gray-800 neon-border"
              style={{
                '--section-bg': 'rgba(20, 20, 30, 0.6)',
                background: 'rgba(20, 20, 30, 0.6)',
                backdropFilter: 'blur(10px)'
              } as React.CSSProperties}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-gradient-to-r from-[#FF3F02] to-[#FEBE03]">
                    <stat.icon className="h-5 w-5 text-white" />
                  </div>
                </div>
              </div>
              <div className="mt-4">
                <p className="text-sm text-gray-400">{stat.name}</p>
                {loading ? (
                  <div className="h-8 w-16 bg-gray-800 rounded animate-pulse mt-2" />
                ) : (
                  <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
                )}
                <p className="text-sm text-gray-500 mt-2">{stat.change}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="rounded-3xl p-6 border border-gray-800" style={{ background: 'rgba(20, 20, 30, 0.6)' }}>
          <h3 className="text-xl font-bold text-white mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <a
              href="/admin/inquiries"
              className="p-4 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors text-center"
            >
              <Inbox className="h-6 w-6 text-[#FEBE03] mx-auto mb-2" />
              <p className="text-sm text-white">View Inquiries</p>
            </a>
            <a
              href="/admin/gallery"
              className="p-4 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors text-center"
            >
              <Images className="h-6 w-6 text-[#FEBE03] mx-auto mb-2" />
              <p className="text-sm text-white">Manage Gallery</p>
            </a>
            <a
              href="/admin/testimonials"
              className="p-4 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors text-center"
            >
              <MessageSquare className="h-6 w-6 text-[#FEBE03] mx-auto mb-2" />
              <p className="text-sm text-white">Add Testimonial</p>
            </a>
            <a
              href="/admin/footer"
              className="p-4 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors text-center"
            >
              <TrendingUp className="h-6 w-6 text-[#FEBE03] mx-auto mb-2" />
              <p className="text-sm text-white">Update Footer</p>
            </a>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="rounded-3xl p-6 border border-gray-800" style={{ background: 'rgba(20, 20, 30, 0.6)' }}>
          <h3 className="text-xl font-bold text-white mb-4">Recent Activity</h3>
          <p className="text-gray-400 text-sm">No recent activity to display.</p>
        </div>
      </div>
    </AdminLayout>
  )
}
