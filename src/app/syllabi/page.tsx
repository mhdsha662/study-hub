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
  Calendar,
  BookOpen,
  Clock,
} from "lucide-react"

export default function SyllabiPage() {
  // Mock data - in real app this would come from API
  const syllabi = [
    {
      id: "1",
      title: "Cambridge International AS & A Level Chemistry 9701",
      subject: "Chemistry",
      code: "9701",
      level: "AS & A Level",
      year: 2024,
      validFrom: "2024",
      validTo: "2026",
      downloads: 3421,
      isLatest: true,
    },
    {
      id: "2",
      title: "Cambridge IGCSE Chemistry 0620",
      subject: "Chemistry",
      code: "0620",
      level: "IGCSE",
      year: 2023,
      validFrom: "2023",
      validTo: "2025",
      downloads: 2876,
      isLatest: true,
    },
    {
      id: "3",
      title: "Cambridge International AS & A Level Physics 9702",
      subject: "Physics",
      code: "9702",
      level: "AS & A Level",
      year: 2024,
      validFrom: "2024",
      validTo: "2026",
      downloads: 2987,
      isLatest: true,
    },
    {
      id: "4",
      title: "Cambridge International AS & A Level Chemistry 9701",
      subject: "Chemistry",
      code: "9701",
      level: "AS & A Level",
      year: 2022,
      validFrom: "2022",
      validTo: "2024",
      downloads: 1234,
      isLatest: false,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Syllabi
          </h1>
          <p className="text-gray-600">
            Current and past Cambridge syllabi for all subjects
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search syllabi..."
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
                <SelectItem value="business">Business Studies</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="All Levels" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="igcse">IGCSE</SelectItem>
                <SelectItem value="olevel">O Level</SelectItem>
                <SelectItem value="as">AS Level</SelectItem>
                <SelectItem value="alevel">A Level</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <BookOpen className="h-8 w-8 text-blue-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold">150+</p>
                  <p className="text-gray-600">Syllabi</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-green-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold">25</p>
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
                  <p className="text-2xl font-bold">15</p>
                  <p className="text-gray-600">Years Covered</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Clock className="h-8 w-8 text-orange-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold">45</p>
                  <p className="text-gray-600">Latest Syllabi</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Syllabi List */}
        <div className="space-y-4">
          {syllabi.map((syllabus) => (
            <Card key={syllabus.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold">{syllabus.title}</h3>
                      {syllabus.isLatest && (
                        <Badge className="bg-green-100 text-green-800">
                          Latest
                        </Badge>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600 mb-4">
                      <div>
                        <span className="font-medium">Subject:</span> {syllabus.subject}
                      </div>
                      <div>
                        <span className="font-medium">Code:</span> {syllabus.code}
                      </div>
                      <div>
                        <span className="font-medium">Level:</span> {syllabus.level}
                      </div>
                      <div>
                        <span className="font-medium">Year:</span> {syllabus.year}
                      </div>
                    </div>
                    <div className="text-sm text-gray-600">
                      <span className="font-medium">Valid:</span> {syllabus.validFrom} - {syllabus.validTo}
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 ml-6">
                    <div className="text-right">
                      <div className="text-sm text-gray-500">{syllabus.downloads} downloads</div>
                    </div>
                    <div className="flex space-x-2">
                      <Button size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </Button>
                      <Button size="sm" variant="outline">
                        <Eye className="mr-2 h-4 w-4" />
                        View
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Info Section */}
        <div className="mt-12 bg-blue-50 rounded-lg p-6">
          <div className="flex items-start">
            <BookOpen className="h-6 w-6 text-blue-600 mr-3 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-2">
                About Cambridge Syllabi
              </h3>
              <p className="text-blue-800 mb-3">
                Cambridge syllabi outline the curriculum, assessment objectives, and learning outcomes 
                for each subject. They are essential for understanding what will be covered in exams 
                and how students will be assessed.
              </p>
              <p className="text-blue-800">
                Syllabuses are typically updated every few years to reflect changes in educational 
                standards and practices. Always ensure you're using the most current syllabus 
                for your exam session.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}