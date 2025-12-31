import { createClient } from './server'

export interface HeroSection {
  id: string
  badge_text: string | null
  title_line1: string
  title_line2: string
  title_line2_color: string
  description: string
  features: string[]
  primary_button_text: string
  primary_button_action: string
  secondary_button_text: string
  secondary_button_action: string | null
  featured_image_url: string | null
  featured_image_alt: string | null
  featured_project_title: string | null
  featured_project_1_title: string | null
  featured_project_1_image_url: string | null
  featured_project_1_image_alt: string | null
  featured_project_1_category: string | null
  featured_project_2_title: string | null
  featured_project_2_image_url: string | null
  featured_project_2_image_alt: string | null
  featured_project_2_category: string | null
  featured_project_3_title: string | null
  featured_project_3_image_url: string | null
  featured_project_3_image_alt: string | null
  featured_project_3_category: string | null
  gallery_images: Array<{
    url: string
    alt: string
    title: string
  }>
  ready_to_start_text: string
  ready_to_start_button_text: string
  ready_to_start_action: string
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
  const supabase = await createClient()

  const { data, error } = await supabase
    .schema('aradaa_int')
    .from('hero_section')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating hero section:', error)
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

