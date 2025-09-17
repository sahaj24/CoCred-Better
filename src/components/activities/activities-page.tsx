"use client";

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AddActivityModal } from './add-activity-modal';
import { 
  Plus, 
  Search, 
  Eye, 
  Download, 
  Filter,
  Clock,
  Award,
  Briefcase,
  GitBranch,
  FileText,
  CheckCircle,
  XCircle,
  AlertCircle,
  Calendar,
  BarChart3
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';
import { getStudentActivities, getActivityStats, type Activity, type ActivityStatus, type ActivityType, type ActivityCategory } from '@/lib/student-activities';


export function ActivitiesPage() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<ActivityStatus | "all">("all");
  const [categoryFilter, setCategoryFilter] = useState<ActivityCategory | "all">("all");
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      loadActivities();
    }
  }, [user]);

  const loadActivities = async () => {
    try {
      setLoading(true);
      const studentActivities = await getStudentActivities(user?.id || '');
      setActivities(studentActivities);
    } catch (error) {
      console.error('Error loading activities:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: ActivityStatus) => {
    const variants = {
      pending: { icon: AlertCircle, class: "bg-yellow-100 text-yellow-800 border-yellow-200" },
      approved: { icon: CheckCircle, class: "bg-green-100 text-green-800 border-green-200" },
      rejected: { icon: XCircle, class: "bg-red-100 text-red-800 border-red-200" }
    };
    
    const variant = variants[status];
    const Icon = variant.icon;
    
    return (
      <Badge variant="outline" className={variant.class}>
        <Icon className="h-3 w-3 mr-1" />
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getTypeIcon = (type: ActivityType) => {
    switch (type) {
      case 'certificate':
        return <Award className="h-4 w-4 text-yellow-600" />;
      case 'internship':
        return <Briefcase className="h-4 w-4 text-green-600" />;
      case 'project':
        return <GitBranch className="h-4 w-4 text-purple-600" />;
      case 'workshop':
        return <FileText className="h-4 w-4 text-blue-600" />;
      default:
        return <FileText className="h-4 w-4 text-blue-600" />;
    }
  };

  const filteredActivities = activities.filter(activity => {
    const matchesSearch = activity.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         activity.organization?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || activity.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || activity.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  const activitiesByCategory = activities.reduce((acc, activity) => {
    if (!acc[activity.category]) {
      acc[activity.category] = [];
    }
    acc[activity.category].push(activity);
    return acc;
  }, {} as Record<ActivityCategory, Activity[]>);

  const statsData = {
    total: activities.length,
    approved: activities.filter(a => a.status === "approved").length,
    pending: activities.filter(a => a.status === "pending").length,
    rejected: activities.filter(a => a.status === "rejected").length
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading activities...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Activities</h1>
          <p className="text-gray-600">Track and manage your academic and extracurricular activities</p>
        </div>
        <AddActivityModal>
          <Button className="bg-[#2161FF] hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-2" />
            Add Activity
          </Button>
        </AddActivityModal>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Activities</p>
                <p className="text-2xl font-bold text-gray-900">{statsData.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Approved</p>
                <p className="text-2xl font-bold text-green-600">{statsData.approved}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-yellow-600">{statsData.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <XCircle className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-bold text-red-600">{statsData.rejected}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All Activities</TabsTrigger>
          <TabsTrigger value="timeline">Timeline View</TabsTrigger>
          <TabsTrigger value="categories">By Category</TabsTrigger>
        </TabsList>

        {/* All Activities Tab */}
        <TabsContent value="all">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>All Activities</CardTitle>
                  <CardDescription>Complete list of your logged activities</CardDescription>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input 
                      placeholder="Search activities..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 w-64 focus:border-[#2161FF] focus:ring-[#2161FF]"
                    />
                  </div>
                  <select 
                    value={statusFilter} 
                    onChange={(e) => setStatusFilter(e.target.value as ActivityStatus | "all")}
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:border-[#2161FF] focus:ring-[#2161FF]"
                  >
                    <option value="all">All Status</option>
                    <option value="approved">Approved</option>
                    <option value="pending">Pending</option>
                    <option value="rejected">Rejected</option>
                  </select>
                  <select 
                    value={categoryFilter} 
                    onChange={(e) => setCategoryFilter(e.target.value as ActivityCategory | "all")}
                    className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:border-[#2161FF] focus:ring-[#2161FF]"
                  >
                    <option value="all">All Categories</option>
                    <option value="Academic">Academic</option>
                    <option value="Technical">Technical</option>
                    <option value="Leadership">Leadership</option>
                    <option value="Sports">Sports</option>
                    <option value="Cultural">Cultural</option>
                    <option value="Social">Social</option>
                  </select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Activity</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Organization</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredActivities.length > 0 ? filteredActivities.map((activity) => (
                    <TableRow key={activity.id} className="hover:bg-white border-b border-gray-100">
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          {getTypeIcon(activity.type)}
                          <div>
                            <p className="font-medium">{activity.title}</p>
                            <p className="text-sm text-gray-500 truncate max-w-xs">{activity.description}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary" className="capitalize">
                          {activity.type}
                        </Badge>
                      </TableCell>
                      <TableCell>{activity.category}</TableCell>
                      <TableCell className="text-gray-600">{activity.organization}</TableCell>
                      <TableCell className="text-gray-500">
                        {new Date(activity.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{getStatusBadge(activity.status)}</TableCell>
                      <TableCell>
                        <div className="flex space-x-1">
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                            <Download className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  )) : (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                        No activities found. Add your first activity to get started!
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Timeline Tab */}
        <TabsContent value="timeline">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-[#2161FF]"/>
                Activity Timeline
              </CardTitle>
              <CardDescription>Chronological view of your activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border-l-2 border-gray-200 pl-6 space-y-8 relative">
                {activities.length > 0 ? activities
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((activity) => (
                    <div key={activity.id} className="relative">
                      <div className={`absolute -left-[34px] top-1 h-4 w-4 rounded-full border-2 border-white ${
                        activity.status === 'approved' ? 'bg-green-500' : 
                        activity.status === 'pending' ? 'bg-yellow-500' : 'bg-red-500'
                      }`}></div>
                      <div className="bg-white p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            {getTypeIcon(activity.type)}
                            <h4 className="font-semibold">{activity.title}</h4>
                          </div>
                          {getStatusBadge(activity.status)}
                        </div>
                        <p className="text-sm text-gray-600 mb-1">
                          {activity.category} • {activity.organization}
                        </p>
                        <p className="text-xs text-gray-500">
                          {new Date(activity.date).toLocaleDateString('en-GB', { 
                            day: 'numeric', 
                            month: 'long', 
                            year: 'numeric' 
                          })}
                        </p>
                        <p className="text-sm text-gray-700 mt-2">{activity.description}</p>
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-8 text-gray-500">
                      <Clock className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <p>No activities to display in timeline view.</p>
                      <p className="text-sm mt-1">Add your first activity to see it here!</p>
                    </div>
                  )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Categories Tab */}
        <TabsContent value="categories">
          <div className="space-y-6">
            {Object.keys(activitiesByCategory).length > 0 ? Object.entries(activitiesByCategory).map(([category, categoryActivities]) => (
              <Card key={category}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{category} Activities</span>
                    <Badge variant="secondary">{categoryActivities.length}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {categoryActivities.map((activity) => (
                      <div key={activity.id} className="flex items-center space-x-4 p-3 border border-gray-200 rounded-lg hover:bg-white shadow-sm">
                        {getTypeIcon(activity.type)}
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium">{activity.title}</h4>
                            {getStatusBadge(activity.status)}
                          </div>
                          <p className="text-sm text-gray-600">{activity.organization} • {new Date(activity.date).toLocaleDateString()}</p>
                        </div>
                        <div className="flex space-x-1">
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )) : (
              <Card>
                <CardContent className="text-center py-12">
                  <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p className="text-gray-500">No activities found in any category.</p>
                  <p className="text-sm text-gray-400 mt-1">Start by adding your first activity!</p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}