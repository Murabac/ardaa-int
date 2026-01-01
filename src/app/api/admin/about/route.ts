import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'
import {
  getAllAboutSections,
  createAboutSection,
  updateAboutSection,
  deleteAboutSection,
} from '@/lib/supabase/about'

// GET - Fetch all about sections (for admin)
export async function GET() {
  try {
    const token = cookies().get('auth-token')?.value
    if (!token) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const user = verifyToken(token)
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const aboutSections = await getAllAboutSections()
    return NextResponse.json({ success: true, data: aboutSections })
  } catch (error: any) {
    console.error('Error fetching about sections:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch about sections', details: error?.message },
      { status: 500 }
    )
  }
}

// POST - Create new about section
export async function POST(request: NextRequest) {
  try {
    const token = cookies().get('auth-token')?.value
    if (!token) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const user = verifyToken(token)
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { badge_text, main_heading, description_paragraphs, stats, values, display_order, is_active } = body

    if (!main_heading) {
      return NextResponse.json(
        { success: false, error: 'main_heading is required' },
        { status: 400 }
      )
    }

    const newAboutSection = await createAboutSection({
      badge_text: badge_text || null,
      main_heading,
      description_paragraphs: description_paragraphs || [],
      stats: stats || [],
      values: values || [],
      display_order: display_order ?? 0,
      is_active: is_active ?? true,
    })

    if (!newAboutSection) {
      return NextResponse.json(
        { success: false, error: 'Failed to create about section' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data: newAboutSection })
  } catch (error: any) {
    console.error('Error creating about section:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create about section', details: error?.message },
      { status: 500 }
    )
  }
}

// PUT - Update about section
export async function PUT(request: NextRequest) {
  try {
    const token = cookies().get('auth-token')?.value
    if (!token) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const user = verifyToken(token)
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json({ success: false, error: 'id is required' }, { status: 400 })
    }

    const updatedAboutSection = await updateAboutSection(id, updates)

    if (!updatedAboutSection) {
      return NextResponse.json(
        { success: false, error: 'Failed to update about section' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data: updatedAboutSection })
  } catch (error: any) {
    console.error('Error updating about section:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update about section', details: error?.message },
      { status: 500 }
    )
  }
}

// DELETE - Delete about section
export async function DELETE(request: NextRequest) {
  try {
    const token = cookies().get('auth-token')?.value
    if (!token) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const user = verifyToken(token)
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ success: false, error: 'id is required' }, { status: 400 })
    }

    const deleted = await deleteAboutSection(id)

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Failed to delete about section' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting about section:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete about section', details: error?.message },
      { status: 500 }
    )
  }
}

