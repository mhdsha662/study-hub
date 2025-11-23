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
  TrendingUp,
  AlertCircle,
  CheckCircle,
} from "lucide-react"

export default function ExaminerReportsPage() {
  // Mock data - in real app this would come from API
  const reports = [
    {
      id: "1",
      title: "9701 Chemistry AS Level Examiner Report",
      subject: "Chemistry",
      code: "9701",
      level: "AS Level",
      year: 2024,
      session: "May/June",
      keyFindings: "Strong performance in organic chemistry, weaker in physical chemistry",
      downloads: 567,
    },
    {
      id: "2",
      title: "9701 Chemistry A Level Examiner Report",
      subject: "Chemistry",
      code: "9701",
      level: "A Level",
      year: 2024,
      session: "May/June",
      keyFindings: "Good understanding of concepts, need improvement in practical skills",
      downloads: 432,
    },
    {
      id: "3",
      title: "0620 Chemistry IGCSE Examiner Report",
      subject: "Chemistry",
      code: "0620",
      level: "IGCSE",
      year: 2023,
      session: "October/November",
      keyFindings: "Overall satisfactory performance, areas for improvement identified",
      downloads: 789,
    },
    {
      id: "4",
      title: "9702 Physics AS Level Examiner Report",
      subject: "Physics",
      code: "9702",
      level: "AS Level",
      year: 2024,
      session: "May/June",
      keyFindings: "Strong mathematical skills, weaker in conceptual understanding",
      downloads: 345,
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Examiner Reports
          </h1>
          <p className="text-gray-600">
            Detailed reports on exam performance and common mistakes
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search examiner reports..."
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
                  <p className="text-2xl font-bold">900+</p>
                  <p className="text-gray-600">Reports</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <TrendingUp className="h-8 w-8 text-green-600 mr-3" />
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
                <AlertCircle className="h-8 w-8 text-orange-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold">500+</p>
                  <p className="text-gray-600">Key Findings</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Calendar className="h-8 w-8 text-purple-600 mr-3" />
                <div>
                  <p className="text-2xl font-bold">10</p>
                  <p className="text-gray-600">Years</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reports.map((report) => (
            <Card key={report.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg leading-tight">{report.title}</CardTitle>
                    <CardDescription>
                      {report.subject} • {report.level}
                    </CardDescription>
                  </div>
                  <Badge variant="secondary">{report.year}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 mb-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Code:</span>
                      <span className="ml-1 font-medium">{report.code}</span>
                    </div>
                    <div>
                      <span className="text-gray-500">Session:</span>
                      <span className="ml-1 font-medium">{report.session}</span>
                    </div>
                  </div>
                  <div className="bg-yellow-50 p-3 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <AlertCircle className="h-4 w-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-yellow-800 mb-1">Key Findings:</p>
                        <p className="text-sm text-yellow-700">{report.keyFindings}</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    <span className="font-medium">Downloads:</span> {report.downloads}
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
        <div className="mt-12 bg-purple-50 rounded-lg p-6">
          <div className="flex items-start">
            <TrendingUp className="h-6 w-6 text-purple-600 mr-3 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-purple-900 mb-2">
                About Examiner Reports
              </h3>
              <p className="text-purple-800 mb-3">
                Examiner reports provide valuable insights into student performance in Cambridge exams. 
                They include analysis of common mistakes, areas of strength and weakness, and 
                recommendations for improvement.
              </p>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-purple-800">Identify common errors and misconceptions</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-purple-800">Understand marking standards and expectations</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span className="text-purple-800">Get tips for improving exam performance</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}