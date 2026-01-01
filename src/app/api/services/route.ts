import { getServices } from '@/lib/supabase/services'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const services = await getServices()

    return NextResponse.json({
      success: true,
      data: services
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch services',
        details: {
          message: error?.message || 'Unknown error'
        }
      },
      { status: 500 }
    )
  }
}

