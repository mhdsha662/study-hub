import { db } from '@/lib/db'
import { readFile, writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

export interface FileOrganizationResult {
  success: boolean
  message: string
  movedFiles?: number
  errors?: string[]
}

export class FileOrganizer {
  /**
   * Organize existing files into the new directory structure
   */
  static async organizeExistingFiles(): Promise<FileOrganizationResult> {
    const errors: string[] = []
    let movedFiles = 0

    try {
      // Get all resources that need to be reorganized
      const resources = await db.resource.findMany({
        where: {
          category: 'PAST_PAPER',
          isPublic: true
        },
        include: {
          subject: true
        }
      })

      for (const resource of resources) {
        try {
          // Parse current file path
          const currentPath = join(process.cwd(), 'public', 'uploads', resource.filePath)
          
          if (!existsSync(currentPath)) {
            errors.push(`File not found: ${resource.filePath}`)
            continue
          }

          // Generate new organized path
          const categoryDir = resource.category.toLowerCase()
          const subjectCode = resource.subject.code
          const yearDir = resource.year?.toString() || 'unknown'
          const fileName = resource.filename
          
          const newPath = join(process.cwd(), 'public', 'uploads', categoryDir, subjectCode, yearDir, fileName)
          const newRelativePath = `${categoryDir}/${subjectCode}/${yearDir}/${fileName}`

          // Create directory if it doesn't exist
          const newDir = join(process.cwd(), 'public', 'uploads', categoryDir, subjectCode, yearDir)
          await mkdir(newDir, { recursive: true })

          // Read file content
          const fileContent = await readFile(currentPath)
          
          // Write to new location
          await writeFile(newPath, fileContent)
          
          // Update database record
          await db.resource.update({
            where: { id: resource.id },
            data: { filePath: newRelativePath }
          })

          // Remove old file (optional - comment out for safety)
          // await unlink(currentPath)
          
          movedFiles++
        } catch (error) {
          errors.push(`Failed to organize ${resource.originalName}: ${error}`)
        }
      }

      return {
        success: errors.length === 0,
        message: `Organized ${movedFiles} files successfully`,
        movedFiles,
        errors: errors.length > 0 ? errors : undefined
      }
    } catch (error) {
      return {
        success: false,
        message: `Failed to organize files: ${error}`,
        errors
      }
    }
  }

  /**
   * Get storage statistics
   */
  static async getStorageStats() {
    try {
      const resources = await db.resource.findMany({
        where: { isPublic: true },
        select: {
          fileSize: true,
          category: true,
          subject: {
            select: {
              code: true,
              level: true
            }
          },
          year: true
        }
      })

      const stats = {
        totalFiles: resources.length,
        totalSize: resources.reduce((sum, r) => sum + r.fileSize, 0),
        byCategory: {} as Record<string, { count: number; size: number }>,
        bySubject: {} as Record<string, { count: number; size: number }>,
        byYear: {} as Record<string, { count: number; size: number }>,
        byLevel: {} as Record<string, { count: number; size: number }>
      }

      resources.forEach(resource => {
        // By category
        if (!stats.byCategory[resource.category]) {
          stats.byCategory[resource.category] = { count: 0, size: 0 }
        }
        stats.byCategory[resource.category].count++
        stats.byCategory[resource.category].size += resource.fileSize

        // By subject
        const subjectKey = `${resource.subject.code} (${resource.subject.level})`
        if (!stats.bySubject[subjectKey]) {
          stats.bySubject[subjectKey] = { count: 0, size: 0 }
        }
        stats.bySubject[subjectKey].count++
        stats.bySubject[subjectKey].size += resource.fileSize

        // By year
        const yearKey = resource.year?.toString() || 'Unknown'
        if (!stats.byYear[yearKey]) {
          stats.byYear[yearKey] = { count: 0, size: 0 }
        }
        stats.byYear[yearKey].count++
        stats.byYear[yearKey].size += resource.fileSize

        // By level
        const levelKey = resource.subject.level
        if (!stats.byLevel[levelKey]) {
          stats.byLevel[levelKey] = { count: 0, size: 0 }
        }
        stats.byLevel[levelKey].count++
        stats.byLevel[levelKey].size += resource.fileSize
      })

      return stats
    } catch (error) {
      console.error('Error getting storage stats:', error)
      return null
    }
  }

  /**
   * Clean up orphaned files (files in uploads directory not in database)
   */
  static async cleanupOrphanedFiles(): Promise<FileOrganizationResult> {
    // This would require scanning the uploads directory and checking against database
    // For now, return a placeholder
    return {
      success: true,
      message: 'Cleanup not implemented yet'
    }
  }
}