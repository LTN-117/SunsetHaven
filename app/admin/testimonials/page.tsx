"use client"

import { useEffect, useState } from "react"
import AdminLayout from "@/components/admin/AdminLayout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Plus, Trash2, Eye, EyeOff, Edit, Quote, Loader2 } from "lucide-react"
import { toast } from "sonner"

interface Testimonial {
  id: string
  guest_name: string
  quote: string
  guest_role: string | null
  display_order: number
  is_active: boolean
  created_at: string
}

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState({
    guest_name: '',
    quote: '',
    guest_role: '',
  })

  useEffect(() => {
    loadTestimonials()
  }, [])

  async function loadTestimonials() {
    try {
      const response = await fetch('/api/admin/testimonials')
      if (!response.ok) throw new Error('Failed to load testimonials')
      const data = await response.json()
      setTestimonials(data || [])
    } catch (error) {
      console.error('Error loading testimonials:', error)
    } finally {
      setLoading(false)
    }
  }

  function openDialog(testimonial?: Testimonial) {
    if (testimonial) {
      setEditingId(testimonial.id)
      setFormData({
        guest_name: testimonial.guest_name,
        quote: testimonial.quote,
        guest_role: testimonial.guest_role || '',
      })
    } else {
      setEditingId(null)
      setFormData({
        guest_name: '',
        quote: '',
        guest_role: '',
      })
    }
    setDialogOpen(true)
  }

  async function saveTestimonial() {
    if (!formData.guest_name || !formData.quote) {
      toast.error('Please fill in name and quote')
      return
    }

    setIsSaving(true)
    try {
      if (editingId) {
        // Update existing
        const response = await fetch('/api/admin/testimonials', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingId,
            guest_name: formData.guest_name,
            quote: formData.quote,
            guest_role: formData.guest_role || null,
          })
        })
        if (!response.ok) throw new Error('Failed to update testimonial')

        setTestimonials(prev =>
          prev.map(t => t.id === editingId
            ? { ...t, ...formData, guest_role: formData.guest_role || null }
            : t
          )
        )
      } else {
        // Create new
        const maxOrder = testimonials.length > 0
          ? Math.max(...testimonials.map(t => t.display_order))
          : -1

        const response = await fetch('/api/admin/testimonials', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formData,
            guest_role: formData.guest_role || null,
            display_order: maxOrder + 1,
            is_active: true
          })
        })
        if (!response.ok) throw new Error('Failed to create testimonial')
        const data = await response.json()

        if (data) {
          setTestimonials([...testimonials, data])
        }
      }

      setDialogOpen(false)
      setEditingId(null)
      setFormData({ guest_name: '', quote: '', guest_role: '' })
    } catch (error) {
      console.error('Error saving testimonial:', error)
      toast.error('Failed to save testimonial. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  async function deleteTestimonial(id: string) {
    if (!confirm('Are you sure you want to delete this testimonial?')) return

    try {
      const response = await fetch(`/api/admin/testimonials?id=${id}`, {
        method: 'DELETE'
      })
      if (!response.ok) throw new Error('Failed to delete testimonial')

      setTestimonials(prev => prev.filter(t => t.id !== id))
    } catch (error) {
      console.error('Error deleting testimonial:', error)
      toast.error('Failed to delete testimonial. Please try again.')
    }
  }

  async function toggleActive(id: string, currentStatus: boolean) {
    try {
      const response = await fetch('/api/admin/testimonials', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, is_active: !currentStatus })
      })
      if (!response.ok) throw new Error('Failed to update status')

      setTestimonials(prev =>
        prev.map(t => t.id === id ? { ...t, is_active: !currentStatus } : t)
      )
    } catch (error) {
      console.error('Error toggling active status:', error)
    }
  }

  const stats = {
    total: testimonials.length,
    active: testimonials.filter(t => t.is_active).length,
    inactive: testimonials.filter(t => !t.is_active).length,
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl p-4 border border-gray-800" style={{ background: 'rgba(20, 20, 30, 0.6)' }}>
            <p className="text-sm text-gray-400">Total Testimonials</p>
            <p className="text-2xl font-bold text-white mt-1">{stats.total}</p>
          </div>
          <div className="rounded-2xl p-4 border border-gray-800" style={{ background: 'rgba(20, 20, 30, 0.6)' }}>
            <p className="text-sm text-gray-400">Published</p>
            <p className="text-2xl font-bold text-green-400 mt-1">{stats.active}</p>
          </div>
          <div className="rounded-2xl p-4 border border-gray-800" style={{ background: 'rgba(20, 20, 30, 0.6)' }}>
            <p className="text-sm text-gray-400">Hidden</p>
            <p className="text-2xl font-bold text-gray-400 mt-1">{stats.inactive}</p>
          </div>
        </div>

        {/* Add Button */}
        <div className="flex justify-end">
          <Button
            onClick={() => openDialog()}
            className="bg-gradient-to-r from-[#FF3F02] to-[#FEBE03] text-black hover:opacity-90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Testimonial
          </Button>
        </div>

        {/* Testimonials Grid */}
        <div className="rounded-3xl border border-gray-800 p-6 neon-border" style={{ background: 'rgba(20, 20, 30, 0.6)' }}>
          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#FEBE03] border-r-transparent"></div>
              <p className="text-gray-400 mt-4">Loading testimonials...</p>
            </div>
          ) : testimonials.length === 0 ? (
            <div className="p-8 text-center">
              <Quote className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No testimonials yet. Add your first testimonial to get started!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {testimonials.map((testimonial) => (
                <Card
                  key={testimonial.id}
                  className="bg-gray-900 border-gray-800"
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-white text-lg">
                          {testimonial.guest_name}
                        </CardTitle>
                        {testimonial.guest_role && (
                          <CardDescription className="text-gray-400 mt-1">
                            {testimonial.guest_role}
                          </CardDescription>
                        )}
                      </div>
                      {!testimonial.is_active && (
                        <span className="bg-gray-800 text-gray-400 px-2 py-1 rounded text-xs">
                          Hidden
                        </span>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="relative">
                        <Quote className="absolute -top-2 -left-2 h-8 w-8 text-[#FEBE03] opacity-20" />
                        <p className="text-gray-300 italic pl-6 relative z-10">
                          {testimonial.quote}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 pt-4 border-t border-gray-800">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openDialog(testimonial)}
                          className="border-gray-700 text-gray-300 hover:bg-gray-800"
                        >
                          <Edit className="h-3 w-3 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => toggleActive(testimonial.id, testimonial.is_active)}
                          className="border-gray-700 text-gray-300 hover:bg-gray-800"
                        >
                          {testimonial.is_active ? (
                            <>
                              <EyeOff className="h-3 w-3 mr-1" />
                              Hide
                            </>
                          ) : (
                            <>
                              <Eye className="h-3 w-3 mr-1" />
                              Show
                            </>
                          )}
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => deleteTestimonial(testimonial.id)}
                          className="border-red-900 text-red-400 hover:bg-red-900/20"
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Add/Edit Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="bg-[#1a1a1a] border-gray-800 text-white max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-white">
                {editingId ? 'Edit Testimonial' : 'Add New Testimonial'}
              </DialogTitle>
              <DialogDescription className="text-gray-400">
                {editingId ? 'Update the testimonial details below' : 'Add a new testimonial from a guest'}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="guest_name" className="text-gray-300">
                  Guest Name *
                </Label>
                <Input
                  id="guest_name"
                  placeholder="Sarah Johnson"
                  value={formData.guest_name}
                  onChange={(e) => setFormData({ ...formData, guest_name: e.target.value })}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="guest_role" className="text-gray-300">
                  Guest Role (Optional)
                </Label>
                <Input
                  id="guest_role"
                  placeholder="Corporate Retreat Organizer"
                  value={formData.guest_role}
                  onChange={(e) => setFormData({ ...formData, guest_role: e.target.value })}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="quote" className="text-gray-300">
                  Testimonial Quote *
                </Label>
                <Textarea
                  id="quote"
                  placeholder="An unforgettable experience! The sunset views and peaceful atmosphere made our corporate retreat truly special..."
                  value={formData.quote}
                  onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                  className="bg-gray-800 border-gray-700 text-white min-h-[120px]"
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setDialogOpen(false)
                    setEditingId(null)
                    setFormData({ guest_name: '', quote: '', guest_role: '' })
                  }}
                  className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800"
                >
                  Cancel
                </Button>
                <Button
                  onClick={saveTestimonial}
                  className="flex-1 bg-gradient-to-r from-[#FF3F02] to-[#FEBE03] text-black hover:opacity-90"
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {editingId ? 'Updating...' : 'Adding...'}
                    </>
                  ) : (
                    <>{editingId ? 'Update' : 'Add'} Testimonial</>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  )
}
