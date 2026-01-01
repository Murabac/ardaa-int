import { createClient } from './server'
import { createAdminClient } from './admin'

export interface Project {
  id: string
  title: string
  description: string
  category: 'Residential' | 'Office' | 'Government' | 'Mosque'
  image_url: string
  image_alt: string | null
  display_order: number
  is_featured: boolean
  is_active: boolean
  created_at: string
  updated_at: string
}

/**
 * Get all active projects ordered by display_order
 */
export async function getProjects(): Promise<Project[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .schema('aradaa_int')
    .from('projects')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true })

  if (error) {
    console.error('Error fetching projects:', error)
    return []
  }

  return (data || []) as Project[]
}

/**
 * Get projects by category
 */
export async function getProjectsByCategory(category: string): Promise<Project[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .schema('aradaa_int')
    .from('projects')
    .select('*')
    .eq('is_active', true)
    .eq('category', category)
    .order('display_order', { ascending: true })

  if (error) {
    console.error('Error fetching projects by category:', error)
    return []
  }

  return (data || []) as Project[]
}

/**
 * Get featured projects
 */
export async function getFeaturedProjects(): Promise<Project[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .schema('aradaa_int')
    .from('projects')
    .select('*')
    .eq('is_active', true)
    .eq('is_featured', true)
    .order('display_order', { ascending: true })

  if (error) {
    console.error('Error fetching featured projects:', error)
    return []
  }

  return (data || []) as Project[]
}

/**
 * Get all projects (including inactive) - for admin use
 */
export async function getAllProjects(): Promise<Project[]> {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .schema('aradaa_int')
    .from('projects')
    .select('*')
    .order('display_order', { ascending: true })

  if (error) {
    console.error('Error fetching all projects:', error)
    return []
  }

  return (data || []) as Project[]
}

/**
 * Get a project by ID
 */
export async function getProjectById(id: string): Promise<Project | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .schema('aradaa_int')
    .from('projects')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching project:', error)
    return null
  }

  return data as Project
}

/**
 * Create a new project
 */
export async function createProject(projectData: Partial<Project>): Promise<Project | null> {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .schema('aradaa_int')
    .from('projects')
    .insert(projectData)
    .select()
    .single()

  if (error) {
    console.error('Error creating project:', error)
    return null
  }

  return data as Project
}

/**
 * Update a project
 */
export async function updateProject(
  id: string,
  updates: Partial<Project>
): Promise<Project | null> {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .schema('aradaa_int')
    .from('projects')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating project:', error)
    return null
  }

  return data as Project
}

/**
 * Delete a project
 */
export async function deleteProject(id: string): Promise<boolean> {
  const supabase = createAdminClient()

  const { error } = await supabase
    .schema('aradaa_int')
    .from('projects')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting project:', error)
    return false
  }

  return true
}


