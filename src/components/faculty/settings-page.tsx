"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { 
  Settings, 
  User, 
  Bell, 
  Shield, 
  Download, 
  Trash2,
  Save,
  Upload,
  Eye,
  EyeOff,
  Users,
  Award,
  Calendar,
  FileText,
  Lock,
  Globe,
  Smartphone,
  Mail,
  BookOpen,
  UserCheck
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export function FacultySettingsPage() {
  const { user, signOut } = useAuth();
  
  // Faculty Profile Settings State
  const [profileData, setProfileData] = useState({
    name: user?.user_metadata?.full_name || user?.email?.split("@")[0] || "",
    email: user?.email || "",
    phone: "",
    title: "Professor",
    department: "Computer Science",
    specialization: "Software Engineering",
    experience: "15 years",
    education: "Ph.D. Computer Science",
    bio: "",
    officeLocation: "",
    officeHours: "",
    researchInterests: "",
    website: "",
    linkedIn: "",
    orcid: "",
  });

  // Authority Settings State
  const [authoritySettings, setAuthoritySettings] = useState({
    authorityLevel: "department_head",
    canApproveInternships: true,
    canIssueWorkshopCertificates: true,
    canManageEvents: true,
    canViewAnalytics: true,
    canBulkApprove: false,
    requireSecondaryApproval: true,
    autoNotifyStudents: true,
  });

  // Privacy Settings State
  const [privacySettings, setPrivacySettings] = useState({
    profilePublic: true,
    showEmail: false,
    showPhone: false,
    showOfficeHours: true,
    allowStudentContact: true,
    showResearchInterests: true,
  });

  // Notification Settings State
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    newSubmissions: true,
    bulkSubmissions: true,
    urgentApprovals: true,
    weeklyDigest: false,
    monthlyReports: true,
    systemUpdates: true,
    maintenanceAlerts: true,
  });

  // Security Settings State
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: false,
    sessionTimeout: 30,
    loginAlerts: true,
    suspiciousActivityAlerts: true,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleProfileSave = () => {
    // In real app, this would save to backend
    console.log('Saving faculty profile:', profileData);
    alert('Profile updated successfully!');
  };

  const handleAuthoritySettingsSave = () => {
    // In real app, this would save to backend
    console.log('Saving authority settings:', authoritySettings);
    alert('Authority settings updated successfully!');
  };

  const handlePrivacySave = () => {
    // In real app, this would save to backend
    console.log('Saving privacy settings:', privacySettings);
    alert('Privacy settings updated successfully!');
  };

  const handleNotificationSave = () => {
    // In real app, this would save to backend
    console.log('Saving notification settings:', notificationSettings);
    alert('Notification settings updated successfully!');
  };

  const handlePasswordChange = () => {
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    if (newPassword.length < 6) {
      alert('Password must be at least 6 characters long!');
      return;
    }
    // In real app, this would update password
    console.log('Changing password');
    alert('Password changed successfully!');
    setNewPassword("");
    setConfirmPassword("");
  };

  const handleExportData = () => {
    // In real app, this would export faculty data
    const exportData = {
      profile: profileData,
      settings: { authority: authoritySettings, privacy: privacySettings, notifications: notificationSettings },
      activities: [], // Would include actual activities managed by faculty
      analytics: {} // Would include faculty analytics data
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'faculty-data-export.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleDeleteAccount = () => {
    const confirmDelete = confirm('Are you sure you want to delete your faculty account? This action cannot be undone.');
    if (confirmDelete) {
      const finalConfirm = confirm('This will permanently delete all your data and revoke your authority permissions. Type "DELETE" to confirm.');
      if (finalConfirm) {
        // In real app, this would delete the account
        console.log('Deleting faculty account');
        alert('Account deletion initiated. You will receive a confirmation email.');
        signOut();
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <Settings className="h-8 w-8 text-[#2161FF]" />
          Faculty Settings
        </h1>
        <p className="text-gray-600">Manage your faculty profile, authority permissions, and system preferences</p>
      </div>

      {/* Faculty Profile Settings */}
      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Faculty Profile Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Avatar and Basic Info */}
          <div className="flex items-center space-x-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={user?.user_metadata?.avatar_url} />
              <AvatarFallback className="bg-[#2161FF] text-white text-2xl">
                {profileData.name.charAt(0) || "F"}
              </AvatarFallback>
            </Avatar>
            <div>
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Change Photo
              </Button>
              <p className="text-sm text-gray-500 mt-1">JPG, PNG or GIF. Max size 2MB.</p>
              <div className="flex gap-2 mt-2">
                <Badge variant="secondary">{profileData.title}</Badge>
                <Badge variant="outline">{profileData.department}</Badge>
              </div>
            </div>
          </div>

          {/* Profile Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={profileData.name}
                onChange={(e) => setProfileData(prev => ({...prev, name: e.target.value}))}
              />
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData(prev => ({...prev, email: e.target.value}))}
              />
            </div>
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={profileData.phone}
                onChange={(e) => setProfileData(prev => ({...prev, phone: e.target.value}))}
                placeholder="+1 (555) 123-4567"
              />
            </div>
            <div>
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={profileData.title}
                onChange={(e) => setProfileData(prev => ({...prev, title: e.target.value}))}
                placeholder="Professor, Associate Professor, etc."
              />
            </div>
            <div>
              <Label htmlFor="department">Department</Label>
              <Input
                id="department"
                value={profileData.department}
                onChange={(e) => setProfileData(prev => ({...prev, department: e.target.value}))}
              />
            </div>
            <div>
              <Label htmlFor="specialization">Specialization</Label>
              <Input
                id="specialization"
                value={profileData.specialization}
                onChange={(e) => setProfileData(prev => ({...prev, specialization: e.target.value}))}
              />
            </div>
            <div>
              <Label htmlFor="experience">Experience</Label>
              <Input
                id="experience"
                value={profileData.experience}
                onChange={(e) => setProfileData(prev => ({...prev, experience: e.target.value}))}
                placeholder="e.g., 15 years"
              />
            </div>
            <div>
              <Label htmlFor="education">Education</Label>
              <Input
                id="education"
                value={profileData.education}
                onChange={(e) => setProfileData(prev => ({...prev, education: e.target.value}))}
                placeholder="e.g., Ph.D. Computer Science"
              />
            </div>
            <div>
              <Label htmlFor="officeLocation">Office Location</Label>
              <Input
                id="officeLocation"
                value={profileData.officeLocation}
                onChange={(e) => setProfileData(prev => ({...prev, officeLocation: e.target.value}))}
                placeholder="e.g., Room 205, CS Building"
              />
            </div>
            <div>
              <Label htmlFor="officeHours">Office Hours</Label>
              <Input
                id="officeHours"
                value={profileData.officeHours}
                onChange={(e) => setProfileData(prev => ({...prev, officeHours: e.target.value}))}
                placeholder="e.g., Mon-Wed 2-4 PM"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="bio">Professional Bio</Label>
            <Textarea
              id="bio"
              value={profileData.bio}
              onChange={(e) => setProfileData(prev => ({...prev, bio: e.target.value}))}
              placeholder="Brief professional background and expertise..."
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="researchInterests">Research Interests</Label>
            <Textarea
              id="researchInterests"
              value={profileData.researchInterests}
              onChange={(e) => setProfileData(prev => ({...prev, researchInterests: e.target.value}))}
              placeholder="Areas of research and academic interest..."
              rows={2}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={profileData.website}
                onChange={(e) => setProfileData(prev => ({...prev, website: e.target.value}))}
                placeholder="https://faculty-website.com"
              />
            </div>
            <div>
              <Label htmlFor="linkedIn">LinkedIn</Label>
              <Input
                id="linkedIn"
                value={profileData.linkedIn}
                onChange={(e) => setProfileData(prev => ({...prev, linkedIn: e.target.value}))}
                placeholder="linkedin.com/in/username"
              />
            </div>
            <div>
              <Label htmlFor="orcid">ORCID</Label>
              <Input
                id="orcid"
                value={profileData.orcid}
                onChange={(e) => setProfileData(prev => ({...prev, orcid: e.target.value}))}
                placeholder="0000-0000-0000-0000"
              />
            </div>
          </div>

          <Button onClick={handleProfileSave} className="bg-[#2161FF] hover:bg-blue-700">
            <Save className="h-4 w-4 mr-2" />
            Save Profile
          </Button>
        </CardContent>
      </Card>

      {/* Authority & Permissions */}
      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserCheck className="h-5 w-5" />
            Authority & Permissions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Approve Internships</Label>
                  <p className="text-sm text-gray-500">Authority to approve student internship activities</p>
                </div>
                <Switch 
                  checked={authoritySettings.canApproveInternships}
                  onCheckedChange={(checked) => setAuthoritySettings(prev => ({...prev, canApproveInternships: checked}))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Issue Workshop Certificates</Label>
                  <p className="text-sm text-gray-500">Authority to issue workshop completion certificates</p>
                </div>
                <Switch 
                  checked={authoritySettings.canIssueWorkshopCertificates}
                  onCheckedChange={(checked) => setAuthoritySettings(prev => ({...prev, canIssueWorkshopCertificates: checked}))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Manage Events</Label>
                  <p className="text-sm text-gray-500">Permission to create and manage institutional events</p>
                </div>
                <Switch 
                  checked={authoritySettings.canManageEvents}
                  onCheckedChange={(checked) => setAuthoritySettings(prev => ({...prev, canManageEvents: checked}))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>View Analytics</Label>
                  <p className="text-sm text-gray-500">Access to institutional analytics and reports</p>
                </div>
                <Switch 
                  checked={authoritySettings.canViewAnalytics}
                  onCheckedChange={(checked) => setAuthoritySettings(prev => ({...prev, canViewAnalytics: checked}))}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Bulk Approve</Label>
                  <p className="text-sm text-gray-500">Ability to approve multiple activities at once</p>
                </div>
                <Switch 
                  checked={authoritySettings.canBulkApprove}
                  onCheckedChange={(checked) => setAuthoritySettings(prev => ({...prev, canBulkApprove: checked}))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Require Secondary Approval</Label>
                  <p className="text-sm text-gray-500">Require additional approval for high-value certificates</p>
                </div>
                <Switch 
                  checked={authoritySettings.requireSecondaryApproval}
                  onCheckedChange={(checked) => setAuthoritySettings(prev => ({...prev, requireSecondaryApproval: checked}))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Auto-notify Students</Label>
                  <p className="text-sm text-gray-500">Automatically notify students of approval/rejection</p>
                </div>
                <Switch 
                  checked={authoritySettings.autoNotifyStudents}
                  onCheckedChange={(checked) => setAuthoritySettings(prev => ({...prev, autoNotifyStudents: checked}))}
                />
              </div>
            </div>
          </div>

          <Button onClick={handleAuthoritySettingsSave} variant="outline">
            <Save className="h-4 w-4 mr-2" />
            Save Authority Settings
          </Button>
        </CardContent>
      </Card>

      {/* Privacy Settings */}
      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Privacy Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Make Profile Public</Label>
                <p className="text-sm text-gray-500">Allow students and public to view your faculty profile</p>
              </div>
              <Switch 
                checked={privacySettings.profilePublic}
                onCheckedChange={(checked) => setPrivacySettings(prev => ({...prev, profilePublic: checked}))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Show Email Address</Label>
                <p className="text-sm text-gray-500">Display email on public profile</p>
              </div>
              <Switch 
                checked={privacySettings.showEmail}
                onCheckedChange={(checked) => setPrivacySettings(prev => ({...prev, showEmail: checked}))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Show Office Hours</Label>
                <p className="text-sm text-gray-500">Display office hours for student consultation</p>
              </div>
              <Switch 
                checked={privacySettings.showOfficeHours}
                onCheckedChange={(checked) => setPrivacySettings(prev => ({...prev, showOfficeHours: checked}))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Allow Student Contact</Label>
                <p className="text-sm text-gray-500">Allow students to contact you through the platform</p>
              </div>
              <Switch 
                checked={privacySettings.allowStudentContact}
                onCheckedChange={(checked) => setPrivacySettings(prev => ({...prev, allowStudentContact: checked}))}
              />
            </div>
          </div>

          <Button onClick={handlePrivacySave} variant="outline">
            <Save className="h-4 w-4 mr-2" />
            Save Privacy Settings
          </Button>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-gray-500">Receive important updates via email</p>
                </div>
                <Switch 
                  checked={notificationSettings.emailNotifications}
                  onCheckedChange={(checked) => setNotificationSettings(prev => ({...prev, emailNotifications: checked}))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>New Submissions</Label>
                  <p className="text-sm text-gray-500">Notify when students submit new activities</p>
                </div>
                <Switch 
                  checked={notificationSettings.newSubmissions}
                  onCheckedChange={(checked) => setNotificationSettings(prev => ({...prev, newSubmissions: checked}))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Urgent Approvals</Label>
                  <p className="text-sm text-gray-500">High-priority approval notifications</p>
                </div>
                <Switch 
                  checked={notificationSettings.urgentApprovals}
                  onCheckedChange={(checked) => setNotificationSettings(prev => ({...prev, urgentApprovals: checked}))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>System Updates</Label>
                  <p className="text-sm text-gray-500">Platform updates and new features</p>
                </div>
                <Switch 
                  checked={notificationSettings.systemUpdates}
                  onCheckedChange={(checked) => setNotificationSettings(prev => ({...prev, systemUpdates: checked}))}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Weekly Digest</Label>
                  <p className="text-sm text-gray-500">Weekly summary of activities and approvals</p>
                </div>
                <Switch 
                  checked={notificationSettings.weeklyDigest}
                  onCheckedChange={(checked) => setNotificationSettings(prev => ({...prev, weeklyDigest: checked}))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Monthly Reports</Label>
                  <p className="text-sm text-gray-500">Monthly analytics and performance reports</p>
                </div>
                <Switch 
                  checked={notificationSettings.monthlyReports}
                  onCheckedChange={(checked) => setNotificationSettings(prev => ({...prev, monthlyReports: checked}))}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Maintenance Alerts</Label>
                  <p className="text-sm text-gray-500">System maintenance and downtime notifications</p>
                </div>
                <Switch 
                  checked={notificationSettings.maintenanceAlerts}
                  onCheckedChange={(checked) => setNotificationSettings(prev => ({...prev, maintenanceAlerts: checked}))}
                />
              </div>
            </div>
          </div>

          <Button onClick={handleNotificationSave} variant="outline">
            <Save className="h-4 w-4 mr-2" />
            Save Notification Settings
          </Button>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card className="bg-white">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Change Password */}
          <div>
            <Label>Change Password</Label>
            <div className="space-y-2 mt-2">
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="New Password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <Button onClick={handlePasswordChange} size="sm">
                Change Password
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Two-Factor Authentication</Label>
                <p className="text-sm text-gray-500">Add extra security to your account</p>
              </div>
              <Switch 
                checked={securitySettings.twoFactorEnabled}
                onCheckedChange={(checked) => setSecuritySettings(prev => ({...prev, twoFactorEnabled: checked}))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Login Alerts</Label>
                <p className="text-sm text-gray-500">Get notified of new login attempts</p>
              </div>
              <Switch 
                checked={securitySettings.loginAlerts}
                onCheckedChange={(checked) => setSecuritySettings(prev => ({...prev, loginAlerts: checked}))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card className="bg-white">
        <CardHeader>
          <CardTitle>Data Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button onClick={handleExportData} variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <Download className="h-6 w-6" />
              <span>Export Faculty Data</span>
              <span className="text-xs text-gray-500">Download all your data and settings</span>
            </Button>
            
            <Button onClick={handleDeleteAccount} variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2 text-red-600 border-red-200 hover:bg-red-50">
              <Trash2 className="h-6 w-6" />
              <span>Delete Faculty Account</span>
              <span className="text-xs text-gray-500">Permanently remove account and revoke permissions</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}