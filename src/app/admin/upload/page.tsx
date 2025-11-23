"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Upload,
  FileText,
  X,
  AlertCircle,
  CheckCircle,
} from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"

interface FileUpload {
  file: File
  id: string
  progress: number
  status: "pending" | "uploading" | "success" | "error"
  error?: string
}

export default function UploadPage() {
  const [files, setFiles] = useState<FileUpload[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    subject: "",
    year: "",
    paperNumber: "",
    isPublic: true,
  })

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || [])
    
    const newFiles: FileUpload[] = selectedFiles.map(file => ({
      file,
      id: Math.random().toString(36).substr(2, 9),
      progress: 0,
      status: "pending",
    }))
    
    setFiles(prev => [...prev, ...newFiles])
  }

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id))
  }

  const handleUpload = async () => {
    if (files.length === 0) return

    setIsUploading(true)
    setUploadProgress(0)

    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      setUploadProgress(i)
      await new Promise(resolve => setTimeout(resolve, 200))
    }

    // Simulate file processing
    setFiles(prev => prev.map(f => ({ ...f, status: "uploading" })))
    
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    setFiles(prev => prev.map(f => ({ ...f, status: "success" })))
    setIsUploading(false)
  }

  const clearAll = () => {
    setFiles([])
    setUploadProgress(0)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Upload Resources</h1>
        <p className="text-gray-600">Add new study materials to the platform</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Upload Form */}
        <Card>
          <CardHeader>
            <CardTitle>Resource Information</CardTitle>
            <CardDescription>
              Enter details about the resource you're uploading
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Enter resource title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter resource description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PAST_PAPER">Past Paper</SelectItem>
                    <SelectItem value="MARK_SCHEME">Mark Scheme</SelectItem>
                    <SelectItem value="EXAMINER_REPORT">Examiner Report</SelectItem>
                    <SelectItem value="SYLLABUS">Syllabus</SelectItem>
                    <SelectItem value="NOTES">Notes</SelectItem>
                    <SelectItem value="BOOK">Book</SelectItem>
                    <SelectItem value="EXTRA_MATERIALS">Extra Materials</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Select value={formData.subject} onValueChange={(value) => setFormData(prev => ({ ...prev, subject: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="9701">Chemistry (9701)</SelectItem>
                    <SelectItem value="9702">Physics (9702)</SelectItem>
                    <SelectItem value="9700">Biology (9700)</SelectItem>
                    <SelectItem value="9609">Business (9609)</SelectItem>
                    <SelectItem value="9618">IT (9618)</SelectItem>
                    <SelectItem value="9709">Mathematics (9709)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="year">Year</Label>
                <Input
                  id="year"
                  type="number"
                  placeholder="2024"
                  value={formData.year}
                  onChange={(e) => setFormData(prev => ({ ...prev, year: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="paperNumber">Paper Number</Label>
                <Input
                  id="paperNumber"
                  placeholder="41, 42, etc."
                  value={formData.paperNumber}
                  onChange={(e) => setFormData(prev => ({ ...prev, paperNumber: e.target.value }))}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isPublic"
                checked={formData.isPublic}
                onChange={(e) => setFormData(prev => ({ ...prev, isPublic: e.target.checked }))}
                className="rounded border-gray-300"
              />
              <Label htmlFor="isPublic">Make publicly available</Label>
            </div>
          </CardContent>
        </Card>

        {/* File Upload */}
        <Card>
          <CardHeader>
            <CardTitle>Upload Files</CardTitle>
            <CardDescription>
              Select files to upload (PDF, DOC, DOCX, etc.)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <div className="space-y-2">
                <p className="text-sm text-gray-600">
                  Drag and drop files here, or click to select
                </p>
                <p className="text-xs text-gray-500">
                  Supported formats: PDF, DOC, DOCX, PPT, PPTX (Max 50MB)
                </p>
              </div>
              <Input
                type="file"
                multiple
                accept=".pdf,.doc,.docx,.ppt,.pptx"
                onChange={handleFileSelect}
                className="mt-4"
              />
            </div>

            {files.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label>Selected Files ({files.length})</Label>
                  <Button variant="outline" size="sm" onClick={clearAll}>
                    Clear All
                  </Button>
                </div>
                
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {files.map((fileUpload) => (
                    <div key={fileUpload.id} className="flex items-center justify-between p-2 border rounded">
                      <div className="flex items-center space-x-2">
                        <FileText className="h-4 w-4" />
                        <span className="text-sm truncate">{fileUpload.file.name}</span>
                        <span className="text-xs text-gray-500">
                          ({(fileUpload.file.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        {fileUpload.status === "success" && (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        )}
                        {fileUpload.status === "error" && (
                          <AlertCircle className="h-4 w-4 text-red-600" />
                        )}
                        {fileUpload.status === "uploading" && (
                          <div className="w-16">
                            <Progress value={fileUpload.progress} className="h-2" />
                          </div>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(fileUpload.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {isUploading && (
              <div className="space-y-2">
                <Label>Uploading...</Label>
                <Progress value={uploadProgress} className="w-full" />
              </div>
            )}

            <div className="flex space-x-2">
              <Button
                onClick={handleUpload}
                disabled={files.length === 0 || isUploading}
                className="flex-1"
              >
                {isUploading ? "Uploading..." : "Upload Files"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Auto-categorization Info */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Auto-categorization:</strong> Files will be automatically organized by subject and year 
          if the filename includes subject codes (e.g., "9701 Chem 2019 Paper 41").
        </AlertDescription>
      </Alert>
    </div>
  )
}