"use client"

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
  Star,
  BookOpen,
  FileText,
  Calendar,
  Trash2,
  ExternalLink,
} from "lucide-react"
import { useRouter } from "next/navigation"

export default function BookmarksPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  // Mock data - in real app this would come from API
  const bookmarks = [
    {
      id: "1",
      title: "9701 Chemistry AS Level Paper 1",
      type: "Past Paper",
      subject: "Chemistry",
      year: 2024,
      addedDate: "2024-01-15",
      downloads: 1234,
    },
    {
      id: "2",
      title: "Complete A-Level Chemistry Notes",
      type: "Notes",
      subject: "Chemistry",
      year: 2024,
      addedDate: "2024-01-10",
      downloads: 2341,
    },
    {
      id: "3",
      title: "Cambridge Chemistry Coursebook",
      type: "Book",
      subject: "Chemistry",
      year: 2023,
      addedDate: "2024-01-08",
      downloads: 892,
    },
    {
      id: "4",
      title: "9701 Chemistry A Level Paper 3 Mark Scheme",
      type: "Mark Scheme",
      subject: "Chemistry",
      year: 2024,
      addedDate: "2024-01-05",
      downloads: 756,
    },
  ]

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

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              My Bookmarks
            </h1>
            <p className="text-gray-600">
              Save your favorite resources for quick access
            </p>
          </div>

          <Alert>
            <Star className="h-4 w-4" />
            <AlertDescription>
              <strong>Sign In Required:</strong> You need to sign in to view and manage your bookmarks.
            </AlertDescription>
          </Alert>

          <div className="mt-8 text-center">
            <div className="space-y-4">
              <p className="text-gray-600">
                Sign in to access your bookmarks and save your favorite study resources.
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
                My Bookmarks
              </h1>
              <p className="text-gray-600">
                Your saved study resources
              </p>
            </div>
            <Badge className="bg-blue-100 text-blue-800">
              {bookmarks.length} Saved
            </Badge>
          </div>
        </div>

        {bookmarks.length === 0 ? (
          <div className="text-center py-12">
            <Star className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No bookmarks yet
            </h3>
            <p className="text-gray-600 mb-6">
              Start exploring resources and bookmark your favorites for quick access.
            </p>
            <Button onClick={() => router.push("/past-papers")}>
              Browse Resources
            </Button>
          </div>
        ) : (
          <>
            {/* Search and Filters */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="Search bookmarks..."
                      className="pl-10"
                    />
                  </div>
                </div>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="All Types" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="past-paper">Past Papers</SelectItem>
                    <SelectItem value="mark-scheme">Mark Schemes</SelectItem>
                    <SelectItem value="notes">Notes</SelectItem>
                    <SelectItem value="book">Books</SelectItem>
                    <SelectItem value="syllabus">Syllabi</SelectItem>
                  </SelectContent>
                </Select>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="All Subjects" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="chemistry">Chemistry</SelectItem>
                    <SelectItem value="physics">Physics</SelectItem>
                    <SelectItem value="biology">Biology</SelectItem>
                    <SelectItem value="mathematics">Mathematics</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Bookmarks Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {bookmarks.map((bookmark) => (
                <Card key={bookmark.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-lg leading-tight">{bookmark.title}</CardTitle>
                        <CardDescription>
                          {bookmark.subject} • {bookmark.year}
                        </CardDescription>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="secondary">{bookmark.type}</Badge>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>Added {new Date(bookmark.addedDate).toLocaleDateString()}</span>
                        </div>
                        <span>{bookmark.downloads} downloads</span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm" className="flex-1">
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                      <Button size="sm" variant="outline">
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Stats */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <Star className="h-8 w-8 text-yellow-600 mr-3" />
                    <div>
                      <p className="text-2xl font-bold">{bookmarks.length}</p>
                      <p className="text-gray-600">Total Bookmarks</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <FileText className="h-8 w-8 text-blue-600 mr-3" />
                    <div>
                      <p className="text-2xl font-bold">
                        {bookmarks.filter(b => b.type === "Past Paper").length}
                      </p>
                      <p className="text-gray-600">Past Papers</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <BookOpen className="h-8 w-8 text-green-600 mr-3" />
                    <div>
                      <p className="text-2xl font-bold">
                        {bookmarks.filter(b => b.type === "Notes").length}
                      </p>
                      <p className="text-gray-600">Notes</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <ExternalLink className="h-8 w-8 text-purple-600 mr-3" />
                    <div>
                      <p className="text-2xl font-bold">4</p>
                      <p className="text-gray-600">Subjects</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  )
}