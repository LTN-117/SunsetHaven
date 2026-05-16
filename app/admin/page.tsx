"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import AdminLayout from "@/components/admin/AdminLayout"
import { supabase } from "@/lib/supabase"
import { Inbox, Images, MessageSquare, Calendar, Mail, AlertCircle } from "lucide-react"
import { format } from "date-fns"

interface RecentInquiry {
  id: string
  name: string
  inquiry_type: string
  status: string
  created_at: string
}

interface UpcomingEvent {
  id: string
  title: string
  event_date: string
}

const STATUS_COLORS: Record<string, string> = {
  new: "bg-[#FEBE03] text-black",
  read: "bg-blue-600 text-white",
  responded: "bg-green-600 text-white",
  archived: "bg-gray-600 text-white",
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    newInquiries: 0,
    totalInquiries: 0,
    activeEvents: 0,
    galleryImages: 0,
    testimonials: 0,
    newsletter: 0,
  })
  const [recentInquiries, setRecentInquiries] = useState<RecentInquiry[]>([])
  const [upcomingEvents, setUpcomingEvents] = useState<UpcomingEvent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDashboard()
  }, [])

  async function loadDashboard() {
    try {
      const today = new Date().toISOString().split("T")[0]

      const [
        { count: newInquiries },
        { count: totalInquiries },
        { count: activeEvents },
        { count: galleryImages },
        { count: testimonials },
        { count: newsletter },
        { data: recent },
        { data: events },
      ] = await Promise.all([
        supabase.from("inquiries").select("*", { count: "exact", head: true }).eq("status", "new"),
        supabase.from("inquiries").select("*", { count: "exact", head: true }),
        supabase.from("events").select("*", { count: "exact", head: true }).eq("is_active", true).gte("event_date", today),
        supabase.from("gallery_images").select("*", { count: "exact", head: true }).eq("is_active", true),
        supabase.from("testimonials").select("*", { count: "exact", head: true }).eq("is_active", true),
        supabase.from("event_newsletter_signups").select("*", { count: "exact", head: true }),
        supabase.from("inquiries").select("id, name, inquiry_type, status, created_at").order("created_at", { ascending: false }).limit(5),
        supabase.from("events").select("id, title, event_date").eq("is_active", true).gte("event_date", today).order("event_date", { ascending: true }).limit(3),
      ])

      setStats({
        newInquiries: newInquiries || 0,
        totalInquiries: totalInquiries || 0,
        activeEvents: activeEvents || 0,
        galleryImages: galleryImages || 0,
        testimonials: testimonials || 0,
        newsletter: newsletter || 0,
      })
      setRecentInquiries(recent || [])
      setUpcomingEvents(events || [])
    } catch (error) {
      console.error("Error loading dashboard:", error)
    } finally {
      setLoading(false)
    }
  }

  const statCards = [
    {
      name: "New Inquiries",
      value: stats.newInquiries,
      icon: AlertCircle,
      sub: "Awaiting response",
      href: "/admin/inquiries",
      highlight: stats.newInquiries > 0,
    },
    {
      name: "Total Inquiries",
      value: stats.totalInquiries,
      icon: Inbox,
      sub: "All time",
      href: "/admin/inquiries",
      highlight: false,
    },
    {
      name: "Active Events",
      value: stats.activeEvents,
      icon: Calendar,
      sub: "Currently published",
      href: "/admin/events",
      highlight: false,
    },
    {
      name: "Gallery Images",
      value: stats.galleryImages,
      icon: Images,
      sub: "Live on site",
      href: "/admin/gallery",
      highlight: false,
    },
    {
      name: "Testimonials",
      value: stats.testimonials,
      icon: MessageSquare,
      sub: "Published",
      href: "/admin/testimonials",
      highlight: false,
    },
    {
      name: "Newsletter",
      value: stats.newsletter,
      icon: Mail,
      sub: "Subscribers",
      href: "/admin/newsletter",
      highlight: false,
    },
  ]

  return (
    <AdminLayout>
      <div className="space-y-8 max-w-7xl">

        {/* Page heading */}
        <div>
          <h2 className="text-2xl font-bold text-white">Dashboard</h2>
          <p className="text-sm text-gray-500 mt-1">Overview of Sunset Haven activity</p>
        </div>

        {/* New inquiry alert */}
        {!loading && stats.newInquiries > 0 && (
          <Link
            href="/admin/inquiries"
            className="flex items-center gap-3 px-5 py-3 rounded-xl transition-opacity hover:opacity-80"
            style={{ background: "rgba(254,190,3,0.08)", border: "1px solid rgba(254,190,3,0.2)" }}
          >
            <AlertCircle className="h-4 w-4 text-[#FEBE03] flex-shrink-0" />
            <span className="text-[#FEBE03] font-semibold text-sm">
              {stats.newInquiries} new {stats.newInquiries === 1 ? "inquiry" : "inquiries"} awaiting response
            </span>
            <span className="text-[#FEBE03] text-sm ml-auto">View →</span>
          </Link>
        )}

        {/* 6-stat grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {statCards.map((stat) => (
            <Link
              key={stat.name}
              href={stat.href}
              className="group rounded-2xl p-5 border transition-all hover:border-[#FEBE03]/20 neon-border"
              style={{
                background: stat.highlight ? "rgba(254,190,3,0.06)" : "rgba(255,255,255,0.03)",
                border: stat.highlight ? "1px solid rgba(254,190,3,0.2)" : "1px solid rgba(255,255,255,0.06)",
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className="p-2 rounded-lg"
                  style={{
                    background: stat.highlight
                      ? "rgba(254,190,3,0.15)"
                      : "rgba(255,255,255,0.06)",
                  }}
                >
                  <stat.icon
                    className="h-4 w-4"
                    style={{ color: stat.highlight ? "#FEBE03" : "#9ca3af" }}
                  />
                </div>
              </div>
              {loading ? (
                <div className="h-8 w-12 rounded-lg animate-pulse" style={{ background: "rgba(255,255,255,0.08)" }} />
              ) : (
                <p
                  className="text-3xl font-bold leading-none mb-1"
                  style={{ color: stat.highlight ? "#FEBE03" : "white" }}
                >
                  {stat.value}
                </p>
              )}
              <p className="text-xs text-gray-500 mt-2">{stat.name}</p>
              <p className="text-[10px] text-gray-600 mt-0.5">{stat.sub}</p>
            </Link>
          ))}
        </div>

        {/* Bottom two-column row */}
        <div className="grid lg:grid-cols-5 gap-6">

          {/* Recent Inquiries — spans 3 cols */}
          <div
            className="lg:col-span-3 rounded-2xl border overflow-hidden"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
              <h3 className="text-sm font-semibold text-white">Recent Inquiries</h3>
              <Link href="/admin/inquiries" className="text-xs text-gray-500 hover:text-[#FEBE03] transition-colors">
                View all →
              </Link>
            </div>
            {loading ? (
              <div className="p-6 space-y-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-10 rounded-lg animate-pulse" style={{ background: "rgba(255,255,255,0.05)" }} />
                ))}
              </div>
            ) : recentInquiries.length === 0 ? (
              <div className="px-6 py-10 text-center">
                <p className="text-sm text-gray-600">No inquiries yet.</p>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {recentInquiries.map((inq) => (
                  <Link
                    key={inq.id}
                    href="/admin/inquiries"
                    className="flex items-center gap-4 px-6 py-3.5 hover:bg-white/3 transition-colors"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{inq.name}</p>
                      <p className="text-xs text-gray-500 truncate">{inq.inquiry_type}</p>
                    </div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full flex-shrink-0 ${STATUS_COLORS[inq.status] || "bg-gray-700 text-white"}`}>
                      {inq.status}
                    </span>
                    <span className="text-[10px] text-gray-600 flex-shrink-0 hidden sm:block">
                      {format(new Date(inq.created_at), "MMM d")}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Upcoming Events — spans 2 cols */}
          <div
            className="lg:col-span-2 rounded-2xl border overflow-hidden"
            style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
          >
            <div className="flex items-center justify-between px-6 py-4 border-b border-white/5">
              <h3 className="text-sm font-semibold text-white">Upcoming Events</h3>
              <Link href="/admin/events" className="text-xs text-gray-500 hover:text-[#FEBE03] transition-colors">
                Manage →
              </Link>
            </div>
            {loading ? (
              <div className="p-6 space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-14 rounded-lg animate-pulse" style={{ background: "rgba(255,255,255,0.05)" }} />
                ))}
              </div>
            ) : upcomingEvents.length === 0 ? (
              <div className="px-6 py-10 text-center">
                <Calendar className="h-8 w-8 text-gray-700 mx-auto mb-3" />
                <p className="text-sm text-gray-600 mb-3">No upcoming events</p>
                <Link
                  href="/admin/events"
                  className="text-xs font-semibold px-4 py-2 rounded-lg text-black"
                  style={{ background: "linear-gradient(135deg, #FF3F02, #FEBE03)" }}
                >
                  Create Event →
                </Link>
              </div>
            ) : (
              <div className="divide-y divide-white/5">
                {upcomingEvents.map((event) => (
                  <div key={event.id} className="flex items-center gap-4 px-6 py-4">
                    <div
                      className="flex-shrink-0 w-10 text-center rounded-lg py-1"
                      style={{ background: "rgba(254,190,3,0.08)" }}
                    >
                      <p className="text-lg font-bold text-[#FEBE03] leading-none">
                        {new Date(event.event_date).getDate()}
                      </p>
                      <p className="text-[9px] text-gray-500 uppercase">
                        {format(new Date(event.event_date), "MMM")}
                      </p>
                    </div>
                    <p className="text-sm text-white leading-snug flex-1 min-w-0 truncate">{event.title}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
