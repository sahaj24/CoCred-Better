"use client";

import { useState } from 'react';
import { FacultyLayout } from '@/components/layouts/FacultyLayout';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Upload, FileText, X, CheckCircle2 } from 'lucide-react';

export default function BatchUploadPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(event.target.files || []);
    setFiles(prev => [...prev, ...selectedFiles]);
  };

  const handleRemoveFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    // TODO: connect API - Implement actual upload logic
    setUploading(true);
    setUploadProgress(0);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setUploading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <ProtectedRoute requiredUserType="authority">
      <FacultyLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">Batch Upload</h1>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Upload Zone */}
            <Card>
              <CardHeader>
                <CardTitle>Upload Files</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div 
                    className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center hover:border-muted-foreground/50 transition-colors cursor-pointer"
                    onClick={() => document.getElementById('file-input')?.click()}
                  >
                    <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Drop files here or click to browse</h3>
                    <p className="text-muted-foreground">
                      Support for CSV, Excel, and PDF files up to 10MB each
                    </p>
                    <input
                      id="file-input"
                      type="file"
                      multiple
                      accept=".csv,.xlsx,.xls,.pdf"
                      onChange={handleFileSelect}
                      className="hidden"
                      aria-label="Select files to upload"
                    />
                  </div>

                  {files.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium">Selected Files</h4>
                      <div className="space-y-2 max-h-40 overflow-y-auto">
                        {files.map((file, index) => (
                          <div key={index} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                            <FileText className="h-4 w-4 text-muted-foreground" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium truncate">{file.name}</p>
                              <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveFile(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {files.length > 0 && (
                    <Button 
                      onClick={handleUpload} 
                      disabled={uploading}
                      className="w-full"
                    >
                      {uploading ? 'Uploading...' : `Upload ${files.length} file${files.length > 1 ? 's' : ''}`}
                    </Button>
                  )}

                  {uploading && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Upload Progress</span>
                        <span>{uploadProgress}%</span>
                      </div>
                      <Progress value={uploadProgress} className="w-full" />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Upload History */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Uploads</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {/* TODO: connect API - Replace with actual upload history */}
                  {[
                    { name: "student_data_batch_1.csv", date: "2024-01-15", status: "completed", records: 150 },
                    { name: "grade_records.xlsx", date: "2024-01-14", status: "completed", records: 89 },
                    { name: "attendance_data.csv", date: "2024-01-13", status: "failed", records: 0 },
                  ].map((upload, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                      <div className="flex-shrink-0">
                        {upload.status === 'completed' ? (
                          <CheckCircle2 className="h-5 w-5 text-green-600" />
                        ) : (
                          <X className="h-5 w-5 text-red-600" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{upload.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {upload.date} • {upload.records} records
                        </p>
                      </div>
                      <Button variant="ghost" size="sm">
                        View
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Instructions */}
          <Card>
            <CardHeader>
              <CardTitle>Upload Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Supported file formats: CSV, Excel (.xlsx, .xls), PDF</li>
                  <li>• Maximum file size: 10MB per file</li>
                  <li>• CSV files should include headers in the first row</li>
                  <li>• For student data, required columns: Name, ID, Email</li>
                  <li>• For grade data, required columns: Student ID, Course Code, Grade</li>
                  <li>• Files will be processed automatically after upload</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </FacultyLayout>
    </ProtectedRoute>
  );
}