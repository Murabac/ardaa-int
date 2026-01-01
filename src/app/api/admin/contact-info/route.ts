import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { verifyToken } from '@/lib/auth'
import {
  getAllContactInfo,
  createContactInfo,
  updateContactInfo,
  deleteContactInfo,
} from '@/lib/supabase/contact'

// GET - Fetch all contact info (for admin)
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

    const contactInfo = await getAllContactInfo()
    return NextResponse.json({ success: true, data: contactInfo })
  } catch (error: any) {
    console.error('Error fetching contact info:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch contact info', details: error?.message },
      { status: 500 }
    )
  }
}

// POST - Create new contact info
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
    const {
      contact_badge_text,
      contact_heading,
      contact_description,
      phone_1,
      phone_2,
      email_1,
      email_2,
      address_lines,
      business_hours,
      footer_text,
      social_media_links,
      copyright_text,
      display_order,
      is_active
    } = body

    if (!contact_heading || !phone_1 || !email_1) {
      return NextResponse.json(
        { success: false, error: 'contact_heading, phone_1, and email_1 are required' },
        { status: 400 }
      )
    }

    const newContactInfo = await createContactInfo({
      contact_badge_text: contact_badge_text || null,
      contact_heading,
      contact_description: contact_description || null,
      phone_1,
      phone_2: phone_2 || null,
      email_1,
      email_2: email_2 || null,
      address_lines: address_lines || [],
      business_hours: business_hours || [],
      footer_text: footer_text || null,
      social_media_links: social_media_links || [],
      copyright_text: copyright_text || null,
      display_order: display_order ?? 0,
      is_active: is_active ?? true,
    })

    if (!newContactInfo) {
      return NextResponse.json(
        { success: false, error: 'Failed to create contact info' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data: newContactInfo })
  } catch (error: any) {
    console.error('Error creating contact info:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create contact info', details: error?.message },
      { status: 500 }
    )
  }
}

// PUT - Update contact info
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

    const updatedContactInfo = await updateContactInfo(id, updates)

    if (!updatedContactInfo) {
      return NextResponse.json(
        { success: false, error: 'Failed to update contact info' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, data: updatedContactInfo })
  } catch (error: any) {
    console.error('Error updating contact info:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update contact info', details: error?.message },
      { status: 500 }
    )
  }
}

// DELETE - Delete contact info
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

    const deleted = await deleteContactInfo(id)

    if (!deleted) {
      return NextResponse.json(
        { success: false, error: 'Failed to delete contact info' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Error deleting contact info:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to delete contact info', details: error?.message },
      { status: 500 }
    )
  }
}

