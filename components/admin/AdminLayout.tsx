"use client"

import { ReactNode, useState, useEffect } from "react"
import Link from "next/link"
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
  Users,
  LogOut,
  Menu,
  X
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Toaster } from "sonner"
import { signOut } from "@/lib/auth"
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
  // { name: "Users", href: "/admin/users", icon: Users }, // Removed - using single admin
  { name: "Footer Settings", href: "/admin/footer", icon: Settings },
]

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isChecking, setIsChecking] = useState(true)
  const [mounted, setMounted] = useState(false)

  // Check if user is logged in
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const isLoggedIn = localStorage.getItem('isAdminLoggedIn')

    if (isLoggedIn !== 'true') {
      router.push('/admin/login')
      return
    }

    setIsChecking(false)
  }, [mounted, router])

  const handleLogout = () => {
    // Clear localStorage session
    localStorage.removeItem('isAdminLoggedIn')
    localStorage.removeItem('adminEmail')

    toast.success('Logged out successfully')
    router.push('/admin/login')
  }

  // Show loading while checking auth
  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0a0a' }}>
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#FEBE03] border-r-transparent"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen" style={{ background: '#0a0a0a' }}>
      {/* Microsoft Clarity Analytics for Admin */}
      <Script id="clarity-admin-script" strategy="afterInteractive">
        {`
          (function(c,l,a,r,i,t,y){
            c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
            t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
            y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
          })(window, document, "clarity", "script", "tzmsioibjm");
        `}
      </Script>
        {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="fixed inset-y-0 left-0 w-64 bg-[#1a1a1a] p-6">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-bold text-white">Admin Panel</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-6 w-6 text-white" />
              </Button>
            </div>
            <nav className="space-y-2">
              {navigation.map((item) => {
                const isActive = pathname === item.href
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? "bg-gradient-to-r from-[#FF3F02] to-[#FEBE03] text-white"
                        : "text-gray-400 hover:bg-gray-800 hover:text-white"
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-64 lg:flex-col bg-[#1a1a1a] border-r border-gray-800">
        <div className="flex flex-col flex-1 p-6">
          <div className="mb-8">
            <h2 className="text-xl font-bold text-white">Sunset Haven</h2>
            <p className="text-sm text-gray-400 mt-1">Admin Panel</p>
          </div>
          <nav className="flex-1 space-y-2">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-gradient-to-r from-[#FF3F02] to-[#FEBE03] text-white"
                      : "text-gray-400 hover:bg-gray-800 hover:text-white"
                  }`}
                >
                  <item.icon className="h-5 w-5" />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>
          <div className="pt-6 border-t border-gray-800 space-y-2">
            <Button
              onClick={handleLogout}
              variant="ghost"
              className="w-full justify-start text-gray-400 hover:text-white hover:bg-gray-800"
            >
              <LogOut className="h-5 w-5 mr-3" />
              Sign Out
            </Button>
            <Link
              href="/"
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors px-4 py-2"
            >
              <span>← Back to Website</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <div className="sticky top-0 z-40 flex h-16 items-center gap-x-4 border-b border-gray-800 bg-[#1a1a1a] px-4 sm:gap-x-6 sm:px-6 lg:px-8">
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden text-white"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </Button>
          <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
            <div className="flex flex-1 items-center">
              <h1 className="text-lg font-semibold text-white">
                {navigation.find(item => item.href === pathname)?.name || 'Dashboard'}
              </h1>
            </div>
          </div>
        </div>

        {/* Page content */}
        <main className="py-8 px-4 sm:px-6 lg:px-8">
          {children}
        </main>
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
