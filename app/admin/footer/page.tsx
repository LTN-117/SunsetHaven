"use client"

import { useEffect, useState } from "react"
import AdminLayout from "@/components/admin/AdminLayout"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Save, Mail, Phone, MapPin, Instagram, Info, Calendar, Truck } from "lucide-react"

interface FooterSettings {
  id: string
  email: string
  phone: string
  address: string
  additional_info: string
  instagram_handle: string
  instagram_url: string
  availability_text: string
  transport_text: string
  copyright_text: string
  powered_by_text: string
  updated_at: string
}

export default function FooterSettingsPage() {
  const [settings, setSettings] = useState<FooterSettings | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  useEffect(() => {
    loadSettings()
  }, [])

  async function loadSettings() {
    try {
      const { data, error } = await supabase
        .from('footer_settings')
        .select('*')
        .single()

      if (error) throw error
      setSettings(data)
      if (data?.updated_at) {
        setLastSaved(new Date(data.updated_at))
      }
    } catch (error) {
      console.error('Error loading footer settings:', error)
    } finally {
      setLoading(false)
    }
  }

  async function saveSettings() {
    if (!settings) return

    setSaving(true)
    try {
      const { error } = await supabase
        .from('footer_settings')
        .update({
          email: settings.email,
          phone: settings.phone,
          address: settings.address,
          additional_info: settings.additional_info,
          instagram_handle: settings.instagram_handle,
          instagram_url: settings.instagram_url,
          availability_text: settings.availability_text,
          transport_text: settings.transport_text,
          copyright_text: settings.copyright_text,
          powered_by_text: settings.powered_by_text,
        })
        .eq('id', settings.id)

      if (error) throw error

      setLastSaved(new Date())
      alert('Footer settings saved successfully!')
    } catch (error) {
      console.error('Error saving footer settings:', error)
      alert('Failed to save settings. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#FEBE03] border-r-transparent"></div>
            <p className="text-gray-400 mt-4">Loading footer settings...</p>
          </div>
        </div>
      </AdminLayout>
    )
  }

  if (!settings) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center min-h-[400px]">
          <p className="text-gray-400">No footer settings found.</p>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">Footer Settings</h2>
            <p className="text-gray-400 text-sm mt-1">
              Manage all footer content and contact information
            </p>
          </div>
          {lastSaved && (
            <div className="text-right">
              <p className="text-xs text-gray-500">Last saved</p>
              <p className="text-sm text-gray-400">
                {lastSaved.toLocaleDateString()} at {lastSaved.toLocaleTimeString()}
              </p>
            </div>
          )}
        </div>

        {/* Settings Form */}
        <div className="rounded-3xl border border-gray-800 p-8 neon-border" style={{ background: 'rgba(20, 20, 30, 0.6)' }}>
          <div className="space-y-8">
            {/* Contact Information Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2 border-b border-gray-800 pb-2">
                <Mail className="h-5 w-5 text-[#FEBE03]" />
                Contact Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-300 flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={settings.email}
                    onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                    className="bg-gray-800 border-gray-700 text-white"
                    placeholder="contact@example.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-gray-300 flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={settings.phone}
                    onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                    className="bg-gray-800 border-gray-700 text-white"
                    placeholder="+234 XXX XXX XXXX"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address" className="text-gray-300 flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Address
                </Label>
                <Input
                  id="address"
                  value={settings.address}
                  onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                  className="bg-gray-800 border-gray-700 text-white"
                  placeholder="Tarkwa Bay Island, Lagos"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="additional_info" className="text-gray-300 flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  Additional Info
                </Label>
                <Input
                  id="additional_info"
                  value={settings.additional_info}
                  onChange={(e) => setSettings({ ...settings, additional_info: e.target.value })}
                  className="bg-gray-800 border-gray-700 text-white"
                  placeholder="15 minutes by boat from Lagos"
                />
              </div>
            </div>

            {/* Social Media Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2 border-b border-gray-800 pb-2">
                <Instagram className="h-5 w-5 text-[#FEBE03]" />
                Social Media
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="instagram_handle" className="text-gray-300">
                    Instagram Handle
                  </Label>
                  <Input
                    id="instagram_handle"
                    value={settings.instagram_handle}
                    onChange={(e) => setSettings({ ...settings, instagram_handle: e.target.value })}
                    className="bg-gray-800 border-gray-700 text-white"
                    placeholder="@sunset.haven__"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="instagram_url" className="text-gray-300">
                    Instagram URL
                  </Label>
                  <Input
                    id="instagram_url"
                    type="url"
                    value={settings.instagram_url}
                    onChange={(e) => setSettings({ ...settings, instagram_url: e.target.value })}
                    className="bg-gray-800 border-gray-700 text-white"
                    placeholder="https://instagram.com/sunset.haven__"
                  />
                </div>
              </div>
            </div>

            {/* Information Badges Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2 border-b border-gray-800 pb-2">
                <Calendar className="h-5 w-5 text-[#FEBE03]" />
                Information Badges
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="availability_text" className="text-gray-300 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Availability Text
                  </Label>
                  <Input
                    id="availability_text"
                    value={settings.availability_text}
                    onChange={(e) => setSettings({ ...settings, availability_text: e.target.value })}
                    className="bg-gray-800 border-gray-700 text-white"
                    placeholder="Year-round availability"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="transport_text" className="text-gray-300 flex items-center gap-2">
                    <Truck className="h-4 w-4" />
                    Transport Text
                  </Label>
                  <Input
                    id="transport_text"
                    value={settings.transport_text}
                    onChange={(e) => setSettings({ ...settings, transport_text: e.target.value })}
                    className="bg-gray-800 border-gray-700 text-white"
                    placeholder="Boat transport available"
                  />
                </div>
              </div>
            </div>

            {/* Footer Text Section */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-white flex items-center gap-2 border-b border-gray-800 pb-2">
                <Info className="h-5 w-5 text-[#FEBE03]" />
                Footer Text
              </h3>

              <div className="space-y-2">
                <Label htmlFor="copyright_text" className="text-gray-300">
                  Copyright Text
                </Label>
                <Textarea
                  id="copyright_text"
                  value={settings.copyright_text}
                  onChange={(e) => setSettings({ ...settings, copyright_text: e.target.value })}
                  className="bg-gray-800 border-gray-700 text-white"
                  placeholder="© 2025 by Sunset Haven. Powered and secured by Vercel."
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="powered_by_text" className="text-gray-300">
                  Powered By Text
                </Label>
                <Input
                  id="powered_by_text"
                  value={settings.powered_by_text}
                  onChange={(e) => setSettings({ ...settings, powered_by_text: e.target.value })}
                  className="bg-gray-800 border-gray-700 text-white"
                  placeholder="Powered and secured by Vercel"
                />
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-6 border-t border-gray-800">
              <Button
                onClick={saveSettings}
                disabled={saving}
                className="bg-gradient-to-r from-[#FF3F02] to-[#FEBE03] text-white hover:opacity-90 px-8"
              >
                {saving ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-solid border-white border-r-transparent mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

        {/* Preview Section */}
        <div className="rounded-2xl border border-gray-800 p-6" style={{ background: 'rgba(20, 20, 30, 0.6)' }}>
          <h3 className="text-lg font-semibold text-white mb-4">Preview</h3>
          <div className="bg-gradient-to-r from-[#FF3F02] to-[#FEBE03] rounded-xl p-6 text-white">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <h4 className="font-semibold mb-2">Contact</h4>
                <p className="text-sm opacity-90">{settings.email}</p>
                <p className="text-sm opacity-90">{settings.phone}</p>
                <p className="text-sm opacity-90">{settings.address}</p>
                <p className="text-sm opacity-90">{settings.additional_info}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Follow Us</h4>
                <p className="text-sm opacity-90">{settings.instagram_handle}</p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Info</h4>
                <p className="text-sm opacity-90">{settings.availability_text}</p>
                <p className="text-sm opacity-90">{settings.transport_text}</p>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-white/20 text-sm opacity-75">
              {settings.copyright_text}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
