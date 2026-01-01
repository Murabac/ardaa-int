import { getHeroSection } from '@/lib/supabase/hero'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const heroData = await getHeroSection()

    if (!heroData) {
      return NextResponse.json(
        {
          success: false,
          error: 'No active hero section found'
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: heroData
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch hero section',
        details: {
          message: error?.message || 'Unknown error'
        }
      },
      { status: 500 }
    )
  }
}



