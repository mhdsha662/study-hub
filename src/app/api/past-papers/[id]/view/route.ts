import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: resourceId } = await params
    console.log('View request for resource:', resourceId)

    // Update view count
    await db.resource.update({
      where: { id: resourceId },
      data: { viewCount: { increment: 1 } }
    })

    console.log('View count updated for resource:', resourceId)

    // Record analytics
    await db.analytics.create({
      data: {
        resourceId: resourceId,
        action: 'view',
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown'
      }
    })

    console.log('Analytics recorded for view:', resourceId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating view count:', error)
    return NextResponse.json(
      { error: 'Failed to update view count' },
      { status: 500 }
    )
  }
}