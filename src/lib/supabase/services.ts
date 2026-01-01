import { createClient } from './server'
import { createAdminClient } from './admin'

export interface Service {
  id: string
  icon: string
  title: string
  description: string
  color: string
  category: string
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

/**
 * Get all active services ordered by display_order
 */
export async function getServices(): Promise<Service[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .schema('aradaa_int')
    .from('services')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true })

  if (error) {
    console.error('Error fetching services:', error)
    return []
  }

  return (data || []) as Service[]
}

/**
 * Get all services (including inactive) - for admin use
 */
export async function getAllServices(): Promise<Service[]> {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .schema('aradaa_int')
    .from('services')
    .select('*')
    .order('display_order', { ascending: true })

  if (error) {
    console.error('Error fetching all services:', error)
    return []
  }

  return (data || []) as Service[]
}

/**
 * Get a service by ID
 */
export async function getServiceById(id: string): Promise<Service | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .schema('aradaa_int')
    .from('services')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching service:', error)
    return null
  }

  return data as Service
}

/**
 * Create a new service
 */
export async function createService(serviceData: Partial<Service>): Promise<Service | null> {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .schema('aradaa_int')
    .from('services')
    .insert(serviceData)
    .select()
    .single()

  if (error) {
    console.error('Error creating service:', error)
    return null
  }

  return data as Service
}

/**
 * Update a service
 */
export async function updateService(
  id: string,
  updates: Partial<Service>
): Promise<Service | null> {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .schema('aradaa_int')
    .from('services')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating service:', error)
    return null
  }

  return data as Service
}

/**
 * Delete a service
 */
export async function deleteService(id: string): Promise<boolean> {
  const supabase = createAdminClient()

  const { error } = await supabase
    .schema('aradaa_int')
    .from('services')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting service:', error)
    return false
  }

  return true
}


