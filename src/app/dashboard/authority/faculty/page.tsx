"use client";

import { useState, useContext, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  LogOut, 
  LayoutDashboard, 
  Users, 
  Calendar, 
  Settings, 
  TrendingUp,
  Clock,
  CheckCircle,
  Home,
  Bell,
  HelpCircle,
  Award,
  FileText,
  Plus,
  Eye,
  UserCheck,
  ClipboardList,
  BarChart
} from "lucide-react";
import { LanguageContext } from "@/lib/language-context";
import { getAllUserProfiles, getEvents } from "@/lib/file-store";
import type { UserProfile, AppEvent } from "@/lib/types";

type NavigationTab = 'home' | 'dashboard' | 'events' | 'approvals' | 'participants' | 'settings';

export default function FacultyPortal() {
  const [activeTab, setActiveTab] = useState<NavigationTab>("home");
  const [students, setStudents] = useState<UserProfile[]>([]);
  const [events, setEvents] = useState<AppEvent[]>([]);
  const { translations } = useContext(LanguageContext);

  useEffect(() => {
    setStudents(getAllUserProfiles());
    setEvents(getEvents());
  }, []);

  const navigationItems = [
    { id: "home" as NavigationTab, label: "Home", icon: Home },
    { id: "dashboard" as NavigationTab, label: "Dashboard", icon: LayoutDashboard },
    { id: "events" as NavigationTab, label: "My Events", icon: Calendar },
    { id: "approvals" as NavigationTab, label: "Approvals", icon: UserCheck },
    { id: "participants" as NavigationTab, label: "Participants", icon: Users },
    { id: "settings" as NavigationTab, label: "Settings", icon: Settings },
  ];

  const bottomNavigationItems = [
    { id: "help", label: "Help", icon: HelpCircle },
    { id: "logout", label: "Logout", icon: LogOut },
  ];

  const renderHomeContent = () => (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Faculty Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage events, approvals, and student activities</p>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" className="border-blue-200 text-blue-600 hover:bg-blue-50">
              <Bell className="h-4 w-4 mr-2" />
              Notifications
            </Button>
            <Button 
              onClick={() => setActiveTab("events")}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Event
            </Button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="bg-white shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Events</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{events.length}</p>
                <p className="text-xs text-green-600 mt-1">+2 this month</p>
              </div>
              <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Students</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{students.length}</p>
                <p className="text-xs text-green-600 mt-1">+12 this week</p>
              </div>
              <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center">
                <Users className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Approvals</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">24</p>
                <p className="text-xs text-orange-600 mt-1">Needs attention</p>
              </div>
              <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center">
                <Clock className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Certificates Issued</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">156</p>
                <p className="text-xs text-green-600 mt-1">+18 this month</p>
              </div>
              <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center">
                <Award className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <button 
          onClick={() => setActiveTab("events")}
          className="p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl border border-blue-200 hover:shadow-md transition-all text-left group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <Calendar className="h-5 w-5 text-white" />
            </div>
            <div className="text-blue-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
          <h3 className="font-semibold text-blue-900">Manage Events</h3>
          <p className="text-sm text-blue-700 mt-1">Create and organize workshops</p>
        </button>
        
        <button 
          onClick={() => setActiveTab("approvals")}
          className="p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-xl border border-green-200 hover:shadow-md transition-all text-left group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-green-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <CheckCircle className="h-5 w-5 text-white" />
            </div>
            <div className="text-green-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
          <h3 className="font-semibold text-green-900">Approve Certificates</h3>
          <p className="text-sm text-green-700 mt-1">Review certificate requests</p>
        </button>

        <button 
          onClick={() => setActiveTab("participants")}
          className="p-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl border border-purple-200 hover:shadow-md transition-all text-left group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <Users className="h-5 w-5 text-white" />
            </div>
            <div className="text-purple-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
          <h3 className="font-semibold text-purple-900">View Participants</h3>
          <p className="text-sm text-purple-700 mt-1">Manage student registrations</p>
        </button>

        <button 
          onClick={() => setActiveTab("dashboard")}
          className="p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl border border-orange-200 hover:shadow-md transition-all text-left group"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform">
              <BarChart className="h-5 w-5 text-white" />
            </div>
            <div className="text-orange-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
          <h3 className="font-semibold text-orange-900">Analytics</h3>
          <p className="text-sm text-orange-700 mt-1">View detailed statistics</p>
        </button>
      </div>

      {/* Recent Activity & Pending Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white shadow-sm border border-gray-100">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-blue-600" />
              Recent Activity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg border border-green-100">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <CheckCircle className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-green-900">Certificates Approved</p>
                <p className="text-xs text-green-700 mt-1">5 certificates approved for "Web Development Workshop"</p>
                <p className="text-xs text-green-600 mt-1">2 minutes ago</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg border border-blue-100">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Calendar className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-900">New Event Created</p>
                <p className="text-xs text-blue-700 mt-1">Created "AI Workshop Series" with 50 seats</p>
                <p className="text-xs text-blue-600 mt-1">1 hour ago</p>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 bg-purple-50 rounded-lg border border-purple-100">
              <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <Users className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-purple-900">Student Registrations</p>
                <p className="text-xs text-purple-700 mt-1">12 new registrations for upcoming events</p>
                <p className="text-xs text-purple-600 mt-1">3 hours ago</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm border border-gray-100">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-3">
              <ClipboardList className="h-5 w-5 text-orange-600" />
              Pending Tasks
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                  <Clock className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-orange-900">Registration Approvals</p>
                  <p className="text-xs text-orange-700">15 pending approvals</p>
                </div>
              </div>
              <Button 
                size="sm" 
                className="bg-orange-600 hover:bg-orange-700 text-white"
                onClick={() => setActiveTab("approvals")}
              >
                Review
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                  <Award className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-purple-900">Certificate Approvals</p>
                  <p className="text-xs text-purple-700">8 certificates to review</p>
                </div>
              </div>
              <Button 
                size="sm" 
                className="bg-purple-600 hover:bg-purple-700 text-white"
                onClick={() => setActiveTab("approvals")}
              >
                Issue
              </Button>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-100">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                  <FileText className="h-4 w-4 text-white" />
                </div>
                <div>
                  <p className="text-sm font-medium text-blue-900">Event Feedback</p>
                  <p className="text-xs text-blue-700">3 events awaiting review</p>
                </div>
              </div>
              <Button 
                size="sm" 
                variant="outline" 
                className="border-blue-200 text-blue-600 hover:bg-blue-50"
              >
                View
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderDashboardContent = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Analytics Dashboard</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                <p className="text-2xl font-bold">{students.length}</p>
              </div>
              <Users className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Activities</p>
                <p className="text-2xl font-bold">6</p>
              </div>
              <Award className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Events</p>
                <p className="text-2xl font-bold">{events.length}</p>
              </div>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Performance</p>
                <p className="text-2xl font-bold">85%</p>
              </div>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Performance Overview</CardTitle>
          <CardDescription>Student progress and course analytics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-muted/20 rounded-lg flex items-center justify-center">
            <p className="text-muted-foreground">Analytics charts would be displayed here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderStudentsContent = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Student Management</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Student Roster</CardTitle>
          <CardDescription>Manage your students and their documents</CardDescription>
        </CardHeader>
        <CardContent>
          {students.length > 0 ? (
            <div className="space-y-3">
              {students.map((student) => (
                <div key={student.aaparId} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={student.imageUrl} />
                      <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{student.name}</p>
                      <p className="text-sm text-muted-foreground">{student.aaparId}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">Active</Badge>
                    <Button asChild variant="outline" size="sm">
                      <Link href={`/dashboard/authority/student/${student.aaparId}`}>
                        View Documents
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center text-muted-foreground py-8">No students registered yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderEventsContent = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">My Events</h2>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create New Event
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {[
          { name: "AI & Machine Learning Workshop", participants: 45, status: "Active", date: "Oct 15-17" },
          { name: "Coding Competition 2025", participants: 120, status: "Registration Open", date: "Nov 5" },
          { name: "Industry Connect Seminar", participants: 60, status: "Completed", date: "Sep 10" },
          { name: "Hackathon Weekend", participants: 80, status: "Planning", date: "Dec 1-2" },
          { name: "Web Development Bootcamp", participants: 35, status: "Active", date: "Oct 20-25" },
          { name: "Data Science Workshop", participants: 50, status: "Upcoming", date: "Nov 12" }
        ].map((event, index) => (
          <Card key={index}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-lg">{event.name}</CardTitle>
                <Badge variant={event.status === 'Active' ? 'default' : event.status === 'Completed' ? 'secondary' : 'outline'}>
                  {event.status}
                </Badge>
              </div>
              <CardDescription>{event.date}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <p className="text-sm"><span className="font-medium">Participants:</span> {event.participants}</p>
                  <p className="text-sm"><span className="font-medium">Type:</span> Co-curricular</p>
                </div>
                <div className="flex space-x-2">
                  <Button variant="outline" size="sm">
                    <Eye className="mr-1 h-3 w-3" />
                    View
                  </Button>
                  <Button variant="outline" size="sm">
                    Edit
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderApprovalsContent = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Pending Approvals</h2>
        <div className="flex space-x-2">
          <Button variant="outline">Approve All</Button>
          <Button variant="outline">Export List</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {[
          { name: "John Smith", event: "AI Workshop", type: "Registration", date: "2 hours ago" },
          { name: "Emma Johnson", event: "Coding Competition", type: "Submission", date: "5 hours ago" },
          { name: "Mike Davis", event: "Web Development", type: "Registration", date: "1 day ago" },
          { name: "Sarah Wilson", event: "Hackathon", type: "Team Formation", date: "1 day ago" },
          { name: "Alex Brown", event: "Data Science", type: "Certificate Approval", date: "2 days ago" }
        ].map((approval, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarFallback>{approval.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{approval.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {approval.type} for "{approval.event}"
                    </p>
                    <p className="text-xs text-muted-foreground">{approval.date}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button size="sm" variant="outline">
                    Reject
                  </Button>
                  <Button size="sm">
                    <CheckCircle className="mr-1 h-3 w-3" />
                    Approve
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderParticipantsContent = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Event Participants</h2>
        <Button variant="outline">
          <BarChart className="mr-2 h-4 w-4" />
          View Analytics
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {students.length > 0 ? (
          <Card>
            <CardHeader>
              <CardTitle>All Participants</CardTitle>
              <CardDescription>Students enrolled in your events</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {students.slice(0, 10).map((student) => (
                  <div key={student.aaparId} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center space-x-3">
                      <Avatar>
                        <AvatarImage src={student.imageUrl} />
                        <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{student.name}</p>
                        <p className="text-sm text-muted-foreground">{student.aaparId}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="secondary">
                        {Math.floor(Math.random() * 3) + 1} Events
                      </Badge>
                      <Button variant="outline" size="sm">
                        View Profile
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-8 text-center">
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No participants registered yet.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );

  const renderSettingsContent = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Settings</h2>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Faculty Preferences</CardTitle>
          <CardDescription>Manage your portal settings and preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Email Notifications</p>
                <p className="text-sm text-muted-foreground">Receive updates about student activities</p>
              </div>
              <Button variant="outline" size="sm">Configure</Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Profile Information</p>
                <p className="text-sm text-muted-foreground">Update your contact details</p>
              </div>
              <Button variant="outline" size="sm">Edit</Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Security Settings</p>
                <p className="text-sm text-muted-foreground">Manage password and security</p>
              </div>
              <Button variant="outline" size="sm">Manage</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return renderHomeContent();
      case 'dashboard':
        return renderDashboardContent();
      case 'events':
        return renderEventsContent();
      case 'approvals':
        return renderApprovalsContent();
      case 'participants':
        return renderParticipantsContent();
      case 'settings':
        return renderSettingsContent();
      default:
        return renderHomeContent();
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header (64px height) */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 h-16">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <img 
              src="/logo-blue.svg" 
              alt="CoCred Logo" 
              className="h-10 w-auto"
            />
          </div>

          {/* Future global search bar space (optional) */}
          <div className="flex-1 max-w-md mx-8">
            {/* Placeholder for future global search */}
          </div>

          {/* Right Section: Notifications + User Info */}
          <div className="flex items-center space-x-3">
            {/* Notification Bell */}
            <Button variant="ghost" size="sm" className="relative p-2">
              <Bell className="h-5 w-5 text-gray-600" />
              {/* Notification badge */}
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                2
              </span>
            </Button>
            
            {/* User Info */}
            <div className="flex items-center space-x-2">
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-blue-100 text-blue-600 text-sm">F</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-gray-700 max-w-32 truncate">Faculty User</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-64px)]">
        {/* Left Sidebar (same as student) */}
        <div className="w-80 lg:w-80 md:w-16 bg-white border-r border-gray-200 flex flex-col transition-all duration-300">
          <div className="p-4 flex-1">
            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3 md:hidden lg:block">
              Navigation
            </h3>
            <nav className="space-y-1">
              {navigationItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`
                      w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-all duration-200
                      ${isActive 
                        ? "bg-white text-[#2161FF] border-l-4 border-[#2161FF] shadow-sm" 
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      }
                    `}
                    title={item.label}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    <span className="font-medium md:hidden lg:block">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
          
          {/* Bottom Navigation */}
          <div className="p-4 border-t border-gray-200">
            <nav className="space-y-1">
              {bottomNavigationItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (item.id === 'logout') {
                        window.location.href = '/';
                      }
                    }}
                    className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all duration-200"
                    title={item.label}
                  >
                    <Icon className="h-5 w-5 flex-shrink-0" />
                    <span className="font-medium md:hidden lg:block">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Right Content Area (same as student) */}
        <div className="flex-1 p-6 overflow-auto bg-[#F8FAFC]">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}