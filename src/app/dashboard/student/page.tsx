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
  LayoutDashboard
} from "lucide-react";
import { useState, useContext } from "react";
import { LanguageContext } from "@/lib/language-context";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { useAuth } from "@/lib/auth-context";
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

type NavigationTab = "profile" | "dashboard" | "upload" | "download" | "qr" | "share" | "settings" | "help";
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
    { id: "download" as NavigationTab, label: "Download", icon: Download },
    { id: "qr" as NavigationTab, label: "Generate QR", icon: QrCode },
    { id: "share" as NavigationTab, label: "Share Portfolio", icon: Share2 },
  ];

  const bottomNavigationItems = [
    { id: "help" as NavigationTab, label: "Help / FAQ", icon: HelpCircle },
    { id: "settings" as NavigationTab, label: "Settings", icon: Settings },
  ];

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
          {activeTab === "dashboard" && (
            <div className="space-y-6">
              {/* Two-Card Upload Grid */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {/* Documents Upload Card */}
                <Card className="bg-white shadow-sm hover:shadow-md transition-shadow rounded-xl border border-gray-100 cursor-pointer">
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
                <Card className="bg-white shadow-sm hover:shadow-md transition-shadow rounded-xl border border-gray-100 cursor-pointer">
                  <CardContent className="p-6">
                    <div className="text-center">
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Download & Manage</h3>
                      <p className="text-sm text-gray-500 mb-4">
                        Download your documents and manage your portfolio
                      </p>
                      <div className="flex justify-center space-x-6 mb-4">
                        <div className="flex flex-col items-center space-y-1">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <Download className="h-5 w-5 text-blue-600" />
                          </div>
                          <span className="text-xs text-gray-600">Download</span>
                        </div>
                        <div className="flex flex-col items-center space-y-1">
                          <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                            <QrCode className="h-5 w-5 text-indigo-600" />
                          </div>
                          <span className="text-xs text-gray-600">Generate QR</span>
                        </div>
                        <div className="flex flex-col items-center space-y-1">
                          <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                            <Share2 className="h-5 w-5 text-emerald-600" />
                          </div>
                          <span className="text-xs text-gray-600">Share</span>
                        </div>
                      </div>
                      <Button onClick={() => {
                        // TODO: Navigate to download/manage page
                        console.log('Navigate to download page');
                      }} variant="outline" className="border-[#2161FF] text-[#2161FF] hover:bg-blue-50">
                        <Folder className="h-4 w-4 mr-2" />
                        Manage Files
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Certificates List */}
              <Card className="bg-white shadow-sm hover:shadow-md transition-shadow rounded-xl border border-gray-100">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl text-gray-900">Certificates List</CardTitle>
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <Input 
                          placeholder="Search certificates..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 w-64 focus:border-[#2161FF] focus:ring-[#2161FF]"
                        />
                      </div>
                      {selectedCertificates.length > 0 && (
                        <Button size="sm" variant="outline" className="text-red-600 hover:bg-red-50 border-red-200">
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete ({selectedCertificates.filter(id => selectableIds.includes(id)).length})
                        </Button>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-12">
                          {selectableCertificates.length > 0 && (
                            <Checkbox 
                              checked={selectableIds.length > 0 && selectableIds.every(id => selectedCertificates.includes(id))}
                              onCheckedChange={handleSelectAll}
                            />
                          )}
                        </TableHead>
                        <TableHead>Name</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Event/Body</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredCertificates.map((cert) => (
                        <TableRow key={cert.id} className="hover:bg-gray-50">
                          <TableCell>
                            {cert.status !== "approved" && (
                              <Checkbox 
                                checked={selectedCertificates.includes(cert.id)}
                                onCheckedChange={() => handleCertificateSelect(cert.id)}
                              />
                            )}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-3">
                              {getDocumentIcon(cert.type)}
                              <span className="font-medium">{cert.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 capitalize">
                              {cert.type}
                            </span>
                          </TableCell>
                          <TableCell className="text-gray-600">{cert.event}</TableCell>
                          <TableCell>{getStatusBadge(cert.status)}</TableCell>
                          <TableCell className="text-gray-500">
                            {new Date(cert.date).toLocaleDateString()}
                          </TableCell>
                          <TableCell>
                            <TooltipProvider>
                              <div className="flex space-x-1">
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>View</TooltipContent>
                                </Tooltip>
                                
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                      <Download className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Download</TooltipContent>
                                </Tooltip>
                                
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                                      <QrCode className="h-4 w-4" />
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent>Generate QR</TooltipContent>
                                </Tooltip>
                                
                                {cert.status !== "approved" && (
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-500 hover:text-red-700">
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </TooltipTrigger>
                                    <TooltipContent>Delete</TooltipContent>
                                  </Tooltip>
                                )}
                              </div>
                            </TooltipProvider>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Upload Tab Content */}
          {activeTab === "upload" && (
            <div className="space-y-6">
              <Card className="bg-white shadow-sm hover:shadow-md transition-shadow rounded-xl border border-gray-100">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-900">Upload Documents</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                      <Upload className="h-8 w-8 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Your Certificates</h3>
                    <p className="text-gray-500 mb-6">Upload certificates, internships, and project documents</p>
                    <Button className="bg-[#2161FF] hover:bg-blue-700">
                      <Upload className="h-4 w-4 mr-2" />
                      Start Upload
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Download Tab Content */}
          {activeTab === "download" && (
            <div className="space-y-6">
              <Card className="bg-white shadow-sm hover:shadow-md transition-shadow rounded-xl border border-gray-100">
                <CardHeader>
                  <CardTitle className="text-xl text-gray-900">Download Center</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                      <Download className="h-8 w-8 text-blue-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Download Your Documents</h3>
                    <p className="text-gray-500 mb-6">Access and download all your certificates and documents</p>
                    <Button className="bg-[#2161FF] hover:bg-blue-700">
                      <Download className="h-4 w-4 mr-2" />
                      Browse Downloads
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Other tab content */}
          {activeTab !== "dashboard" && activeTab !== "upload" && activeTab !== "download" && (
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