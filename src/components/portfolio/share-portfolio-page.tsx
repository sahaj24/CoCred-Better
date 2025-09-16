"use client";

import React, { useState, useRef } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Share2, 
  Download, 
  Edit, 
  Save, 
  XCircle, 
  CheckCircle, 
  Upload, 
  Loader2,
  Copy,
  Mail,
  Facebook,
  Twitter,
  Linkedin,
  QrCode
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Types based on existing certificate structure
interface ActivityItem {
  id: string;
  name: string;
  type: "certificate" | "internship" | "project" | "workshop";
  event: string;
  status: "pending" | "approved" | "rejected";
  date: string;
  description?: string;
}

export function SharePortfolioPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const portfolioRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  
  // Edit form state
  const [editedName, setEditedName] = useState(user?.user_metadata?.full_name || user?.email?.split("@")[0] || "Student");
  const [editedEmail, setEditedEmail] = useState(user?.email || 'student@university.edu');
  const [editedPhone, setEditedPhone] = useState('+1 234 567 890');
  const [editedProfile, setEditedProfile] = useState('A dedicated and motivated student with a passion for technology and innovation. Experienced in various technical projects and committed to continuous learning and professional development.');
  const [editedSkills, setEditedSkills] = useState('JavaScript, React, Node.js, Python, Project Management, Team Leadership');
  const [editedUniversity, setEditedUniversity] = useState('State University');
  const [editedYear, setEditedYear] = useState('3rd Year');
  const [editedCgpa, setEditedCgpa] = useState('3.8');
  const [editedAvatarUrl, setEditedAvatarUrl] = useState<string | null>(null);

  if (!user) return null;

  // Mock approved activities - in real app this would come from your data
  const approvedActivities: ActivityItem[] = [
    {
      id: "1",
      name: "JavaScript Certification",
      type: "certificate",
      event: "Web Development Workshop",
      status: "approved",
      date: "2025-09-01",
      description: "Comprehensive certification in modern JavaScript development including ES6+ features and advanced concepts."
    },
    {
      id: "3",
      name: "Project Management Certificate",
      type: "workshop",
      event: "Leadership Training",
      status: "approved",
      date: "2025-08-28",
      description: "Advanced project management methodologies and team leadership skills."
    },
    {
      id: "4",
      name: "Node.js Certificate",
      type: "certificate",
      event: "Backend Development",
      status: "approved",
      date: "2025-08-25",
      description: "Backend development with Node.js, Express, and database integration."
    },
    {
      id: "5",
      name: "Summer Internship Completion",
      type: "internship",
      event: "Summer Internship 2025",
      status: "approved",
      date: "2025-08-20",
      description: "Three-month internship focused on full-stack web development and agile methodologies."
    }
  ];

  const generatePublicUrl = () => {
    // In a real app, this would generate a unique URL for sharing
    return `${window.location.origin}/portfolio/share/${user.id}`;
  };

  const handleShare = () => {
    const publicUrl = generatePublicUrl();
    navigator.clipboard.writeText(publicUrl);
    toast({
      title: 'Link Copied!',
      description: 'Your public portfolio link has been copied to the clipboard.',
    });
  };

  const handleSocialShare = (platform: string) => {
    const publicUrl = generatePublicUrl();
    const text = `Check out my academic portfolio: ${editedName}`;
    
    let shareUrl = '';
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(publicUrl)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(publicUrl)}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(publicUrl)}`;
        break;
      case 'email':
        shareUrl = `mailto:?subject=${encodeURIComponent(`${editedName}'s Portfolio`)}&body=${encodeURIComponent(`${text}\n\n${publicUrl}`)}`;
        break;
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank');
    }
  };

  const handleDownload = async () => {
    if (!portfolioRef.current) return;
    setIsDownloading(true);
    toast({
      title: 'Generating PDF...',
      description: 'Your portfolio is being prepared for download.',
    });

    const portfolioElement = portfolioRef.current;
    const actionsElement = portfolioElement.querySelector('#portfolio-actions-internal');
    if (actionsElement) {
      (actionsElement as HTMLElement).style.display = 'none';
    }

    try {
      const canvas = await html2canvas(portfolioElement, {
        scale: 2,
        useCORS: true,
        logging: false,
      });
      const imgData = canvas.toDataURL('image/png');
      
      const pdf = new jsPDF({
        orientation: 'p',
        unit: 'mm',
        format: 'a4',
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const ratio = canvasWidth / canvasHeight;
      const imgWidth = pdfWidth;
      const imgHeight = imgWidth / ratio;
      
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight;
      }
      
      pdf.save(`${editedName.replace(/\s+/g, '-')}-portfolio.pdf`);
      
      toast({
        title: 'Download Complete!',
        description: 'Your portfolio PDF has been downloaded successfully.',
      });
    } catch(error) {
      console.error("Error generating PDF:", error);
      toast({
        variant: "destructive",
        title: "PDF Generation Failed",
        description: "There was an error while generating the PDF. Please try again.",
      });
    } finally {
      if (actionsElement) {
        (actionsElement as HTMLElement).style.display = 'flex';
      }
      setIsDownloading(false);
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };
  
  const handleSaveChanges = () => {
    // In a real app, this would save to backend/database
    setIsEditing(false);
    toast({
      title: 'Profile Updated',
      description: 'Your portfolio has been successfully updated.',
    });
  };

  const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        setEditedAvatarUrl(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const ActivityItem = ({ activity }: { activity: ActivityItem }) => (
    <div className="py-4">
      <div className="flex items-center gap-2 mb-1">
        <h4 className="font-semibold">{activity.name}</h4>
        <Badge variant="outline" className="bg-emerald-100 text-emerald-800 border-emerald-300">
          <CheckCircle className="mr-1 h-3 w-3" />
          Verified
        </Badge>
      </div>
      <p className="text-sm text-muted-foreground mb-2">
        {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)} • {activity.event} • {new Date(activity.date).toLocaleDateString()}
      </p>
      {activity.description && (
        <p className="text-sm text-muted-foreground">{activity.description}</p>
      )}
    </div>
  );

  const currentAvatar = editedAvatarUrl || user?.user_metadata?.avatar_url || `https://ui-avatars.com/api/?name=${editedName}&background=2161FF&color=fff&size=150`;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div id="portfolio-actions-internal" className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Share Portfolio</h1>
          <p className="text-gray-600">Share your academic achievements and portfolio with others</p>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Share2 className="mr-2 h-4 w-4"/>
                Share
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={handleShare}>
                <Copy className="mr-2 h-4 w-4"/>
                Copy Link
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSocialShare('email')}>
                <Mail className="mr-2 h-4 w-4"/>
                Share via Email
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSocialShare('linkedin')}>
                <Linkedin className="mr-2 h-4 w-4"/>
                Share on LinkedIn
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSocialShare('twitter')}>
                <Twitter className="mr-2 h-4 w-4"/>
                Share on Twitter
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSocialShare('facebook')}>
                <Facebook className="mr-2 h-4 w-4"/>
                Share on Facebook
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button size="sm" onClick={handleDownload} disabled={isDownloading}>
            {isDownloading ? <Loader2 className="mr-2 h-4 w-4 animate-spin"/> : <Download className="mr-2 h-4 w-4"/>}
            Download PDF
          </Button>
          
          <Button variant="outline" size="sm" onClick={handleEditToggle}>
            {isEditing ? <XCircle className="mr-2 h-4 w-4"/> : <Edit className="mr-2 h-4 w-4" />}
            {isEditing ? 'Cancel' : 'Edit'}
          </Button>
        </div>
      </div>

      <div ref={portfolioRef}>
        <Card className="bg-white shadow-sm">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center gap-6 mb-6">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={currentAvatar} alt={editedName} />
                  <AvatarFallback className="bg-[#2161FF] text-white text-2xl">
                    {editedName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <Button size="icon" variant="outline" className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full" asChild>
                    <label htmlFor="avatar-upload">
                      <Upload className="h-4 w-4" />
                      <Input id="avatar-upload" type="file" className="sr-only" onChange={handleAvatarChange} accept="image/*" />
                      <span className="sr-only">Upload new picture</span>
                    </label>
                  </Button>
                )}
              </div>
              <div className="flex-1 text-center md:text-left">
                {isEditing ? (
                  <div className="space-y-2">
                    <Input className="text-2xl font-bold" value={editedName} onChange={e => setEditedName(e.target.value)} placeholder="Your Name" />
                    <Input value={editedEmail} onChange={e => setEditedEmail(e.target.value)} placeholder="your.email@example.com" />
                    <Input value={editedPhone} onChange={e => setEditedPhone(e.target.value)} placeholder="Your Phone Number" />
                  </div>
                ) : (
                  <div>
                    <h2 className="text-3xl font-bold text-gray-900">{editedName}</h2>
                    <p className="text-gray-600 text-lg">{editedEmail}</p>
                    <p className="text-gray-600">{editedPhone}</p>
                  </div>
                )}
              </div>
            </div>

            <Separator className="my-6" />

            <div className="py-6">
              <h3 className="text-xl font-semibold mb-3">About</h3>
              {isEditing ? (
                <Textarea 
                  value={editedProfile} 
                  onChange={e => setEditedProfile(e.target.value)} 
                  rows={4}
                  className="focus:border-[#2161FF] focus:ring-[#2161FF]" 
                />
              ) : (
                <p className="text-gray-600 leading-relaxed">{editedProfile}</p>
              )}
            </div>

            <Separator className="my-6" />
            
            <div className="py-6">
              <h3 className="text-xl font-semibold mb-3">Education</h3>
              {isEditing ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>University/College</Label>
                    <Input value={editedUniversity} onChange={e => setEditedUniversity(e.target.value)} className="focus:border-[#2161FF] focus:ring-[#2161FF]" />
                  </div>
                  <div>
                    <Label>Year of Study</Label>
                    <Input value={editedYear} onChange={e => setEditedYear(e.target.value)} className="focus:border-[#2161FF] focus:ring-[#2161FF]" />
                  </div>
                  <div>
                    <Label>CGPA</Label>
                    <Input value={editedCgpa} onChange={e => setEditedCgpa(e.target.value)} className="focus:border-[#2161FF] focus:ring-[#2161FF]" />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                  <div>
                    <span className="text-gray-500 font-medium">University/College:</span>
                    <p className="text-gray-900 font-semibold">{editedUniversity}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 font-medium">Year of Study:</span>
                    <p className="text-gray-900 font-semibold">{editedYear}</p>
                  </div>
                  <div>
                    <span className="text-gray-500 font-medium">CGPA:</span>
                    <p className="text-gray-900 font-semibold">{editedCgpa}</p>
                  </div>
                </div>
              )}
            </div>

            <Separator className="my-6" />
            
            <div className="py-6">
              <h3 className="text-xl font-semibold mb-3">Skills</h3>
              {isEditing ? (
                <div>
                  <Label>Skills (comma separated)</Label>
                  <Input 
                    value={editedSkills} 
                    onChange={e => setEditedSkills(e.target.value)} 
                    className="focus:border-[#2161FF] focus:ring-[#2161FF]"
                  />
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {editedSkills.split(',').map((skill, index) => (
                    <Badge key={index} variant="secondary" className="bg-blue-100 text-blue-800">
                      {skill.trim()}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
            
            {isEditing && (
              <div className="mt-6 flex justify-end">
                <Button onClick={handleSaveChanges} className="bg-[#2161FF] hover:bg-blue-700">
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="mt-6 bg-white shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl">Academic Approved & Verified Activities</CardTitle>
          </CardHeader>
          <CardContent>
            {approvedActivities.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {approvedActivities.map(activity => (
                  <ActivityItem key={activity.id} activity={activity} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <CheckCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p className="text-lg font-medium">No verified activities yet.</p>
                <p className="text-sm">Add activities and get them approved to see them here.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}