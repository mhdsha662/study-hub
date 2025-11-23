"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Download,
  Eye,
  FileText,
  Calendar,
  HardDrive,
} from "lucide-react"
import { formatFileSize } from "@/lib/utils"
import { ResourceCategory } from "@prisma/client"

interface Resource {
  id: string
  title: string
  subject: string
  subjectCode: string
  year: number
  paperNumber?: string
  category: ResourceCategory
  description?: string
  fileSize: number
  downloadCount: number
  viewCount: number
  createdAt: Date
  filePath: string
}

interface ResourceCardProps {
  resource: Resource
  viewMode: "grid" | "list"
  onDownload?: (id: string) => void
  onView?: (id: string) => void
}

export function ResourceCard({ resource, viewMode, onDownload, onView }: ResourceCardProps) {
  const getCategoryColor = (category: ResourceCategory) => {
    switch (category) {
      case "PAST_PAPER": return "bg-blue-100 text-blue-800"
      case "MARK_SCHEME": return "bg-green-100 text-green-800"
      case "EXAMINER_REPORT": return "bg-purple-100 text-purple-800"
      case "SYLLABUS": return "bg-red-100 text-red-800"
      case "NOTES": return "bg-yellow-100 text-yellow-800"
      case "BOOK": return "bg-orange-100 text-orange-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getCategoryLabel = (category: ResourceCategory) => {
    switch (category) {
      case "PAST_PAPER": return "Past Paper"
      case "MARK_SCHEME": return "Mark Scheme"
      case "EXAMINER_REPORT": return "Examiner Report"
      case "SYLLABUS": return "Syllabus"
      case "NOTES": return "Notes"
      case "BOOK": return "Book"
      default: return category.replace(/_/g, ' ')
    }
  }

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onDownload) {
      onDownload(resource.id)
    } else {
      window.open(`/api/download/${resource.id}`, '_blank')
    }
  }

  const handleView = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onView) {
      onView(resource.id)
    }
  }

  if (viewMode === "list") {
    return (
      <Card className="hover:shadow-md transition-shadow">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="text-lg font-semibold">{resource.title}</h3>
                <Badge className={getCategoryColor(resource.category)}>
                  {getCategoryLabel(resource.category)}
                </Badge>
              </div>

              <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                <div className="flex items-center space-x-1">
                  <FileText className="h-4 w-4" />
                  <span>{resource.subject} ({resource.subjectCode})</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>{resource.year}</span>
                </div>
                {resource.paperNumber && (
                  <div className="flex items-center space-x-1">
                    <span>Paper {resource.paperNumber}</span>
                  </div>
                )}
                <div className="flex items-center space-x-1">
                  <HardDrive className="h-4 w-4" />
                  <span>{formatFileSize(resource.fileSize)}</span>
                </div>
              </div>

              {resource.description && (
                <p className="text-gray-600 text-sm mb-3">{resource.description}</p>
              )}

              <div className="flex items-center space-x-4 text-sm text-gray-500">
                <div className="flex items-center space-x-1">
                  <Download className="h-4 w-4" />
                  <span>{resource.downloadCount.toLocaleString()} downloads</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Eye className="h-4 w-4" />
                  <span>{resource.viewCount.toLocaleString()} views</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2 ml-6">
              <Button variant="outline" size="sm" onClick={handleView}>
                <Eye className="mr-2 h-4 w-4" />
                View
              </Button>
              <Button size="sm" onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={handleView}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2 line-clamp-2">{resource.title}</CardTitle>
            <div className="flex items-center space-x-2 mb-2">
              <Badge className={getCategoryColor(resource.category)}>
                {getCategoryLabel(resource.category)}
              </Badge>
              {resource.paperNumber && (
                <Badge variant="outline">Paper {resource.paperNumber}</Badge>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>{resource.subject} ({resource.subjectCode})</span>
            <span>{resource.year}</span>
          </div>

          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <HardDrive className="h-3 w-3" />
              <span>{formatFileSize(resource.fileSize)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <Download className="h-3 w-3" />
                <span>{resource.downloadCount}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Eye className="h-3 w-3" />
                <span>{resource.viewCount}</span>
              </div>
            </div>
          </div>

          <div className="flex space-x-2 pt-2">
            <Button variant="outline" size="sm" className="flex-1" onClick={handleView}>
              <Eye className="mr-2 h-4 w-4" />
              View
            </Button>
            <Button size="sm" className="flex-1" onClick={handleDownload}>
              <Download className="mr-2 h-4 w-4" />
              Download
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}