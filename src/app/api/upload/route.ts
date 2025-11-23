import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

// 50MB limit
const MAX_FILE_SIZE = 50 * 1024 * 1024
const ALLOWED_MIME_TYPES = ['application/pdf']

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    // Enforce authentication
    if (!session || session.user.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await req.formData()
    const file = formData.get('file') as File
    const subjectId = formData.get('subjectId') as string
    const category = formData.get('category') as string
    const year = formData.get('year') ? parseInt(formData.get('year') as string) : null
    const paperNumber = formData.get('paperNumber') as string

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File size exceeds 50MB limit' }, { status: 400 })
    }

    // Validate file type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Only PDFs are allowed.' }, { status: 400 })
    }

    if (!subjectId) {
      return NextResponse.json({ error: 'No subject provided' }, { status: 400 })
    }

    // Get subject
    const subject = await db.subject.findUnique({
      where: { id: subjectId }
    })

    if (!subject) {
      return NextResponse.json({ error: 'Subject not found' }, { status: 404 })
    }

    // Extract metadata from filename if not provided
    let extractedYear = year
    let extractedPaperNumber = paperNumber
    let title = file.name

    if (!extractedYear || !extractedPaperNumber) {
      const filename = file.name.toLowerCase()
      
      // Extract year (format: 2024, 23, etc.)
      const yearMatch = filename.match(/(20\d{2})/)
      if (yearMatch && !extractedYear) {
        extractedYear = parseInt(yearMatch[1])
      }
      
      // Extract paper number (format: _qp_11, _qp_22, etc.)
      const paperMatch = filename.match(/_qp_(\d+)/)
      if (paperMatch && !extractedPaperNumber) {
        extractedPaperNumber = paperMatch[1]
      }
      
      // Generate title from metadata
      const levelName = subject.level.replace('_', ' ')
      const seasonMatch = filename.match(/_(s|w|m)(\d{2})_/)
      const season = seasonMatch ? 
        (seasonMatch[1] === 's' ? 'Summer' : seasonMatch[1] === 'w' ? 'Winter' : 'March') : 
        ''
      
      title = `${subject.name} ${levelName} Paper ${extractedPaperNumber || 'N/A'}`
      if (extractedYear) title += ` ${extractedYear}`
      if (season) title += ` ${season}`
    }

    // Generate better file path structure
    const fileExtension = path.extname(file.name)
    const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}${fileExtension}`
    
    // Create organized directory structure: uploads/[category]/[subject-code]/[year]/
    const categoryDir = category.toLowerCase()
    const subjectCode = subject.code
    const yearDir = extractedYear?.toString() || 'unknown'
    
    const relativePath = `${categoryDir}/${subjectCode}/${yearDir}/${fileName}`
    const filePath = path.join('public', 'uploads', relativePath)

    // Ensure directory exists
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', categoryDir, subjectCode, yearDir)
    try {
      await mkdir(uploadDir, { recursive: true })
    } catch (error) {
      // Directory might already exist
    }

    // Save file locally
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    // Create resource record
    const resource = await db.resource.create({
      data: {
        title: title,
        filename: fileName,
        originalName: file.name,
        filePath: relativePath,
        fileSize: file.size,
        mimeType: file.type || 'application/pdf',
        category: category as any,
        description: null,
        year: extractedYear,
        paperNumber: extractedPaperNumber,
        isPublic: true,
        subjectId: subject.id
      }
    })

    return NextResponse.json({ 
      success: true, 
      resource,
      fileUrl: `/uploads/${relativePath}` 
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}