"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Download, FileText, Trash2, RefreshCw } from 'lucide-react';
import { listUserFiles, deleteFile, downloadFile, getFileIcon, formatFileSize } from '@/lib/file-upload';
import { useAuth } from '@/lib/auth-context';

interface UploadedFile {
  id: string;
  file_name: string;
  file_path: string;
  file_size: number;
  file_type: string;
  upload_date: string;
  publicUrl: string;
  originalName: string;
}

export function DownloadPage() {
  const { user } = useAuth();
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingFiles, setDeletingFiles] = useState<Set<string>>(new Set());

  const loadFiles = async () => {
    if (!user) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const result = await listUserFiles(user.id);
      if (result.success) {
        setFiles(result.data || []);
      } else {
        setError(result.error || 'Failed to load files');
      }
    } catch (err) {
      setError('Failed to load files');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFiles();
  }, [user]);

  const handleDownload = async (file: UploadedFile) => {
    try {
      const result = await downloadFile(file.file_path);
      if (result.success && result.data) {
        // Create download link
        const url = URL.createObjectURL(result.data);
        const link = document.createElement('a');
        link.href = url;
        link.download = file.originalName; // Use original filename
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      } else {
        alert(result.error || 'Download failed');
      }
    } catch (error) {
      alert('Download failed');
    }
  };

  const handleDelete = async (file: UploadedFile) => {
    if (!confirm(`Are you sure you want to delete "${file.originalName}"?`)) {
      return;
    }

    setDeletingFiles(prev => new Set(prev).add(file.id));
    
    try {
      const result = await deleteFile(file.file_path);
      if (result.success) {
        setFiles(prev => prev.filter(f => f.id !== file.id));
      } else {
        alert(result.error || 'Delete failed');
      }
    } catch (error) {
      alert('Delete failed');
    } finally {
      setDeletingFiles(prev => {
        const newSet = new Set(prev);
        newSet.delete(file.id);
        return newSet;
      });
    }
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <Alert>
          <AlertDescription>Please log in to view your files.</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Documents</h1>
          <p className="text-gray-600">
            Download and manage your uploaded files
          </p>
        </div>
        <Button onClick={loadFiles} disabled={loading} variant="outline">
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Loading State */}
      {loading ? (
        <Card>
          <CardContent className="p-8">
            <div className="text-center">
              <div className="animate-spin h-8 w-8 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
              <p className="text-gray-500">Loading your files...</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Files List */}
          {files.length === 0 ? (
            <Card>
              <CardContent className="p-8">
                <div className="text-center">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No files uploaded yet</h3>
                  <p className="text-gray-500 mb-4">Upload some documents to see them here</p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  Uploaded Files ({files.length})
                </h2>
              </div>
              
              <div className="grid gap-4">
                {files.map((file) => (
                  <Card key={file.id} className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 flex-1 min-w-0">
                          <div className="text-2xl">
                            {getFileIcon(file.file_type)}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-gray-900 truncate">
                              {file.originalName}
                            </h3>
                            <div className="flex items-center space-x-4 text-sm text-gray-500">
                              <span>{formatFileSize(file.file_size)}</span>
                              <span>•</span>
                              <span>{new Date(file.upload_date).toLocaleDateString()}</span>
                              <span>•</span>
                              <span className="capitalize">
                                {file.file_type.split('/')[1] || 'Unknown'}
                              </span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDownload(file)}
                            className="shrink-0"
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Download
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDelete(file)}
                            disabled={deletingFiles.has(file.id)}
                            className="shrink-0 text-red-600 hover:bg-red-50 border-red-200"
                          >
                            {deletingFiles.has(file.id) ? (
                              <div className="animate-spin h-4 w-4 border-2 border-red-600 border-t-transparent rounded-full" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}