import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { readFile } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id: resourceId } = await params

        // Get the resource from database
        const resource = await db.resource.findUnique({
            where: { id: resourceId },
            include: { subject: true }
        })

        if (!resource) {
            return NextResponse.json(
                { error: 'Resource not found' },
                { status: 404 }
            )
        }

        // Check if file exists
        const filePath = join(process.cwd(), 'public', 'uploads', resource.filePath)

        if (!existsSync(filePath)) {
            return NextResponse.json(
                { error: 'File not found on server' },
                { status: 404 }
            )
        }

        // Record download
        await db.download.create({
            data: {
                resourceId: resourceId,
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

        return new NextResponse(fileBuffer, {
            headers: {
                'Content-Type': resource.mimeType,
                'Content-Disposition': `attachment; filename="${resource.originalName}"`,
                'Content-Length': resource.fileSize.toString()
            }
        })
    } catch (error) {
        console.error('Error downloading file:', error)
        return NextResponse.json(
            { error: 'Failed to download file' },
            { status: 500 }
        )
    }
}
