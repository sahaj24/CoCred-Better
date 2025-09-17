"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getPendingCertificates, updateCertificateStatus } from '@/lib/faculty-certificates';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { 
  Search, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Eye, 
  MoreHorizontal,
  Download,
  MessageCircle,
  Users,
  Calendar,
  FileText,
  AlertCircle,
  Award,
  Plus,
  SortAsc
} from 'lucide-react';

interface ActivitySubmission {
  id: string;
  title: string;
  description: string;
  student: {
    name: string;
    id: string;
    avatar?: string;
    department: string;
  };
  type: 'workshop' | 'certificate' | 'internship' | 'project' | 'competition';
  status: 'pending' | 'approved' | 'rejected' | 'under_review';
  submittedDate: string;
  eventDate: string;
  documents: string[];
  priority: 'high' | 'medium' | 'low';
  category: string;
}


export function FacultyActivitiesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedActivities, setSelectedActivities] = useState<string[]>([]);
  const [activities, setActivities] = useState<ActivitySubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Auth context
  const { user, loading: authLoading } = useAuth();

  // Fetch activities only after auth state is resolved and user exists
  useEffect(() => {
    if (!authLoading && user) {
      loadActivities();
    }
  }, [authLoading, user]);

  const loadActivities = async () => {
    try {
      setLoading(true);
      console.log('Loading activities from database...');
      
      // Get faculty class_code first
      const { data: facultyRow, error: facultyErr } = await supabase
        .from('faculty')
        .select('class_code')
        .eq('user_id', user?.id)
        .maybeSingle();

      if (facultyErr) {
        throw new Error(`Faculty lookup failed: ${facultyErr.message}`);
      }

      if (!facultyRow || !facultyRow.class_code) {
        throw new Error('No class code found for current faculty user.');
      }

      const classCode = facultyRow.class_code;
      console.log('Faculty class_code:', classCode);

      // Fetch certificates belonging to this class code (select * avoids joins that may violate RLS)
      const { data: certificates, error } = await supabase
        .from('certificates')
        .select('*')
        .eq('class_code', classCode)
        .order('uploaded_at', { ascending: false });
      
      console.log('Direct query result:', { certificates, error });
      
      if (error) {
        console.error('Supabase error:', error);
        // Check if it's an auth error
        if (error.message?.includes('JWT') || error.message?.includes('auth')) {
          throw new Error('Authentication required. Please log in.');
        }
        throw new Error(`Database error: ${error.message}`);
      }
      
      if (!certificates || certificates.length === 0) {
        console.log('No certificates found in database');
        setActivities([]);
        return;
      }
      
      console.log(`Found ${certificates.length} certificates`);
      
      // Convert certificates to activity format
      const convertedActivities: ActivitySubmission[] = certificates.map((cert: any) => ({
        id: cert.id,
        title: cert.issued_name || cert.name || 'Certificate',
        description: cert.description || 'Student certificate submission',
        student: {
          name: cert.student_name || 'Unknown Student',
          id: cert.student_id?.slice(0, 8) || 'N/A',
          department: 'Unknown',
          avatar: ''
        },
        type: 'certificate',
        status: (cert.status as any) || 'pending',
        submittedDate: cert.uploaded_at || cert.created_at || new Date().toISOString(),
        eventDate: cert.uploaded_at || cert.created_at || new Date().toISOString(),
        documents: cert.public_url ? [cert.public_url] : cert.file_url ? [cert.file_url] : [],
        priority: 'medium' as any,
        category: 'Academic'
      }));
      
      console.log('Converted activities:', convertedActivities);
      setActivities(convertedActivities);
    } catch (error) {
      console.error('Error loading activities:', error);
      
      let errorMessage = 'Unknown error';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast({
        title: 'Database Error',
        description: `Failed to load activities: ${errorMessage}`,
        variant: 'destructive'
      });
      
      setActivities([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (activityId: string) => {
    try {
      await updateCertificateStatus(activityId, 'approved');
      toast({
        title: 'Success',
        description: 'Activity approved successfully'
      });
      loadActivities(); // Refresh
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to approve activity',
        variant: 'destructive'
      });
    }
  };

  const handleReject = async (activityId: string) => {
    try {
      await updateCertificateStatus(activityId, 'rejected', 'Activity rejected by faculty');
      toast({
        title: 'Success',
        description: 'Activity rejected successfully'
      });
      loadActivities(); // Refresh
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to reject activity',
        variant: 'destructive'
      });
    }
  };

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || activity.status === statusFilter;
    const matchesType = typeFilter === 'all' || activity.type === typeFilter;
    const matchesPriority = priorityFilter === 'all' || activity.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesType && matchesPriority;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'under_review': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
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

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'workshop': return <Users className="h-4 w-4" />;
      case 'certificate': return <Award className="h-4 w-4" />;
      case 'internship': return <FileText className="h-4 w-4" />;
      case 'project': return <Calendar className="h-4 w-4" />;
      case 'competition': return <Award className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };

  const handleBulkAction = (action: string) => {
    // Handle bulk actions (approve, reject, review)
    console.log(`Performing ${action} on activities:`, selectedActivities);
  };

  // Handle auth loading state
  if (authLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // If no user session, prompt login
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <AlertCircle className="h-12 w-12 text-red-600" />
        <h2 className="text-xl font-semibold">Login Required</h2>
        <p className="text-gray-600 max-w-sm">
          You must be logged in as faculty to view and manage student activities. Please sign in using your faculty account.
        </p>
        <Button className="bg-[#2161FF] hover:bg-blue-700 text-white" asChild>
          <Link href="/login/authority">Go to Login</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <FileText className="h-8 w-8 text-[#2161FF]" />
            Activity Management
          </h1>
          <p className="text-gray-600">Review and manage student activity submissions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button size="sm" className="bg-[#2161FF] hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Bulk Actions
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Review</p>
                <p className="text-2xl font-bold text-orange-600 mt-1">
                  {activities.filter(a => a.status === 'pending').length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-green-600 mt-1">
                  {activities.filter(a => a.status === 'approved').length}
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
                <p className="text-sm font-medium text-gray-600">Under Review</p>
                <p className="text-2xl font-bold text-blue-600 mt-1">
                  {activities.filter(a => a.status === 'under_review').length}
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">High Priority</p>
                <p className="text-2xl font-bold text-red-600 mt-1">
                  {activities.filter(a => a.priority === 'high').length}
                </p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card className="bg-white">
        <CardContent className="p-6">
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search activities, students, or descriptions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <select 
              value={statusFilter} 
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="under_review">Under Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>

            <select 
              value={typeFilter} 
              onChange={(e) => setTypeFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="all">All Types</option>
              <option value="workshop">Workshops</option>
              <option value="certificate">Certificates</option>
              <option value="internship">Internships</option>
              <option value="project">Projects</option>
              <option value="competition">Competitions</option>
            </select>

            <select 
              value={priorityFilter} 
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm"
            >
              <option value="all">All Priority</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>

            <Button variant="outline" size="sm">
              <SortAsc className="h-4 w-4 mr-2" />
              Sort
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Activities Tabs */}
      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="bg-white border">
          <TabsTrigger value="all">All Activities ({filteredActivities.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({filteredActivities.filter(a => a.status === 'pending').length})</TabsTrigger>
          <TabsTrigger value="review">Under Review ({filteredActivities.filter(a => a.status === 'under_review').length})</TabsTrigger>
          <TabsTrigger value="priority">High Priority ({filteredActivities.filter(a => a.priority === 'high').length})</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading activities...</p>
            </div>
          ) : filteredActivities.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No activities found</p>
            </div>
          ) : filteredActivities.map((activity) => (
            <Card key={activity.id} className="bg-white hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <input
                      type="checkbox"
                      checked={selectedActivities.includes(activity.id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedActivities([...selectedActivities, activity.id]);
                        } else {
                          setSelectedActivities(selectedActivities.filter(id => id !== activity.id));
                        }
                      }}
                      className="mt-1"
                    />
                    
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={activity.student.avatar} />
                      <AvatarFallback className="bg-[#2161FF] text-white">
                        {activity.student.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900 mb-1">{activity.title}</h3>
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-sm font-medium">{activity.student.name}</span>
                            <span className="text-sm text-gray-500">({activity.student.id})</span>
                            <Badge variant="outline" className="text-xs">
                              {activity.student.department}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getPriorityColor(activity.priority)}>
                            {activity.priority}
                          </Badge>
                          <Badge className={getStatusColor(activity.status)}>
                            {activity.status.replace('_', ' ')}
                          </Badge>
                        </div>
                      </div>

                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {activity.description}
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center gap-1">
                            {getTypeIcon(activity.type)}
                            <span className="capitalize">{activity.type}</span>
                          </div>
                          <span>Submitted: {new Date(activity.submittedDate).toLocaleDateString()}</span>
                          <span>Event: {new Date(activity.eventDate).toLocaleDateString()}</span>
                          <span>{activity.documents.length} documents</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                          <Button variant="outline" size="sm">
                            <MessageCircle className="h-4 w-4 mr-1" />
                            Comment
                          </Button>
                          {activity.status === 'pending' && (
                            <>
                              <Button 
                                size="sm" 
                                className="bg-green-600 hover:bg-green-700 text-white"
                                onClick={() => handleApprove(activity.id)}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Approve
                              </Button>
                              <Button 
                                variant="destructive" 
                                size="sm"
                                onClick={() => handleReject(activity.id)}
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          {filteredActivities.filter(a => a.status === 'pending').map((activity) => (
            <Card key={activity.id} className="bg-white border-l-4 border-l-orange-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-[#2161FF] text-white">
                        {activity.student.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{activity.title}</h3>
                      <p className="text-sm text-gray-600">{activity.student.name} • {activity.student.department}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getPriorityColor(activity.priority)}>
                      {activity.priority}
                    </Badge>
                    <Button size="sm" className="bg-green-600 hover:bg-green-700 text-white">
                      Review
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="review" className="space-y-4">
          {filteredActivities.filter(a => a.status === 'under_review').map((activity) => (
            <Card key={activity.id} className="bg-white border-l-4 border-l-blue-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-[#2161FF] text-white">
                        {activity.student.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{activity.title}</h3>
                      <p className="text-sm text-gray-600">{activity.student.name} • {activity.student.department}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-blue-100 text-blue-800">Under Review</Badge>
                    <Button size="sm" variant="outline">
                      Continue Review
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        <TabsContent value="priority" className="space-y-4">
          {filteredActivities.filter(a => a.priority === 'high').map((activity) => (
            <Card key={activity.id} className="bg-white border-l-4 border-l-red-500">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-[#2161FF] text-white">
                        {activity.student.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold">{activity.title}</h3>
                      <p className="text-sm text-gray-600">{activity.student.name} • {activity.student.department}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-red-100 text-red-800">High Priority</Badge>
                    <Badge className={getStatusColor(activity.status)}>
                      {activity.status.replace('_', ' ')}
                    </Badge>
                    <Button size="sm" className="bg-[#2161FF] hover:bg-blue-700">
                      Action Required
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>

      {/* Bulk Actions */}
      {selectedActivities.length > 0 && (
        <Card className="bg-white border-blue-200 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                {selectedActivities.length} activities selected
              </span>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => handleBulkAction('approve')}>
                  Bulk Approve
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleBulkAction('review')}>
                  Move to Review
                </Button>
                <Button size="sm" variant="destructive" onClick={() => handleBulkAction('reject')}>
                  Bulk Reject
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}