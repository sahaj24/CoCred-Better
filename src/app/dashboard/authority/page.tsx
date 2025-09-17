
"use client";

import { useState, useContext, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Modal,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  BarChart,
  Upload,
  Download,
  X,
  Check,
  FilePlus,
  ChevronRight,
  Trash2
} from "lucide-react";
import { getAllUserProfiles, getEvents, removeEvent } from "@/lib/file-store";
import type { UserProfile, AppEvent, SupabaseUserProfile } from "@/lib/types";
import { getPendingCertificates, getCertificateStats, updateCertificateStatus } from "@/lib/faculty-certificates";
import { LanguageContext } from "@/lib/language-context";
import { format } from "date-fns";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/lib/supabase";
import { AuthorityRoute } from "@/components/auth/protected-route";
import { getAuthorityFeatures, getAuthorityRole, hasPermission } from "@/lib/authority-roles";
import { DEV_MODE, getMockProfile } from "@/lib/dev-config";
import { FacultyAnalyticsPage } from '@/components/faculty/analytics-page';
import { FacultyActivitiesPage } from '@/components/faculty/activities-page';
import { FacultyTimelinePage } from '@/components/faculty/timeline-page';
import { FacultySettingsPage } from '@/components/faculty/settings-page';
import { FacultyFAQPage } from '@/components/faculty/faq-page';

type NavigationTab = 'home' | 'dashboard' | 'students' | 'events' | 'recent' | 'faculty' | 'analytics' | 'activities' | 'timeline' | 'settings' | 'faq';


export default function AuthorityDashboard() {
  const [activeTab, setActiveTab] = useState<NavigationTab>("home");
  const [students, setStudents] = useState<UserProfile[]>([]);
  const [events, setEvents] = useState<AppEvent[]>([]);
  const [eventToDelete, setEventToDelete] = useState<AppEvent | null>(null);
  const [userProfile, setUserProfile] = useState<SupabaseUserProfile | null>(null);
  const [pendingCertificates, setPendingCertificates] = useState<any[]>([]);
  const [certificateStats, setCertificateStats] = useState({ pending: 0, approved: 0, rejected: 0, total: 0 });
  const { translations } = useContext(LanguageContext);
  const { toast } = useToast();
  const { user } = useAuth();

  useEffect(() => {
    setStudents(getAllUserProfiles());
    setEvents(getEvents());
    loadCertificateData();
  }, []);

  const loadCertificateData = async () => {
    try {
      const [certificates, stats] = await Promise.all([
        getPendingCertificates(),
        getCertificateStats()
      ]);
      setPendingCertificates(certificates);
      setCertificateStats(stats);
    } catch (error) {
      console.error('Error loading certificate data:', error);
    }
  };

  const handleCertificateAction = async (certificateId: string, status: 'approved' | 'rejected', feedback?: string) => {
    try {
      await updateCertificateStatus(certificateId, status, feedback);
      toast({
        title: status === 'approved' ? 'Certificate Approved' : 'Certificate Rejected',
        description: `Certificate has been ${status} successfully.`
      });
      loadCertificateData(); // Refresh data
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update certificate status.',
        variant: 'destructive'
      });
    }
  };

  // Fetch user profile to get authority type and permissions
  useEffect(() => {
    async function fetchUserProfile() {
      // Use mock profile in dev mode
      if (DEV_MODE.BYPASS_AUTH) {
        setUserProfile(DEV_MODE.MOCK_AUTHORITY_PROFILE);
        return;
      }

      if (!user?.id) return;

      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error('Error fetching user profile:', error);
        } else {
          setUserProfile(profile);
        }
      } catch (error) {
        console.error('Error in fetchUserProfile:', error);
      }
    }

    fetchUserProfile();
  }, [user]);

  const handleDeleteEvent = () => {
    if (!eventToDelete) return;
    
    // Check permission before deleting
    if (!hasPermission(userProfile?.permissions, 'can_delete_events')) {
      toast({
        title: "Access Denied",
        description: "You don't have permission to delete events.",
        variant: "destructive"
      });
      setEventToDelete(null);
      return;
    }

    removeEvent(eventToDelete.id);
    toast({
      title: "Event Deleted",
      description: `The event "${eventToDelete.name}" has been successfully removed.`,
    });
    setEvents(getEvents()); // Refresh the events list
    setEventToDelete(null);
  };

  // Get authority role information
  const authorityRole = userProfile?.authority_type ? getAuthorityRole(userProfile.authority_type) : null;

  // Check permissions
  const canManageStudents = hasPermission(userProfile?.permissions, 'can_manage_students');
  const canCreateEvents = hasPermission(userProfile?.permissions, 'can_create_events');
  const canDeleteEvents = hasPermission(userProfile?.permissions, 'can_delete_events');
  const canIssueCertificates = hasPermission(userProfile?.permissions, 'can_issue_certificates');
  const canApproveCertificates = hasPermission(userProfile?.permissions, 'can_approve_certificates');
  const canManageFaculty = hasPermission(userProfile?.permissions, 'can_manage_faculty');
  const canViewAnalytics = hasPermission(userProfile?.permissions, 'can_view_analytics');

  // Navigation items based on permissions
  const navigationItems = [
    { id: "home" as NavigationTab, label: "Home", icon: Home },
    { id: "dashboard" as NavigationTab, label: "Dashboard", icon: LayoutDashboard },
    ...(canManageStudents ? [{ id: "students" as NavigationTab, label: "Students", icon: Users }] : []),
    { id: "activities" as NavigationTab, label: "Activities", icon: ClipboardList },
    ...(canCreateEvents ? [{ id: "events" as NavigationTab, label: "Events", icon: Calendar }] : []),
    ...(canIssueCertificates || canApproveCertificates ? [{ id: "recent" as NavigationTab, label: "Recent", icon: Clock }] : []),
    { id: "timeline" as NavigationTab, label: "Timeline", icon: Clock },
    ...(canManageFaculty ? [{ id: "faculty" as NavigationTab, label: "Faculty", icon: UserCheck }] : []),
    ...(canViewAnalytics ? [{ id: "analytics" as NavigationTab, label: "Analytics", icon: BarChart }] : []),
    { id: "settings" as NavigationTab, label: "Settings", icon: Settings },
  ];

  const bottomNavigationItems = [
    { id: "faq", label: "FAQ & Help", icon: HelpCircle },
    { id: "logout", label: "Logout", icon: LogOut },
  ];

  const renderHomeContent = () => (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Welcome, Authority</h2>
        {authorityRole && (
          <div className="flex items-center gap-2 mb-4">
            <Badge variant="secondary">{authorityRole.label}</Badge>
            {userProfile?.organization && (
              <Badge variant="outline">{userProfile.organization}</Badge>
            )}
          </div>
        )}
        <p className="text-muted-foreground">
          {authorityRole?.description || "Manage the institution's co-curricular activities and certificates."}
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl p-6 border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Students</p>
              <p className="text-2xl font-semibold mt-1">{students.length}</p>
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
              <p className="text-2xl font-semibold mt-1">{events.length}</p>
            </div>
            <div className="h-10 w-10 bg-green-50 rounded-lg flex items-center justify-center">
              <Calendar className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-xl p-6 border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending Certificates</p>
              <p className="text-2xl font-semibold mt-1">{certificateStats.pending}</p>
            </div>
            <div className="h-10 w-10 bg-purple-50 rounded-lg flex items-center justify-center">
              <Clock className="h-5 w-5 text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 border shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Certificates</p>
              <p className="text-2xl font-semibold mt-1">{certificateStats.total}</p>
            </div>
            <div className="h-10 w-10 bg-orange-50 rounded-lg flex items-center justify-center">
              <UserCheck className="h-5 w-5 text-orange-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-medium mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {canManageStudents && (
            <button 
              onClick={() => setActiveTab("students")}
              className="text-left p-6 bg-white rounded-xl border shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start space-x-4">
                <div className="h-10 w-10 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium">Manage Students</h3>
                  <p className="text-sm text-muted-foreground mt-1">View and manage student profiles</p>
                </div>
              </div>
            </button>
          )}
          
          {canCreateEvents && (
            <button 
              onClick={() => setActiveTab("events")}
              className="text-left p-6 bg-white rounded-xl border shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start space-x-4">
                <div className="h-10 w-10 bg-green-50 rounded-lg flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-medium">Manage Events</h3>
                  <p className="text-sm text-muted-foreground mt-1">Create and oversee institutional events</p>
                </div>
              </div>
            </button>
          )}

          {(canIssueCertificates || canApproveCertificates) && (
            <button 
              onClick={() => setActiveTab("recent")}
              className="text-left p-6 bg-white rounded-xl border shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start space-x-4">
                <div className="h-10 w-10 bg-purple-50 rounded-lg flex items-center justify-center">
                  <Clock className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-medium">Recent Activities</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    View recent submissions and activities
                  </p>
                </div>
              </div>
            </button>
          )}
        </div>
      </div>
    </div>
  );

  const renderDashboardContent = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingCertificates.slice(0, 3).map((cert) => (
                <div key={cert.id} className="flex items-center space-x-3 p-3 bg-muted/30 rounded-lg">
                  <Clock className="h-4 w-4 text-orange-600 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium">Certificate pending review</p>
                    <p className="text-xs text-muted-foreground">{cert.student_name} - {cert.name}</p>
                  </div>
                  <span className="text-xs text-muted-foreground">{new Date(cert.date).toLocaleDateString()}</span>
                </div>
              ))}
              {pendingCertificates.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No pending certificates</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* System Status */}
        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Student Registrations</span>
                <Badge variant="secondary">Active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Certificate Generation</span>
                <Badge variant="secondary">Active</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Event Management</span>
                <Badge variant="secondary">Active</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderStudentsContent = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Student Management</h2>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Student
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Students</CardTitle>
          <CardDescription>Manage student profiles and documents</CardDescription>
        </CardHeader>
        <CardContent>
          {students.length > 0 ? (
            <div className="space-y-3">
              {students.map((student) => (
                <div key={student.aaparId} className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg hover:bg-secondary/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <Avatar>
                      <AvatarImage src={student.imageUrl} alt={student.name} />
                      <AvatarFallback>{student.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{student.name}</p>
                      <p className="text-sm text-muted-foreground">{student.aaparId}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {canIssueCertificates && (
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/dashboard/authority/issue-document/${student.aaparId}`}>
                          <FilePlus className="mr-2 h-4 w-4" />
                          Issue Document
                        </Link>
                      </Button>
                    )}
                    <Button asChild size="sm">
                      <Link href={`/dashboard/authority/student/${student.aaparId}`}>
                        View Documents
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">No students registered yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderEventsContent = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Event Management</h2>
        <Button asChild>
          <Link href="/dashboard/authority/add-event">
            <Plus className="mr-2 h-4 w-4" />
            Create Event
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Events</CardTitle>
          <CardDescription>Manage institutional events and activities</CardDescription>
        </CardHeader>
        <CardContent>
          {events.length > 0 ? (
            <div className="space-y-3">
              {events.map((event) => (
                <div key={event.id} className="flex items-center justify-between p-4 bg-secondary/30 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Calendar className="h-4 w-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{event.name}</p>
                      <p className="text-sm text-muted-foreground">{event.organizer}</p>
                      <p className="text-xs text-muted-foreground font-mono">{event.key}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {format(new Date(event.startDate), "MMM dd")} - {format(new Date(event.endDate), "MMM dd")}
                      </p>
                      <Link href={event.devopsLink} target="_blank" className="text-sm text-blue-500 hover:underline">
                        DevOps Link
                      </Link>
                    </div>
                    {canDeleteEvents && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive/80" onClick={() => setEventToDelete(event)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        {eventToDelete && eventToDelete.id === event.id && (
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete the event
                              <span className="font-semibold text-foreground"> {event.name}</span>.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel onClick={() => setEventToDelete(null)}>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDeleteEvent}>Continue</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                        )}
                      </AlertDialog>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">No events created yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderRecentContent = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Recent Activities</h2>
        <div className="flex items-center space-x-2">
          <Modal>
            <ModalTrigger asChild>
              <Button variant="outline">
                <Upload className="mr-2 h-4 w-4" />
                Upload Document
              </Button>
            </ModalTrigger>
            <ModalContent className="sm:max-w-[425px]">
              <ModalHeader>
                <ModalTitle>Upload Document</ModalTitle>
                <ModalDescription>
                  Upload a new document or certificate for processing
                </ModalDescription>
              </ModalHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="title" className="text-right">
                    Title
                  </Label>
                  <Input
                    id="title"
                    placeholder="Document title..."
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="category" className="text-right">
                    Category
                  </Label>
                  <select className="col-span-3 border border-gray-300 rounded-md px-3 py-2">
                    <option value="">Select category...</option>
                    <option value="certificate">Certificate</option>
                    <option value="document">Official Document</option>
                    <option value="transcript">Transcript</option>
                  </select>
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="file" className="text-right">
                    File
                  </Label>
                  <Input
                    id="file"
                    type="file"
                    className="col-span-3"
                    accept=".pdf,.doc,.docx,.jpg,.png"
                  />
                </div>
              </div>
              <ModalFooter>
                <Button type="submit" className="bg-[#2161FF] hover:bg-blue-700">
                  Upload Document
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
          
          <Button>
            <Clock className="mr-2 h-4 w-4" />
            View All
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Recent Submissions</CardTitle>
            <CardDescription>
              Latest student submissions and applications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {pendingCertificates.map((cert) => (
                <div key={cert.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div>
                    <p className="font-medium">{cert.student_name}</p>
                    <p className="text-sm text-muted-foreground">{cert.name}</p>
                    <p className="text-xs text-muted-foreground">{new Date(cert.date).toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant="secondary">pending</Badge>
                    
                    <Modal>
                      <ModalTrigger asChild>
                        <Button size="sm" variant="outline" className="text-green-600 border-green-200 hover:bg-green-50">
                          <Check className="h-3 w-3 mr-1" />
                          Approve
                        </Button>
                      </ModalTrigger>
                      <ModalContent className="sm:max-w-[425px]">
                        <ModalHeader>
                          <ModalTitle>Approve Certificate</ModalTitle>
                          <ModalDescription>
                            Approve {cert.student_name}'s certificate for {cert.name}
                          </ModalDescription>
                        </ModalHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor={`feedback-${cert.id}`} className="text-right">
                              Feedback
                            </Label>
                            <Textarea 
                              id={`feedback-${cert.id}`}
                              placeholder="Optional feedback for the student..."
                              className="col-span-3"
                            />
                          </div>
                        </div>
                        <ModalFooter>
                          <Button 
                            type="submit" 
                            className="bg-[#2161FF] hover:bg-blue-700"
                            onClick={() => {
                              const feedback = (document.getElementById(`feedback-${cert.id}`) as HTMLTextAreaElement)?.value;
                              handleCertificateAction(cert.id, 'approved', feedback);
                            }}
                          >
                            Approve Certificate
                          </Button>
                        </ModalFooter>
                      </ModalContent>
                    </Modal>

                    <Modal>
                      <ModalTrigger asChild>
                        <Button size="sm" variant="outline" className="text-red-600 border-red-200 hover:bg-red-50">
                          <X className="h-3 w-3 mr-1" />
                          Reject
                        </Button>
                      </ModalTrigger>
                      <ModalContent className="sm:max-w-[425px]">
                        <ModalHeader>
                          <ModalTitle>Reject Certificate</ModalTitle>
                          <ModalDescription>
                            Reject {cert.student_name}'s certificate for {cert.name}
                          </ModalDescription>
                        </ModalHeader>
                        <div className="grid gap-4 py-4">
                          <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor={`reason-${cert.id}`} className="text-right">
                              Reason
                            </Label>
                            <Textarea 
                              id={`reason-${cert.id}`}
                              placeholder="Please provide a reason for rejection..."
                              className="col-span-3"
                              required
                            />
                          </div>
                        </div>
                        <ModalFooter>
                          <Button 
                            type="submit" 
                            variant="destructive"
                            onClick={() => {
                              const reason = (document.getElementById(`reason-${cert.id}`) as HTMLTextAreaElement)?.value;
                              if (reason) handleCertificateAction(cert.id, 'rejected', reason);
                            }}
                          >
                            Reject Certificate
                          </Button>
                        </ModalFooter>
                      </ModalContent>
                    </Modal>
                    
                    <Button size="sm" variant="outline">
                      <Eye className="h-3 w-3 mr-1" />
                      View
                    </Button>
                  </div>
                </div>
              ))}
              {pendingCertificates.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No pending certificates</p>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Activity Statistics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm">Pending</span>
                <span className="font-medium">{certificateStats.pending}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Approved</span>
                <span className="font-medium">{certificateStats.approved}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Rejected</span>
                <span className="font-medium">{certificateStats.rejected}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  const renderSettingsContent = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Settings</h2>
      
      <Card>
        <CardHeader>
          <CardTitle>Authority Profile</CardTitle>
          <CardDescription>Manage your authority settings and preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Authority Type</p>
                <p className="text-sm text-muted-foreground">{authorityRole?.label}</p>
              </div>
              <Badge variant="secondary">{userProfile?.authority_type}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Organization</p>
                <p className="text-sm text-muted-foreground">{userProfile?.organization}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderFacultyContent = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Faculty Management</h2>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Faculty
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Faculty Overview</CardTitle>
            <CardDescription>Manage faculty members and their roles</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="text-sm">Total Faculty</span>
                <span className="font-medium">12</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Active This Month</span>
                <span className="font-medium">8</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Events Organized</span>
                <span className="font-medium">15</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button asChild variant="outline" className="w-full justify-start">
                <Link href="/dashboard/authority/faculty/profile">
                  <UserCheck className="mr-2 h-4 w-4" />
                  View Faculty Profiles
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link href="/dashboard/authority/faculty/batch-upload">
                  <Upload className="mr-2 h-4 w-4" />
                  Batch Upload Faculty
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full justify-start">
                <Link href="/dashboard/authority/faculty/notifications">
                  <Bell className="mr-2 h-4 w-4" />
                  Faculty Notifications
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Faculty Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: "Dr. Smith", action: "Created new event", time: "2 hours ago", event: "AI Workshop" },
              { name: "Prof. Johnson", action: "Updated course materials", time: "4 hours ago", event: "Data Science Course" },
              { name: "Dr. Williams", action: "Approved certificates", time: "1 day ago", event: "Web Development" }
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback>{activity.name.split(' ')[1]?.charAt(0) || 'F'}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">{activity.name}</p>
                    <p className="text-xs text-muted-foreground">{activity.action}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-xs font-medium">{activity.event}</p>
                  <p className="text-xs text-muted-foreground">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderAnalyticsContent = () => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Analytics & Reports</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Student Engagement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <p className="text-xs text-muted-foreground">+5% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Event Completion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">92%</div>
            <p className="text-xs text-muted-foreground">+2% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Certificate Issued</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">347</div>
            <p className="text-xs text-muted-foreground">+28 this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Faculty Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">78%</div>
            <p className="text-xs text-muted-foreground">+12% from last month</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Trends</CardTitle>
          <CardDescription>Performance overview for the last 6 months</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            📊 Charts will be implemented with actual data integration
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
      case 'students':
        return canManageStudents ? renderStudentsContent() : renderHomeContent();
      case 'activities':
        return <FacultyActivitiesPage />;
      case 'events':
        return canCreateEvents ? renderEventsContent() : renderHomeContent();
      case 'recent':
        return (canIssueCertificates || canApproveCertificates) ? renderRecentContent() : renderHomeContent();
      case 'timeline':
        return <FacultyTimelinePage />;
      case 'faculty':
        return canManageFaculty ? renderFacultyContent() : renderHomeContent();
      case 'analytics':
        return canViewAnalytics ? <FacultyAnalyticsPage /> : renderHomeContent();
      case 'settings':
        return <FacultySettingsPage />;
      case 'faq':
        return <FacultyFAQPage />;
      default:
        return renderHomeContent();
    }
  };

  return (
    <AuthorityRoute>
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

            {/* Right Section: Notifications + User Info */}
            <div className="flex items-center space-x-3">
              {/* Notification Bell */}
              <Button variant="ghost" size="sm" className="relative p-2">
                <Bell className="h-5 w-5 text-gray-600" />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                  2
                </span>
              </Button>
              
              {/* User Info */}
              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={userProfile?.avatar_url} alt={userProfile?.full_name} />
                  <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                    {userProfile?.full_name?.charAt(0) || 'A'}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block">
                  <p className="text-sm font-medium">{userProfile?.full_name || 'Authority'}</p>
                  <p className="text-xs text-gray-500">{authorityRole?.label}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex h-[calc(100vh-64px)]">
          {/* Sidebar (320px width) */}
          <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
            {/* Navigation */}
            <div className="flex-1 px-4 py-6">
              <nav className="space-y-2">
                {navigationItems.map((item) => {
                  const IconComponent = item.icon;
                  const isActive = activeTab === item.id;
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id)}
                      className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg text-left transition-colors ${
                        isActive 
                          ? 'bg-primary text-primary-foreground shadow-sm' 
                          : 'text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <IconComponent className="h-5 w-5 flex-shrink-0" />
                      <span className="font-medium">{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Bottom Navigation */}
            <div className="border-t border-gray-200 px-4 py-4">
              <div className="space-y-1">
                {bottomNavigationItems.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        if (item.id === 'logout') {
                          // Handle logout
                          window.location.href = '/';
                        } else if (item.id === 'faq') {
                          setActiveTab('faq');
                        }
                      }}
                      className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      <IconComponent className="h-5 w-5 flex-shrink-0" />
                      <span className="text-sm">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 overflow-auto">
            <div className="p-8">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </AuthorityRoute>
  );
}
