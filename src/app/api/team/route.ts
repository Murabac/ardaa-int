import { getTeamSection } from '@/lib/supabase/team'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const teamData = await getTeamSection()

    if (!teamData) {
      return NextResponse.json(
        {
          success: false,
          error: 'No active team section found'
        },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: teamData
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch team section',
        details: {
          message: error?.message || 'Unknown error'
        }
      },
      { status: 500 }
    )
  }
}


