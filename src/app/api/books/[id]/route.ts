import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    
    // Check if user is authenticated and has book access
    if (!session || !session.user.hasBookAccess) {
      return NextResponse.json(
        { error: 'Unauthorized: Book access required' },
        { status: 401 }
      )
    }

    const { id: resourceId } = await params
    console.log('Book view request for resource:', resourceId)

    // Get the resource to verify it exists and is a book
    const resource = await db.resource.findUnique({
      where: { id: resourceId }
    })

    if (!resource) {
      console.log('Book not found:', resourceId)
      return NextResponse.json(
        { error: 'Book not found' },
        { status: 404 }
      )
    }

    // Verify it's actually a book
    if (resource.category !== 'BOOK') {
      return NextResponse.json(
        { error: 'Resource is not a book' },
        { status: 400 }
      )
    }

    // Update view count
    await db.resource.update({
      where: { id: resourceId },
      data: { viewCount: { increment: 1 } }
    })

    console.log('View count updated for book:', resourceId)

    // Record analytics
    await db.analytics.create({
      data: {
        resourceId: resourceId,
        userId: session.user.id,
        action: 'view',
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown'
      }
    })

    console.log('Analytics recorded for book view:', resourceId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating book view count:', error)
    return NextResponse.json(
      { error: 'Failed to update view count' },
      { status: 500 }
    )
  }
}