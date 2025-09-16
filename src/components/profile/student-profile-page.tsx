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
  Briefcase,
  X
} from 'lucide-react';

interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
  type: 'academic' | 'project' | 'certification' | 'leadership' | 'award';
}

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

const StudentProfilePage: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState<StudentProfile>({
    id: "1",
    name: "John Doe",
    email: "john.doe@university.edu",
    phone: "+1 (555) 123-4567",
    dateOfBirth: "2000-05-15",
    address: "123 University Ave, College Town, CT 12345",
    institution: "University of Technology",
    course: "Computer Science",
    yearOfStudy: "3rd",
    aaparId: "AAPAR2023001",
    bio: "Passionate computer science student with a strong interest in artificial intelligence and machine learning. Currently working on several projects including mobile app development and data analysis.",
    skills: ["JavaScript", "Python", "React", "Node.js", "Machine Learning", "Data Analysis"],
    interests: ["Technology", "Innovation", "Research", "Photography", "Travel"],
    achievements: [
      {
        id: "1",
        title: "Dean's List",
        description: "Achieved Dean's List recognition for maintaining GPA above 3.8",
        date: "2023-12-15",
        type: "academic"
      },
      {
        id: "2",
        title: "Hackathon Winner",
        description: "First place in University Tech Hackathon 2023",
        date: "2023-10-20",
        type: "award"
      }
    ],
    stats: {
      certificates: 12,
      internships: 2,
      projects: 8,
      activities: 15
    }
  });

  const [editedProfile, setEditedProfile] = useState<StudentProfile>(profile);

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
      case 'academic': return <BookOpen className="h-5 w-5 text-blue-600" />;
      case 'project': return <Target className="h-5 w-5 text-green-600" />;
      case 'certification': return <Award className="h-5 w-5 text-purple-600" />;
      case 'leadership': return <Users className="h-5 w-5 text-orange-600" />;
      case 'award': return <Star className="h-5 w-5 text-yellow-600" />;
      default: return <Award className="h-5 w-5 text-gray-600" />;
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-4 p-4">
      {/* Header Card with Avatar and Basic Info */}
      <Card className="bg-white border border-gray-200">
        <div className="bg-gradient-to-r from-slate-50 to-gray-100 h-20"></div>
        <CardContent className="p-6 -mt-10 relative">
          <div className="flex flex-col lg:flex-row items-center lg:items-end gap-4">
            {/* Avatar Section */}
            <div className="relative z-10">
              <Avatar className="h-20 w-20 border-2 border-white">
                <AvatarImage src={profile.profileImage} alt={profile.name} />
                <AvatarFallback className="text-lg bg-blue-500 text-white">
                  {profile.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <Button
                  size="sm"
                  className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full p-0 bg-blue-600 hover:bg-blue-700"
                >
                  <Camera className="h-3 w-3" />
                </Button>
              )}
            </div>

            {/* Basic Info */}
            <div className="flex-1 text-center lg:text-left space-y-1">
              {isEditing ? (
                <div className="space-y-2 max-w-md">
                  <Input
                    value={editedProfile.name}
                    onChange={(e) => setEditedProfile({...editedProfile, name: e.target.value})}
                    className="text-xl font-semibold text-center lg:text-left bg-white border"
                    placeholder="Full Name"
                  />
                  <Input
                    value={editedProfile.email}
                    onChange={(e) => setEditedProfile({...editedProfile, email: e.target.value})}
                    className="text-center lg:text-left bg-white border"
                    placeholder="Email"
                  />
                </div>
              ) : (
                <div>
                  <h1 className="text-2xl font-semibold text-gray-900 mb-1">{profile.name}</h1>
                  <p className="text-base text-gray-600 mb-2">{profile.email}</p>
                  <div className="flex flex-wrap justify-center lg:justify-start gap-2">
                    <Badge className="bg-blue-100 text-blue-800 border-blue-200 px-3 py-1">
                      {profile.course}
                    </Badge>
                    <Badge variant="outline" className="border-gray-300 px-3 py-1">
                      Year {profile.yearOfStudy}
                    </Badge>
                    <Badge variant="outline" className="border-gray-300 px-3 py-1">
                      ID: {profile.aaparId}
                    </Badge>
                  </div>
                </div>
              )}
            </div>

            {/* Action Button */}
            <div className="lg:ml-auto">
              {isEditing ? (
                <div className="flex gap-3">
                  <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700 px-6">
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </Button>
                  <Button variant="outline" onClick={handleCancel} className="px-6">
                    <X className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              ) : (
                <Button onClick={() => setIsEditing(true)} className="bg-blue-600 hover:bg-blue-700 px-6">
                  <Edit3 className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              )}
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6">
            <div className="text-center p-3 bg-slate-50 rounded-lg border border-gray-200">
              <Award className="h-5 w-5 text-blue-600 mx-auto mb-1" />
              <div className="text-xl font-semibold text-gray-900">{profile.stats.certificates}</div>
              <div className="text-xs text-gray-600">Certificates</div>
            </div>
            <div className="text-center p-3 bg-slate-50 rounded-lg border border-gray-200">
              <Briefcase className="h-5 w-5 text-blue-600 mx-auto mb-1" />
              <div className="text-xl font-semibold text-gray-900">{profile.stats.internships}</div>
              <div className="text-xs text-gray-600">Internships</div>
            </div>
            <div className="text-center p-3 bg-slate-50 rounded-lg border border-gray-200">
              <Target className="h-5 w-5 text-blue-600 mx-auto mb-1" />
              <div className="text-xl font-semibold text-gray-900">{profile.stats.projects}</div>
              <div className="text-xs text-gray-600">Projects</div>
            </div>
            <div className="text-center p-3 bg-slate-50 rounded-lg border border-gray-200">
              <Users className="h-5 w-5 text-blue-600 mx-auto mb-1" />
              <div className="text-xl font-semibold text-gray-900">{profile.stats.activities}</div>
              <div className="text-xs text-gray-600">Activities</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Personal Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-white shadow-sm border border-gray-100">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-lg">
                <User className="h-5 w-5 text-blue-600" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Phone</Label>
                  {isEditing ? (
                    <Input
                      value={editedProfile.phone}
                      onChange={(e) => setEditedProfile({...editedProfile, phone: e.target.value})}
                      className="bg-white"
                    />
                  ) : (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-900">{profile.phone}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Date of Birth</Label>
                  {isEditing ? (
                    <Input
                      type="date"
                      value={editedProfile.dateOfBirth}
                      onChange={(e) => setEditedProfile({...editedProfile, dateOfBirth: e.target.value})}
                      className="bg-white"
                    />
                  ) : (
                    <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-gray-900">{new Date(profile.dateOfBirth).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-sm font-medium text-gray-700">Address</Label>
                {isEditing ? (
                  <Input
                    value={editedProfile.address}
                    onChange={(e) => setEditedProfile({...editedProfile, address: e.target.value})}
                    className="bg-white"
                  />
                ) : (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-900">{profile.address}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Academic Information */}
          <Card className="bg-white shadow-sm border border-gray-100">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-lg">
                <GraduationCap className="h-5 w-5 text-blue-600" />
                Academic Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Institution</Label>
                  {isEditing ? (
                    <Input
                      value={editedProfile.institution}
                      onChange={(e) => setEditedProfile({...editedProfile, institution: e.target.value})}
                      className="bg-white"
                    />
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-lg border">
                      <span className="text-gray-900">{profile.institution}</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">Year of Study</Label>
                  {isEditing ? (
                    <Input
                      value={editedProfile.yearOfStudy}
                      onChange={(e) => setEditedProfile({...editedProfile, yearOfStudy: e.target.value})}
                      className="bg-white"
                    />
                  ) : (
                    <div className="p-3 bg-gray-50 rounded-lg border">
                      <span className="text-gray-900">{profile.yearOfStudy}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* About Me */}
          <Card className="bg-white shadow-sm border border-gray-100">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">About Me</CardTitle>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <Textarea
                  value={editedProfile.bio}
                  onChange={(e) => setEditedProfile({...editedProfile, bio: e.target.value})}
                  className="min-h-[120px] bg-white"
                  placeholder="Tell us about yourself..."
                />
              ) : (
                <p className="text-gray-700 leading-relaxed">{profile.bio}</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Skills & Achievements */}
        <div className="space-y-6">
          {/* Skills */}
          <Card className="bg-white shadow-sm border border-gray-100">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {profile.skills.map((skill, index) => (
                  <Badge 
                    key={index} 
                    variant="secondary" 
                    className="bg-blue-50 text-blue-700 border-blue-200 px-3 py-1"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Interests */}
          <Card className="bg-white shadow-sm border border-gray-100">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Interests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {profile.interests.map((interest, index) => (
                  <Badge 
                    key={index} 
                    variant="outline" 
                    className="border-gray-300 px-3 py-1"
                  >
                    {interest}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Latest Achievements */}
          <Card className="bg-white shadow-sm border border-gray-100">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-lg">
                <Award className="h-5 w-5 text-blue-600" />
                Recent Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {profile.achievements.slice(0, 3).map((achievement) => (
                  <div key={achievement.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border hover:shadow-sm transition-shadow">
                    <div className="mt-1">
                      {getAchievementIcon(achievement.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-gray-900 text-sm">{achievement.title}</h4>
                      <p className="text-xs text-gray-600 mt-1 line-clamp-2">{achievement.description}</p>
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
};

export default StudentProfilePage;