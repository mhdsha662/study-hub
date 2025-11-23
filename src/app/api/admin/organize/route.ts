import { NextRequest, NextResponse } from 'next/server'
import { FileOrganizer } from '@/lib/file-organizer'

export async function POST(request: NextRequest) {
  try {
    const result = await FileOrganizer.organizeExistingFiles()
    
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error organizing files:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to organize files',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const stats = await FileOrganizer.getStorageStats()
    
    if (!stats) {
      return NextResponse.json(
        { error: 'Failed to get storage statistics' },
        { status: 500 }
      )
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Error getting storage stats:', error)
    return NextResponse.json(
      { 
        error: 'Failed to get storage statistics',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}