import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url)
        const subjectId = searchParams.get('subjectId')
        const year = searchParams.get('year')
        const level = searchParams.get('level')
        const search = searchParams.get('search')

        // Build where clause for mark schemes
        const where: any = {
            category: 'MARK_SCHEME',
            isPublic: true
        }

        if (subjectId) {
            where.subjectId = subjectId
        }

        if (year) {
            where.year = parseInt(year)
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
                { subject: { name: { contains: search } } },
                { subject: { code: { contains: search } } }
            ]

            // Add paper number search if it's a number
            if (/^\d+$/.test(search)) {
                where.OR.push({ paperNumber: search })
            }

            // Add year search if it's a valid year
            if (/^(19|20)\d{2}$/.test(search)) {
                where.OR.push({ year: parseInt(search) })
            }
        }

        const markSchemes = await db.resource.findMany({
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
                { year: 'desc' },
                { createdAt: 'desc' }
            ]
        })

        return NextResponse.json(markSchemes)
    } catch (error) {
        console.error('Error fetching mark schemes:', error)
        return NextResponse.json(
            { error: 'Failed to fetch mark schemes' },
            { status: 500 }
        )
    }
}
