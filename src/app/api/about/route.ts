import { getAboutSection } from '@/lib/supabase/about'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const aboutData = await getAboutSection()

    if (!aboutData) {
      return NextResponse.json(
        {
          success: false,
          error: 'No active about section found'
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: aboutData
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch about section',
        details: {
          message: error?.message || 'Unknown error'
        }
      },
      { status: 500 }
    )
  }
}

