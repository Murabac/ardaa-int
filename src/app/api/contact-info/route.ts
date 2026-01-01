import { getContactInfo } from '@/lib/supabase/contact'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const contactData = await getContactInfo()

    if (!contactData) {
      return NextResponse.json(
        {
          success: false,
          error: 'No active contact info found'
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: contactData
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch contact info',
        details: {
          message: error?.message || 'Unknown error'
        }
      },
      { status: 500 }
    )
  }
}

