import { useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Upload, File, Image, CheckCircle, X, Camera, FileText, Loader2 } from 'lucide-react';

interface FileUploadProps {
  language: 'en' | 'sw';
}

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  progress: number;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  extractedText?: string;
}

export default function FileUpload({ language }: FileUploadProps) {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const content = {
    en: {
      title: "Upload Study Materials",
      description: "Upload your notes, past papers, or images for AI analysis",
      dragText: "Drag and drop files here, or click to browse",
      supportedFormats: "Supported: PDF, DOC, TXT, JPG, PNG",
      ocrProcessing: "OCR Processing",
      textExtracted: "Text Extracted",
      uploadProgress: "Upload Progress",
      processing: "Processing...",
      completed: "Completed",
      error: "Error",
      removeFile: "Remove file",
      startAnalysis: "Start AI Analysis"
    },
    sw: {
      title: "Pakia Vifaa vya Masomo",
      description: "Pakia maandishi yako, karatasi za zamani, au picha kwa uchambuzi wa AI",
      dragText: "Buruta na udondoshe faili hapa, au bofya kuchunguza",
      supportedFormats: "Zinazotumika: PDF, DOC, TXT, JPG, PNG",
      ocrProcessing: "Uchakataji wa OCR",
      textExtracted: "Maandishi Yameondolewa",
      uploadProgress: "Maendeleo ya Kupakia",
      processing: "Inachakata...",
      completed: "Imekamilika",
      error: "Hitilafu",
      removeFile: "Ondoa faili",
      startAnalysis: "Anza Uchambuzi wa AI"
    }
  };

  const currentContent = content[language];

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  }, []);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      handleFiles(selectedFiles);
    }
  }, []);

  const handleFiles = (fileList: File[]) => {
    fileList.forEach((file) => {
      const uploadedFile: UploadedFile = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        type: file.type,
        progress: 0,
        status: 'uploading'
      };

      setFiles(prev => [...prev, uploadedFile]);

      // Simulate file upload and processing
      simulateFileProcessing(uploadedFile.id, file);
    });
  };

  const simulateFileProcessing = async (fileId: string, file: File) => {
    // Simulate upload progress
    for (let progress = 0; progress <= 100; progress += 10) {
      await new Promise(resolve => setTimeout(resolve, 100));
      setFiles(prev => prev.map(f => 
        f.id === fileId ? { ...f, progress } : f
      ));
    }

    // Change to processing status
    setFiles(prev => prev.map(f => 
      f.id === fileId ? { ...f, status: 'processing' } : f
    ));

    // Simulate OCR processing for images
    if (file.type.startsWith('image/')) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const sampleExtractedText = language === 'en' 
        ? "Sample extracted text from image:\n\nChapter 5: Quadratic Equations\n\nA quadratic equation is an equation of the form ax² + bx + c = 0, where a ≠ 0.\n\nExample: Solve x² - 5x + 6 = 0\nSolution: (x - 2)(x - 3) = 0\nTherefore, x = 2 or x = 3"
        : "Maandishi ya mfano yaliyoondolewa kutoka picha:\n\nSura ya 5: Mlinganyo wa Quadratic\n\nMlinganyo wa quadratic ni mlinganyo wa aina ya ax² + bx + c = 0, ambapo a ≠ 0.\n\nMfano: Tatua x² - 5x + 6 = 0\nSuluhisho: (x - 2)(x - 3) = 0\nKwa hiyo, x = 2 au x = 3";

      setFiles(prev => prev.map(f => 
        f.id === fileId ? { 
          ...f, 
          status: 'completed',
          extractedText: sampleExtractedText
        } : f
      ));
    } else {
      // For other file types, just mark as completed
      await new Promise(resolve => setTimeout(resolve, 1000));
      setFiles(prev => prev.map(f => 
        f.id === fileId ? { ...f, status: 'completed' } : f
      ));
    }
  };

  const removeFile = (fileId: string) => {
    setFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return <Image className="h-5 w-5" />;
    return <FileText className="h-5 w-5" />;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'uploading':
        return <Loader2 className="h-4 w-4 animate-spin text-blue-500" />;
      case 'processing':
        return <Loader2 className="h-4 w-4 animate-spin text-orange-500" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <X className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <Card className="bg-white/80 backdrop-blur-sm border-0">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Upload className="h-5 w-5 text-green-600" />
            <span>{currentContent.title}</span>
          </CardTitle>
          <p className="text-gray-600">{currentContent.description}</p>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging
                ? 'border-green-500 bg-green-50'
                : 'border-gray-300 hover:border-green-400'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-lg font-medium text-gray-700 mb-2">
              {currentContent.dragText}
            </p>
            <p className="text-sm text-gray-500 mb-4">
              {currentContent.supportedFormats}
            </p>
            <input
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.txt,.jpg,.jpeg,.png"
              onChange={handleFileInput}
              className="hidden"
              id="file-upload"
            />
            <Button asChild className="bg-green-600 hover:bg-green-700">
              <label htmlFor="file-upload" className="cursor-pointer">
                <File className="h-4 w-4 mr-2" />
                Browse Files
              </label>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Uploaded Files */}
      {files.length > 0 && (
        <Card className="bg-white/80 backdrop-blur-sm border-0">
          <CardHeader>
            <CardTitle>{currentContent.uploadProgress}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {files.map((file) => (
              <div key={file.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {getFileIcon(file.type)}
                    <div>
                      <p className="font-medium text-gray-900">{file.name}</p>
                      <p className="text-sm text-gray-500">{formatFileSize(file.size)}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(file.status)}
                    <Badge variant="secondary">
                      {file.status === 'uploading' && currentContent.processing}
                      {file.status === 'processing' && currentContent.ocrProcessing}
                      {file.status === 'completed' && currentContent.completed}
                      {file.status === 'error' && currentContent.error}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(file.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {file.status === 'uploading' && (
                  <Progress value={file.progress} className="w-full" />
                )}

                {file.extractedText && (
                  <div className="mt-3 p-3 bg-green-50 rounded-lg">
                    <div className="flex items-center space-x-2 mb-2">
                      <Camera className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-medium text-green-800">
                        {currentContent.textExtracted}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">
                      {file.extractedText}
                    </p>
                  </div>
                )}
              </div>
            ))}

            {files.some(f => f.status === 'completed') && (
              <Button className="w-full bg-green-600 hover:bg-green-700">
                <Camera className="h-4 w-4 mr-2" />
                {currentContent.startAnalysis}
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}