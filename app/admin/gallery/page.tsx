"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import AdminLayout from "@/components/admin/AdminLayout"
import { supabase } from "@/lib/supabase"
import { getAdminProfile, getUserPermissions } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Plus, Trash2, Eye, EyeOff, GripVertical, Star, Loader2 } from "lucide-react"
import Image from "next/image"
import { toast } from "sonner"

interface GalleryImage {
  id: string
  image_url: string
  caption: string
  category: string
  tag?: string | null
  activity_id?: string | null
  display_order: number
  is_active: boolean
  show_in_hero: boolean
  show_in_gallery?: boolean
  created_at: string
}

export default function GalleryPage() {
  const router = useRouter()
  const [images, setImages] = useState<GalleryImage[]>([])
  const [filteredImages, setFilteredImages] = useState<GalleryImage[]>([])
  const [categoryFilter, setCategoryFilter] = useState<string>("all")
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [imageToDelete, setImageToDelete] = useState<string | null>(null)
  const [permissions, setPermissions] = useState<any>(null)
  const [newImage, setNewImage] = useState({
    image_url: '',
    caption: '',
    category: 'general',
    tag: '',
    show_in_hero: false,
    show_in_gallery: true,
  })
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>('')
  const [isAdding, setIsAdding] = useState(false)

  useEffect(() => {
    checkPermissionsAndLoad()
  }, [])

  useEffect(() => {
    filterImages()
  }, [images, categoryFilter])

  async function checkPermissionsAndLoad() {
    try {
      const profile = await getAdminProfile()
      if (!profile) {
        router.push('/admin/login')
        return
      }

      const perms = await getUserPermissions('gallery')
      if (!perms || !perms.can_view) {
        toast.error('You do not have permission to view gallery')
        router.push('/admin')
        return
      }
      setPermissions(perms)

      await loadImages()
    } catch (error) {
      console.error('Error checking permissions:', error)
      router.push('/admin')
    }
  }

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
    } else if (categoryFilter === "hero") {
      setFilteredImages(images.filter(img => img.show_in_hero && !img.tag))
    } else if (categoryFilter === "gallery") {
      setFilteredImages(images.filter(img => img.show_in_gallery && !img.tag && !img.show_in_hero))
    } else {
      setFilteredImages(images.filter(img => img.tag === categoryFilter))
    }
  }

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadedFile(file)

      // Create preview URL
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setPreviewUrl(result)
        setNewImage({ ...newImage, image_url: result })
      }
      reader.readAsDataURL(file)
    }
  }

  async function addImage() {
    if (!permissions?.can_create) {
      toast.error('You do not have permission to add images')
      return
    }

    if (!uploadedFile && !newImage.image_url) {
      toast.error('Please upload an image or enter an image URL')
      return
    }

    setIsAdding(true)
    try {
      let imageUrl = newImage.image_url

      // If user uploaded a file, upload it to Supabase Storage
      if (uploadedFile) {
        const fileExt = uploadedFile.name.split('.').pop()
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
        const filePath = `${fileName}`

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('gallery-images')
          .upload(filePath, uploadedFile, {
            cacheControl: '3600',
            upsert: false
          })

        if (uploadError) {
          console.error('Upload error:', uploadError)
          throw new Error(`Failed to upload image: ${uploadError.message}`)
        }

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('gallery-images')
          .getPublicUrl(filePath)

        imageUrl = publicUrl
      }

      // If tagging with a "What We've Built" tag, auto-reassign the existing tagged image
      const whatWeveBuiltTags = ['bespoke-events', 'curated-networking', 'adventure-activities', 'premium-camping']
      if (newImage.tag && whatWeveBuiltTags.includes(newImage.tag)) {
        // Find existing image with this tag
        const existingTaggedImage = images.find(img => img.tag === newImage.tag)
        if (existingTaggedImage) {
          // Auto-reassign to gallery
          await supabase
            .from('gallery_images')
            .update({ tag: null, show_in_gallery: true, show_in_hero: false })
            .eq('id', existingTaggedImage.id)

          toast.info(`Previous "${newImage.tag}" image reassigned to gallery`)
        }
      }

      const maxOrder = images.length > 0
        ? Math.max(...images.map(img => img.display_order))
        : -1

      const { data, error } = await supabase
        .from('gallery_images')
        .insert([{
          image_url: imageUrl,
          caption: newImage.caption,
          category: newImage.category,
          tag: newImage.tag || null,
          display_order: maxOrder + 1,
          is_active: true,
          show_in_hero: newImage.show_in_hero,
          show_in_gallery: newImage.show_in_gallery
        }])
        .select()

      if (error) throw error

      // Reload all images to reflect changes
      await loadImages()

      // Reset form
      setNewImage({
        image_url: '',
        caption: '',
        category: 'general',
        tag: '',
        show_in_hero: false,
        show_in_gallery: true,
      })
      setUploadedFile(null)
      setPreviewUrl('')
      setDialogOpen(false)
      toast.success('Image added successfully!')
    } catch (error: any) {
      console.error('Error adding image:', error)
      toast.error(error.message || 'Failed to add image. Please try again.')
    } finally {
      setIsAdding(false)
    }
  }

  function confirmDelete(id: string) {
    if (!permissions?.can_delete) {
      toast.error('You do not have permission to delete images')
      return
    }
    setImageToDelete(id)
    setDeleteDialogOpen(true)
  }

  async function deleteImage() {
    if (!imageToDelete) return

    try {
      const { error } = await supabase
        .from('gallery_images')
        .delete()
        .eq('id', imageToDelete)

      if (error) throw error

      setImages(prev => prev.filter(img => img.id !== imageToDelete))
      toast.success('Image deleted successfully!')
      setDeleteDialogOpen(false)
      setImageToDelete(null)
    } catch (error) {
      console.error('Error deleting image:', error)
      toast.error('Failed to delete image. Please try again.')
    }
  }

  async function toggleActive(id: string, currentStatus: boolean) {
    if (!permissions?.can_edit) {
      toast.error('You do not have permission to edit images')
      return
    }

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

  async function toggleHero(id: string, currentStatus: boolean) {
    if (!permissions?.can_edit) {
      toast.error('You do not have permission to edit images')
      return
    }

    try {
      const { error } = await supabase
        .from('gallery_images')
        .update({ show_in_hero: !currentStatus })
        .eq('id', id)

      if (error) throw error

      setImages(prev =>
        prev.map(img => img.id === id ? { ...img, show_in_hero: !currentStatus } : img)
      )
      toast.success(!currentStatus ? 'Added to hero section!' : 'Removed from hero section')
    } catch (error) {
      console.error('Error toggling hero status:', error)
      toast.error('Failed to update hero status')
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
              <SelectValue placeholder="Filter by tag" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Images</SelectItem>
              <SelectItem value="hero">Hero Only</SelectItem>
              <SelectItem value="gallery">Gallery Only</SelectItem>
              <SelectItem value="bespoke-events">Bespoke Events</SelectItem>
              <SelectItem value="curated-networking">Curated Networking</SelectItem>
              <SelectItem value="adventure-activities">Adventure Activities</SelectItem>
              <SelectItem value="premium-camping">Premium Camping</SelectItem>
            </SelectContent>
          </Select>

          <Button
            onClick={() => setDialogOpen(true)}
            className="bg-gradient-to-r from-[#FF3F02] to-[#FEBE03] text-black hover:opacity-90"
            disabled={!permissions?.can_create}
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
                        onClick={() => toggleHero(image.id, image.show_in_hero)}
                        className={`${image.show_in_hero ? 'bg-yellow-500/30 hover:bg-yellow-500/40' : 'bg-white/20 hover:bg-white/30'} text-white`}
                        title={image.show_in_hero ? "Remove from hero" : "Add to hero"}
                        disabled={!permissions?.can_edit}
                      >
                        <Star className={`h-4 w-4 ${image.show_in_hero ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => toggleActive(image.id, image.is_active)}
                        className="bg-white/20 hover:bg-white/30 text-white"
                        disabled={!permissions?.can_edit}
                      >
                        {image.is_active ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => confirmDelete(image.id)}
                        className="bg-red-500/20 hover:bg-red-500/30 text-red-400"
                        disabled={!permissions?.can_delete}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Status Badges */}
                    <div className="absolute top-2 right-2 flex flex-col gap-1">
                      {image.show_in_hero && (
                        <div className="bg-yellow-500/90 text-white px-2 py-1 rounded text-xs font-semibold flex items-center gap-1">
                          <Star className="h-3 w-3 fill-white" />
                          Hero
                        </div>
                      )}
                      {image.show_in_gallery && (
                        <div className="bg-blue-500/90 text-white px-2 py-1 rounded text-xs font-semibold">
                          Gallery
                        </div>
                      )}
                      {image.tag && (
                        <div className="bg-gradient-to-r from-[#FF3F02] to-[#FEBE03] text-white px-2 py-1 rounded text-xs font-semibold">
                          {image.tag === 'bespoke-events' ? 'Bespoke Events' :
                           image.tag === 'curated-networking' ? 'Curated Networking' :
                           image.tag === 'adventure-activities' ? 'Adventure Activities' :
                           image.tag === 'premium-camping' ? 'Premium Camping' : image.tag}
                        </div>
                      )}
                      {!image.is_active && (
                        <div className="bg-gray-800/90 text-gray-300 px-2 py-1 rounded text-xs">
                          Hidden
                        </div>
                      )}
                    </div>
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
          <DialogContent className="bg-[#1a1a1a] border-gray-800 text-white max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-white">
                Add New Image
              </DialogTitle>
              <DialogDescription className="text-gray-400">
                Add a new image to the gallery
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 mt-4">
              {/* File Upload Option */}
              <div className="space-y-2">
                <Label htmlFor="file_upload" className="text-gray-300">
                  Upload Image File
                </Label>
                <Input
                  id="file_upload"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="bg-gray-800 border-gray-700 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-[#FF3F02] file:to-[#FEBE03] file:text-white hover:file:opacity-90 cursor-pointer"
                />
                <p className="text-xs text-gray-500">Or enter a URL below</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="image_url" className="text-gray-300">
                  Image URL
                </Label>
                <Input
                  id="image_url"
                  placeholder="https://example.com/image.jpg or /local-image.jpg"
                  value={newImage.image_url}
                  onChange={(e) => setNewImage({ ...newImage, image_url: e.target.value })}
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
                  disabled={!!uploadedFile}
                />
                {uploadedFile && (
                  <p className="text-xs text-green-400">File uploaded: {uploadedFile.name}</p>
                )}
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
                  className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tag" className="text-gray-300">
                  Link to "What We've Built" Card (Optional)
                </Label>
                <Select
                  value={newImage.tag || "none"}
                  onValueChange={(value) => setNewImage({ ...newImage, tag: value === "none" ? '' : value })}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-600 text-white focus:border-[#FEBE03]">
                    <SelectValue placeholder="Select a card" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600 text-white">
                    <SelectItem value="none" className="text-white hover:bg-gray-700">None</SelectItem>
                    <SelectItem value="bespoke-events" className="text-white hover:bg-gray-700">Bespoke Events</SelectItem>
                    <SelectItem value="curated-networking" className="text-white hover:bg-gray-700">Curated Networking</SelectItem>
                    <SelectItem value="adventure-activities" className="text-white hover:bg-gray-700">Adventure Activities</SelectItem>
                    <SelectItem value="premium-camping" className="text-white hover:bg-gray-700">Premium Camping</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">Select which "What We've Built" card should display this image</p>
              </div>

              <div className="space-y-3 pt-2 border-t border-gray-700">
                <Label className="text-gray-300">Display Options</Label>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="show_in_hero"
                    checked={newImage.show_in_hero}
                    onCheckedChange={(checked) => setNewImage({ ...newImage, show_in_hero: checked as boolean })}
                    className="border-gray-600 data-[state=checked]:bg-[#FEBE03] data-[state=checked]:border-[#FEBE03]"
                  />
                  <Label htmlFor="show_in_hero" className="text-sm text-gray-300 cursor-pointer">
                    Show in Hero Section
                  </Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="show_in_gallery"
                    checked={newImage.show_in_gallery}
                    onCheckedChange={(checked) => setNewImage({ ...newImage, show_in_gallery: checked as boolean })}
                    className="border-gray-600 data-[state=checked]:bg-[#FEBE03] data-[state=checked]:border-[#FEBE03]"
                  />
                  <Label htmlFor="show_in_gallery" className="text-sm text-gray-300 cursor-pointer">
                    Show in Gallery
                  </Label>
                </div>
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
                  className="flex-1 bg-gradient-to-r from-[#FF3F02] to-[#FEBE03] text-black hover:opacity-90"
                  disabled={isAdding}
                >
                  {isAdding ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Adding...
                    </>
                  ) : (
                    'Add Image'
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <AlertDialogContent className="bg-[#1a1a1a] border-gray-800 text-white">
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Image?</AlertDialogTitle>
              <AlertDialogDescription className="text-gray-400">
                Are you sure you want to delete this image? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className="bg-gray-800 border-gray-700 text-white hover:bg-gray-700">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={deleteImage}
                className="bg-red-600 text-white hover:bg-red-700"
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </AdminLayout>
  )
}
