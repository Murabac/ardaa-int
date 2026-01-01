import { createClient } from './server'
import { createAdminClient } from './admin'

export interface ShowreelImage {
  id: string
  media_type: 'image' | 'video'
  image_url: string
  image_alt: string | null
  title: string | null
  description: string | null
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

/**
 * Get all active showreel images ordered by display_order
 */
export async function getShowreelImages(): Promise<ShowreelImage[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .schema('aradaa_int')
    .from('showreel_images')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true })

  if (error) {
    console.error('Error fetching showreel images:', error)
    return []
  }

  return (data || []) as ShowreelImage[]
}

/**
 * Get all showreel images (including inactive) - for admin use
 */
export async function getAllShowreelImages(): Promise<ShowreelImage[]> {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .schema('aradaa_int')
    .from('showreel_images')
    .select('*')
    .order('display_order', { ascending: true })

  if (error) {
    console.error('Error fetching all showreel images:', error)
    return []
  }

  return (data || []) as ShowreelImage[]
}

/**
 * Create a new showreel image
 */
export async function createShowreelImage(imageData: Partial<ShowreelImage>): Promise<ShowreelImage | null> {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .schema('aradaa_int')
    .from('showreel_images')
    .insert(imageData)
    .select()
    .single()

  if (error) {
    console.error('Error creating showreel image:', error)
    return null
  }

  return data as ShowreelImage
}

/**
 * Update a showreel image
 */
export async function updateShowreelImage(
  id: string,
  updates: Partial<ShowreelImage>
): Promise<ShowreelImage | null> {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .schema('aradaa_int')
    .from('showreel_images')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating showreel image:', error)
    return null
  }

  return data as ShowreelImage
}

/**
 * Delete a showreel image
 */
export async function deleteShowreelImage(id: string): Promise<boolean> {
  const supabase = createAdminClient()

  const { error } = await supabase
    .schema('aradaa_int')
    .from('showreel_images')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting showreel image:', error)
    return false
  }

  return true
}

