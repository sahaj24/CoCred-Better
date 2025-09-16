"use client";

import React, { useState, useCallback } from 'react';
import { FileDropzone } from '@/components/ui/file-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, AlertCircle, Upload as UploadIcon } from 'lucide-react';
import { uploadFile } from '@/lib/file-upload';
import { useAuth } from '@/lib/auth-context';

interface FileWithPreview extends File {
  preview?: string;
  id: string;
  validation: { isValid: boolean; error?: string };
  uploadProgress?: number;
  uploadStatus?: 'pending' | 'uploading' | 'success' | 'error';
  uploadError?: string;
  uploadedPath?: string;
}

export function UploadPage() {
  const { user } = useAuth();
  const [selectedFiles, setSelectedFiles] = useState<FileWithPreview[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadResults, setUploadResults] = useState<{
    successful: number;
    failed: number;
    errors: string[];
  } | null>(null);

  const handleFilesSelected = useCallback((files: FileWithPreview[]) => {
    setSelectedFiles(prev => [...prev, ...files]);
    setUploadResults(null);
  }, []);

  const handleFileRemove = useCallback((fileId: string) => {
    setSelectedFiles(prev => prev.filter(file => file.id !== fileId));
  }, []);

  const updateFileProgress = useCallback((fileId: string, progress: number) => {
    setSelectedFiles(prev => 
      prev.map(file => 
        file.id === fileId 
          ? { ...file, uploadProgress: progress, uploadStatus: 'uploading' as const }
          : file
      )
    );
  }, []);

  const updateFileStatus = useCallback((fileId: string, status: 'success' | 'error', error?: string, uploadedPath?: string) => {
    setSelectedFiles(prev => 
      prev.map(file => 
        file.id === fileId 
          ? { 
              ...file, 
              uploadStatus: status, 
              uploadError: error,
              uploadedPath,
              uploadProgress: status === 'success' ? 100 : file.uploadProgress
            }
          : file
      )
    );
  }, []);

  const handleUploadAll = async () => {
    if (!user) {
      alert('You must be logged in to upload files');
      return;
    }

    const validFiles = selectedFiles.filter(file => file.validation.isValid);
    if (validFiles.length === 0) {
      alert('No valid files to upload');
      return;
    }

    setIsUploading(true);
    setUploadResults(null);

    let successful = 0;
    let failed = 0;
    const errors: string[] = [];

    for (const file of validFiles) {
      try {
        // Set file to uploading status
        updateFileStatus(file.id, 'success'); // Temporarily set to success for progress
        updateFileProgress(file.id, 0);

        const result = await uploadFile(
          file,
          user.id,
          (progress) => updateFileProgress(file.id, progress)
        );

        if (result.success && result.data) {
          updateFileStatus(file.id, 'success', undefined, result.data.path);
          successful++;
        } else {
          throw new Error(result.error || 'Upload failed');
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Upload failed';
        updateFileStatus(file.id, 'error', errorMessage);
        errors.push(`${file.name}: ${errorMessage}`);
        failed++;
      }
    }

    setUploadResults({ successful, failed, errors });
    setIsUploading(false);
  };

  const handleClearAll = () => {
    // Revoke object URLs to prevent memory leaks
    selectedFiles.forEach(file => {
      if (file.preview) {
        URL.revokeObjectURL(file.preview);
      }
    });
    setSelectedFiles([]);
    setUploadResults(null);
  };

  const validFilesCount = selectedFiles.filter(file => file.validation.isValid).length;
  const hasValidFiles = validFilesCount > 0;
  const allFilesUploaded = selectedFiles.length > 0 && selectedFiles.every(file => 
    !file.validation.isValid || file.uploadStatus === 'success' || file.uploadStatus === 'error'
  );

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Upload Documents</h1>
        <p className="text-gray-600">
          Upload your academic documents, certificates, and other files
        </p>
      </div>

      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UploadIcon className="h-5 w-5" />
            Select Files
          </CardTitle>
          <CardDescription>
            Drag and drop files or click to browse. Supported formats: PDF, DOC, DOCX, TXT, JPG, PNG
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FileDropzone
            onFilesSelected={handleFilesSelected}
            onFileRemove={handleFileRemove}
            selectedFiles={selectedFiles}
            maxFiles={10}
            disabled={isUploading}
          />
        </CardContent>
      </Card>

      {/* Upload Actions */}
      {selectedFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Upload Actions</CardTitle>
            <CardDescription>
              {validFilesCount} valid file{validFilesCount !== 1 ? 's' : ''} ready to upload
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Button
                onClick={handleUploadAll}
                disabled={!hasValidFiles || isUploading}
                className="flex-1"
              >
                {isUploading ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <UploadIcon className="h-4 w-4 mr-2" />
                    Upload All Files ({validFilesCount})
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={handleClearAll}
                disabled={isUploading}
              >
                Clear All
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Upload Progress */}
      {isUploading && (
        <Card>
          <CardHeader>
            <CardTitle>Upload Progress</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedFiles
              .filter(file => file.validation.isValid)
              .map(file => (
                <div key={file.id} className="mb-4 last:mb-0">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium truncate">{file.name}</span>
                    <span className="text-sm text-gray-500">
                      {file.uploadProgress || 0}%
                    </span>
                  </div>
                  <Progress value={file.uploadProgress || 0} className="h-2" />
                </div>
              ))
            }
          </CardContent>
        </Card>
      )}

      {/* Upload Results */}
      {uploadResults && allFilesUploaded && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {uploadResults.failed === 0 ? (
                <CheckCircle2 className="h-5 w-5 text-green-600" />
              ) : (
                <AlertCircle className="h-5 w-5 text-yellow-600" />
              )}
              Upload Complete
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {uploadResults.successful > 0 && (
                <Alert>
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription>
                    Successfully uploaded {uploadResults.successful} file{uploadResults.successful !== 1 ? 's' : ''}
                  </AlertDescription>
                </Alert>
              )}

              {uploadResults.failed > 0 && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Failed to upload {uploadResults.failed} file{uploadResults.failed !== 1 ? 's' : ''}:
                    <ul className="list-disc list-inside mt-2 space-y-1">
                      {uploadResults.errors.map((error, index) => (
                        <li key={index} className="text-sm">{error}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex gap-4">
                <Button onClick={handleClearAll} variant="outline">
                  Clear All Files
                </Button>
                {uploadResults.successful > 0 && (
                  <Button onClick={() => window.location.reload()}>
                    Upload More Files
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}