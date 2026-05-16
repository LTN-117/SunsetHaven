"use client"

import { ReactNode, useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import Script from "next/script"
import {
  LayoutDashboard,
  Inbox,
  Images,
  MessageSquare,
  Settings,
  Calendar,
  Mail,
  LogOut,
  Menu,
  X,
  ExternalLink,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Toaster } from "sonner"
import { toast } from "sonner"
import { supabase } from "@/lib/supabase"

interface AdminLayoutProps {
  children: ReactNode
}

const navigation = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Inquiries", href: "/admin/inquiries", icon: Inbox },
  { name: "Gallery", href: "/admin/gallery", icon: Images },
  { name: "Events", href: "/admin/events", icon: Calendar },
  { name: "Newsletter", href: "/admin/newsletter", icon: Mail },
  { name: "Testimonials", href: "/admin/testimonials", icon: MessageSquare },
  { name: "Footer", href: "/admin/footer", icon: Settings },
]

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isChecking, setIsChecking] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [newInquiries, setNewInquiries] = useState(0)
  const [adminEmail, setAdminEmail] = useState("")

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const isLoggedIn = localStorage.getItem("isAdminLoggedIn")
    if (isLoggedIn !== "true") {
      router.push("/admin/login")
      return
    }

    setAdminEmail(localStorage.getItem("adminEmail") || "admin@sunsethaven.com")
    setIsChecking(false)

    supabase
      .from("inquiries")
      .select("*", { count: "exact", head: true })
      .eq("status", "new")
      .then(({ count }) => setNewInquiries(count || 0))
  }, [mounted, router])

  const handleLogout = () => {
    localStorage.removeItem("isAdminLoggedIn")
    localStorage.removeItem("adminEmail")
    toast.success("Logged out successfully")
    router.push("/admin/login")
  }

  const currentPage = navigation.find((item) => item.href === pathname)?.name || "Dashboard"

  const NavItems = ({ onNavigate }: { onNavigate?: () => void }) => (
    <nav className="flex-1 space-y-0.5">
      {navigation.map((item) => {
        const isActive = pathname === item.href
        return (
          <Link
            key={item.name}
            href={item.href}
            onClick={onNavigate}
            className={`flex items-center gap-3 py-2.5 pr-4 rounded-lg text-sm transition-all duration-150 ${
              isActive
                ? "bg-white/5 text-white border-l-2 border-[#FEBE03] pl-[14px]"
                : "text-gray-400 hover:bg-white/5 hover:text-gray-200 border-l-2 border-transparent pl-[14px]"
            }`}
          >
            <item.icon className="h-4 w-4 flex-shrink-0" />
            <span>{item.name}</span>
            {item.name === "Inquiries" && newInquiries > 0 && (
              <span className="ml-auto text-xs font-bold px-1.5 py-0.5 rounded-full bg-[#FEBE03] text-black leading-none">
                {newInquiries}
              </span>
            )}
          </Link>
        )
      })}
    </nav>
  )

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: "#0a0a0a" }}>
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#FEBE03] border-r-transparent" />
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: "#0a0a0a" }}>
      <Script id="clarity-admin-script" strategy="afterInteractive">
        {`
          (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "tzmsioibjm");
        `}
      </Script>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />
          <div className="fixed inset-y-0 left-0 w-64 flex flex-col" style={{ background: "#111111", borderRight: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="flex items-center justify-between px-5 py-5 border-b border-white/5">
              <div className="flex items-center gap-3">
                <Image src="/sunset-haven-logo.png" alt="Sunset Haven" width={32} height={32} className="rounded-lg" />
                <div>
                  <p className="font-bold text-white text-sm leading-tight">Sunset Haven</p>
                  <p className="text-[10px] text-gray-500 leading-tight mt-0.5">Admin Panel</p>
                </div>
              </div>
              <button onClick={() => setSidebarOpen(false)} className="text-gray-400 hover:text-white transition-colors">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto px-3 py-4">
              <NavItems onNavigate={() => setSidebarOpen(false)} />
            </div>
            <div className="px-3 py-4 border-t border-white/5">
              <p className="text-[10px] text-gray-600 px-[14px] mb-2 truncate">{adminEmail}</p>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full py-2.5 pl-[14px] pr-4 rounded-lg text-sm text-gray-400 hover:bg-white/5 hover:text-gray-200 transition-all"
              >
                <LogOut className="h-4 w-4" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div
        className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col"
        style={{ background: "#111111", borderRight: "1px solid rgba(255,255,255,0.06)" }}
      >
        {/* Sidebar header */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-white/5">
          <Image src="/sunset-haven-logo.png" alt="Sunset Haven" width={32} height={32} className="rounded-lg" />
          <div>
            <p className="font-bold text-white text-sm leading-tight">Sunset Haven</p>
            <p className="text-[10px] text-gray-500 leading-tight mt-0.5">Admin Panel</p>
          </div>
        </div>

        {/* Nav */}
        <div className="flex flex-col flex-1 overflow-y-auto px-3 py-4">
          <NavItems />
        </div>

        {/* Sidebar footer */}
        <div className="px-3 py-4 border-t border-white/5">
          <p className="text-[10px] text-gray-600 px-[14px] mb-2 truncate">{adminEmail}</p>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full py-2.5 pl-[14px] pr-4 rounded-lg text-sm text-gray-400 hover:bg-white/5 hover:text-gray-200 transition-all"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
          <Link
            href="/"
            className="flex items-center gap-2 py-2.5 pl-[14px] pr-4 rounded-lg text-sm text-gray-500 hover:text-gray-300 transition-all"
          >
            <ExternalLink className="h-4 w-4" />
            View Site
          </Link>
        </div>
      </div>

      {/* Main content area */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div
          className="sticky top-0 z-40 flex h-14 items-center gap-4 px-4 sm:px-6 lg:px-8"
          style={{ background: "rgba(10,10,10,0.85)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}
        >
          <button
            className="lg:hidden text-gray-400 hover:text-white transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </button>
          <h1 className="text-sm font-semibold text-white">{currentPage}</h1>
          <div className="flex-1" />
          <Link
            href="/"
            className="hidden sm:flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 transition-colors"
          >
            <ExternalLink className="h-3.5 w-3.5" />
            View Site
          </Link>
        </div>

        {/* Page content */}
        <main className="py-8 px-4 sm:px-6 lg:px-8">{children}</main>
      </div>

      <Toaster
        position="top-right"
        richColors
        theme="dark"
        toastOptions={{
          style: {
            background: "#1a1a1a",
            border: "1px solid rgba(254,190,3,0.2)",
          },
        }}
      />
    </div>
  )
}
