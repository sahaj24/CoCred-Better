"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
  EyeOff
} from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export function SettingsPage() {
  const { user, signOut } = useAuth();
  
  // Profile Settings State
  const [profileData, setProfileData] = useState({
    name: user?.user_metadata?.full_name || user?.email?.split("@")[0] || "",
    email: user?.email || "",
    phone: "",
    bio: "",
    university: "",
    department: "",
    year: "",
    website: "",
  });

  // Privacy Settings State
  const [privacySettings, setPrivacySettings] = useState({
    profilePublic: true,
    showEmail: false,
    showPhone: false,
    allowSearch: true,
    showActivities: true,
  });

  // Notification Settings State
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    activityUpdates: true,
    weeklyDigest: false,
    marketingEmails: false,
  });

  // Security Settings State
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: false,
    sessionTimeout: 30,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleProfileSave = () => {
    // In real app, this would save to backend
    console.log('Saving profile:', profileData);
    alert('Profile updated successfully!');
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
    // In real app, this would export user data
    const exportData = {
      profile: profileData,
      activities: [], // Would include actual activities
      settings: { privacy: privacySettings, notifications: notificationSettings }
    };
    
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'cocred-data-export.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
  };

  const handleDeleteAccount = () => {
    const confirmDelete = confirm('Are you sure you want to delete your account? This action cannot be undone.');
    if (confirmDelete) {
      const finalConfirm = confirm('This will permanently delete all your data. Type "DELETE" to confirm.');
      if (finalConfirm) {
        // In real app, this would delete the account
        console.log('Deleting account');
        alert('Account deletion initiated. You will receive a confirmation email.');
        signOut();
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
          <Settings className="h-8 w-8 text-[#2161FF]" />
          Settings
        </h1>
        <p className="text-gray-600">Manage your account settings and preferences</p>
      </div>

      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Profile Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Avatar */}
          <div className="flex items-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user?.user_metadata?.avatar_url} />
              <AvatarFallback className="bg-[#2161FF] text-white text-xl">
                {profileData.name.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <Button variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Change Photo
              </Button>
              <p className="text-sm text-gray-500 mt-1">JPG, PNG or GIF. Max size 2MB.</p>
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
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                value={profileData.website}
                onChange={(e) => setProfileData(prev => ({...prev, website: e.target.value}))}
                placeholder="https://yourwebsite.com"
              />
            </div>
            <div>
              <Label htmlFor="university">University</Label>
              <Input
                id="university"
                value={profileData.university}
                onChange={(e) => setProfileData(prev => ({...prev, university: e.target.value}))}
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
          </div>

          <div>
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              value={profileData.bio}
              onChange={(e) => setProfileData(prev => ({...prev, bio: e.target.value}))}
              placeholder="Tell us about yourself..."
              rows={3}
            />
          </div>

          <Button onClick={handleProfileSave} className="bg-[#2161FF] hover:bg-blue-700">
            <Save className="h-4 w-4 mr-2" />
            Save Profile
          </Button>
        </CardContent>
      </Card>

      {/* Privacy Settings */}
      <Card>
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
                <p className="text-sm text-gray-500">Allow others to find and view your portfolio</p>
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
                <Label>Show Phone Number</Label>
                <p className="text-sm text-gray-500">Display phone on public profile</p>
              </div>
              <Switch 
                checked={privacySettings.showPhone}
                onCheckedChange={(checked) => setPrivacySettings(prev => ({...prev, showPhone: checked}))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Allow Search Indexing</Label>
                <p className="text-sm text-gray-500">Let search engines find your profile</p>
              </div>
              <Switch 
                checked={privacySettings.allowSearch}
                onCheckedChange={(checked) => setPrivacySettings(prev => ({...prev, allowSearch: checked}))}
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
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notification Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
                <Label>Activity Updates</Label>
                <p className="text-sm text-gray-500">Get notified when activities are approved/rejected</p>
              </div>
              <Switch 
                checked={notificationSettings.activityUpdates}
                onCheckedChange={(checked) => setNotificationSettings(prev => ({...prev, activityUpdates: checked}))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label>Weekly Digest</Label>
                <p className="text-sm text-gray-500">Receive weekly summary of your activities</p>
              </div>
              <Switch 
                checked={notificationSettings.weeklyDigest}
                onCheckedChange={(checked) => setNotificationSettings(prev => ({...prev, weeklyDigest: checked}))}
              />
            </div>
          </div>

          <Button onClick={handleNotificationSave} variant="outline">
            <Save className="h-4 w-4 mr-2" />
            Save Notification Settings
          </Button>
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
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
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card>
        <CardHeader>
          <CardTitle>Data Management</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button onClick={handleExportData} variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <Download className="h-6 w-6" />
              <span>Export My Data</span>
              <span className="text-xs text-gray-500">Download all your data</span>
            </Button>
            
            <Button onClick={handleDeleteAccount} variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2 text-red-600 border-red-200 hover:bg-red-50">
              <Trash2 className="h-6 w-6" />
              <span>Delete Account</span>
              <span className="text-xs text-gray-500">Permanently remove account</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}