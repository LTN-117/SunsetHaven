import { supabase } from './supabase'

export interface AdminProfile {
  id: string
  email: string
  full_name: string
  role: 'super_admin' | 'admin' | 'editor' | 'viewer'
  is_active: boolean
  is_deletable: boolean
  last_login: string | null
  created_at: string
  updated_at: string
}

export interface Permission {
  can_view: boolean
  can_create: boolean
  can_edit: boolean
  can_delete: boolean
}

export interface RolePermissions {
  [resource: string]: Permission
}

// Get current user's admin profile
export async function getAdminProfile(): Promise<AdminProfile | null> {
  try {
    // Check localStorage for single admin authentication
    if (typeof window !== 'undefined') {
      const isLoggedIn = localStorage.getItem('isAdminLoggedIn')
      const adminEmail = localStorage.getItem('adminEmail')

      if (isLoggedIn === 'true' && adminEmail === 'admin@sunsethaven.com') {
        // Return a mock admin profile for the single hardcoded admin
        return {
          id: 'admin-1',
          email: 'admin@sunsethaven.com',
          full_name: 'Admin',
          role: 'super_admin',
          is_active: true,
          is_deletable: false,
          last_login: new Date().toISOString(),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      }
    }

    return null
  } catch (error) {
    console.error('Error fetching admin profile:', error)
    return null
  }
}

// Get user's permissions for a specific resource
export async function getUserPermissions(resource: string): Promise<Permission | null> {
  try {
    const profile = await getAdminProfile()
    if (!profile) return null

    // Super admin has all permissions
    if (profile.role === 'super_admin') {
      return {
        can_view: true,
        can_create: true,
        can_edit: true,
        can_delete: true
      }
    }

    const { data, error } = await supabase
      .from('role_permissions')
      .select('can_view, can_create, can_edit, can_delete')
      .eq('role', profile.role)
      .eq('resource', resource)
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching permissions:', error)
    return null
  }
}

// Get all permissions for current user
export async function getAllUserPermissions(): Promise<RolePermissions> {
  try {
    const profile = await getAdminProfile()
    if (!profile) return {}

    // Super admin has all permissions
    if (profile.role === 'super_admin') {
      const resources = ['inquiries', 'gallery', 'events', 'newsletter', 'testimonials', 'footer', 'users']
      const allPermissions: RolePermissions = {}
      resources.forEach(resource => {
        allPermissions[resource] = {
          can_view: true,
          can_create: true,
          can_edit: true,
          can_delete: true
        }
      })
      return allPermissions
    }

    const { data, error } = await supabase
      .from('role_permissions')
      .select('resource, can_view, can_create, can_edit, can_delete')
      .eq('role', profile.role)

    if (error) throw error

    const permissions: RolePermissions = {}
    data?.forEach(perm => {
      permissions[perm.resource] = {
        can_view: perm.can_view,
        can_create: perm.can_create,
        can_edit: perm.can_edit,
        can_delete: perm.can_delete
      }
    })

    return permissions
  } catch (error) {
    console.error('Error fetching all permissions:', error)
    return {}
  }
}

// Check if user has specific permission
export async function hasPermission(
  resource: string,
  action: 'view' | 'create' | 'edit' | 'delete'
): Promise<boolean> {
  try {
    const permissions = await getUserPermissions(resource)
    if (!permissions) return false

    switch (action) {
      case 'view':
        return permissions.can_view
      case 'create':
        return permissions.can_create
      case 'edit':
        return permissions.can_edit
      case 'delete':
        return permissions.can_delete
      default:
        return false
    }
  } catch (error) {
    console.error('Error checking permission:', error)
    return false
  }
}

// Sign in
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })

  if (error) throw error

  // Note: last_login tracking removed due to RLS restrictions
  // Can be re-enabled by updating RLS policies to allow users to update their own last_login field

  return data
}

// Sign out
export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

// Check if user is authenticated
export async function isAuthenticated(): Promise<boolean> {
  const { data: { session } } = await supabase.auth.getSession()
  return !!session
}

// Map resource names to permission keys
export const RESOURCE_MAP = {
  '/admin/inquiries': 'inquiries',
  '/admin/gallery': 'gallery',
  '/admin/events': 'events',
  '/admin/newsletter': 'newsletter',
  '/admin/testimonials': 'testimonials',
  '/admin/footer': 'footer',
  '/admin/users': 'users'
}
