"use client";

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  GraduationCap,
  Edit3,
  Save,
  Camera,
  Award,
  BookOpen,
  Target,
  Users,
  Star,
  Briefcase
} from 'lucide-react';

interface StudentProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  address: string;
  institution: string;
  course: string;
  yearOfStudy: string;
  aaparId: string;
  bio: string;
  profileImage?: string;
  skills: string[];
  interests: string[];
  achievements: Achievement[];
  stats: {
    certificates: number;
    internships: number;
    projects: number;
    activities: number;
  };
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
  type: 'certificate' | 'award' | 'competition' | 'project';
}

const mockProfile: StudentProfile = {
  id: "1",
  name: "Aarav Sharma",
  email: "aarav.sharma@student.edu",
  phone: "+91 98765 43210",
  dateOfBirth: "2002-05-15",
  address: "Mumbai, Maharashtra, India",
  institution: "Indian Institute of Technology",
  course: "Computer Science Engineering",
  yearOfStudy: "3rd Year",
  aaparId: "AAPAR123456789",
  bio: "Passionate computer science student with interests in AI/ML and web development. Always eager to learn new technologies and contribute to innovative projects.",
  skills: ["React", "Node.js", "Python", "Machine Learning", "Data Analysis", "UI/UX Design"],
  interests: ["Artificial Intelligence", "Web Development", "Data Science", "Open Source", "Photography"],
  achievements: [
    {
      id: "1",
      title: "Best Project Award",
      description: "Won best project award in college hackathon",
      date: "2024-08-15",
      type: "award"
    },
    {
      id: "2",
      title: "Web Development Certificate",
      description: "Completed advanced web development course",
      date: "2024-07-20",
      type: "certificate"
    },
    {
      id: "3",
      title: "AI/ML Internship",
      description: "Summer internship at Tech Corp",
      date: "2024-06-01",
      type: "project"
    }
  ],
  stats: {
    certificates: 12,
    internships: 3,
    projects: 8,
    activities: 24
  }
};

export function StudentProfilePage() {
  const [profile, setProfile] = useState<StudentProfile>(mockProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<StudentProfile>(mockProfile);

  const handleSave = () => {
    setProfile(editedProfile);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedProfile(profile);
    setIsEditing(false);
  };

  const getAchievementIcon = (type: string) => {
    switch (type) {
      case 'certificate': return <Award className="h-4 w-4 text-yellow-600" />;
      case 'award': return <Star className="h-4 w-4 text-purple-600" />;
      case 'project': return <Briefcase className="h-4 w-4 text-blue-600" />;
      case 'competition': return <Target className="h-4 w-4 text-green-600" />;
      default: return <BookOpen className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">My Profile</h1>
          <p className="text-muted-foreground">Manage your personal information and achievements</p>
        </div>
        <div className="flex items-center gap-3">
          {isEditing ? (
            <>
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleSave} className="bg-[#2161FF] hover:bg-blue-700">
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            </>
          ) : (
            <Button onClick={() => setIsEditing(true)} variant="outline">
              <Edit3 className="h-4 w-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Profile Info */}
        <div className="lg:col-span-1 space-y-6">
          {/* Profile Card */}
          <Card className="bg-white shadow-sm">
            <CardContent className="p-6">
              <div className="text-center space-y-4">
                <div className="relative">
                  <Avatar className="h-24 w-24 mx-auto">
                    <AvatarImage src={profile.profileImage} />
                    <AvatarFallback className="bg-[#2161FF] text-white text-lg">
                      {profile.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <Button 
                      size="sm" 
                      className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 rounded-full h-8 w-8 p-0"
                      variant="outline"
                    >
                      <Camera className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                
                {isEditing ? (
                  <div className="space-y-3">
                    <Input
                      value={editedProfile.name}
                      onChange={(e) => setEditedProfile({...editedProfile, name: e.target.value})}
                      className="text-center font-semibold"
                    />
                    <Input
                      value={editedProfile.email}
                      onChange={(e) => setEditedProfile({...editedProfile, email: e.target.value})}
                      className="text-center text-sm"
                    />
                  </div>
                ) : (
                  <>
                    <h2 className="text-xl font-semibold">{profile.name}</h2>
                    <p className="text-sm text-muted-foreground">{profile.email}</p>
                  </>
                )}
                
                <Badge variant="secondary" className="bg-[#2161FF] text-white">
                  {profile.aaparId}
                </Badge>
              </div>
            </CardContent>
          </Card>

          {/* Stats Card */}
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Activity Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-[#2161FF]">{profile.stats.certificates}</div>
                  <div className="text-xs text-muted-foreground">Certificates</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{profile.stats.internships}</div>
                  <div className="text-xs text-muted-foreground">Internships</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{profile.stats.projects}</div>
                  <div className="text-xs text-muted-foreground">Projects</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{profile.stats.activities}</div>
                  <div className="text-xs text-muted-foreground">Activities</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Detailed Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-[#2161FF]" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  {isEditing ? (
                    <Input
                      id="phone"
                      value={editedProfile.phone}
                      onChange={(e) => setEditedProfile({...editedProfile, phone: e.target.value})}
                    />
                  ) : (
                    <div className="flex items-center gap-2 p-2 border rounded-md bg-white shadow-sm">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span>{profile.phone}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dob">Date of Birth</Label>
                  {isEditing ? (
                    <Input
                      id="dob"
                      type="date"
                      value={editedProfile.dateOfBirth}
                      onChange={(e) => setEditedProfile({...editedProfile, dateOfBirth: e.target.value})}
                    />
                  ) : (
                    <div className="flex items-center gap-2 p-2 border rounded-md bg-white shadow-sm">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span>{new Date(profile.dateOfBirth).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="address">Address</Label>
                  {isEditing ? (
                    <Input
                      id="address"
                      value={editedProfile.address}
                      onChange={(e) => setEditedProfile({...editedProfile, address: e.target.value})}
                    />
                  ) : (
                    <div className="flex items-center gap-2 p-2 border rounded-md bg-white shadow-sm">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span>{profile.address}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Academic Information */}
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-[#2161FF]" />
                Academic Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="institution">Institution</Label>
                  {isEditing ? (
                    <Input
                      id="institution"
                      value={editedProfile.institution}
                      onChange={(e) => setEditedProfile({...editedProfile, institution: e.target.value})}
                    />
                  ) : (
                    <div className="p-2 border rounded-md bg-white shadow-sm">
                      <span>{profile.institution}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="course">Course</Label>
                  {isEditing ? (
                    <Input
                      id="course"
                      value={editedProfile.course}
                      onChange={(e) => setEditedProfile({...editedProfile, course: e.target.value})}
                    />
                  ) : (
                    <div className="p-2 border rounded-md bg-white shadow-sm">
                      <span>{profile.course}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="year">Year of Study</Label>
                  {isEditing ? (
                    <Input
                      id="year"
                      value={editedProfile.yearOfStudy}
                      onChange={(e) => setEditedProfile({...editedProfile, yearOfStudy: e.target.value})}
                    />
                  ) : (
                    <div className="p-2 border rounded-md bg-white shadow-sm">
                      <span>{profile.yearOfStudy}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Bio */}
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle>About Me</CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <Textarea
                  value={editedProfile.bio}
                  onChange={(e) => setEditedProfile({...editedProfile, bio: e.target.value})}
                  className="min-h-[100px]"
                  placeholder="Tell us about yourself..."
                />
              ) : (
                <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
              )}
            </CardContent>
          </Card>

          {/* Skills & Interests */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Skills</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {profile.skills.map((skill, index) => (
                    <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white shadow-sm">
              <CardHeader>
                <CardTitle className="text-lg">Interests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {profile.interests.map((interest, index) => (
                    <Badge key={index} variant="outline" className="border-green-200 text-green-800">
                      {interest}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Achievements */}
          <Card className="bg-white shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-[#2161FF]" />
                Recent Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {profile.achievements.map((achievement) => (
                  <div key={achievement.id} className="flex items-start gap-3 p-4 border rounded-lg bg-white shadow-sm">
                    <div className="mt-1">
                      {getAchievementIcon(achievement.type)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{achievement.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{achievement.description}</p>
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(achievement.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}