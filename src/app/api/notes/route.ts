import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const subjectId = searchParams.get('subjectId')
        const level = searchParams.get('level')
        const search = searchParams.get('search')

        // Build where clause for notes
        const where: any = {
            category: 'NOTES',
            isPublic: true
        }

        if (subjectId) {
            where.subjectId = subjectId
        }

        if (level) {
            where.subject = {
                level: level
            }
        }

        if (search) {
            where.OR = [
                { title: { contains: search } },
                { originalName: { contains: search } },
                { description: { contains: search } },
                { subject: { name: { contains: search } } },
                { subject: { code: { contains: search } } }
            ]
        }

        const notes = await db.resource.findMany({
            where,
            include: {
                subject: true,
                _count: {
                    select: {
                        downloads: true
                    }
                }
            },
            orderBy: [
                { downloadCount: 'desc' },
                { createdAt: 'desc' }
            ]
        })

        return NextResponse.json(notes)
    } catch (error) {
        console.error('Error fetching notes:', error)
        return NextResponse.json(
            { error: 'Failed to fetch notes' },
            { status: 500 }
        )
    }
}
