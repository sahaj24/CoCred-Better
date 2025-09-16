"use client";

import { useState } from 'react';
import { FacultyLayout } from '@/components/layouts/FacultyLayout';
import { ProtectedRoute } from '@/components/auth/protected-route';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { User, Mail, Phone, MapPin, Edit, Save, X } from 'lucide-react';

export default function ProfilePage() {
  const [editing, setEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    name: 'Dr. Sarah Johnson',
    email: 'sarah.johnson@university.edu',
    phone: '+1 (555) 123-4567',
    department: 'Computer Science',
    office: 'Room 204, Science Building',
    bio: 'Professor of Computer Science with 15 years of experience in software engineering and artificial intelligence. Passionate about teaching and research in machine learning and data science.',
    expertise: ['Machine Learning', 'Data Science', 'Software Engineering', 'Artificial Intelligence'],
    education: [
      { degree: 'Ph.D. in Computer Science', institution: 'MIT', year: '2008' },
      { degree: 'M.S. in Computer Science', institution: 'Stanford University', year: '2004' },
      { degree: 'B.S. in Computer Science', institution: 'UC Berkeley', year: '2002' }
    ]
  });

  const [tempData, setTempData] = useState(profileData);

  const handleEdit = () => {
    setTempData(profileData);
    setEditing(true);
  };

  const handleSave = () => {
    // TODO: connect API - Save profile changes
    setProfileData(tempData);
    setEditing(false);
  };

  const handleCancel = () => {
    setTempData(profileData);
    setEditing(false);
  };

  return (
    <ProtectedRoute requiredUserType="authority">
      <FacultyLayout>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
            {!editing ? (
              <Button onClick={handleEdit}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Profile
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button onClick={handleSave}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
                <Button variant="outline" onClick={handleCancel}>
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </Button>
              </div>
            )}
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Profile Overview */}
            <div className="lg:col-span-1">
              <Card>
                <CardContent className="p-6">
                  <div className="flex flex-col items-center space-y-4">
                    <Avatar className="h-32 w-32">
                      <AvatarImage src="/avatars/professor.jpg" />
                      <AvatarFallback className="text-2xl">
                        {profileData.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="text-center space-y-2">
                      <h2 className="text-2xl font-bold">{profileData.name}</h2>
                      <p className="text-muted-foreground">{profileData.department}</p>
                    </div>

                    <div className="w-full space-y-3">
                      <div className="flex items-center gap-3 text-sm">
                        <Mail className="h-4 w-4 text-muted-foreground" />
                        <span>{profileData.email}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span>{profileData.phone}</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{profileData.office}</span>
                      </div>
                    </div>

                    <Button variant="outline" className="w-full">
                      Change Photo
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Profile Details */}
            <div className="lg:col-span-2">
              <Tabs defaultValue="personal" className="space-y-4">
                <TabsList>
                  <TabsTrigger value="personal">Personal Info</TabsTrigger>
                  <TabsTrigger value="academic">Academic</TabsTrigger>
                  <TabsTrigger value="security">Security</TabsTrigger>
                </TabsList>

                <TabsContent value="personal" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Personal Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <Label htmlFor="name">Full Name</Label>
                          {editing ? (
                            <Input
                              id="name"
                              value={tempData.name}
                              onChange={(e) => setTempData(prev => ({ ...prev, name: e.target.value }))}
                            />
                          ) : (
                            <p className="text-sm text-muted-foreground mt-1">{profileData.name}</p>
                          )}
                        </div>
                        
                        <div>
                          <Label htmlFor="email">Email</Label>
                          {editing ? (
                            <Input
                              id="email"
                              type="email"
                              value={tempData.email}
                              onChange={(e) => setTempData(prev => ({ ...prev, email: e.target.value }))}
                            />
                          ) : (
                            <p className="text-sm text-muted-foreground mt-1">{profileData.email}</p>
                          )}
                        </div>
                        
                        <div>
                          <Label htmlFor="phone">Phone</Label>
                          {editing ? (
                            <Input
                              id="phone"
                              value={tempData.phone}
                              onChange={(e) => setTempData(prev => ({ ...prev, phone: e.target.value }))}
                            />
                          ) : (
                            <p className="text-sm text-muted-foreground mt-1">{profileData.phone}</p>
                          )}
                        </div>
                        
                        <div>
                          <Label htmlFor="department">Department</Label>
                          {editing ? (
                            <Input
                              id="department"
                              value={tempData.department}
                              onChange={(e) => setTempData(prev => ({ ...prev, department: e.target.value }))}
                            />
                          ) : (
                            <p className="text-sm text-muted-foreground mt-1">{profileData.department}</p>
                          )}
                        </div>
                        
                        <div className="md:col-span-2">
                          <Label htmlFor="office">Office Location</Label>
                          {editing ? (
                            <Input
                              id="office"
                              value={tempData.office}
                              onChange={(e) => setTempData(prev => ({ ...prev, office: e.target.value }))}
                            />
                          ) : (
                            <p className="text-sm text-muted-foreground mt-1">{profileData.office}</p>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="bio">Bio</Label>
                        {editing ? (
                          <Textarea
                            id="bio"
                            value={tempData.bio}
                            onChange={(e) => setTempData(prev => ({ ...prev, bio: e.target.value }))}
                            className="min-h-[100px]"
                          />
                        ) : (
                          <p className="text-sm text-muted-foreground mt-1">{profileData.bio}</p>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="academic" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Education</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {profileData.education.map((edu, index) => (
                          <div key={index} className="border-l-2 border-primary pl-4">
                            <h4 className="font-medium">{edu.degree}</h4>
                            <p className="text-sm text-muted-foreground">{edu.institution}</p>
                            <p className="text-xs text-muted-foreground">{edu.year}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Areas of Expertise</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap gap-2">
                        {profileData.expertise.map((skill, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="security" className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Password & Security</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label>Password</Label>
                        <div className="flex items-center gap-4 mt-2">
                          <p className="text-sm text-muted-foreground">••••••••••••</p>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button variant="outline" size="sm">
                                Change Password
                              </Button>
                            </DialogTrigger>
                            <DialogContent>
                              <DialogHeader>
                                <DialogTitle>Change Password</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                <div>
                                  <Label htmlFor="current-password">Current Password</Label>
                                  <Input id="current-password" type="password" />
                                </div>
                                <div>
                                  <Label htmlFor="new-password">New Password</Label>
                                  <Input id="new-password" type="password" />
                                </div>
                                <div>
                                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                                  <Input id="confirm-password" type="password" />
                                </div>
                                <div className="flex justify-end gap-2">
                                  <Button variant="outline">Cancel</Button>
                                  <Button>Update Password</Button>
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>

                      <div>
                        <Label>Two-Factor Authentication</Label>
                        <div className="flex items-center gap-4 mt-2">
                          <p className="text-sm text-muted-foreground">Not enabled</p>
                          <Button variant="outline" size="sm">
                            Enable 2FA
                          </Button>
                        </div>
                      </div>

                      <div>
                        <Label>Login Sessions</Label>
                        <div className="mt-2">
                          <Button variant="outline" size="sm">
                            View Active Sessions
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </FacultyLayout>
    </ProtectedRoute>
  );
}