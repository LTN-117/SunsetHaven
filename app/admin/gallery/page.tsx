"use client"

import { useEffect, useState } from "react"
import AdminLayout from "@/components/admin/AdminLayout"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { Plus, Trash2, Eye, EyeOff, GripVertical } from "lucide-react"
import Image from "next/image"

interface GalleryImage {
  id: string
  image_url: string
  caption: string
  category: string
  display_order: number
  is_active: boolean
  created_at: string
}

export default function GalleryPage() {
  const [images, setImages] = useState<GalleryImage[]>([])
  const [filteredImages, setFilteredImages] = useState<GalleryImage[]>([])
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [newImage, setNewImage] = useState({
    image_url: '',
    caption: '',
    category: 'general',
  })

  useEffect(() => {
    loadImages()
  }, [])

  useEffect(() => {
    filterImages()
  }, [images, categoryFilter])

  async function loadImages() {
    try {
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*')
        .order('display_order', { ascending: true })

      if (error) throw error
      setImages(data || [])
    } catch (error) {
      console.error('Error loading images:', error)
    } finally {
      setLoading(false)
    }
  }

  function filterImages() {
    if (categoryFilter === "all") {
      setFilteredImages(images)
    } else {
      setFilteredImages(images.filter(img => img.category === categoryFilter))
    }
  }

  async function addImage() {
    if (!newImage.image_url) {
      alert('Please enter an image URL')
      return
    }

    try {
      const maxOrder = images.length > 0
        ? Math.max(...images.map(img => img.display_order))
        : -1

      const { data, error } = await supabase
        .from('gallery_images')
        .insert([{
          ...newImage,
          display_order: maxOrder + 1,
          is_active: true
        }])
        .select()

      if (error) throw error

      if (data) {
        setImages([...images, data[0]])
      }

      // Reset form
      setNewImage({
        image_url: '',
        caption: '',
        category: 'general',
      })
      setDialogOpen(false)
    } catch (error) {
      console.error('Error adding image:', error)
      alert('Failed to add image. Please try again.')
    }
  }

  async function deleteImage(id: string) {
    if (!confirm('Are you sure you want to delete this image?')) return

    try {
      const { error } = await supabase
        .from('gallery_images')
        .delete()
        .eq('id', id)

      if (error) throw error

      setImages(prev => prev.filter(img => img.id !== id))
    } catch (error) {
      console.error('Error deleting image:', error)
      alert('Failed to delete image. Please try again.')
    }
  }

  async function toggleActive(id: string, currentStatus: boolean) {
    try {
      const { error } = await supabase
        .from('gallery_images')
        .update({ is_active: !currentStatus })
        .eq('id', id)

      if (error) throw error

      setImages(prev =>
        prev.map(img => img.id === id ? { ...img, is_active: !currentStatus } : img)
      )
    } catch (error) {
      console.error('Error toggling active status:', error)
    }
  }

  const categories = ['general', 'camping', 'activities', 'events', 'sunset', 'beach']
  const stats = {
    total: images.length,
    active: images.filter(i => i.is_active).length,
    inactive: images.filter(i => !i.is_active).length,
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl p-4 border border-gray-800" style={{ background: 'rgba(20, 20, 30, 0.6)' }}>
            <p className="text-sm text-gray-400">Total Images</p>
            <p className="text-2xl font-bold text-white mt-1">{stats.total}</p>
          </div>
          <div className="rounded-2xl p-4 border border-gray-800" style={{ background: 'rgba(20, 20, 30, 0.6)' }}>
            <p className="text-sm text-gray-400">Active</p>
            <p className="text-2xl font-bold text-green-400 mt-1">{stats.active}</p>
          </div>
          <div className="rounded-2xl p-4 border border-gray-800" style={{ background: 'rgba(20, 20, 30, 0.6)' }}>
            <p className="text-sm text-gray-400">Inactive</p>
            <p className="text-2xl font-bold text-gray-400 mt-1">{stats.inactive}</p>
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex items-center justify-between gap-4 rounded-2xl p-4 border border-gray-800" style={{ background: 'rgba(20, 20, 30, 0.6)' }}>
          <Select value={categoryFilter} onValueChange={setCategoryFilter}>
            <SelectTrigger className="w-[200px] bg-gray-800 border-gray-700 text-white">
              <SelectValue placeholder="Filter by category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(cat => (
                <SelectItem key={cat} value={cat}>
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button
            onClick={() => setDialogOpen(true)}
            className="bg-gradient-to-r from-[#FF3F02] to-[#FEBE03] text-white hover:opacity-90"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Image
          </Button>
        </div>

        {/* Images Grid */}
        <div className="rounded-3xl border border-gray-800 p-6 neon-border" style={{ background: 'rgba(20, 20, 30, 0.6)' }}>
          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#FEBE03] border-r-transparent"></div>
              <p className="text-gray-400 mt-4">Loading images...</p>
            </div>
          ) : filteredImages.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-400">No images found. Add your first image to get started!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredImages.map((image) => (
                <div
                  key={image.id}
                  className="group relative rounded-xl overflow-hidden border border-gray-800 bg-gray-900"
                >
                  {/* Image */}
                  <div className="relative aspect-square">
                    <Image
                      src={image.image_url}
                      alt={image.caption || 'Gallery image'}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />

                    {/* Overlay on hover */}
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleActive(image.id, image.is_active)}
                        className="bg-white/20 hover:bg-white/30 text-white"
                      >
                        {image.is_active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => deleteImage(image.id)}
                        className="bg-red-500/20 hover:bg-red-500/30 text-red-400"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Status Badge */}
                    {!image.is_active && (
                      <div className="absolute top-2 right-2 bg-gray-800/90 text-gray-300 px-2 py-1 rounded text-xs">
                        Hidden
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="p-3 space-y-1">
                    <p className="text-sm text-white font-medium truncate">
                      {image.caption || 'No caption'}
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-400 capitalize">{image.category}</p>
                      <div className="flex items-center gap-1 text-gray-500">
                        <GripVertical className="h-3 w-3" />
                        <span className="text-xs">{image.display_order}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Add Image Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="bg-[#1a1a1a] border-gray-800 text-white">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-white">
                Add New Image
              </DialogTitle>
              <DialogDescription className="text-gray-400">
                Add a new image to the gallery
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="image_url" className="text-gray-300">
                  Image URL
                </Label>
                <Input
                  id="image_url"
                  placeholder="https://example.com/image.jpg or /local-image.jpg"
                  value={newImage.image_url}
                  onChange={(e) => setNewImage({ ...newImage, image_url: e.target.value })}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="caption" className="text-gray-300">
                  Caption (Optional)
                </Label>
                <Input
                  id="caption"
                  placeholder="Beautiful sunset at Tarkwa Bay"
                  value={newImage.caption}
                  onChange={(e) => setNewImage({ ...newImage, caption: e.target.value })}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category" className="text-gray-300">
                  Category
                </Label>
                <Select
                  value={newImage.category}
                  onValueChange={(value) => setNewImage({ ...newImage, category: value })}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {newImage.image_url && (
                <div className="space-y-2">
                  <Label className="text-gray-300">Preview</Label>
                  <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-800">
                    <Image
                      src={newImage.image_url}
                      alt="Preview"
                      fill
                      className="object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.style.display = 'none'
                      }}
                    />
                  </div>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                  className="flex-1 border-gray-700 text-gray-300 hover:bg-gray-800"
                >
                  Cancel
                </Button>
                <Button
                  onClick={addImage}
                  className="flex-1 bg-gradient-to-r from-[#FF3F02] to-[#FEBE03] text-white hover:opacity-90"
                >
                  Add Image
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  )
}
