import { getShowreelImages } from '@/lib/supabase/showreel'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const images = await getShowreelImages()

    return NextResponse.json({
      success: true,
      data: images
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch showreel images',
        details: {
          message: error?.message || 'Unknown error'
        }
      },
      { status: 500 }
    )
  }
}

