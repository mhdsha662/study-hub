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
  FileText,
  Star,
  Calendar,
  User,
} from "lucide-react"

export default function NotesPage() {
  // Mock data - in real app this would come from API
  const notes = [
    {
      id: "1",
      title: "Complete A-Level Chemistry Notes",
      subject: "Chemistry",
      level: "A-Level",
      author: "Dr. Sarah Johnson",
      pages: 45,
      downloads: 2341,
      rating: 4.8,
      uploaded: "2024-01-15",
    },
    {
      id: "2",
      title: "IGCSE Physics Study Guide",
      subject: "Physics",
      level: "IGCSE",
      author: "Prof. Michael Chen",
      pages: 32,
      downloads: 1876,
      rating: 4.6,
      uploaded: "2024-01-10",
    },
    {
      id: "3",
      title: "AS Level Biology Revision Notes",
      subject: "Biology",
      level: "AS-Level",
      author: "Emma Williams",
      pages: 28,
      downloads: 1543,
      rating: 4.9,
      uploaded: "2024-01-08",
    },
    {
      id: "4",
      title: "A-Level Mathematics Formula Sheet",
      subject: "Mathematics",
      level: "A-Level",
      author: "Study Hub Team",
      pages: 15,
      downloads: 3210,
      rating: 4.7,
      uploaded: "2024-01-05",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Study Notes
          </h1>
          <p className="text-gray-600">
            Comprehensive notes and study guides for Cambridge subjects
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search notes..."
                  className="pl-10"
                />
              </div>
            </div>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="All Subjects" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="chemistry">Chemistry</SelectItem>
                <SelectItem value="physics">Physics</SelectItem>
                <SelectItem value="biology">Biology</SelectItem>
                <SelectItem value="mathematics">Mathematics</SelectItem>
                <SelectItem value="business">Business</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="All Levels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="igcse">IGCSE</SelectItem>
                <SelectItem value="as">AS Level</SelectItem>
                <SelectItem value="a">A Level</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold">500+</p>
                  <p className="text-gray-600">Study Notes</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <User className="h-8 w-8 text-green-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold">50+</p>
                  <p className="text-gray-600">Contributors</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Star className="h-8 w-8 text-yellow-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold">4.7</p>
                  <p className="text-gray-600">Avg Rating</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Download className="h-8 w-8 text-purple-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold">25K+</p>
                  <p className="text-gray-600">Downloads</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Notes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map((note) => (
            <Card key={note.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg leading-tight">{note.title}</CardTitle>
                    <CardDescription>
                      by {note.author}
                    </CardDescription>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span className="text-sm font-medium">{note.rating}</span>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{note.subject} • {note.level}</span>
                    <span>{note.pages} pages</span>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{note.downloads} downloads</span>
                    <span>{new Date(note.uploaded).toLocaleDateString()}</span>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" className="flex-1">
                    <Download className="mr-2 h-4 w-4" />
                    Download
                  </Button>
                  <Button size="sm" variant="outline">
                    <Eye className="mr-2 h-4 w-4" />
                    Preview
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-12 bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">
            Share Your Notes
          </h2>
          <p className="text-blue-100 mb-6 max-w-2xl mx-auto">
            Help fellow students by sharing your study notes and guides. 
            Together we can build the largest collection of Cambridge study resources.
          </p>
          <Button variant="secondary" size="lg">
            Upload Your Notes
          </Button>
        </div>
      </div>
    </div>
  )
}