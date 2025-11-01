"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Plus, Trash2, Edit, Shield, Eye, EyeOff, UserCog } from "lucide-react"
import { toast } from "sonner"
import { getAdminProfile, getUserPermissions } from "@/lib/auth"

interface AdminUser {
  id: string
  email: string
  full_name: string
  role: 'super_admin' | 'admin' | 'editor' | 'viewer'
  is_active: boolean
  is_deletable: boolean
  last_login: string | null
  created_at: string
}

export default function UsersPage() {
  const router = useRouter()
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null)
  const [permissions, setPermissions] = useState<any>(null)
  const [formData, setFormData] = useState({
    email: '',
    full_name: '',
    password: '',
    role: 'viewer' as 'super_admin' | 'admin' | 'editor' | 'viewer',
  })

  useEffect(() => {
    checkPermissionsAndLoad()
  }, [])

  async function checkPermissionsAndLoad() {
    try {
      // Get current user
      const profile = await getAdminProfile()
      if (!profile) {
        router.push('/admin/login')
        return
      }
      setCurrentUser(profile)

      // Check permissions
      const perms = await getUserPermissions('users')
      if (!perms || !perms.can_view) {
        toast.error('You do not have permission to view users')
        router.push('/admin')
        return
      }
      setPermissions(perms)

      // Load users
      await loadUsers()
    } catch (error) {
      console.error('Error checking permissions:', error)
      router.push('/admin')
    }
  }

  async function loadUsers() {
    try {
      const { data, error } = await supabase
        .from('admin_profiles')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error

      setUsers(data || [])
    } catch (error) {
      console.error('Error loading users:', error)
      toast.error('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  function openDialog(user?: AdminUser) {
    if (user) {
      setEditingId(user.id)
      setFormData({
        email: user.email,
        full_name: user.full_name,
        password: '',
        role: user.role,
      })
    } else {
      setEditingId(null)
      setFormData({
        email: '',
        full_name: '',
        password: '',
        role: 'viewer',
      })
    }
    setDialogOpen(true)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!formData.email || !formData.full_name) {
      toast.error('Please fill in all required fields')
      return
    }

    if (!editingId && !formData.password) {
      toast.error('Password is required for new users')
      return
    }

    try {
      if (editingId) {
        // Update existing user
        if (!permissions.can_edit) {
          toast.error('You do not have permission to edit users')
          return
        }

        const { error } = await supabase
          .from('admin_profiles')
          .update({
            full_name: formData.full_name,
            role: formData.role,
            updated_at: new Date().toISOString()
          })
          .eq('id', editingId)

        if (error) throw error

        // If password is provided, update it via auth
        if (formData.password) {
          const { error: authError } = await supabase.auth.updateUser({
            password: formData.password
          })
          if (authError) throw authError
        }

        toast.success('User updated successfully')
      } else {
        // Create new user
        if (!permissions.can_create) {
          toast.error('You do not have permission to create users')
          return
        }

        const { data: authData, error: authError } = await supabase.auth.admin.createUser({
          email: formData.email,
          password: formData.password,
          email_confirm: true,
          user_metadata: {
            full_name: formData.full_name,
            role: formData.role
          }
        })

        if (authError) throw authError

        toast.success('User created successfully')
      }

      setDialogOpen(false)
      await loadUsers()
    } catch (error: any) {
      console.error('Error saving user:', error)
      toast.error(error.message || 'Failed to save user')
    }
  }

  async function toggleActive(id: string, currentStatus: boolean) {
    if (!permissions.can_edit) {
      toast.error('You do not have permission to edit users')
      return
    }

    // Cannot deactivate yourself
    if (id === currentUser?.id) {
      toast.error('You cannot deactivate your own account')
      return
    }

    try {
      const { error } = await supabase
        .from('admin_profiles')
        .update({ is_active: !currentStatus })
        .eq('id', id)

      if (error) throw error

      setUsers(prev =>
        prev.map(u => u.id === id ? { ...u, is_active: !currentStatus } : u)
      )
      toast.success(!currentStatus ? 'User activated' : 'User deactivated')
    } catch (error) {
      console.error('Error toggling user status:', error)
      toast.error('Failed to update user status')
    }
  }

  async function deleteUser(id: string, user: AdminUser) {
    if (!permissions.can_delete) {
      toast.error('You do not have permission to delete users')
      return
    }

    if (!user.is_deletable) {
      toast.error('This user cannot be deleted')
      return
    }

    if (id === currentUser?.id) {
      toast.error('You cannot delete your own account')
      return
    }

    if (!confirm(`Are you sure you want to delete ${user.full_name}? This action cannot be undone.`)) {
      return
    }

    try {
      // Delete from admin_profiles (will cascade delete from auth.users via RLS)
      const { error: profileError } = await supabase
        .from('admin_profiles')
        .delete()
        .eq('id', id)

      if (profileError) throw profileError

      // Delete from auth
      const { error: authError } = await supabase.auth.admin.deleteUser(id)
      if (authError) throw authError

      setUsers(prev => prev.filter(u => u.id !== id))
      toast.success('User deleted successfully')
    } catch (error: any) {
      console.error('Error deleting user:', error)
      toast.error(error.message || 'Failed to delete user')
    }
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'bg-gradient-to-r from-[#FF3F02] to-[#FEBE03]'
      case 'admin':
        return 'bg-purple-500'
      case 'editor':
        return 'bg-blue-500'
      case 'viewer':
        return 'bg-gray-500'
      default:
        return 'bg-gray-500'
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'super_admin':
        return 'Super Admin'
      case 'admin':
        return 'Admin'
      case 'editor':
        return 'Editor'
      case 'viewer':
        return 'Viewer'
      default:
        return role
    }
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Never'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const stats = {
    total: users.length,
    active: users.filter(u => u.is_active).length,
    super_admins: users.filter(u => u.role === 'super_admin').length,
  }

  if (!permissions) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#FEBE03] border-r-transparent"></div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl p-4 border border-gray-800" style={{ background: 'rgba(20, 20, 30, 0.6)' }}>
            <p className="text-sm text-gray-400">Total Users</p>
            <p className="text-2xl font-bold text-white mt-1">{stats.total}</p>
          </div>
          <div className="rounded-2xl p-4 border border-gray-800" style={{ background: 'rgba(20, 20, 30, 0.6)' }}>
            <p className="text-sm text-gray-400">Active</p>
            <p className="text-2xl font-bold text-green-400 mt-1">{stats.active}</p>
          </div>
          <div className="rounded-2xl p-4 border border-gray-800" style={{ background: 'rgba(20, 20, 30, 0.6)' }}>
            <p className="text-sm text-gray-400">Super Admins</p>
            <p className="text-2xl font-bold text-[#FEBE03] mt-1">{stats.super_admins}</p>
          </div>
        </div>

        {/* Add Button */}
        {permissions.can_create && (
          <div className="flex justify-end">
            <Button
              onClick={() => openDialog()}
              className="bg-gradient-to-r from-[#FF3F02] to-[#FEBE03] text-black hover:opacity-90"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </div>
        )}

        {/* Users List */}
        <div className="rounded-3xl border border-gray-800 p-6 neon-border" style={{ background: 'rgba(20, 20, 30, 0.6)' }}>
          <div className="mb-6">
            <h2 className="text-xl font-bold text-white">Admin Users</h2>
            <p className="text-gray-400 text-sm mt-1">
              Manage team members and their access levels
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#FEBE03] border-r-transparent"></div>
              <p className="text-gray-400 mt-4 ml-4">Loading users...</p>
            </div>
          ) : users.length === 0 ? (
            <div className="p-8 text-center">
              <UserCog className="h-12 w-12 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400">No users yet. Add your first team member!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {users.map((user) => (
                <Card
                  key={user.id}
                  className="bg-gray-900 border-gray-800"
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-4 flex-1">
                        <div className={`${getRoleBadgeColor(user.role)} rounded-full p-3`}>
                          <Shield className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="text-white font-medium">{user.full_name}</p>
                            {user.id === currentUser?.id && (
                              <span className="text-xs text-gray-400">(You)</span>
                            )}
                            {!user.is_active && (
                              <span className="text-xs bg-gray-800 text-gray-400 px-2 py-0.5 rounded">
                                Inactive
                              </span>
                            )}
                            {!user.is_deletable && (
                              <span className="text-xs bg-gradient-to-r from-[#FF3F02] to-[#FEBE03] text-white px-2 py-0.5 rounded">
                                Protected
                              </span>
                            )}
                          </div>
                          <p className="text-gray-400 text-sm">{user.email}</p>
                          <div className="flex items-center gap-4 mt-1">
                            <span className={`text-xs ${getRoleBadgeColor(user.role)} text-white px-2 py-0.5 rounded`}>
                              {getRoleLabel(user.role)}
                            </span>
                            <span className="text-xs text-gray-500">
                              Last login: {formatDate(user.last_login)}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {permissions.can_edit && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => openDialog(user)}
                            className="border-gray-700 text-black bg-white hover:bg-gray-100"
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                        )}
                        {permissions.can_edit && user.id !== currentUser?.id && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleActive(user.id, user.is_active)}
                            className="border-gray-700 text-black bg-white hover:bg-gray-100"
                          >
                            {user.is_active ? (
                              <>
                                <EyeOff className="h-3 w-3 mr-1" />
                                Deactivate
                              </>
                            ) : (
                              <>
                                <Eye className="h-3 w-3 mr-1" />
                                Activate
                              </>
                            )}
                          </Button>
                        )}
                        {permissions.can_delete && user.is_deletable && user.id !== currentUser?.id && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteUser(user.id, user)}
                            className="border-red-900 text-red-400 hover:bg-red-900/20"
                          >
                            <Trash2 className="h-3 w-3 mr-1" />
                            Delete
                          </Button>
                        )}
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
          <DialogContent className="bg-[#1a1a1a] border-gray-800 text-white">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-white">
                {editingId ? 'Edit User' : 'Add New User'}
              </DialogTitle>
              <DialogDescription className="text-gray-400">
                {editingId ? 'Update user details and permissions' : 'Create a new admin user'}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div>
                <Label htmlFor="email" className="text-gray-300">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="user@example.com"
                  className="mt-1 bg-gray-900 border-gray-700 text-white"
                  disabled={!!editingId} // Cannot change email
                  required
                />
              </div>

              <div>
                <Label htmlFor="full_name" className="text-gray-300">Full Name *</Label>
                <Input
                  id="full_name"
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  placeholder="John Doe"
                  className="mt-1 bg-gray-900 border-gray-700 text-white"
                  required
                />
              </div>

              <div>
                <Label htmlFor="password" className="text-gray-300">
                  Password {!editingId && '*'}
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder={editingId ? 'Leave blank to keep unchanged' : 'Min. 8 characters'}
                  className="mt-1 bg-gray-900 border-gray-700 text-white"
                  required={!editingId}
                />
                {editingId && (
                  <p className="text-xs text-gray-500 mt-1">Leave blank to keep current password</p>
                )}
              </div>

              <div>
                <Label htmlFor="role" className="text-gray-300">Role *</Label>
                <Select
                  value={formData.role}
                  onValueChange={(value: any) => setFormData({ ...formData, role: value })}
                >
                  <SelectTrigger className="mt-1 bg-gray-900 border-gray-700 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="super_admin">Super Admin (Full Access)</SelectItem>
                    <SelectItem value="admin">Admin (Manage Content)</SelectItem>
                    <SelectItem value="editor">Editor (Edit Only)</SelectItem>
                    <SelectItem value="viewer">Viewer (Read Only)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setDialogOpen(false)}
                  className="flex-1 border-gray-700 text-white hover:bg-gray-800"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-[#FF3F02] to-[#FEBE03] text-black hover:opacity-90"
                >
                  {editingId ? 'Update User' : 'Create User'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  )
}
