import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const subjectId = searchParams.get('subjectId')
    const level = searchParams.get('level')
    const search = searchParams.get('search')

    // Build where clause for books
    const where: any = {
      category: 'BOOK',
      isPublic: false // Books are typically not public
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
        { subject: { name: { contains: search } } },
        { subject: { code: { contains: search } } }
      ]
      
      // Add year search if it's a valid year
      if (/^(19|20)\d{2}$/.test(search)) {
        where.OR.push({ year: parseInt(search) })
      }
    }

    const books = await db.resource.findMany({
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

    return NextResponse.json(books)
  } catch (error) {
    console.error('Error fetching books:', error)
    return NextResponse.json(
      { error: 'Failed to fetch books' },
      { status: 500 }
    )
  }
}