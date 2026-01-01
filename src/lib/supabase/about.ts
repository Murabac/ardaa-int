import { createClient } from './server'

export interface Stat {
  number: string
  label: string
  icon: string
}

export interface Value {
  icon: string
  title: string
  description: string
}

export interface AboutSection {
  id: string
  badge_text: string | null
  main_heading: string
  description_paragraphs: string[]
  stats: Stat[]
  values: Value[]
  is_active: boolean
  display_order: number
  created_at: string
  updated_at: string
}

/**
 * Get the active about section
 * Returns the first active about section ordered by display_order
 */
export async function getAboutSection(): Promise<AboutSection | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .schema('aradaa_int')
    .from('about_section')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true })
    .limit(1)
    .single()

  if (error) {
    console.error('Error fetching about section:', error)
    return null
  }

  if (!data) {
    return null
  }

  // Parse JSON fields
  return {
    ...data,
    description_paragraphs: Array.isArray(data.description_paragraphs) 
      ? data.description_paragraphs 
      : [],
    stats: Array.isArray(data.stats) ? data.stats : [],
    values: Array.isArray(data.values) ? data.values : []
  } as AboutSection
}

/**
 * Get all about sections (for admin use)
 */
export async function getAllAboutSections(): Promise<AboutSection[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .schema('aradaa_int')
    .from('about_section')
    .select('*')
    .order('display_order', { ascending: true })

  if (error) {
    console.error('Error fetching about sections:', error)
    return []
  }

  return (data || []).map(item => ({
    ...item,
    description_paragraphs: Array.isArray(item.description_paragraphs) 
      ? item.description_paragraphs 
      : [],
    stats: Array.isArray(item.stats) ? item.stats : [],
    values: Array.isArray(item.values) ? item.values : []
  })) as AboutSection[]
}

/**
 * Create a new about section
 */
export async function createAboutSection(aboutData: Partial<AboutSection>): Promise<AboutSection | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .schema('aradaa_int')
    .from('about_section')
    .insert(aboutData)
    .select()
    .single()

  if (error) {
    console.error('Error creating about section:', error)
    return null
  }

  return {
    ...data,
    description_paragraphs: Array.isArray(data.description_paragraphs) 
      ? data.description_paragraphs 
      : [],
    stats: Array.isArray(data.stats) ? data.stats : [],
    values: Array.isArray(data.values) ? data.values : []
  } as AboutSection
}

/**
 * Update an about section
 */
export async function updateAboutSection(
  id: string,
  updates: Partial<AboutSection>
): Promise<AboutSection | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .schema('aradaa_int')
    .from('about_section')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating about section:', error)
    return null
  }

  return {
    ...data,
    description_paragraphs: Array.isArray(data.description_paragraphs) 
      ? data.description_paragraphs 
      : [],
    stats: Array.isArray(data.stats) ? data.stats : [],
    values: Array.isArray(data.values) ? data.values : []
  } as AboutSection
}

/**
 * Delete an about section
 */
export async function deleteAboutSection(id: string): Promise<boolean> {
  const supabase = await createClient()

  const { error } = await supabase
    .schema('aradaa_int')
    .from('about_section')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting about section:', error)
    return false
  }

  return true
}

