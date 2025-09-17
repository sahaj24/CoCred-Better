"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Download, 
  Eye, 
  Loader2, 
  Image, 
  FileText, 
  Filter,
  RefreshCw
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ImageRecord {
  id: string;
  type: 'certificate' | 'activity' | 'storage_file';
  name: string;
  file_path: string;
  public_url: string;
  status: string;
  uploaded_at: string;
  student: {
    aapar_id: string;
    name: string;
    email: string;
  } | null;
  class_code?: string;
  activity_type?: string;
  activity_title?: string;
  file_size?: number;
  file_type?: string;
}

interface ApiResponse {
  success: boolean;
  summary: {
    total_files: number;
    certificates: number;
    activities: number;
    storage_files: number;
    by_status: {
      pending: number;
      approved: number;
      rejected: number;
      unknown: number;
    };
  };
  images: ImageRecord[];
}

export default function ImageManagementPage() {
  const [images, setImages] = useState<ImageRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [summary, setSummary] = useState<ApiResponse['summary'] | null>(null);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const { toast } = useToast();

  const fetchAllImages = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/images/view-all');
      const data: ApiResponse = await response.json();
      
      if (data.success) {
        setImages(data.images);
        setSummary(data.summary);
        toast({
          title: "Images loaded successfully",
          description: `Found ${data.summary.total_files} files`,
        });
      } else {
        throw new Error('Failed to fetch images');
      }
    } catch (error) {
      console.error('Error fetching images:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load images",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBulkExport = async (filtered = false) => {
    setExporting(true);
    try {
      let url = '/api/images/bulk-export';
      let options: RequestInit = { method: 'GET' };

      if (filtered) {
        options = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            fileIds: selectedImages.length > 0 ? selectedImages : undefined,
            statusFilter: statusFilter !== 'all' ? statusFilter : undefined,
          }),
        };
      }

      const response = await fetch(url, options);
      
      if (response.ok) {
        const blob = await response.blob();
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = downloadUrl;
        a.download = `export_${new Date().toISOString().split('T')[0]}.zip`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(downloadUrl);
        
        toast({
          title: "Export successful",
          description: "Files have been downloaded as a zip file",
        });
      } else {
        throw new Error('Export failed');
      }
    } catch (error) {
      console.error('Error exporting images:', error);
      toast({
        variant: "destructive",
        title: "Export failed",
        description: "Failed to export images",
      });
    } finally {
      setExporting(false);
    }
  };

  const filteredImages = images.filter(image => {
    const statusMatch = statusFilter === 'all' || image.status === statusFilter;
    const typeMatch = typeFilter === 'all' || image.type === typeFilter;
    return statusMatch && typeMatch;
  });

  const toggleImageSelection = (imageId: string) => {
    setSelectedImages(prev => 
      prev.includes(imageId) 
        ? prev.filter(id => id !== imageId)
        : [...prev, imageId]
    );
  };

  const selectAllVisible = () => {
    const visibleIds = filteredImages.map(img => img.id);
    setSelectedImages(visibleIds);
  };

  const clearSelection = () => {
    setSelectedImages([]);
  };

  useEffect(() => {
    fetchAllImages();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'certificate': return <FileText className="h-4 w-4" />;
      case 'activity': return <Image className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Image Management</h1>
          <p className="text-gray-600 mt-2">View and export all database images</p>
        </div>
        <Button onClick={fetchAllImages} disabled={loading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {/* Summary Cards */}
      {summary && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Files</p>
                  <p className="text-2xl font-bold">{summary.total_files}</p>
                </div>
                <FileText className="h-8 w-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Certificates</p>
                  <p className="text-2xl font-bold">{summary.certificates}</p>
                </div>
                <FileText className="h-8 w-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Activities</p>
                  <p className="text-2xl font-bold">{summary.activities}</p>
                </div>
                <Image className="h-8 w-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-2xl font-bold">{summary.by_status.pending}</p>
                </div>
                <Eye className="h-8 w-8 text-yellow-500" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Actions and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters & Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="status-filter">Status Filter</Label>
              <select
                id="status-filter"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="unknown">Unknown</option>
              </select>
            </div>
            <div>
              <Label htmlFor="type-filter">Type Filter</Label>
              <select
                id="type-filter"
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md"
              >
                <option value="all">All Types</option>
                <option value="certificate">Certificates</option>
                <option value="activity">Activities</option>
                <option value="storage_file">Storage Files</option>
              </select>
            </div>
            <div>
              <Label>Selection ({selectedImages.length} selected)</Label>
              <div className="flex gap-2 mt-1">
                <Button size="sm" variant="outline" onClick={selectAllVisible}>
                  Select All Visible
                </Button>
                <Button size="sm" variant="outline" onClick={clearSelection}>
                  Clear
                </Button>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            <Button 
              onClick={() => handleBulkExport(false)} 
              disabled={exporting}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {exporting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
              Export All Files
            </Button>
            <Button 
              onClick={() => handleBulkExport(true)} 
              disabled={exporting || (selectedImages.length === 0 && statusFilter === 'all')}
              variant="outline"
            >
              {exporting ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Download className="h-4 w-4 mr-2" />}
              Export Filtered/Selected
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Images List */}
      <Card>
        <CardHeader>
          <CardTitle>All Images ({filteredImages.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Loading images...</span>
            </div>
          ) : (
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredImages.map((image) => (
                <div 
                  key={image.id} 
                  className={`flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 ${
                    selectedImages.includes(image.id) ? 'bg-blue-50 border-blue-200' : ''
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <input
                      type="checkbox"
                      checked={selectedImages.includes(image.id)}
                      onChange={() => toggleImageSelection(image.id)}
                      className="rounded border-gray-300"
                    />
                    <div className="flex items-center space-x-2">
                      {getTypeIcon(image.type)}
                      <div>
                        <p className="font-medium text-sm">{image.name}</p>
                        <p className="text-xs text-gray-500">
                          {image.student?.name ? `${image.student.name} (${image.student.aapar_id})` : 'Unknown Student'}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge className={getStatusColor(image.status)}>
                      {image.status}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {image.type}
                    </Badge>
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => window.open(image.public_url, '_blank')}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {filteredImages.length === 0 && !loading && (
                <div className="text-center py-8 text-gray-500">
                  No images found matching the current filters.
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}