import { createClient as createServerClient } from './server'
import { createClient as createBrowserClient } from './client'
import { withSchema } from './schema'

/**
 * Helper functions for Supabase queries
 * Add your table-specific queries here as you create tables
 * 
 * Example usage:
 * 
 * // Server Component
 * const supabase = await createServerClient()
 * const { data } = await supabase
 *   .from(withSchema('your_table_name'))
 *   .select('*')
 * 
 * // Client Component
 * const supabase = createBrowserClient()
 * const { data } = await supabase
 *   .from(withSchema('your_table_name'))
 *   .select('*')
 */

