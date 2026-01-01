import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'
import {
  getAllProjects,
  createProject,
  updateProject,
  deleteProject,
} from '@/lib/supabase/projects'

// GET - Fetch all projects (for admin)
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

    const projects = await getAllProjects()
    return NextResponse.json({ success: true, data: projects })
  } catch (error: any) {
    console.error('Error fetching projects:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch projects', details: error?.message },
      { status: 500 }
    )
  }
}

// POST - Create new project
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
    const { title, description, category, image_url, image_alt, display_order, is_featured, is_active } = body

    if (!title || !description || !category || !image_url) {
      return NextResponse.json(
        { success: false, error: 'title, description, category, and image_url are required' },
        { status: 400 }
      )
    }

    const newProject = await createProject({
      title,
      description,
      category,
      image_url,
      image_alt: image_alt || null,
      display_order: display_order ?? 0,
      is_featured: is_featured ?? false,
      is_active: is_active ?? true,
    })

    if (!newProject) {
      return NextResponse.json(
        { success: false, error: 'Failed to create project' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data: newProject })
  } catch (error: any) {
    console.error('Error creating project:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create project', details: error?.message },
      { status: 500 }
    )
  }
}

// PUT - Update project
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

    const updatedProject = await updateProject(id, updates)

    if (!updatedProject) {
      return NextResponse.json(
        { success: false, error: 'Failed to update project' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data: updatedProject })
  } catch (error: any) {
    console.error('Error updating project:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update project', details: error?.message },
      { status: 500 }
    )
  }
}

// DELETE - Delete project
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

    const deleted = await deleteProject(id)

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Failed to delete project' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting project:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete project', details: error?.message },
      { status: 500 }
    )
  }
}

