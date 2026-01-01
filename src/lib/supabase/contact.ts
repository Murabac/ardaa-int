import { createClient } from './server'

export interface BusinessHour {
  day: string
  hours: string
}

export interface SocialMediaLink {
  platform: string
  url: string
}

export interface ContactInfo {
  id: string
  contact_badge_text: string | null
  contact_heading: string
  contact_description: string | null
  phone_1: string
  phone_2: string | null
  email_1: string
  email_2: string | null
  address_lines: string[]
  business_hours: BusinessHour[]
  footer_text: string | null
  social_media_links: SocialMediaLink[]
  copyright_text: string | null
  is_active: boolean
  display_order: number
  created_at: string
  updated_at: string
}

/**
 * Get the active contact info
 * Returns the first active contact info ordered by display_order
 */
export async function getContactInfo(): Promise<ContactInfo | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .schema('aradaa_int')
    .from('contact_info')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true })
    .limit(1)
    .single()

  if (error) {
    console.error('Error fetching contact info:', error)
    return null
  }

  if (!data) {
    return null
  }

  // Parse JSON fields
  return {
    ...data,
    address_lines: Array.isArray(data.address_lines) ? data.address_lines : [],
    business_hours: Array.isArray(data.business_hours) ? data.business_hours : [],
    social_media_links: Array.isArray(data.social_media_links) ? data.social_media_links : []
  } as ContactInfo
}

/**
 * Get all contact info (for admin use)
 */
export async function getAllContactInfo(): Promise<ContactInfo[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .schema('aradaa_int')
    .from('contact_info')
    .select('*')
    .order('display_order', { ascending: true })

  if (error) {
    console.error('Error fetching contact info:', error)
    return []
  }

  return (data || []).map(item => ({
    ...item,
    address_lines: Array.isArray(item.address_lines) ? item.address_lines : [],
    business_hours: Array.isArray(item.business_hours) ? item.business_hours : [],
    social_media_links: Array.isArray(item.social_media_links) ? item.social_media_links : []
  })) as ContactInfo[]
}

/**
 * Create new contact info
 */
export async function createContactInfo(contactData: Partial<ContactInfo>): Promise<ContactInfo | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .schema('aradaa_int')
    .from('contact_info')
    .insert(contactData)
    .select()
    .single()

  if (error) {
    console.error('Error creating contact info:', error)
    return null
  }

  return {
    ...data,
    address_lines: Array.isArray(data.address_lines) ? data.address_lines : [],
    business_hours: Array.isArray(data.business_hours) ? data.business_hours : [],
    social_media_links: Array.isArray(data.social_media_links) ? data.social_media_links : []
  } as ContactInfo
}

/**
 * Update contact info
 */
export async function updateContactInfo(
  id: string,
  updates: Partial<ContactInfo>
): Promise<ContactInfo | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .schema('aradaa_int')
    .from('contact_info')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating contact info:', error)
    return null
  }

  return {
    ...data,
    address_lines: Array.isArray(data.address_lines) ? data.address_lines : [],
    business_hours: Array.isArray(data.business_hours) ? data.business_hours : [],
    social_media_links: Array.isArray(data.social_media_links) ? data.social_media_links : []
  } as ContactInfo
}

/**
 * Delete contact info
 */
export async function deleteContactInfo(id: string): Promise<boolean> {
  const supabase = await createClient()

  const { error } = await supabase
    .schema('aradaa_int')
    .from('contact_info')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting contact info:', error)
    return false
  }

  return true
}

