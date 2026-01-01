import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { createClient } from './supabase/server'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'
const JWT_EXPIRES_IN = '7d'

export interface User {
  id: string
  email: string
  full_name: string
  role: string
}

export interface LoginCredentials {
  email: string
  password: string
}

/**
 * Hash a password
 */
export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10)
}

/**
 * Verify a password
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash)
}

/**
 * Generate JWT token
 */
export function generateToken(user: User): string {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  )
}

/**
 * Verify JWT token
 */
export function verifyToken(token: string): User | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as User
    return decoded
  } catch (error) {
    return null
  }
}

/**
 * Get user by email
 */
export async function getUserByEmail(email: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .schema('aradaa_int')
    .from('users')
    .select('id, email, password_hash, full_name, role, is_active')
    .eq('email', email)
    .eq('is_active', true)
    .single()

  if (error || !data) {
    return null
  }

  return data
}

/**
 * Authenticate user
 */
export async function authenticateUser(credentials: LoginCredentials): Promise<{ user: User; token: string } | null> {
  const userData = await getUserByEmail(credentials.email)

  if (!userData) {
    return null
  }

  const isValid = await verifyPassword(credentials.password, userData.password_hash)

  if (!isValid) {
    return null
  }

  const user: User = {
    id: userData.id,
    email: userData.email,
    full_name: userData.full_name,
    role: userData.role
  }

  const token = generateToken(user)

  // Update last login
  const supabase = await createClient()
  await supabase
    .schema('aradaa_int')
    .from('users')
    .update({ last_login: new Date().toISOString() })
    .eq('id', user.id)

  return { user, token }
}

/**
 * Get current user from request
 */
export async function getCurrentUser(request: Request): Promise<User | null> {
  const token = request.headers.get('cookie')
    ?.split(';')
    .find(c => c.trim().startsWith('auth-token='))
    ?.split('=')[1]

  if (!token) {
    return null
  }

  return verifyToken(token)
}


