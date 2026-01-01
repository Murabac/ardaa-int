import { createClient } from './server'

export interface TeamMember {
  name: string
  role: string
  image: string
  bio: string
}

export interface TeamSection {
  id: string
  badge_text: string | null
  heading: string
  description: string | null
  team_members: TeamMember[]
  is_active: boolean
  display_order: number
  created_at: string
  updated_at: string
}

/**
 * Get the active team section
 * Returns the first active team section ordered by display_order
 */
export async function getTeamSection(): Promise<TeamSection | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .schema('aradaa_int')
    .from('team_section')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true })
    .limit(1)
    .single()

  if (error) {
    console.error('Error fetching team section:', error)
    return null
  }

  if (!data) {
    return null
  }

  // Parse JSON fields
  return {
    ...data,
    team_members: Array.isArray(data.team_members) ? data.team_members : []
  } as TeamSection
}

/**
 * Get all team sections (for admin use)
 */
export async function getAllTeamSections(): Promise<TeamSection[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .schema('aradaa_int')
    .from('team_section')
    .select('*')
    .order('display_order', { ascending: true })

  if (error) {
    console.error('Error fetching team sections:', error)
    return []
  }

  return (data || []).map(item => ({
    ...item,
    team_members: Array.isArray(item.team_members) ? item.team_members : []
  })) as TeamSection[]
}

/**
 * Create a new team section
 */
export async function createTeamSection(teamData: Partial<TeamSection>): Promise<TeamSection | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .schema('aradaa_int')
    .from('team_section')
    .insert(teamData)
    .select()
    .single()

  if (error) {
    console.error('Error creating team section:', error)
    return null
  }

  return {
    ...data,
    team_members: Array.isArray(data.team_members) ? data.team_members : []
  } as TeamSection
}

/**
 * Update a team section
 */
export async function updateTeamSection(
  id: string,
  updates: Partial<TeamSection>
): Promise<TeamSection | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .schema('aradaa_int')
    .from('team_section')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating team section:', error)
    return null
  }

  return {
    ...data,
    team_members: Array.isArray(data.team_members) ? data.team_members : []
  } as TeamSection
}

/**
 * Delete a team section
 */
export async function deleteTeamSection(id: string): Promise<boolean> {
  const supabase = await createClient()

  const { error } = await supabase
    .schema('aradaa_int')
    .from('team_section')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting team section:', error)
    return false
  }

  return true
}

