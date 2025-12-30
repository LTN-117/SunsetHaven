"use client"

import { useEffect, useState } from "react"
import AdminLayout from "@/components/admin/AdminLayout"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Eye, Filter, Mail, Phone, Calendar, X } from "lucide-react"
import { format } from "date-fns"
import { toast } from "sonner"

interface Inquiry {
  id: string
  name: string
  phone: string
  inquiry_type: string
  message: string
  status: 'new' | 'read' | 'responded' | 'archived'
  created_at: string
  updated_at: string
}

export default function InquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([])
  const [filteredInquiries, setFilteredInquiries] = useState<Inquiry[]>([])
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)

  useEffect(() => {
    loadInquiries()
  }, [])

  useEffect(() => {
    filterInquiries()
  }, [inquiries, statusFilter])

  async function loadInquiries() {
    try {
      const response = await fetch('/api/admin/inquiries')
      if (!response.ok) throw new Error('Failed to load inquiries')
      const data = await response.json()
      setInquiries(data || [])
    } catch (error) {
      console.error('Error loading inquiries:', error)
    } finally {
      setLoading(false)
    }
  }

  function filterInquiries() {
    if (statusFilter === "all") {
      setFilteredInquiries(inquiries)
    } else {
      setFilteredInquiries(inquiries.filter(inq => inq.status === statusFilter))
    }
  }

  async function updateStatus(id: string, newStatus: Inquiry['status']) {
    try {
      const response = await fetch('/api/admin/inquiries', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus })
      })
      if (!response.ok) throw new Error('Failed to update status')

      // Update local state
      setInquiries(prev =>
        prev.map(inq => inq.id === id ? { ...inq, status: newStatus } : inq)
      )

      if (selectedInquiry?.id === id) {
        setSelectedInquiry(prev => prev ? { ...prev, status: newStatus } : null)
      }
    } catch (error) {
      console.error('Error updating status:', error)
    }
  }

  function openInquiry(inquiry: Inquiry) {
    setSelectedInquiry(inquiry)
    setDialogOpen(true)

    // Mark as read if it's new
    if (inquiry.status === 'new') {
      updateStatus(inquiry.id, 'read')
    }
  }

  function getStatusBadge(status: string) {
    const variants: Record<string, { color: string; label: string }> = {
      new: { color: "bg-[#FEBE03] text-black", label: "New" },
      read: { color: "bg-blue-600 text-white", label: "Read" },
      responded: { color: "bg-green-600 text-white", label: "Responded" },
      archived: { color: "bg-gray-600 text-white", label: "Archived" },
    }

    const variant = variants[status] || variants.new
    return (
      <Badge className={`${variant.color}`}>
        {variant.label}
      </Badge>
    )
  }

  function formatInquiryType(type: string) {
    return type
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  }

  const stats = {
    total: inquiries.length,
    new: inquiries.filter(i => i.status === 'new').length,
    read: inquiries.filter(i => i.status === 'read').length,
    responded: inquiries.filter(i => i.status === 'responded').length,
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="rounded-2xl p-4 border border-gray-800" style={{ background: 'rgba(20, 20, 30, 0.6)' }}>
            <p className="text-sm text-gray-400">Total Inquiries</p>
            <p className="text-2xl font-bold text-white mt-1">{stats.total}</p>
          </div>
          <div className="rounded-2xl p-4 border border-gray-800" style={{ background: 'rgba(20, 20, 30, 0.6)' }}>
            <p className="text-sm text-gray-400">New</p>
            <p className="text-2xl font-bold text-[#FEBE03] mt-1">{stats.new}</p>
          </div>
          <div className="rounded-2xl p-4 border border-gray-800" style={{ background: 'rgba(20, 20, 30, 0.6)' }}>
            <p className="text-sm text-gray-400">Read</p>
            <p className="text-2xl font-bold text-blue-400 mt-1">{stats.read}</p>
          </div>
          <div className="rounded-2xl p-4 border border-gray-800" style={{ background: 'rgba(20, 20, 30, 0.6)' }}>
            <p className="text-sm text-gray-400">Responded</p>
            <p className="text-2xl font-bold text-green-400 mt-1">{stats.responded}</p>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center gap-4 rounded-2xl p-4 border border-gray-800" style={{ background: 'rgba(20, 20, 30, 0.6)' }}>
          <Filter className="h-5 w-5 text-gray-400" />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[200px] bg-gray-800 border-gray-700 text-white">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Inquiries</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="read">Read</SelectItem>
              <SelectItem value="responded">Responded</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
          {statusFilter !== "all" && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setStatusFilter("all")}
              className="text-gray-400 hover:text-white"
            >
              <X className="h-4 w-4 mr-1" />
              Clear Filter
            </Button>
          )}
        </div>

        {/* Inquiries Table */}
        <div className="rounded-3xl border border-gray-800 overflow-hidden neon-border" style={{ background: 'rgba(20, 20, 30, 0.6)' }}>
          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#FEBE03] border-r-transparent"></div>
              <p className="text-gray-400 mt-4">Loading inquiries...</p>
            </div>
          ) : filteredInquiries.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-400">No inquiries found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-gray-800 hover:bg-transparent">
                    <TableHead className="text-gray-400">Date</TableHead>
                    <TableHead className="text-gray-400">Name</TableHead>
                    <TableHead className="text-gray-400">Phone</TableHead>
                    <TableHead className="text-gray-400">Type</TableHead>
                    <TableHead className="text-gray-400">Status</TableHead>
                    <TableHead className="text-gray-400">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInquiries.map((inquiry) => (
                    <TableRow
                      key={inquiry.id}
                      className="border-gray-800 hover:bg-gray-800/50 cursor-pointer"
                      onClick={() => openInquiry(inquiry)}
                    >
                      <TableCell className="text-gray-300">
                        {format(new Date(inquiry.created_at), 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell className="font-medium text-white">
                        {inquiry.name}
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {inquiry.phone}
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {formatInquiryType(inquiry.inquiry_type)}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(inquiry.status)}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            openInquiry(inquiry)
                          }}
                          className="text-[#FEBE03] hover:text-[#FF3F02]"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>

        {/* Inquiry Detail Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="bg-[#1a1a1a] border-gray-800 text-white max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-white">
                Inquiry Details
              </DialogTitle>
              <DialogDescription className="text-gray-400">
                {selectedInquiry && format(new Date(selectedInquiry.created_at), 'MMMM dd, yyyy \'at\' h:mm a')}
              </DialogDescription>
            </DialogHeader>

            {selectedInquiry && (
              <div className="space-y-6 mt-4">
                {/* Contact Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400 flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Name
                    </label>
                    <p className="text-white font-medium">{selectedInquiry.name}</p>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400 flex items-center gap-2">
                      <Phone className="h-4 w-4" />
                      Phone
                    </label>
                    <p className="text-white font-medium">{selectedInquiry.phone}</p>
                  </div>
                </div>

                {/* Inquiry Type */}
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Inquiry Type</label>
                  <p className="text-white font-medium">
                    {formatInquiryType(selectedInquiry.inquiry_type)}
                  </p>
                </div>

                {/* Message */}
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Message</label>
                  <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700">
                    <p className="text-white whitespace-pre-wrap">{selectedInquiry.message}</p>
                  </div>
                </div>

                {/* Status Update */}
                <div className="space-y-2">
                  <label className="text-sm text-gray-400">Update Status</label>
                  <Select
                    value={selectedInquiry.status}
                    onValueChange={(value) => updateStatus(selectedInquiry.id, value as Inquiry['status'])}
                  >
                    <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="read">Read</SelectItem>
                      <SelectItem value="responded">Responded</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Timestamps */}
                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-800">
                  <div>
                    <p className="text-xs text-gray-500">Created</p>
                    <p className="text-sm text-gray-400 flex items-center gap-1 mt-1">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(selectedInquiry.created_at), 'MMM dd, yyyy h:mm a')}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Last Updated</p>
                    <p className="text-sm text-gray-400 flex items-center gap-1 mt-1">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(selectedInquiry.updated_at), 'MMM dd, yyyy h:mm a')}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  )
}
