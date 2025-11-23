"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
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
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Search,
  Download,
  Eye,
  Lock,
  BookOpen,
  Shield,
  Calendar,
  Loader2,
} from "lucide-react"
import { useRouter } from "next/navigation"
import PDFViewer from "@/components/pdf-viewer"

interface Subject {
  id: string
  code: string
  name: string
  level: "IGCSE" | "AS_LEVEL" | "A_LEVEL"
}

interface Book {
  id: string
  title: string
  filename: string
  originalName: string
  year: number
  subject: Subject
  downloadCount: number
  viewCount: number
  _count: {
    downloads: number
  }
}

export default function BooksPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [books, setBooks] = useState<Book[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null)
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null)
  const [viewingBook, setViewingBook] = useState<Book | null>(null)

  useEffect(() => {
    if (session && session.user.hasBookAccess) {
      fetchBooks()
      fetchSubjects()
    }
  }, [session])

  useEffect(() => {
    if (session && session.user.hasBookAccess) {
      fetchBooks()
    }
  }, [searchTerm, selectedSubject, selectedLevel])

  const fetchBooks = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (searchTerm) params.append("search", searchTerm)
      if (selectedSubject) params.append("subjectId", selectedSubject)
      if (selectedLevel) params.append("level", selectedLevel)

      const response = await fetch(`/api/books?${params}`)
      if (response.ok) {
        const data = await response.json()
        setBooks(data)
      }
    } catch (error) {
      console.error("Error fetching books:", error)
    } finally {
      setLoading(false)
    }
  }

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

  const handleDownload = async (bookId: string, filename: string) => {
    console.log('Download clicked for book:', bookId, filename)
    try {
      const response = await fetch(`/api/books/download/${bookId}`)
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
        alert("Download failed. Please ensure you have book access permissions.")
      }
    } catch (error) {
      console.error("Error downloading book:", error)
      alert("Error downloading book. Please try again.")
    }
  }

  const handleView = async (bookId: string) => {
    console.log('View clicked for book:', bookId)
    try {
      // Update view count
      const viewResponse = await fetch(`/api/books/${bookId}/view`, { method: 'POST' })
      console.log('View response:', viewResponse.status, viewResponse.statusText)
      
      if (!viewResponse.ok) {
        console.error('View update failed:', viewResponse.status, viewResponse.statusText)
        const errorText = await viewResponse.text()
        console.error('View error response:', errorText)
      }
      
      // Find the book and open in viewer
      const book = books.find(b => b.id === bookId)
      if (book) {
        console.log('Found book, opening viewer:', book.originalName)
        setViewingBook(book)
      } else {
        console.error('Book not found in books array:', bookId)
      }
    } catch (error) {
      console.error("Error viewing book:", error)
      // Fallback to download if view fails
      const book = books.find(b => b.id === bookId)
      if (book) {
        handleDownload(bookId, book.originalName)
      }
    }
  }

  const closeViewer = () => {
    setViewingBook(null)
  }

  const handleViewerDownload = () => {
    if (viewingBook) {
      handleDownload(viewingBook.id, viewingBook.originalName)
    }
  }

  const levels = ["IGCSE", "AS_LEVEL", "A_LEVEL"]

  // Get available years from books
  const availableYears = books.length > 0 
    ? Array.from(new Set(books.map(b => b.year.toString()))).sort((a, b) => parseInt(b) - parseInt(a))
    : []

  // Get available levels from books
  const availableLevels = books.length > 0
    ? Array.from(new Set(books.map(b => b.subject.level)))
    : levels

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!session || !session.user.hasBookAccess) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Cambridge Books
            </h1>
            <p className="text-gray-600">
              Official Cambridge textbooks with controlled access
            </p>
          </div>

          <Alert>
            <Lock className="h-4 w-4" />
            <AlertDescription>
              <strong>Access Restricted:</strong> Cambridge books require special login credentials. 
              Please contact an administrator or sign in with an authorized account.
            </AlertDescription>
          </Alert>

          <div className="mt-8 text-center">
            {!session ? (
              <div className="space-y-4">
                <p className="text-gray-600">
                  You need to sign in to access Cambridge books.
                </p>
                <div className="flex justify-center space-x-4">
                  <Button onClick={() => router.push("/auth/signin")}>
                    Sign In
                  </Button>
                  <Button variant="outline" onClick={() => router.push("/auth/signup")}>
                    Sign Up
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-gray-600">
                  Your account doesn't have access to Cambridge books. Please contact an administrator.
                </p>
                <Button variant="outline" onClick={() => router.push("/")}>
                  Back to Home
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Cambridge Books
              </h1>
              <p className="text-gray-600">
                Official Cambridge textbooks (Access Granted)
              </p>
            </div>
            <Badge className="bg-green-100 text-green-800">
              <Shield className="mr-1 h-3 w-3" />
              Access Granted
            </Badge>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search books... (try: Chemistry, Physics, 2023)"
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Search by title, subject, author, or year
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
            <Select value={selectedLevel || "all"} onValueChange={(value) => setSelectedLevel(value === "all" ? null : value)}>
              <SelectTrigger>
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

        {/* Books Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading books...</p>
          </div>
        ) : books.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No books found</h3>
            <p className="text-gray-600">Try adjusting your search criteria or check back later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {books.map((book) => (
              <Card key={book.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg leading-tight">{book.title}</CardTitle>
                      <CardDescription>
                        {book.subject.name} • {book.subject.level.replace('_', ' ')}
                      </CardDescription>
                    </div>
                    <Badge variant="secondary">{book.year}</Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span>{book.subject.code}</span>
                    <div className="flex items-center space-x-4">
                      <span>{book.downloadCount} downloads</span>
                      <span>{book.viewCount} views</span>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleDownload(book.id, book.originalName)}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleView(book.id)}
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

        {/* Info Section */}
        <div className="mt-12 bg-blue-50 rounded-lg p-6">
          <div className="flex items-start">
            <BookOpen className="h-6 w-6 text-blue-600 mr-3 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                About Cambridge Books
              </h3>
              <p className="text-blue-800">
                These are official Cambridge textbooks provided for educational purposes. 
                Access is restricted to authorized users only. Please respect copyright 
                and use these resources responsibly.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* PDF Viewer Modal */}
      {viewingBook && (
        <PDFViewer
          url={`/uploads/${viewingBook.filePath}`}
          title={viewingBook.title}
          onClose={closeViewer}
          onDownload={handleViewerDownload}
        />
      )}
    </div>
  )
}