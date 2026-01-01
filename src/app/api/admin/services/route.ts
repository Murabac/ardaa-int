import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'
import {
  getAllServices,
  createService,
  updateService,
  deleteService,
} from '@/lib/supabase/services'

// GET - Fetch all services (for admin)
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

    const services = await getAllServices()
    return NextResponse.json({ success: true, data: services })
  } catch (error: any) {
    console.error('Error fetching services:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch services', details: error?.message },
      { status: 500 }
    )
  }
}

// POST - Create new service
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
    const { icon, title, description, color, category, display_order, is_active } = body

    if (!icon || !title || !description || !color || !category) {
      return NextResponse.json(
        { success: false, error: 'icon, title, description, color, and category are required' },
        { status: 400 }
      )
    }

    const newService = await createService({
      icon,
      title,
      description,
      color,
      category,
      display_order: display_order ?? 0,
      is_active: is_active ?? true,
    })

    if (!newService) {
      return NextResponse.json(
        { success: false, error: 'Failed to create service' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data: newService })
  } catch (error: any) {
    console.error('Error creating service:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create service', details: error?.message },
      { status: 500 }
    )
  }
}

// PUT - Update service
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

    const updatedService = await updateService(id, updates)

    if (!updatedService) {
      return NextResponse.json(
        { success: false, error: 'Failed to update service' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data: updatedService })
  } catch (error: any) {
    console.error('Error updating service:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update service', details: error?.message },
      { status: 500 }
    )
  }
}

// DELETE - Delete service
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

    const deleted = await deleteService(id)

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Failed to delete service' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting service:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete service', details: error?.message },
      { status: 500 }
    )
  }
}

