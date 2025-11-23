import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import { readFile } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export async function GET(
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
    console.log('Book download request for resource:', resourceId)

    // Get the resource from database
    const resource = await db.resource.findUnique({
      where: { id: resourceId },
      include: { subject: true }
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

    console.log('Book found:', resource.title, resource.filePath)

    // Check if file exists
    const filePath = join(process.cwd(), 'public', 'uploads', resource.filePath)
    console.log('Full file path:', filePath)
    
    if (!existsSync(filePath)) {
      console.log('File not found on server:', filePath)
      return NextResponse.json(
        { error: 'File not found on server' },
        { status: 404 }
      )
    }

    console.log('File exists, proceeding with download')

    // Record download
    await db.download.create({
      data: {
        resourceId: resourceId,
        userId: session.user.id,
        ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown'
      }
    })

    // Update download count
    await db.resource.update({
      where: { id: resourceId },
      data: { downloadCount: { increment: 1 } }
    })

    // Read file and return for download
    const fileBuffer = await readFile(filePath)
    console.log('File read successfully, size:', fileBuffer.length)
    
    return new NextResponse(fileBuffer, {
      headers: {
        'Content-Type': resource.mimeType,
        'Content-Disposition': `attachment; filename="${resource.originalName}"`,
        'Content-Length': resource.fileSize.toString(),
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    })
  } catch (error) {
    console.error('Error downloading book:', error)
    return NextResponse.json(
      { error: 'Failed to download book' },
      { status: 500 }
    )
  }
}