"use client"

import { useState, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  Download,
  Eye,
  Filter,
  BookOpen,
  Calendar,
  FileText,
} from "lucide-react"
import PDFViewer from "@/components/pdf-viewer"

interface Subject {
  id: string
  code: string
  name: string
  level: "IGCSE" | "AS_LEVEL" | "A_LEVEL"
}

interface PastPaper {
  id: string
  title: string
  filename: string
  originalName: string
  year: number
  paperNumber?: string
  subject: Subject
  downloadCount: number
  viewCount: number
  _count: {
    downloads: number
  }
}

export default function PastPapersPage() {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [pastPapers, setPastPapers] = useState<PastPaper[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null)
  const [selectedYear, setSelectedYear] = useState<string | null>(null)
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null)
  const [viewingPaper, setViewingPaper] = useState<PastPaper | null>(null)

  useEffect(() => {
    fetchSubjects()
    fetchPastPapers()
  }, [])

  useEffect(() => {
    fetchPastPapers()
  }, [searchTerm, selectedSubject, selectedYear, selectedLevel])

  const fetchSubjects = async () => {
    try {
      const response = await fetch("/api/subjects")
      if (response.ok) {
        const data = await response.json()
        setSubjects(data)
      }
    } catch (error) {
      console.error("Error fetching subjects:", error)
    }
  }

  const fetchPastPapers = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (searchTerm) params.append("search", searchTerm)
      if (selectedSubject) params.append("subjectId", selectedSubject)
      if (selectedYear) params.append("year", selectedYear)
      if (selectedLevel) params.append("level", selectedLevel)

      const response = await fetch(`/api/past-papers?${params}`)
      if (response.ok) {
        const data = await response.json()
        setPastPapers(data)
      }
    } catch (error) {
      console.error("Error fetching past papers:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async (paperId: string, filename: string) => {
    console.log('Download clicked for paper:', paperId, filename)
    try {
      const response = await fetch(`/api/past-papers/download/${paperId}`)
      console.log('Download response:', response.status, response.statusText)
      if (response.ok) {
        const blob = await response.blob()
        console.log('Blob received:', blob.size, blob.type)
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = filename
        document.body.appendChild(a)
        a.click()
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        console.error("Download failed:", response.status, response.statusText)
        const errorText = await response.text()
        console.error("Error response:", errorText)
      }
    } catch (error) {
      console.error("Error downloading file:", error)
    }
  }

  const handleView = async (paperId: string) => {
    console.log('View clicked for paper:', paperId)
    try {
      // Update view count
      const viewResponse = await fetch(`/api/past-papers/${paperId}/view`, { method: 'POST' })
      console.log('View response:', viewResponse.status, viewResponse.statusText)
      
      if (!viewResponse.ok) {
        console.error('View update failed:', viewResponse.status, viewResponse.statusText)
        const errorText = await viewResponse.text()
        console.error('View error response:', errorText)
      }
      
      // Find the paper and open in viewer
      const paper = pastPapers.find(p => p.id === paperId)
      if (paper) {
        console.log('Found paper, opening viewer:', paper.originalName)
        setViewingPaper(paper)
      } else {
        console.error('Paper not found in pastPapers array:', paperId)
      }
    } catch (error) {
      console.error("Error viewing file:", error)
    }
  }

  const closeViewer = () => {
    setViewingPaper(null)
  }

  const handleViewerDownload = () => {
    if (viewingPaper) {
      handleDownload(viewingPaper.id, viewingPaper.originalName)
    }
  }

  const years = Array.from({ length: 15 }, (_, i) => (2024 - i).toString())
  const levels = ["IGCSE", "AS_LEVEL", "A_LEVEL"]

  // Get available years from past papers
  const availableYears = pastPapers.length > 0 
    ? Array.from(new Set(pastPapers.map(p => p.year.toString()))).sort((a, b) => parseInt(b) - parseInt(a))
    : years

  // Get available levels from past papers
  const availableLevels = pastPapers.length > 0
    ? Array.from(new Set(pastPapers.map(p => p.subject.level)))
    : levels

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Past Papers
          </h1>
          <p className="text-gray-600">
            Free access to Cambridge past papers. No login required.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search past papers... (try: 9701, Chemistry, 2024, 11)"
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Search by subject code, name, year, or paper number
              </p>
            </div>
            <Select value={selectedSubject || "all"} onValueChange={(value) => setSelectedSubject(value === "all" ? null : value)}>
              <SelectTrigger>
                <SelectValue placeholder="All Subjects" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {subjects.map((subject) => (
                  <SelectItem key={subject.id} value={subject.id}>
                    {subject.name} ({subject.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedYear || "all"} onValueChange={(value) => setSelectedYear(value === "all" ? null : value)}>
              <SelectTrigger>
                <SelectValue placeholder="All Years" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Years</SelectItem>
                {availableYears.map((year) => (
                  <SelectItem key={year} value={year}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="mt-4">
            <Select value={selectedLevel || "all"} onValueChange={(value) => setSelectedLevel(value === "all" ? null : value)}>
              <SelectTrigger className="w-full md:w-64">
                <SelectValue placeholder="All Levels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                {availableLevels.map((level) => (
                  <SelectItem key={level} value={level}>
                    {level.replace('_', ' ')}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold">{pastPapers.length}</p>
                  <p className="text-gray-600">Total Papers</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <BookOpen className="h-8 w-8 text-green-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold">{subjects.length}</p>
                  <p className="text-gray-600">Subjects</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-purple-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold">
                    {pastPapers.length > 0 
                      ? Math.max(...pastPapers.map(p => p.year)) - Math.min(...pastPapers.map(p => p.year)) + 1 
                      : 0
                    }
                  </p>
                  <p className="text-gray-600">Years Available</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Past Papers Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading past papers...</p>
          </div>
        ) : pastPapers.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No past papers found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or check back later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pastPapers.map((paper) => (
              <Card key={paper.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{paper.title}</CardTitle>
                      <CardDescription>
                        {paper.subject.name} • {paper.subject.level.replace('_', ' ')}
                      </CardDescription>
                    </div>
                    <Badge variant="secondary">{paper.year}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>Paper {paper.paperNumber || 'N/A'}</span>
                    <div className="flex items-center space-x-4">
                      <span>{paper.downloadCount} downloads</span>
                      <span>{paper.viewCount} views</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleDownload(paper.id, paper.originalName)}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleView(paper.id)}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* PDF Viewer Modal */}
      {viewingPaper && (
        <PDFViewer
          url={`/uploads/${viewingPaper.filePath}`}
          title={viewingPaper.title}
          onClose={closeViewer}
          onDownload={handleViewerDownload}
        />
      )}
    </div>
  )
}