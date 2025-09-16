"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Calendar,
  Filter,
  Download,
  RefreshCw,
  Users,
  FileText,
  Award,
  Eye,
  MessageCircle
} from 'lucide-react';

interface TimelineActivity {
  id: string;
  type: 'submission' | 'approval' | 'rejection' | 'review' | 'comment' | 'event';
  title: string;
  description: string;
  student?: {
    name: string;
    id: string;
    avatar?: string;
  };
  faculty?: {
    name: string;
    role: string;
  };
  timestamp: string;
  status: 'completed' | 'pending' | 'in_progress' | 'cancelled';
  priority: 'high' | 'medium' | 'low';
  category: string;
  documents?: string[];
}

const mockTimelineData: TimelineActivity[] = [
  {
    id: '1',
    type: 'submission',
    title: 'New Activity Submission',
    description: 'Web Development Workshop completion certificate submitted for verification',
    student: {
      name: 'John Doe',
      id: 'CS2021001',
      avatar: ''
    },
    timestamp: '2025-01-16T10:30:00Z',
    status: 'pending',
    priority: 'high',
    category: 'Certificate Verification',
    documents: ['certificate.pdf', 'project_demo.mp4']
  },
  {
    id: '2',
    type: 'approval',
    title: 'Activity Approved',
    description: 'AI/ML Research Project has been approved and certificate will be issued',
    student: {
      name: 'Jane Smith',
      id: 'CS2021002',
      avatar: ''
    },
    faculty: {
      name: 'Dr. Johnson',
      role: 'Computer Science Head'
    },
    timestamp: '2025-01-16T09:15:00Z',
    status: 'completed',
    priority: 'medium',
    category: 'Project Approval'
  },
  {
    id: '3',
    type: 'review',
    title: 'Under Review',
    description: 'Leadership Training certificate is currently being reviewed for authenticity',
    student: {
      name: 'Mike Johnson',
      id: 'BM2021003',
      avatar: ''
    },
    faculty: {
      name: 'Prof. Williams',
      role: 'Business Faculty'
    },
    timestamp: '2025-01-16T08:45:00Z',
    status: 'in_progress',
    priority: 'medium',
    category: 'Document Review'
  },
  {
    id: '4',
    type: 'rejection',
    title: 'Activity Rejected',
    description: 'Internship documentation rejected due to insufficient proof of completion',
    student: {
      name: 'Sarah Wilson',
      id: 'CS2021004',
      avatar: ''
    },
    faculty: {
      name: 'Dr. Brown',
      role: 'Industry Relations'
    },
    timestamp: '2025-01-15T16:20:00Z',
    status: 'completed',
    priority: 'high',
    category: 'Internship Verification'
  },
  {
    id: '5',
    type: 'comment',
    title: 'Faculty Comment Added',
    description: 'Additional documentation requested for coding competition verification',
    student: {
      name: 'David Brown',
      id: 'CS2021005',
      avatar: ''
    },
    faculty: {
      name: 'Prof. Davis',
      role: 'Technical Assessment'
    },
    timestamp: '2025-01-15T14:10:00Z',
    status: 'pending',
    priority: 'medium',
    category: 'Competition Verification'
  },
  {
    id: '6',
    type: 'event',
    title: 'New Event Created',
    description: 'Advanced Python Programming Workshop scheduled for next month',
    faculty: {
      name: 'Dr. Smith',
      role: 'Computer Science Faculty'
    },
    timestamp: '2025-01-15T11:30:00Z',
    status: 'completed',
    priority: 'low',
    category: 'Event Management'
  },
  {
    id: '7',
    type: 'submission',
    title: 'Bulk Submissions Received',
    description: '15 students submitted their Data Science course completion certificates',
    timestamp: '2025-01-15T09:00:00Z',
    status: 'pending',
    priority: 'high',
    category: 'Bulk Processing'
  },
  {
    id: '8',
    type: 'approval',
    title: 'Batch Approval Completed',
    description: '8 workshop certificates approved and issued to students',
    faculty: {
      name: 'Dr. Johnson',
      role: 'Computer Science Head'
    },
    timestamp: '2025-01-14T15:45:00Z',
    status: 'completed',
    priority: 'medium',
    category: 'Batch Processing'
  }
];

export function FacultyTimelinePage() {
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [timeRange, setTimeRange] = useState('today');

  const filteredTimeline = mockTimelineData.filter(activity => {
    const matchesType = filterType === 'all' || activity.type === filterType;
    const matchesStatus = filterStatus === 'all' || activity.status === filterStatus;
    
    // Simple time filtering (in real app, would use proper date filtering)
    let matchesTime = true;
    if (timeRange === 'today') {
      const today = new Date().toDateString();
      matchesTime = new Date(activity.timestamp).toDateString() === today;
    }
    
    return matchesType && matchesStatus && matchesTime;
  });

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'submission': return <FileText className="h-4 w-4" />;
      case 'approval': return <CheckCircle className="h-4 w-4" />;
      case 'rejection': return <XCircle className="h-4 w-4" />;
      case 'review': return <Clock className="h-4 w-4" />;
      case 'comment': return <MessageCircle className="h-4 w-4" />;
      case 'event': return <Calendar className="h-4 w-4" />;
      default: return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'submission': return 'bg-blue-100 text-blue-800';
      case 'approval': return 'bg-green-100 text-green-800';
      case 'rejection': return 'bg-red-100 text-red-800';
      case 'review': return 'bg-yellow-100 text-yellow-800';
      case 'comment': return 'bg-purple-100 text-purple-800';
      case 'event': return 'bg-indigo-100 text-indigo-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'border-green-400';
      case 'pending': return 'border-yellow-400';
      case 'in_progress': return 'border-blue-400';
      case 'cancelled': return 'border-red-400';
      default: return 'border-gray-400';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInHours < 48) return 'Yesterday';
    return date.toLocaleDateString();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <Clock className="h-8 w-8 text-[#2161FF]" />
            Activity Timeline
          </h1>
          <p className="text-gray-600">Track all activities, approvals, and institutional events in chronological order</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export Timeline
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today's Activities</p>
                <p className="text-2xl font-bold text-[#2161FF] mt-1">
                  {mockTimelineData.filter(a => {
                    const today = new Date().toDateString();
                    return new Date(a.timestamp).toDateString() === today;
                  }).length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-[#2161FF]" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Actions</p>
                <p className="text-2xl font-bold text-orange-600 mt-1">
                  {mockTimelineData.filter(a => a.status === 'pending').length}
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed Today</p>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  {mockTimelineData.filter(a => {
                    const today = new Date().toDateString();
                    return a.status === 'completed' && new Date(a.timestamp).toDateString() === today;
                  }).length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">High Priority</p>
                <p className="text-2xl font-bold text-red-600 mt-1">
                  {mockTimelineData.filter(a => a.priority === 'high').length}
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-white">
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium">Filters:</span>
            </div>
            
            <select 
              value={filterType} 
              onChange={(e) => setFilterType(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="all">All Activities</option>
              <option value="submission">Submissions</option>
              <option value="approval">Approvals</option>
              <option value="rejection">Rejections</option>
              <option value="review">Reviews</option>
              <option value="comment">Comments</option>
              <option value="event">Events</option>
            </select>

            <select 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="cancelled">Cancelled</option>
            </select>

            <select 
              value={timeRange} 
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="today">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="all">All Time</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <Card className="bg-white">
        <CardHeader>
          <CardTitle>Activity Timeline ({filteredTimeline.length} activities)</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>
            
            <div className="space-y-6">
              {filteredTimeline.map((activity, index) => (
                <div key={activity.id} className="relative flex items-start space-x-6">
                  {/* Timeline marker */}
                  <div className={`relative z-10 flex items-center justify-center w-8 h-8 rounded-full border-2 bg-white ${getStatusColor(activity.status)}`}>
                    {getActivityIcon(activity.type)}
                  </div>
                  
                  {/* Activity content */}
                  <div className="flex-1 min-w-0">
                    <Card className="bg-white hover:bg-gray-50 transition-colors shadow-sm">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge className={getActivityColor(activity.type)}>
                                {activity.type.replace('_', ' ')}
                              </Badge>
                              <Badge className={getPriorityColor(activity.priority)}>
                                {activity.priority}
                              </Badge>
                              <span className="text-xs text-gray-500">
                                {activity.category}
                              </span>
                            </div>
                            
                            <h3 className="font-semibold text-gray-900 mb-1">
                              {activity.title}
                            </h3>
                            
                            <p className="text-sm text-gray-600 mb-3">
                              {activity.description}
                            </p>
                            
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                {activity.student && (
                                  <div className="flex items-center space-x-2">
                                    <Avatar className="h-6 w-6">
                                      <AvatarFallback className="bg-[#2161FF] text-white text-xs">
                                        {activity.student.name.split(' ').map(n => n[0]).join('')}
                                      </AvatarFallback>
                                    </Avatar>
                                    <span className="text-xs text-gray-600">
                                      {activity.student.name} ({activity.student.id})
                                    </span>
                                  </div>
                                )}
                                
                                {activity.faculty && (
                                  <div className="text-xs text-gray-600">
                                    Handled by: {activity.faculty.name} ({activity.faculty.role})
                                  </div>
                                )}
                                
                                {activity.documents && (
                                  <span className="text-xs text-gray-500">
                                    {activity.documents.length} documents
                                  </span>
                                )}
                              </div>
                              
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-500">
                                  {formatTime(activity.timestamp)}
                                </span>
                                {(activity.status === 'pending' || activity.status === 'in_progress') && (
                                  <Button size="sm" variant="outline">
                                    <Eye className="h-3 w-3 mr-1" />
                                    View
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              ))}
            </div>
            
            {filteredTimeline.length === 0 && (
              <div className="text-center py-12">
                <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No activities found</h3>
                <p className="text-gray-600">Try adjusting your filters to see more activities.</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}