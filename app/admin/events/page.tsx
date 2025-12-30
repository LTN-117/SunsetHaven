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
import { Plus, Trash2, Eye, EyeOff, Edit, Calendar, DollarSign } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"

interface PriceTier {
  label: string
  price: string
}

interface Event {
  id: string
  title: string
  description: string
  event_date: string
  cost: number
  pricing_tiers: PriceTier[]
  flier_url: string
  paystack_payment_url: string
  is_active: boolean
  display_order: number
  created_at: string
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    event_date: '',
    flier_url: '',
    paystack_payment_url: 'https://paystack.com',
  })
  const [pricingTiers, setPricingTiers] = useState<PriceTier[]>([{ label: '', price: '' }])
  const [uploadedFlier, setUploadedFlier] = useState<File | null>(null)
  const [flierPreview, setFlierPreview] = useState<string>('')

  useEffect(() => {
    loadEvents()
  }, [])

  async function loadEvents() {
    try {
      const response = await fetch('/api/admin/events')
      if (!response.ok) throw new Error('Failed to load events')
      const data = await response.json()

      // Parse pricing_tiers JSON for each event
      const eventsWithParsedTiers = (data || []).map((event: any) => ({
        ...event,
        pricing_tiers: event.pricing_tiers || []
      }))

      setEvents(eventsWithParsedTiers)
    } catch (error) {
      console.error('Error loading events:', error)
      toast.error('Failed to load events')
    } finally {
      setLoading(false)
    }
  }

  function openDialog(event?: Event) {
    if (event) {
      setEditingId(event.id)
      setFormData({
        title: event.title,
        description: event.description,
        event_date: event.event_date,
        flier_url: event.flier_url,
        paystack_payment_url: event.paystack_payment_url,
      })
      setFlierPreview(event.flier_url)
      setPricingTiers(event.pricing_tiers.length > 0 ? event.pricing_tiers : [{ label: '', price: '' }])
    } else {
      setEditingId(null)
      setFormData({
        title: '',
        description: '',
        event_date: '',
        flier_url: '',
        paystack_payment_url: 'https://paystack.com',
      })
      setPricingTiers([{ label: '', price: '' }])
      setUploadedFlier(null)
      setFlierPreview('')
    }
    setDialogOpen(true)
  }

  const handleFlierChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadedFlier(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setFlierPreview(result)
        setFormData({ ...formData, flier_url: result })
      }
      reader.readAsDataURL(file)
    }
  }

  function addPriceTier() {
    setPricingTiers([...pricingTiers, { label: '', price: '' }])
  }

  function removePriceTier(index: number) {
    setPricingTiers(pricingTiers.filter((_, i) => i !== index))
  }

  function updatePriceTier(index: number, field: 'label' | 'price', value: string) {
    const updated = [...pricingTiers]
    updated[index] = { ...updated[index], [field]: value }
    setPricingTiers(updated)
  }

  async function saveEvent() {
    if (!formData.title || !formData.description || !formData.event_date || !formData.flier_url) {
      toast.error('Please fill in all required fields')
      return
    }

    // Validate pricing tiers
    const validTiers = pricingTiers.filter(tier => tier.label.trim() !== '' && tier.price.trim() !== '')
    if (validTiers.length === 0) {
      toast.error('Please add at least one price tier')
      return
    }

    // Calculate the lowest price for the cost column
    const lowestPrice = Math.min(...validTiers.map(tier => parseFloat(tier.price)))

    try {
      if (editingId) {
        // Update existing event
        const response = await fetch('/api/admin/events', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingId,
            title: formData.title,
            description: formData.description,
            event_date: formData.event_date,
            cost: lowestPrice,
            pricing_tiers: validTiers,
            flier_url: formData.flier_url,
            paystack_payment_url: formData.paystack_payment_url,
          })
        })
        if (!response.ok) throw new Error('Failed to update event')

        setEvents(prev =>
          prev.map(e => e.id === editingId
            ? { ...e, ...formData, cost: lowestPrice, pricing_tiers: validTiers }
            : e
          )
        )
        toast.success('Event updated successfully!')
      } else {
        // Create new event
        const maxOrder = events.length > 0
          ? Math.max(...events.map(e => e.display_order))
          : -1

        const response = await fetch('/api/admin/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            title: formData.title,
            description: formData.description,
            event_date: formData.event_date,
            cost: lowestPrice,
            pricing_tiers: validTiers,
            flier_url: formData.flier_url,
            paystack_payment_url: formData.paystack_payment_url,
            display_order: maxOrder + 1,
            is_active: true
          })
        })
        if (!response.ok) throw new Error('Failed to create event')
        const newEvent = await response.json()

        if (newEvent) {
          setEvents([{ ...newEvent, pricing_tiers: validTiers }, ...events])
        }
        toast.success('Event created successfully!')
      }

      setDialogOpen(false)
      setEditingId(null)
      setFormData({
        title: '',
        description: '',
        event_date: '',
        flier_url: '',
        paystack_payment_url: 'https://paystack.com',
      })
      setPricingTiers([{ label: '', price: '' }])
      setUploadedFlier(null)
      setFlierPreview('')
    } catch (error) {
      console.error('Error saving event:', error)
      toast.error('Failed to save event')
    }
  }

  async function deleteEvent(id: string) {
    if (!confirm('Are you sure you want to delete this event?')) return

    try {
      const response = await fetch(`/api/admin/events?id=${id}`, {
        method: 'DELETE'
      })
      if (!response.ok) throw new Error('Failed to delete event')

      setEvents(prev => prev.filter(e => e.id !== id))
      toast.success('Event deleted successfully!')
    } catch (error) {
      console.error('Error deleting event:', error)
      toast.error('Failed to delete event')
    }
  }

  async function toggleActive(id: string, currentStatus: boolean) {
    try {
      const response = await fetch('/api/admin/events', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, is_active: !currentStatus })
      })
      if (!response.ok) throw new Error('Failed to update status')

      setEvents(prev =>
        prev.map(e => e.id === id ? { ...e, is_active: !currentStatus } : e)
      )
      toast.success(!currentStatus ? 'Event activated!' : 'Event deactivated')
    } catch (error) {
      console.error('Error toggling active status:', error)
      toast.error('Failed to update event status')
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(amount)
  }

  const stats = {
    total: events.length,
    active: events.filter(e => e.is_active).length,
    upcoming: events.filter(e => new Date(e.event_date) >= new Date() && e.is_active).length,
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl p-4 border border-gray-800" style={{ background: 'rgba(20, 20, 30, 0.6)' }}>
            <p className="text-sm text-gray-400">Total Events</p>
            <p className="text-2xl font-bold text-white mt-1">{stats.total}</p>
          </div>
          <div className="rounded-2xl p-4 border border-gray-800" style={{ background: 'rgba(20, 20, 30, 0.6)' }}>
            <p className="text-sm text-gray-400">Active</p>
            <p className="text-2xl font-bold text-green-400 mt-1">{stats.active}</p>
          </div>
          <div className="rounded-2xl p-4 border border-gray-800" style={{ background: 'rgba(20, 20, 30, 0.6)' }}>
            <p className="text-sm text-gray-400">Upcoming</p>
            <p className="text-2xl font-bold text-[#FEBE03] mt-1">{stats.upcoming}</p>
          </div>
        </div>

        {/* Add Button */}
        <div className="flex justify-end">
          <Button
            onClick={() => openDialog()}
            className="bg-gradient-to-r from-[#FF3F02] to-[#FEBE03] text-black hover:opacity-90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Event
          </Button>
        </div>

        {/* Events Grid */}
        <div className="rounded-3xl border border-gray-800 p-6 neon-border" style={{ background: 'rgba(20, 20, 30, 0.6)' }}>
          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#FEBE03] border-r-transparent"></div>
              <p className="text-gray-400 mt-4">Loading events...</p>
            </div>
          ) : events.length === 0 ? (
            <div className="p-8 text-center">
              <Calendar className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No events yet. Add your first event to get started!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {events.map((event) => (
                <Card
                  key={event.id}
                  className="bg-gray-900 border-gray-800 overflow-hidden"
                >
                  <div className="relative h-48">
                    <Image
                      src={event.flier_url}
                      alt={event.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                    {!event.is_active && (
                      <div className="absolute top-2 right-2 bg-gray-800/90 text-gray-300 px-2 py-1 rounded text-xs">
                        Hidden
                      </div>
                    )}
                  </div>
                  <CardHeader>
                    <CardTitle className="text-white text-lg">{event.title}</CardTitle>
                    <CardDescription className="text-gray-400">
                      <div className="flex items-center gap-2 mt-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(event.event_date)}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <DollarSign className="h-3 w-3" />
                        From {formatCurrency(event.cost)}
                      </div>
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-300 text-sm line-clamp-2 mb-4">
                      {event.description}
                    </p>

                    <div className="flex items-center gap-2 pt-4 border-t border-gray-800">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openDialog(event)}
                        className="border-gray-700 text-black bg-white hover:bg-gray-100"
                      >
                        <Edit className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleActive(event.id, event.is_active)}
                        className="border-gray-700 text-black bg-white hover:bg-gray-100"
                      >
                        {event.is_active ? (
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
                        onClick={() => deleteEvent(event.id)}
                        className="border-red-900 text-red-400 hover:bg-red-900/20"
                      >
                        <Trash2 className="h-3 w-3 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Add/Edit Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="bg-[#1a1a1a] border-gray-800 text-white max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-white">
                {editingId ? 'Edit Event' : 'Add New Event'}
              </DialogTitle>
              <DialogDescription className="text-gray-400">
                {editingId ? 'Update the event details below' : 'Create a new event with flier and payment details'}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 mt-4">
              {/* Event Details */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-300 border-b border-gray-800 pb-2">
                  Event Details
                </h3>

                <div className="space-y-2">
                  <Label htmlFor="title" className="text-gray-300">
                    Event Title *
                  </Label>
                  <Input
                    id="title"
                    placeholder="Beach Sunset Party 2025"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-gray-300">
                    Description *
                  </Label>
                  <Textarea
                    id="description"
                    placeholder="Join us for an unforgettable evening at Tarkwa Bay..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 min-h-[100px]"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="event_date" className="text-gray-300">
                    Event Date *
                  </Label>
                  <Input
                    id="event_date"
                    type="date"
                    value={formData.event_date}
                    onChange={(e) => setFormData({ ...formData, event_date: e.target.value })}
                    className="bg-gray-800 border-gray-700 text-white"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="paystack_url" className="text-gray-300">
                    Paystack Payment URL *
                  </Label>
                  <Input
                    id="paystack_url"
                    type="url"
                    placeholder="https://paystack.com/pay/your-payment-link"
                    value={formData.paystack_payment_url}
                    onChange={(e) => setFormData({ ...formData, paystack_payment_url: e.target.value })}
                    className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
                  />
                </div>
              </div>

              {/* Pricing Tiers */}
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b border-gray-800 pb-2">
                  <h3 className="text-sm font-semibold text-gray-300">
                    Pricing Tiers *
                  </h3>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addPriceTier}
                    className="border-gray-700 text-gray-300 hover:bg-gray-800"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add Tier
                  </Button>
                </div>

                {pricingTiers.length === 0 ? (
                  <div className="text-center py-4 border border-dashed border-gray-700 rounded-lg">
                    <DollarSign className="h-8 w-8 text-gray-600 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">No pricing tiers added yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {pricingTiers.map((tier, index) => (
                      <div key={index} className="p-4 bg-gray-800/50 rounded-lg">
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="text-sm font-medium text-gray-300">Tier {index + 1}</h4>
                          {pricingTiers.length > 1 && (
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              onClick={() => removePriceTier(index)}
                              className="text-red-400 hover:bg-red-900/20"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          <Input
                            placeholder="Price Label (e.g., Early Bird)"
                            value={tier.label}
                            onChange={(e) => updatePriceTier(index, 'label', e.target.value)}
                            className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                          />
                          <Input
                            placeholder="Price (e.g., 30000)"
                            type="number"
                            value={tier.price}
                            onChange={(e) => updatePriceTier(index, 'price', e.target.value)}
                            className="bg-gray-900 border-gray-700 text-white placeholder:text-gray-500"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Flier Upload */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-300 border-b border-gray-800 pb-2">
                  Event Flier
                </h3>

                <div className="space-y-2">
                  <Label htmlFor="flier_upload" className="text-gray-300">
                    Upload Flier *
                  </Label>
                  <Input
                    id="flier_upload"
                    type="file"
                    accept="image/*"
                    onChange={handleFlierChange}
                    className="bg-gray-800 border-gray-700 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-[#FF3F02] file:to-[#FEBE03] file:text-white hover:file:opacity-90 cursor-pointer"
                  />
                  <p className="text-xs text-gray-500">Or enter a URL below</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="flier_url" className="text-gray-300">
                    Flier URL
                  </Label>
                  <Input
                    id="flier_url"
                    placeholder="https://example.com/flier.jpg"
                    value={formData.flier_url}
                    onChange={(e) => setFormData({ ...formData, flier_url: e.target.value })}
                    className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
                    disabled={!!uploadedFlier}
                  />
                  {uploadedFlier && (
                    <p className="text-xs text-green-400">File uploaded: {uploadedFlier.name}</p>
                  )}
                </div>

                {flierPreview && (
                  <div className="space-y-2">
                    <Label className="text-gray-300">Preview</Label>
                    <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-800">
                      <Image
                        src={flierPreview}
                        alt="Flier preview"
                        fill
                        className="object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement
                          target.style.display = 'none'
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => {
                    setDialogOpen(false)
                    setEditingId(null)
                    setFormData({
                      title: '',
                      description: '',
                      event_date: '',
                      flier_url: '',
                      paystack_payment_url: 'https://paystack.com',
                    })
                    setPricingTiers([{ label: '', price: '' }])
                    setUploadedFlier(null)
                    setFlierPreview('')
                  }}
                  className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800"
                >
                  Cancel
                </Button>
                <Button
                  onClick={saveEvent}
                  className="flex-1 bg-gradient-to-r from-[#FF3F02] to-[#FEBE03] text-black hover:opacity-90"
                >
                  {editingId ? 'Update' : 'Create'} Event
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  )
}
