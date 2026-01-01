import { NextResponse } from 'next/server'
import { updateHeroSection } from '@/lib/supabase/hero'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'

export async function PUT(request: Request) {
  try {
    // Check authentication
    const cookieStore = await cookies()
    const token = cookieStore.get('auth-token')?.value

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const user = verifyToken(token)
    if (!user) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Hero section ID is required' },
        { status: 400 }
      )
    }

    // Remove any undefined or null values that might cause issues
    const cleanUpdates = Object.fromEntries(
      Object.entries(updates).filter(([_, value]) => value !== undefined)
    )

    console.log('Updating hero section with data:', { id, updates: cleanUpdates })
    
    const updated = await updateHeroSection(id, cleanUpdates)

    if (!updated) {
      console.error('updateHeroSection returned null - check server logs for Supabase error')
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to update hero section. Check server logs for details.',
          debug: process.env.NODE_ENV === 'development' ? { id, updates: cleanUpdates } : undefined
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: updated
    })
  } catch (error: any) {
    console.error('Error updating hero section:', error)
    console.error('Error stack:', error?.stack)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update hero section',
        details: error?.message || 'Unknown error',
        stack: process.env.NODE_ENV === 'development' ? error?.stack : undefined
      },
      { status: 500 }
    )
  }
}


