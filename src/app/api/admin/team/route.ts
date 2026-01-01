import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'
import {
  getAllTeamSections,
  createTeamSection,
  updateTeamSection,
  deleteTeamSection,
} from '@/lib/supabase/team'

// GET - Fetch all team sections (for admin)
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

    const teamSections = await getAllTeamSections()
    return NextResponse.json({ success: true, data: teamSections })
  } catch (error: any) {
    console.error('Error fetching team sections:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch team sections', details: error?.message },
      { status: 500 }
    )
  }
}

// POST - Create new team section
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
    const { badge_text, heading, description, team_members, display_order, is_active } = body

    if (!heading) {
      return NextResponse.json(
        { success: false, error: 'heading is required' },
        { status: 400 }
      )
    }

    const newTeamSection = await createTeamSection({
      badge_text: badge_text || null,
      heading,
      description: description || null,
      team_members: team_members || [],
      display_order: display_order ?? 0,
      is_active: is_active ?? true,
    })

    if (!newTeamSection) {
      return NextResponse.json(
        { success: false, error: 'Failed to create team section' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data: newTeamSection })
  } catch (error: any) {
    console.error('Error creating team section:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create team section', details: error?.message },
      { status: 500 }
    )
  }
}

// PUT - Update team section
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

    const updatedTeamSection = await updateTeamSection(id, updates)

    if (!updatedTeamSection) {
      return NextResponse.json(
        { success: false, error: 'Failed to update team section' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data: updatedTeamSection })
  } catch (error: any) {
    console.error('Error updating team section:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update team section', details: error?.message },
      { status: 500 }
    )
  }
}

// DELETE - Delete team section
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

    const deleted = await deleteTeamSection(id)

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Failed to delete team section' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting team section:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete team section', details: error?.message },
      { status: 500 }
    )
  }
}

