import { getProjects } from '@/lib/supabase/projects'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')

    let projects
    if (category && category !== 'All') {
      const { getProjectsByCategory } = await import('@/lib/supabase/projects')
      projects = await getProjectsByCategory(category)
    } else {
      projects = await getProjects()
    }

    return NextResponse.json({
      success: true,
      data: projects
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch projects',
        details: {
          message: error?.message || 'Unknown error'
        }
      },
      { status: 500 }
    )
  }
}

