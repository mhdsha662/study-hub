"use client"

import { useState, useRef, useEffect } from "react"
import { Navigation } from "@/components/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
import { Badge } from "@/components/ui/badge"
import {
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  Plus,
  Trash2,
} from "lucide-react"

interface Subject {
  id: string
  code: string
  name: string
  level: "IGCSE" | "AS_LEVEL" | "A_LEVEL"
}

interface UploadResult {
  success: boolean
  message: string
  resource?: any
}

export default function AdminPage() {
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null)
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null)
  const [newSubjectName, setNewSubjectName] = useState("")
  const [newSubjectCode, setNewSubjectCode] = useState("")
  const [newSubjectLevel, setNewSubjectLevel] = useState<"IGCSE" | "AS_LEVEL" | "A_LEVEL">("IGCSE")
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [uploadResults, setUploadResults] = useState<UploadResult[]>([])
  const [showNewSubjectForm, setShowNewSubjectForm] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const levels = ["IGCSE", "AS_LEVEL", "A_LEVEL"]

  useEffect(() => {
    fetchSubjects()
  }, [])

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

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || [])
    setFiles(prev => [...prev, ...selectedFiles])
  }

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index))
  }

  const createNewSubject = async () => {
    if (!newSubjectName || !newSubjectCode) return

    try {
      const response = await fetch("/api/subjects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: newSubjectName,
          code: newSubjectCode,
          level: newSubjectLevel,
        }),
      })

      if (response.ok) {
        const newSubject = await response.json()
        setSubjects(prev => [...prev, newSubject])
        setSelectedSubject(newSubject.id)
        setNewSubjectName("")
        setNewSubjectCode("")
        setShowNewSubjectForm(false)
      }
    } catch (error) {
      console.error("Error creating subject:", error)
    }
  }

  const uploadFiles = async () => {
    if (files.length === 0 || !selectedSubject) return

    setUploading(true)
    setUploadResults([])

    const results: UploadResult[] = []

    for (const file of files) {
      try {
        const formData = new FormData()
        formData.append("file", file)
        formData.append("subjectId", selectedSubject)
        formData.append("category", "PAST_PAPER")

        // Extract metadata from filename
        const filename = file.name.toLowerCase()
        const yearMatch = filename.match(/(20\d{2})/)
        const paperMatch = filename.match(/_qp_(\d+)/)

        if (yearMatch) {
          formData.append("year", yearMatch[1])
        }
        if (paperMatch) {
          formData.append("paperNumber", paperMatch[1])
        }

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        const result = await response.json()

        if (response.ok) {
          results.push({
            success: true,
            message: `Successfully uploaded ${file.name}`,
            resource: result,
          })
        } else {
          results.push({
            success: false,
            message: `Failed to upload ${file.name}: ${result.error}`,
          })
        }
      } catch (error) {
        results.push({
          success: false,
          message: `Failed to upload ${file.name}: ${error}`,
        })
      }
    }

    setUploadResults(results)
    setUploading(false)
    setFiles([])
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const parseFilename = (filename: string) => {
    const match = filename.match(/(\d{4})_(s|w|m)(\d{2})_qp_(\d+)\.pdf/)
    if (match) {
      const [, year, season, yearSuffix, paperNumber] = match
      return {
        year: parseInt(year),
        season: season === 's' ? 'Summer' : season === 'w' ? 'Winter' : 'March',
        paperNumber,
        originalName: filename
      }
    }
    return { originalName: filename }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Upload and manage Cambridge past papers
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Subject Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Subject Selection</CardTitle>
              <CardDescription>
                Select an existing subject or create a new one
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="level">Level</Label>
                <Select value={selectedLevel || "all"} onValueChange={(value) => setSelectedLevel(value === "all" ? null : value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Levels" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Levels</SelectItem>
                    {levels.map((level) => (
                      <SelectItem key={level} value={level}>
                        {level.replace('_', ' ')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="subject">Subject</Label>
                <Select value={selectedSubject || "all"} onValueChange={(value) => setSelectedSubject(value === "all" ? null : value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects
                      .filter(s => !selectedLevel || s.level === selectedLevel)
                      .map((subject) => (
                        <SelectItem key={subject.id} value={subject.id}>
                          {subject.name} ({subject.code})
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>

              <Button
                variant="outline"
                onClick={() => setShowNewSubjectForm(!showNewSubjectForm)}
                className="w-full"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create New Subject
              </Button>

              {showNewSubjectForm && (
                <div className="border rounded-lg p-4 space-y-4">
                  <div>
                    <Label htmlFor="newSubjectName">Subject Name</Label>
                    <Input
                      id="newSubjectName"
                      value={newSubjectName}
                      onChange={(e) => setNewSubjectName(e.target.value)}
                      placeholder="e.g., Chemistry"
                    />
                  </div>
                  <div>
                    <Label htmlFor="newSubjectCode">Subject Code</Label>
                    <Input
                      id="newSubjectCode"
                      value={newSubjectCode}
                      onChange={(e) => setNewSubjectCode(e.target.value)}
                      placeholder="e.g., 9701"
                    />
                  </div>
                  <div>
                    <Label htmlFor="newSubjectLevel">Level</Label>
                    <Select value={newSubjectLevel} onValueChange={(value: any) => setNewSubjectLevel(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="IGCSE">IGCSE</SelectItem>
                        <SelectItem value="AS_LEVEL">AS Level</SelectItem>
                        <SelectItem value="A_LEVEL">A Level</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={createNewSubject} className="w-full">
                    Create Subject
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* File Upload */}
          <Card>
            <CardHeader>
              <CardTitle>Upload Past Papers</CardTitle>
              <CardDescription>
                Select PDF files to upload as past papers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="files">Select Files</Label>
                <Input
                  ref={fileInputRef}
                  id="files"
                  type="file"
                  multiple
                  accept=".pdf"
                  onChange={handleFileSelect}
                  className="cursor-pointer"
                />
              </div>

              {files.length > 0 && (
                <div className="space-y-2">
                  <Label>Selected Files ({files.length})</Label>
                  <div className="max-h-40 overflow-y-auto space-y-1">
                    {files.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <div className="flex items-center space-x-2">
                          <FileText className="h-4 w-4 text-blue-600" />
                          <span className="text-sm">{file.name}</span>
                          <Badge variant="outline" className="text-xs">
                            {(file.size / 1024 / 1024).toFixed(2)} MB
                          </Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFile(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <Button
                onClick={uploadFiles}
                disabled={files.length === 0 || !selectedSubject || uploading}
                className="w-full"
              >
                <Upload className="mr-2 h-4 w-4" />
                {uploading ? "Uploading..." : "Upload Files"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Upload Results */}
        {uploadResults.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Upload Results</CardTitle>
              <CardDescription>
                Status of uploaded files
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {uploadResults.map((result, index) => (
                  <div key={index} className="flex items-center space-x-2 p-2 rounded">
                    {result.success ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <AlertCircle className="h-5 w-5 text-red-600" />
                    )}
                    <span className={result.success ? "text-green-700" : "text-red-700"}>
                      {result.message}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* File Naming Guide */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>File Naming Convention</CardTitle>
            <CardDescription>
              For automatic metadata extraction, use Cambridge's naming format
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <p><strong>Format:</strong> [SUBJECT_CODE]_[SEASON][YEAR]_qp_[PAPER_NUMBER].pdf</p>
              <p><strong>Examples:</strong></p>
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>9701_s24_qp_11.pdf (Chemistry AS Level Paper 1, 2024)</li>
                <li>9701_s24_qp_31.pdf (Chemistry A Level Paper 3, 2024)</li>
                <li>0620_s23_qp_22.pdf (Chemistry IGCSE Paper 2, 2023)</li>
              </ul>
              <p className="text-gray-600 mt-2">
                The system will automatically extract year, season, and paper number from filenames following this pattern.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}