import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'
import {
  getAllShowreelImages,
  createShowreelImage,
  updateShowreelImage,
  deleteShowreelImage,
} from '@/lib/supabase/showreel'

// GET - Fetch all showreel images (for admin)
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

    const images = await getAllShowreelImages()
    return NextResponse.json({ success: true, data: images })
  } catch (error: any) {
    console.error('Error fetching showreel images:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch showreel images', details: error?.message },
      { status: 500 }
    )
  }
}

// POST - Create new showreel image/video
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
    const { media_type, image_url, image_alt, title, description, display_order, is_active } = body

    if (!media_type || !image_url) {
      return NextResponse.json(
        { success: false, error: 'media_type and image_url are required' },
        { status: 400 }
      )
    }

    const newImage = await createShowreelImage({
      media_type,
      image_url,
      image_alt: image_alt || null,
      title: title || null,
      description: description || null,
      display_order: display_order ?? 0,
      is_active: is_active ?? true,
    })

    if (!newImage) {
      return NextResponse.json(
        { success: false, error: 'Failed to create showreel item' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data: newImage })
  } catch (error: any) {
    console.error('Error creating showreel item:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create showreel item', details: error?.message },
      { status: 500 }
    )
  }
}

// PUT - Update showreel image/video
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

    const updatedImage = await updateShowreelImage(id, updates)

    if (!updatedImage) {
      return NextResponse.json(
        { success: false, error: 'Failed to update showreel item' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data: updatedImage })
  } catch (error: any) {
    console.error('Error updating showreel item:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update showreel item', details: error?.message },
      { status: 500 }
    )
  }
}

// DELETE - Delete showreel image/video
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

    const deleted = await deleteShowreelImage(id)

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Failed to delete showreel item' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting showreel item:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete showreel item', details: error?.message },
      { status: 500 }
    )
  }
}

