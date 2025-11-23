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
  CheckCircle,
  Target,
} from "lucide-react"

export default function MarkSchemesPage() {
  // Mock data - in real app this would come from API
  const markSchemes = [
    {
      id: "1",
      title: "9701 Chemistry AS Level Paper 1 Mark Scheme",
      subject: "Chemistry",
      code: "9701",
      paperNumber: "1",
      level: "AS Level",
      year: 2024,
      session: "May/June",
      maxMarks: 40,
      downloads: 892,
    },
    {
      id: "2",
      title: "9701 Chemistry A Level Paper 3 Mark Scheme",
      subject: "Chemistry",
      code: "9701",
      paperNumber: "3",
      level: "A Level",
      year: 2024,
      session: "May/June",
      maxMarks: 75,
      downloads: 756,
    },
    {
      id: "3",
      title: "0620 Chemistry Paper 2 Mark Scheme",
      subject: "Chemistry",
      code: "0620",
      paperNumber: "2",
      level: "IGCSE",
      year: 2023,
      session: "October/November",
      maxMarks: 80,
      downloads: 1234,
    },
    {
      id: "4",
      title: "9702 Physics AS Level Paper 1 Mark Scheme",
      subject: "Physics",
      code: "9702",
      paperNumber: "1",
      level: "AS Level",
      year: 2024,
      session: "May/June",
      maxMarks: 40,
      downloads: 645,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Mark Schemes
          </h1>
          <p className="text-gray-600">
            Official marking schemes for Cambridge past papers
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search mark schemes..."
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
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="All Years" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2022">2022</SelectItem>
                <SelectItem value="2021">2021</SelectItem>
              </SelectContent>
            </Select>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="All Sessions" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="may-june">May/June</SelectItem>
                <SelectItem value="oct-nov">October/November</SelectItem>
                <SelectItem value="feb-mar">February/March</SelectItem>
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
                  <p className="text-2xl font-bold">1,800+</p>
                  <p className="text-gray-600">Mark Schemes</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <CheckCircle className="h-8 w-8 text-green-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold">100%</p>
                  <p className="text-gray-600">Official</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Target className="h-8 w-8 text-purple-600 mr-3" />
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
                <Calendar className="h-8 w-8 text-orange-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold">10</p>
                  <p className="text-gray-600">Years</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Mark Schemes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {markSchemes.map((scheme) => (
            <Card key={scheme.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg leading-tight">{scheme.title}</CardTitle>
                    <CardDescription>
                      {scheme.subject} • {scheme.level}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary">{scheme.year}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Paper:</span>
                      <span className="ml-1 font-medium">{scheme.paperNumber}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Max Marks:</span>
                      <span className="ml-1 font-medium">{scheme.maxMarks}</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Session:</span>
                      <span className="ml-1 font-medium">{scheme.session}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Downloads:</span>
                      <span className="ml-1 font-medium">{scheme.downloads}</span>
                    </div>
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

        {/* Info Section */}
        <div className="mt-12 bg-green-50 rounded-lg p-6">
          <div className="flex items-start">
            <CheckCircle className="h-6 w-6 text-green-600 mr-3 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-green-900 mb-2">
                About Mark Schemes
              </h3>
              <p className="text-green-800 mb-3">
                Mark schemes provide the official criteria used by examiners to assess student responses. 
                They show how marks are allocated for each question and include examples of acceptable answers.
              </p>
              <p className="text-green-800">
                Using mark schemes effectively can help you understand what examiners are looking for, 
                improve your answer technique, and maximize your marks in exams.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}