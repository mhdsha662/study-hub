"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Download,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  X,
  Loader2,
  ExternalLink
} from "lucide-react"

interface PDFViewerProps {
  url: string
  title: string
  onClose: () => void
  onDownload: () => void
}

export default function PDFViewer({ url, title, onClose, onDownload }: PDFViewerProps) {
  const [scale, setScale] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Reset state when URL changes
    setScale(1)
    setRotation(0)
    setLoading(true)
    setError(null)
  }, [url])

  const handleLoad = () => {
    setLoading(false)
    setError(null)
  }

  const handleError = () => {
    setLoading(false)
    setError("Failed to load PDF. Please try downloading the file instead.")
  }

  const zoomIn = () => setScale(prev => Math.min(prev + 0.25, 3))
  const zoomOut = () => setScale(prev => Math.max(prev - 0.25, 0.5))
  const resetZoom = () => setScale(1)
  const rotate = () => setRotation(prev => (prev + 90) % 360)

  const transformStyle = {
    transform: `scale(${scale}) rotate(${rotation}deg)`,
    transformOrigin: 'center center',
    transition: 'transform 0.3s ease'
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-6xl h-full max-h-[90vh] flex flex-col">
        <CardHeader className="flex-shrink-0 pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg truncate">{title}</CardTitle>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={zoomOut}
                disabled={scale <= 0.5}
              >
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-sm text-gray-600 min-w-[3rem] text-center">
                {Math.round(scale * 100)}%
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={zoomIn}
                disabled={scale >= 3}
              >
                <ZoomIn className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={resetZoom}
              >
                <RotateCcw className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={rotate}
              >
                Rotate
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => window.open(url, '_blank')}
                title="Open in new tab"
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onDownload}
              >
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="flex-1 overflow-auto p-0">
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            {loading && (
              <div className="flex flex-col items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600 mb-2" />
                <p className="text-gray-600">Loading PDF...</p>
              </div>
            )}

            {error && (
              <div className="text-center p-8">
                <p className="text-red-600 mb-4">{error}</p>
                <Button onClick={onDownload}>
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF Instead
                </Button>
              </div>
            )}

            {!loading && !error && (
              <div style={transformStyle} className="max-w-full max-h-full">
                <object
                  data={url}
                  type="application/pdf"
                  width="100%"
                  height="100%"
                  onLoad={handleLoad}
                  onError={handleError}
                  className="max-w-full max-h-full"
                >
                  <div className="text-center p-8">
                    <p className="text-gray-600 mb-4">
                      PDF viewer not supported in your browser.
                    </p>
                    <Button onClick={onDownload}>
                      <Download className="h-4 w-4 mr-2" />
                      Download PDF
                    </Button>
                  </div>
                </object>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}