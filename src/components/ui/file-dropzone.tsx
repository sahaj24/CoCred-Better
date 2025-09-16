"use client";

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { validateFile, getFileMetadata, formatFileSize, getFileIcon, UPLOAD_CONFIG } from '@/lib/file-upload';

interface FileWithPreview extends File {
  preview?: string;
  id: string;
  validation: { isValid: boolean; error?: string };
  uploadProgress?: number;
  uploadStatus?: 'pending' | 'uploading' | 'success' | 'error';
  uploadError?: string;
}

interface FileDropzoneProps {
  onFilesSelected: (files: FileWithPreview[]) => void;
  onFileRemove: (fileId: string) => void;
  selectedFiles: FileWithPreview[];
  maxFiles?: number;
  disabled?: boolean;
}

export function FileDropzone({ 
  onFilesSelected, 
  onFileRemove, 
  selectedFiles, 
  maxFiles = 10,
  disabled = false 
}: FileDropzoneProps) {
  const [dragError, setDragError] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    setDragError(null);

    // Handle rejected files
    if (rejectedFiles.length > 0) {
      const errors = rejectedFiles.map(({ file, errors }) => 
        `${file.name}: ${errors.map((e: any) => e.message).join(', ')}`
      ).join('\n');
      setDragError(errors);
      return;
    }

    // Check if adding files would exceed max limit
    if (selectedFiles.length + acceptedFiles.length > maxFiles) {
      setDragError(`Cannot upload more than ${maxFiles} files at once`);
      return;
    }

    // Process accepted files
    const filesWithPreview: FileWithPreview[] = acceptedFiles.map((file, index) => {
      const validation = validateFile(file);
      const fileWithMeta = Object.assign(file, {
        id: `${Date.now()}-${index}`,
        preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
        validation,
        uploadStatus: 'pending' as const,
        uploadProgress: 0
      });
      
      return fileWithMeta;
    });

    onFilesSelected(filesWithPreview);
  }, [selectedFiles.length, maxFiles, onFilesSelected]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.jpeg', '.jpg', '.png'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/plain': ['.txt']
    },
    maxSize: UPLOAD_CONFIG.MAX_FILE_SIZE,
    maxFiles,
    disabled
  });

  const removeFile = (fileId: string) => {
    const file = selectedFiles.find(f => f.id === fileId);
    if (file?.preview) {
      URL.revokeObjectURL(file.preview);
    }
    onFileRemove(fileId);
  };

  return (
    <div className="space-y-4">
      {/* Dropzone */}
      <Card 
        {...getRootProps()} 
        className={`
          p-8 border-2 border-dashed cursor-pointer transition-all duration-200
          ${isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
          ${isDragReject ? 'border-red-500 bg-red-50' : ''}
          ${disabled ? 'cursor-not-allowed opacity-50' : 'hover:border-blue-400 hover:bg-gray-50'}
        `}
      >
        <input {...getInputProps()} />
        <div className="text-center">
          <Upload className={`mx-auto h-12 w-12 mb-4 ${isDragActive ? 'text-blue-500' : 'text-gray-400'}`} />
          <div className="text-lg font-medium text-gray-900 mb-2">
            {isDragActive ? 'Drop files here...' : 'Upload your documents'}
          </div>
          <p className="text-gray-500 mb-4">
            Drag and drop files here, or click to browse
          </p>
          <div className="text-sm text-gray-400">
            <p>Supported formats: PDF, DOC, DOCX, TXT, JPG, PNG</p>
            <p>Maximum file size: {formatFileSize(UPLOAD_CONFIG.MAX_FILE_SIZE)}</p>
            <p>Maximum {maxFiles} files at once</p>
          </div>
        </div>
      </Card>

      {/* Error Messages */}
      {dragError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{dragError}</AlertDescription>
        </Alert>
      )}

      {/* Selected Files */}
      {selectedFiles.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-medium text-gray-900">
            Selected Files ({selectedFiles.length})
          </h3>
          {selectedFiles.map((file) => (
            <FilePreview
              key={file.id}
              file={file}
              onRemove={removeFile}
              disabled={disabled}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface FilePreviewProps {
  file: FileWithPreview;
  onRemove: (fileId: string) => void;
  disabled?: boolean;
}

function FilePreview({ file, onRemove, disabled }: FilePreviewProps) {
  const metadata = getFileMetadata(file);
  const fileIcon = getFileIcon(file?.type || '');

  const getStatusColor = () => {
    switch (file.uploadStatus) {
      case 'success': return 'text-green-600';
      case 'error': return 'text-red-600';
      case 'uploading': return 'text-blue-600';
      default: return 'text-gray-600';
    }
  };

  const getStatusIcon = () => {
    switch (file.uploadStatus) {
      case 'success': return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'error': return <AlertCircle className="h-4 w-4 text-red-600" />;
      case 'uploading': return <div className="animate-spin h-4 w-4 border-2 border-blue-600 border-t-transparent rounded-full" />;
      default: return <FileText className="h-4 w-4 text-gray-400" />;
    }
  };

  return (
    <Card className="p-4">
      <div className="flex items-center space-x-4">
        {/* File Icon/Preview */}
        <div className="flex-shrink-0">
          {file.preview ? (
            <img
              src={file.preview}
              alt={file.name}
              className="h-12 w-12 object-cover rounded"
              onLoad={() => URL.revokeObjectURL(file.preview!)}
            />
          ) : (
            <div className="h-12 w-12 bg-gray-100 rounded flex items-center justify-center text-2xl">
              {fileIcon}
            </div>
          )}
        </div>

        {/* File Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <p className="text-sm font-medium text-gray-900 truncate">
              {file.name}
            </p>
            {getStatusIcon()}
          </div>
          
          <div className="flex items-center space-x-4 text-xs text-gray-500">
            <span>{metadata.sizeFormatted}</span>
            <span className={getStatusColor()}>
              {file.uploadStatus === 'pending' && 'Ready to upload'}
              {file.uploadStatus === 'uploading' && `Uploading... ${file.uploadProgress}%`}
              {file.uploadStatus === 'success' && 'Upload complete'}
              {file.uploadStatus === 'error' && (file.uploadError || 'Upload failed')}
            </span>
          </div>

          {/* Validation Error */}
          {!file.validation.isValid && (
            <div className="mt-1 text-xs text-red-600">
              {file.validation.error}
            </div>
          )}

          {/* Upload Progress */}
          {file.uploadStatus === 'uploading' && (
            <div className="mt-2">
              <Progress value={file.uploadProgress || 0} className="h-1" />
            </div>
          )}
        </div>

        {/* Remove Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onRemove(file.id)}
          disabled={disabled || file.uploadStatus === 'uploading'}
          className="flex-shrink-0"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </Card>
  );
}