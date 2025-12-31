// Schema configuration for multi-schema Supabase setup
export const SCHEMA_NAME = 'aradaa_int'

/**
 * Prefix table name with schema for multi-schema queries
 * 
 * Note: For this to work, ensure the schema is exposed in Supabase:
 * 1. Go to Settings → API → Schema
 * 2. Add "aradaa_int" to the exposed schemas
 * 
 * If schema-qualified names don't work, you may need to:
 * - Set the search_path in your database
 * - Or configure the schema in Supabase API settings
 */
export function withSchema(tableName: string): string {
  return `"${SCHEMA_NAME}".${tableName}`
}

