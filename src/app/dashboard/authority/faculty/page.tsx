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
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight">Good morning, Event Organizer</h1>
        <p className="text-muted-foreground mt-1">Manage your events, approvals, and participants from here.</p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-card rounded-xl p-6 border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">My Events</p>
              <p className="text-2xl font-semibold mt-1">8</p>
            </div>
            <div className="h-10 w-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <Calendar className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-card rounded-xl p-6 border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Pending Approvals</p>
              <p className="text-2xl font-semibold mt-1">15</p>
            </div>
            <div className="h-10 w-10 bg-orange-50 rounded-lg flex items-center justify-center">
              <UserCheck className="h-5 w-5 text-orange-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-card rounded-xl p-6 border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Total Participants</p>
              <p className="text-2xl font-semibold mt-1">{students.length + 45}</p>
            </div>
            <div className="h-10 w-10 bg-green-50 rounded-lg flex items-center justify-center">
              <Users className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-card rounded-xl p-6 border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Certificate Approvals</p>
              <p className="text-2xl font-semibold mt-1">23</p>
            </div>
            <div className="h-10 w-10 bg-purple-50 rounded-lg flex items-center justify-center">
              <CheckCircle className="h-5 w-5 text-purple-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-medium mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button 
            onClick={() => setActiveTab("events")}
            className="text-left p-6 bg-card rounded-xl border hover:shadow-md transition-shadow"
          >
            <div className="flex items-start space-x-4">
              <div className="h-10 w-10 bg-blue-50 rounded-lg flex items-center justify-center">
                <Plus className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-medium">Create New Event</h3>
                <p className="text-sm text-muted-foreground mt-1">Organize workshops, competitions, and seminars</p>
              </div>
            </div>
          </button>
          
          <button 
            onClick={() => setActiveTab("approvals")}
            className="text-left p-6 bg-card rounded-xl border hover:shadow-md transition-shadow"
          >
            <div className="flex items-start space-x-4">
              <div className="h-10 w-10 bg-orange-50 rounded-lg flex items-center justify-center">
                <ClipboardList className="h-5 w-5 text-orange-600" />
              </div>
              <div>
                <h3 className="font-medium">Review Approvals</h3>
                <p className="text-sm text-muted-foreground mt-1">Approve student registrations and submissions</p>
              </div>
            </div>
          </button>
          
          <button 
            onClick={() => setActiveTab("approvals")}
            className="text-left p-6 bg-card rounded-xl border hover:shadow-md transition-shadow"
          >
            <div className="flex items-start space-x-4">
              <div className="h-10 w-10 bg-green-50 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium">Approve Certificates</h3>
                <p className="text-sm text-muted-foreground mt-1">Review and approve certificate requests</p>
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Recent Activity & Pending Tasks */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span>Approved 5 new registrations for "Tech Workshop"</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <Award className="h-4 w-4 text-purple-600" />
                <span>Approved 8 certificate requests for "Web Dev Workshop"</span>
              </div>
              <div className="flex items-center space-x-3 text-sm">
                <Calendar className="h-4 w-4 text-blue-600" />
                <span>Created new event "AI Workshop Series"</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Pending Tasks</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Clock className="h-4 w-4 text-orange-600" />
                  <span className="text-sm">15 registration approvals</span>
                </div>
                <Button size="sm" variant="outline">Review</Button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Award className="h-4 w-4 text-purple-600" />
                  <span className="text-sm">3 certificates to approve</span>
                </div>
                <Button size="sm" variant="outline">Issue</Button>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Eye className="h-4 w-4 text-blue-600" />
                  <span className="text-sm">Review event feedback</span>
                </div>
                <Button size="sm" variant="outline">View</Button>
              </div>
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
    <div className="min-h-screen bg-gray-50">
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
                        ? "bg-blue-50 text-[#2161FF] border-l-4 border-[#2161FF]" 
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