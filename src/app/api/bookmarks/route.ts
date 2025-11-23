import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

// GET /api/bookmarks - Get user's bookmarks
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const bookmarks = await db.bookmark.findMany({
            where: {
                userId: session.user.id
            },
            include: {
                resource: {
                    include: {
                        subject: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        })

        return NextResponse.json(bookmarks)
    } catch (error) {
        console.error('Error fetching bookmarks:', error)
        return NextResponse.json(
            { error: 'Failed to fetch bookmarks' },
            { status: 500 }
        )
    }
}

// POST /api/bookmarks - Add a bookmark
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const body = await request.json()
        const { resourceId } = body

        if (!resourceId) {
            return NextResponse.json(
                { error: 'Resource ID is required' },
                { status: 400 }
            )
        }

        // Check if bookmark already exists
        const existing = await db.bookmark.findUnique({
            where: {
                userId_resourceId: {
                    userId: session.user.id,
                    resourceId: resourceId
                }
            }
        })

        if (existing) {
            return NextResponse.json(
                { error: 'Bookmark already exists' },
                { status: 400 }
            )
        }

        const bookmark = await db.bookmark.create({
            data: {
                userId: session.user.id,
                resourceId: resourceId
            },
            include: {
                resource: {
                    include: {
                        subject: true
                    }
                }
            }
        })

        return NextResponse.json(bookmark, { status: 201 })
    } catch (error) {
        console.error('Error creating bookmark:', error)
        return NextResponse.json(
            { error: 'Failed to create bookmark' },
            { status: 500 }
        )
    }
}

// DELETE /api/bookmarks - Remove a bookmark
export async function DELETE(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions)

        if (!session) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const { searchParams } = new URL(request.url)
        const resourceId = searchParams.get('resourceId')

        if (!resourceId) {
            return NextResponse.json(
                { error: 'Resource ID is required' },
                { status: 400 }
            )
        }

        await db.bookmark.delete({
            where: {
                userId_resourceId: {
                    userId: session.user.id,
                    resourceId: resourceId
                }
            }
        })

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error deleting bookmark:', error)
        return NextResponse.json(
            { error: 'Failed to delete bookmark' },
            { status: 500 }
        )
    }
}
