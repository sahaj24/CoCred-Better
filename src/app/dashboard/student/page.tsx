"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  LogOut, 
  User, 
  Upload,
  Download,
  QrCode, 
  Settings,
  HelpCircle,
  FileText,
  Award,
  Briefcase,
  GitBranch,
  Eye,
  Trash2,
  Plus,
  Search,
  Share2,
  Folder,
  Bell,
  LayoutDashboard,
  Activity,
  Clock,
  Trophy,
  CheckCircle,
  TrendingUp
} from "lucide-react";
import { useState, useContext } from "react";
import { LanguageContext } from "@/lib/language-context";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { useAuth } from "@/lib/auth-context";
import { useSessionPersistence } from "@/lib/use-session-persistence";
import { useCrossTabAuth } from "@/lib/use-cross-tab-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UploadPage } from '@/components/upload/upload-page';
import { SharePortfolioPage } from '@/components/portfolio/share-portfolio-page';
import { ActivitiesPage } from '@/components/activities/activities-page';
import { TimelinePage } from '@/components/timeline/timeline-page';
import { QRGeneratorPage } from '@/components/qr/qr-generator-page';
import { SettingsPage } from '@/components/settings/settings-page';
import { FAQPage } from '@/components/faq/faq-page';
import StudentProfilePage from '@/components/profile/student-profile-page';
import { AddActivityModal } from '@/components/activities/add-activity-modal';

type NavigationTab = "profile" | "dashboard" | "upload" | "activities" | "timeline" | "qr" | "share" | "settings" | "faq";
type CertificateStatus = "pending" | "approved" | "rejected";
type CertificateType = "certificate" | "internship" | "project" | "workshop";

interface Certificate {
  id: string;
  name: string;
  type: CertificateType;
  event: string;
  status: CertificateStatus;
  date: string;
  selected?: boolean;
}

export default function StudentDashboard() {
  return (
    <ProtectedRoute requiredUserType="student">
      <StudentDashboardContent />
    </ProtectedRoute>
  );
}

function StudentDashboardContent() {
  const { user, signOut } = useAuth();
  const { translations } = useContext(LanguageContext);
  
  // Use session persistence hook
  useSessionPersistence();
  
  // Use cross-tab auth synchronization
  useCrossTabAuth();
  
  const [activeTab, setActiveTab] = useState<NavigationTab>("dashboard");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCertificates, setSelectedCertificates] = useState<string[]>([]);

  // Mock data for certificates
  const [certificates, setCertificates] = useState<Certificate[]>([
    {
      id: "1",
      name: "JavaScript Certification",
      type: "certificate",
      event: "Web Development Workshop",
      status: "approved",
      date: "2025-09-01",
    },
    {
      id: "2", 
      name: "React Fundamentals Certificate",
      type: "certificate",
      event: "Frontend Bootcamp",
      status: "pending",
      date: "2025-09-10",
    },
    {
      id: "3",
      name: "Project Management Certificate",
      type: "workshop",
      event: "Leadership Training",
      status: "approved",
      date: "2025-08-28",
    },
    {
      id: "4",
      name: "Node.js Certificate",
      type: "certificate",
      event: "Backend Development",
      status: "approved",
      date: "2025-08-25",
    },
    {
      id: "5",
      name: "Internship Completion Certificate",
      type: "internship",
      event: "Summer Internship 2025",
      status: "approved",
      date: "2025-08-20",
    }
  ]);

  const handleSignOut = async () => {
    await signOut();
  };

  const getStatusBadge = (status: CertificateStatus) => {
    const variants = {
      pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
      approved: "bg-green-100 text-green-800 border-green-200", 
      rejected: "bg-red-100 text-red-800 border-red-200"
    };
    
    return (
      <Badge variant="outline" className={variants[status]}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getDocumentIcon = (certificateType: CertificateType) => {
    switch (certificateType) {
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

  const handleCertificateSelect = (certificateId: string) => {
    setSelectedCertificates(prev => 
      prev.includes(certificateId) 
        ? prev.filter(id => id !== certificateId)
        : [...prev, certificateId]
    );
  };

  // Filter for selectable certificates (not approved)
  const selectableCertificates = certificates.filter(cert => cert.status !== "approved");
  const selectableIds = selectableCertificates.map(cert => cert.id);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCertificates(selectableIds);
    } else {
      setSelectedCertificates([]);
    }
  };

  const filteredCertificates = certificates.filter(cert =>
    cert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.event.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const navigationItems = [
    { id: "profile" as NavigationTab, label: "Profile", icon: User },
    { id: "dashboard" as NavigationTab, label: "Dashboard", icon: LayoutDashboard },
    { id: "upload" as NavigationTab, label: "Upload", icon: Upload },
    { id: "activities" as NavigationTab, label: "Activities", icon: Activity },
    { id: "timeline" as NavigationTab, label: "Timeline", icon: Clock },
    { id: "qr" as NavigationTab, label: "Generate QR", icon: QrCode },
    { id: "share" as NavigationTab, label: "Share Portfolio", icon: Share2 },
  ];

  const bottomNavigationItems = [
    { id: "faq" as NavigationTab, label: "Help / FAQ", icon: HelpCircle },
    { id: "settings" as NavigationTab, label: "Settings", icon: Settings },
  ];

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
            
          {/* Right Section: Notifications + User Dropdown */}
          <div className="flex items-center space-x-3">
            {/* Notification Bell */}
            <Button variant="ghost" size="sm" className="relative p-2">
              <Bell className="h-5 w-5 text-gray-600" />
              {/* Notification badge */}
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </Button>
            
            {/* User Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.user_metadata?.avatar_url} />
                    <AvatarFallback className="bg-blue-100 text-blue-600 text-sm">
                      {user?.email?.charAt(0).toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium text-gray-700 max-w-32 truncate">
                    {user?.user_metadata?.full_name || user?.email?.split("@")[0] || "User"}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => setActiveTab("profile")}>
                  <User className="h-4 w-4 mr-2" />
                  Profile Settings
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-64px)]">
        {/* Left Sidebar (26% width, responsive) */}
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

            {/* Spacer */}
            <div className="my-6 border-t border-gray-200"></div>

            {/* Bottom navigation items */}
            <nav className="space-y-1">
              {bottomNavigationItems.map((item) => {
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
          
          {/* Logout at bottom */}
          <div className="p-4 border-t border-gray-200">
            <button
              onClick={handleSignOut}
              className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-red-600 hover:bg-red-50 transition-all duration-200"
              title="Logout"
            >
              <LogOut className="h-5 w-5 flex-shrink-0" />
              <span className="font-medium md:hidden lg:block">Logout</span>
            </button>
          </div>
        </div>

        {/* Right Content Area (74% width, responsive) */}
        <div className="flex-1 p-6 overflow-auto bg-[#F8FAFC]">
          {/* Profile Tab Content */}
          {activeTab === "profile" && (
            <StudentProfilePage />
          )}

          {activeTab === "dashboard" && (
            <div className="space-y-6">
              {/* Two-Card Upload Grid */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Documents Upload Card */}
                <Card className="bg-white border border-gray-200 hover:border-blue-300 transition-colors rounded-lg cursor-pointer">
                  <CardContent className="p-6">
                    <div className="text-center">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Upload Documents</h3>
                      <p className="text-sm text-gray-500 mb-4">
                        Upload your certificates, internships, and other documents
                      </p>
                      <div className="flex justify-center space-x-4 mb-4">
                        <div className="flex flex-col items-center space-y-1">
                          <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                            <Award className="h-5 w-5 text-yellow-600" />
                          </div>
                          <span className="text-xs text-gray-600">Certificate</span>
                        </div>
                        <div className="flex flex-col items-center space-y-1">
                          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                            <Briefcase className="h-5 w-5 text-green-600" />
                          </div>
                          <span className="text-xs text-gray-600">Internship</span>
                        </div>
                        <div className="flex flex-col items-center space-y-1">
                          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                            <GitBranch className="h-5 w-5 text-purple-600" />
                          </div>
                          <span className="text-xs text-gray-600">Project</span>
                        </div>
                        <div className="flex flex-col items-center space-y-1">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <FileText className="h-5 w-5 text-blue-600" />
                          </div>
                          <span className="text-xs text-gray-600">Workshop</span>
                        </div>
                      </div>
                      <Button onClick={() => {
                        // TODO: Navigate to upload page
                        console.log('Navigate to upload page');
                      }} className="bg-[#2161FF] hover:bg-blue-700">
                        <Upload className="h-4 w-4 mr-2" />
                        Upload Documents
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Downloads & Management Card */}
                <Card className="bg-white border border-gray-200 hover:border-blue-300 transition-colors rounded-lg cursor-pointer">
                  <CardContent className="p-6">
                    <div className="text-center">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Share & Manage</h3>
                      <p className="text-sm text-gray-500 mb-4">
                        Generate QR codes and share your portfolio
                      </p>
                      <div className="flex justify-center space-x-6 mb-4">
                        <div className="flex flex-col items-center space-y-1">
                          <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                            <QrCode className="h-5 w-5 text-indigo-600" />
                          </div>
                          <span className="text-xs text-gray-600">Generate QR</span>
                        </div>
                        <div className="flex flex-col items-center space-y-1">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Share2 className="h-5 w-5 text-blue-600" />
                          </div>
                          <span className="text-xs text-gray-600">Share</span>
                        </div>
                      </div>
                      <Button onClick={() => {
                        setActiveTab("share");
                      }} variant="outline" className="border-[#2161FF] text-[#2161FF] hover:bg-blue-50">
                        <Folder className="h-4 w-4 mr-2" />
                        Share Portfolio
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Activities */}
              <Card className="bg-white shadow-sm hover:shadow-md transition-shadow rounded-xl border border-gray-100">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl text-gray-900 flex items-center gap-3">
                      <Clock className="h-5 w-5 text-blue-600" />
                      Recent Activities
                    </CardTitle>
                    <Button 
                      onClick={() => setActiveTab("activities")}
                      variant="outline" 
                      size="sm"
                      className="border-blue-200 text-blue-600 hover:bg-blue-50"
                    >
                      View All Activities
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Quick Stats Row */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div className="bg-slate-50 p-3 rounded-lg border border-gray-200">
                        <div className="flex items-center gap-2">
                          <Award className="h-4 w-4 text-blue-600" />
                          <div>
                            <p className="text-xs font-medium text-gray-700">Pending</p>
                            <p className="text-lg font-semibold text-gray-900">3</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-lg border border-gray-200">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-blue-600" />
                          <div>
                            <p className="text-xs font-medium text-gray-700">Approved</p>
                            <p className="text-lg font-semibold text-gray-900">12</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-lg border border-gray-200">
                        <div className="flex items-center gap-2">
                          <Briefcase className="h-4 w-4 text-blue-600" />
                          <div>
                            <p className="text-xs font-medium text-gray-700">This Month</p>
                            <p className="text-lg font-semibold text-gray-900">5</p>
                          </div>
                        </div>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-lg border border-gray-200">
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-blue-600" />
                          <div>
                            <p className="text-xs font-medium text-gray-700">Total</p>
                            <p className="text-lg font-semibold text-gray-900">28</p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Recent Activities List */}
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900 mb-3">Latest Submissions</h4>
                      
                      {/* Activity Item 1 */}
                      <div className="flex items-start gap-4 p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <Award className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h5 className="font-medium text-gray-900 truncate">Machine Learning Certificate</h5>
                            <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">Coursera - Stanford University</p>
                          <p className="text-xs text-gray-500 mt-2">Submitted 2 days ago</p>
                        </div>
                        <Button size="sm" variant="ghost" className="text-blue-600 hover:bg-blue-50">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Activity Item 2 */}
                      <div className="flex items-start gap-4 p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h5 className="font-medium text-gray-900 truncate">Web Development Internship</h5>
                            <Badge className="bg-green-100 text-green-800 border-green-200">Approved</Badge>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">TechCorp Inc. - 3 months</p>
                          <p className="text-xs text-gray-500 mt-2">Approved 1 week ago</p>
                        </div>
                        <Button size="sm" variant="ghost" className="text-green-600 hover:bg-green-50">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Activity Item 3 */}
                      <div className="flex items-start gap-4 p-4 bg-white border border-gray-200 rounded-lg hover:shadow-sm transition-shadow">
                        <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                          <Briefcase className="h-5 w-5 text-purple-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <h5 className="font-medium text-gray-900 truncate">React Portfolio Project</h5>
                            <Badge className="bg-blue-100 text-blue-800 border-blue-200">Under Review</Badge>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">Personal Project - Frontend Development</p>
                          <p className="text-xs text-gray-500 mt-2">Submitted 5 days ago</p>
                        </div>
                        <Button size="sm" variant="ghost" className="text-purple-600 hover:bg-purple-50">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>

                      {/* Quick Action to Add New Activity */}
                      <AddActivityModal>
                        <div className="mt-4 p-4 border-2 border-dashed border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors cursor-pointer">
                          <div className="text-center">
                            <Plus className="h-6 w-6 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-600">Add New Activity</p>
                            <p className="text-xs text-gray-500">Click to log a new certificate, project, or internship</p>
                          </div>
                        </div>
                      </AddActivityModal>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Upload Tab Content */}
          {activeTab === "upload" && (
            <UploadPage />
          )}

          {/* Share Portfolio Tab Content */}
          {activeTab === "share" && (
            <SharePortfolioPage />
          )}

          {/* Activities Tab Content */}
          {activeTab === "activities" && (
            <ActivitiesPage />
          )}

          {/* Timeline Tab Content */}
          {activeTab === "timeline" && (
            <TimelinePage />
          )}

          {/* QR Generator Tab Content */}
          {activeTab === "qr" && (
            <QRGeneratorPage />
          )}

          {/* Settings Tab Content */}
          {activeTab === "settings" && (
            <SettingsPage />
          )}

          {/* FAQ Tab Content */}
          {activeTab === "faq" && (
            <FAQPage />
          )}

          {/* Other tab content */}
          {activeTab !== "profile" && activeTab !== "dashboard" && activeTab !== "upload" && activeTab !== "share" && activeTab !== "activities" && activeTab !== "timeline" && activeTab !== "qr" && activeTab !== "settings" && activeTab !== "faq" && (
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                {[...navigationItems, ...bottomNavigationItems].find(item => item.id === activeTab)?.label}
              </h2>
              <p className="text-gray-500">Content for this section is coming soon...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}