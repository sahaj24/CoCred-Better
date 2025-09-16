"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  Calendar, 
  Award, 
  FileText,
  BarChart3,
  PieChart,
  Download,
  Filter,
  RefreshCw,
  ChevronDown,
  UserCheck,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle
} from 'lucide-react';

interface AnalyticsData {
  totalStudents: number;
  activeEvents: number;
  certificatesIssued: number;
  pendingApprovals: number;
  studentEngagement: number;
  eventCompletion: number;
  facultyActivity: number;
  trends: {
    students: number;
    events: number;
    certificates: number;
    engagement: number;
  };
}

const mockAnalyticsData: AnalyticsData = {
  totalStudents: 1247,
  activeEvents: 23,
  certificatesIssued: 847,
  pendingApprovals: 34,
  studentEngagement: 87,
  eventCompletion: 92,
  facultyActivity: 78,
  trends: {
    students: 12,
    events: -5,
    certificates: 15,
    engagement: 8
  }
};

const monthlyData = [
  { month: 'Jan', students: 150, events: 12, certificates: 89 },
  { month: 'Feb', students: 180, events: 15, certificates: 102 },
  { month: 'Mar', students: 220, events: 18, certificates: 134 },
  { month: 'Apr', students: 195, events: 14, certificates: 118 },
  { month: 'May', students: 240, events: 20, certificates: 156 },
  { month: 'Jun', students: 280, events: 25, certificates: 189 }
];

const departmentData = [
  { department: 'Computer Science', students: 320, completion: 94 },
  { department: 'Engineering', students: 280, completion: 88 },
  { department: 'Business', students: 245, completion: 91 },
  { department: 'Arts & Science', students: 190, completion: 85 },
  { department: 'Medical', students: 212, completion: 96 }
];

const recentActivities = [
  { type: 'approval', title: 'Web Development Certificate', student: 'John Doe', time: '2 hours ago', status: 'approved' },
  { type: 'submission', title: 'AI Workshop Participation', student: 'Jane Smith', time: '4 hours ago', status: 'pending' },
  { type: 'completion', title: 'Data Science Course', student: 'Mike Johnson', time: '6 hours ago', status: 'completed' },
  { type: 'rejection', title: 'Project Submission', student: 'Sarah Wilson', time: '8 hours ago', status: 'rejected' },
  { type: 'approval', title: 'Leadership Training', student: 'David Brown', time: '1 day ago', status: 'approved' }
];

export function FacultyAnalyticsPage() {
  const [selectedTimeframe, setSelectedTimeframe] = useState('monthly');
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  
  const data = mockAnalyticsData;

  const StatCard = ({ 
    title, 
    value, 
    change, 
    icon: Icon, 
    color = 'blue' 
  }: { 
    title: string; 
    value: string | number; 
    change?: number; 
    icon: any; 
    color?: string; 
  }) => (
    <Card className="bg-white">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
            {change !== undefined && (
              <div className="flex items-center mt-1">
                {change >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
                )}
                <span className={`text-sm ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {Math.abs(change)}% from last month
                </span>
              </div>
            )}
          </div>
          <div className={`h-12 w-12 bg-${color}-50 rounded-lg flex items-center justify-center`}>
            <Icon className={`h-6 w-6 text-${color}-600`} />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Faculty Analytics</h1>
          <p className="text-muted-foreground">Track performance metrics and insights</p>
        </div>
        <div className="flex items-center gap-3">
          <select 
            value={selectedTimeframe} 
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 text-sm"
          >
            <option value="weekly">Last Week</option>
            <option value="monthly">Last Month</option>
            <option value="yearly">Last Year</option>
          </select>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button size="sm" className="bg-[#2161FF] hover:bg-blue-700">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Students</p>
              <p className="text-2xl font-semibold mt-1">{data.totalStudents}</p>
              <p className="text-xs text-green-600 mt-1">+{data.trends.students}% from last month</p>
            </div>
            <div className="h-10 w-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <Users className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Active Events</p>
              <p className="text-2xl font-semibold mt-1">{data.activeEvents}</p>
              <p className="text-xs text-green-600 mt-1">+{data.trends.events}% from last month</p>
            </div>
            <div className="h-10 w-10 bg-green-50 rounded-lg flex items-center justify-center">
              <Calendar className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Certificates Issued</p>
              <p className="text-2xl font-semibold mt-1">{data.certificatesIssued}</p>
              <p className="text-xs text-green-600 mt-1">+{data.trends.certificates}% from last month</p>
            </div>
            <div className="h-10 w-10 bg-purple-50 rounded-lg flex items-center justify-center">
              <Award className="h-5 w-5 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Approvals</p>
              <p className="text-2xl font-semibold mt-1">{data.pendingApprovals}</p>
              <p className="text-xs text-orange-600 mt-1">Needs attention</p>
            </div>
            <div className="h-10 w-10 bg-orange-50 rounded-lg flex items-center justify-center">
              <Clock className="h-5 w-5 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-[#2161FF]" />
              Student Engagement
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-4xl font-bold text-[#2161FF] mb-2">{data.studentEngagement}%</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div 
                  className="bg-[#2161FF] h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${data.studentEngagement}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600">
                Average participation rate across all activities
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-green-600" />
              Event Completion
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">{data.eventCompletion}%</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div 
                  className="bg-green-600 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${data.eventCompletion}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600">
                Events completed successfully
              </p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-orange-600" />
              Faculty Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-4xl font-bold text-orange-600 mb-2">{data.facultyActivity}%</div>
              <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
                <div 
                  className="bg-orange-600 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${data.facultyActivity}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-600">
                Active faculty engagement level
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trends */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Monthly Trends
              </span>
              <Button variant="outline" size="sm">
                Last 6 Months
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {monthlyData.map((month, index) => (
                <div key={month.month} className="flex items-center space-x-4">
                  <div className="w-12 text-sm font-medium text-gray-600">{month.month}</div>
                  <div className="flex-1 grid grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-sm font-semibold text-blue-600">{month.students}</div>
                      <div className="text-xs text-gray-500">Students</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-semibold text-green-600">{month.events}</div>
                      <div className="text-xs text-gray-500">Events</div>
                    </div>
                    <div className="text-center">
                      <div className="text-sm font-semibold text-purple-600">{month.certificates}</div>
                      <div className="text-xs text-gray-500">Certificates</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Department Performance */}
        <Card className="bg-white">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="h-5 w-5" />
              Department Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {departmentData.map((dept, index) => (
                <div key={dept.department} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">{dept.department}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">{dept.students} students</span>
                      <Badge variant="secondary">{dept.completion}%</Badge>
                    </div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-[#2161FF] h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${dept.completion}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-4 bg-white rounded-lg border shadow-sm">
                <div className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    {activity.status === 'approved' && <CheckCircle className="h-5 w-5 text-green-600" />}
                    {activity.status === 'pending' && <Clock className="h-5 w-5 text-orange-600" />}
                    {activity.status === 'completed' && <CheckCircle className="h-5 w-5 text-blue-600" />}
                    {activity.status === 'rejected' && <XCircle className="h-5 w-5 text-red-600" />}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{activity.title}</p>
                    <p className="text-sm text-gray-600">by {activity.student}</p>
                  </div>
                </div>
                <div className="text-right">
                  <Badge 
                    variant={
                      activity.status === 'approved' ? 'default' :
                      activity.status === 'pending' ? 'secondary' :
                      activity.status === 'completed' ? 'default' : 'destructive'
                    }
                  >
                    {activity.status}
                  </Badge>
                  <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="bg-white">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <FileText className="h-6 w-6 text-[#2161FF]" />
              <span>Generate Report</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <Users className="h-6 w-6 text-[#2161FF]" />
              <span>View Students</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <Calendar className="h-6 w-6 text-[#2161FF]" />
              <span>Manage Events</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <Award className="h-6 w-6 text-[#2161FF]" />
              <span>Issue Certificates</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}