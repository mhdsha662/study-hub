import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

// GET /api/subjects - Get all subjects
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const level = searchParams.get('level')

    const where: any = {}
    if (level) {
      where.level = level
    }

    const subjects = await db.subject.findMany({
      where,
      orderBy: [
        { level: 'asc' },
        { name: 'asc' }
      ]
    })

    return NextResponse.json(subjects)
  } catch (error) {
    console.error('Error fetching subjects:', error)
    return NextResponse.json(
      { error: 'Failed to fetch subjects' },
      { status: 500 }
    )
  }
}

// POST /api/subjects - Create a new subject
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, code, level, description } = body

    if (!name || !code || !level) {
      return NextResponse.json(
        { error: 'Missing required fields: name, code, level' },
        { status: 400 }
      )
    }

    // Check if subject with this code already exists
    const existingSubject = await db.subject.findUnique({
      where: { code }
    })

    if (existingSubject) {
      return NextResponse.json(
        { error: 'Subject with this code already exists' },
        { status: 400 }
      )
    }

    const subject = await db.subject.create({
      data: {
        name,
        code,
        level,
        description: description || null
      }
    })

    return NextResponse.json(subject, { status: 201 })
  } catch (error) {
    console.error('Error creating subject:', error)
    return NextResponse.json(
      { error: 'Failed to create subject' },
      { status: 500 }
    )
  }
}