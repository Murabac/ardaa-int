import { createClient } from './server'
import { createAdminClient } from './admin'

export interface HeroSection {
  id: string
  badge_text: string | null
  title_line1: string
  description: string
  features: string[]
  featured_image_url: string | null
  featured_project_title: string | null
  featured_project_1_title: string | null
  featured_project_1_image_url: string | null
  featured_project_1_category: string | null
  featured_project_2_title: string | null
  featured_project_2_image_url: string | null
  featured_project_2_category: string | null
  featured_project_3_title: string | null
  featured_project_3_image_url: string | null
  featured_project_3_category: string | null
  gallery_images: Array<{
    url: string
    alt: string
    title: string
  }>
  is_active: boolean
  display_order: number
  created_at: string
  updated_at: string
}

/**
 * Get the active hero section
 * Returns the first active hero section ordered by display_order
 */
export async function getHeroSection(): Promise<HeroSection | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .schema('aradaa_int')
    .from('hero_section')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true })
    .limit(1)
    .single()

  if (error) {
    console.error('Error fetching hero section:', error)
    return null
  }

  if (!data) {
    return null
  }

  // Parse JSON fields
  return {
    ...data,
    features: Array.isArray(data.features) ? data.features : [],
    gallery_images: Array.isArray(data.gallery_images) ? data.gallery_images : []
  } as HeroSection
}

/**
 * Get all hero sections (for admin use)
 */
export async function getAllHeroSections(): Promise<HeroSection[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .schema('aradaa_int')
    .from('hero_section')
    .select('*')
    .order('display_order', { ascending: true })

  if (error) {
    console.error('Error fetching hero sections:', error)
    return []
  }

  return (data || []).map(item => ({
    ...item,
    features: Array.isArray(item.features) ? item.features : [],
    gallery_images: Array.isArray(item.gallery_images) ? item.gallery_images : []
  })) as HeroSection[]
}

/**
 * Create a new hero section
 */
export async function createHeroSection(heroData: Partial<HeroSection>): Promise<HeroSection | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .schema('aradaa_int')
    .from('hero_section')
    .insert(heroData)
    .select()
    .single()

  if (error) {
    console.error('Error creating hero section:', error)
    return null
  }

  return {
    ...data,
    features: Array.isArray(data.features) ? data.features : [],
    gallery_images: Array.isArray(data.gallery_images) ? data.gallery_images : []
  } as HeroSection
}

/**
 * Update a hero section
 */
export async function updateHeroSection(
  id: string,
  updates: Partial<HeroSection>
): Promise<HeroSection | null> {
  // Use admin client for updates to bypass RLS
  const supabase = createAdminClient()

  // Filter out any fields that don't exist in the database schema
  // Remove fields we've removed from the interface
  const allowedFields = [
    'badge_text',
    'title_line1',
    'description',
    'features',
    'featured_image_url',
    'featured_project_title',
    'featured_project_1_title',
    'featured_project_1_image_url',
    'featured_project_1_category',
    'featured_project_2_title',
    'featured_project_2_image_url',
    'featured_project_2_category',
    'featured_project_3_title',
    'featured_project_3_image_url',
    'featured_project_3_category',
    'gallery_images',
    'is_active',
    'display_order'
  ]

  const filteredUpdates = Object.fromEntries(
    Object.entries(updates).filter(([key]) => allowedFields.includes(key))
  )

  // First, get the current hero section to preserve existing values
  // Use admin client to bypass RLS
  const { data: currentData } = await supabase
    .schema('aradaa_int')
    .from('hero_section')
    .select('*')
    .eq('id', id)
    .single()

  // Always set default values for removed fields to ensure they're never NULL
  // Use existing values if they exist, otherwise use defaults
  const updatesWithDefaults = {
    ...filteredUpdates,
    // Preserve existing values or use defaults
    title_line2: currentData?.title_line2 ?? '',
    title_line2_color: currentData?.title_line2_color ?? '#E87842',
    primary_button_text: currentData?.primary_button_text ?? '',
    primary_button_action: currentData?.primary_button_action ?? '',
    secondary_button_text: currentData?.secondary_button_text ?? '',
    secondary_button_action: currentData?.secondary_button_action ?? null,
    ready_to_start_text: currentData?.ready_to_start_text ?? '',
    ready_to_start_button_text: currentData?.ready_to_start_button_text ?? '',
    ready_to_start_action: currentData?.ready_to_start_action ?? '',
    featured_image_alt: currentData?.featured_image_alt ?? null,
    featured_project_1_image_alt: currentData?.featured_project_1_image_alt ?? null,
    featured_project_2_image_alt: currentData?.featured_project_2_image_alt ?? null,
    featured_project_3_image_alt: currentData?.featured_project_3_image_alt ?? null,
  }

  const { data, error } = await supabase
    .schema('aradaa_int')
    .from('hero_section')
    .update(updatesWithDefaults)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Supabase error updating hero section:', error)
    console.error('Error code:', error.code)
    console.error('Error message:', error.message)
    console.error('Error details:', error.details)
    console.error('Error hint:', error.hint)
    console.error('Update data sent:', updatesWithDefaults)
    return null
  }

  return {
    ...data,
    features: Array.isArray(data.features) ? data.features : [],
    gallery_images: Array.isArray(data.gallery_images) ? data.gallery_images : []
  } as HeroSection
}

/**
 * Delete a hero section
 */
export async function deleteHeroSection(id: string): Promise<boolean> {
  const supabase = await createClient()

  const { error } = await supabase
    .schema('aradaa_int')
    .from('hero_section')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting hero section:', error)
    return false
  }

  return true
}

