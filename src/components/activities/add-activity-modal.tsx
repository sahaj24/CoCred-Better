"use client";

import React, { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { supabase } from '@/lib/supabase';
import { addCertificate } from '@/lib/certificates';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, 
  Award, 
  Briefcase, 
  BookOpen, 
  Users, 
  Calendar,
  Upload,
  FileText,
  X
} from 'lucide-react';

interface AddActivityModalProps {
  children: React.ReactNode;
}

type ActivityType = "certificate" | "internship" | "project" | "workshop" | "competition" | "volunteer";
type ActivityCategory = "Academic" | "Technical" | "Leadership" | "Sports" | "Cultural" | "Social";

export function AddActivityModal({ children }: AddActivityModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { toast } = useToast();
  const [activityType, setActivityType] = useState<ActivityType>("certificate");
  const [formData, setFormData] = useState({
    title: '',
    organization: '',
    description: '',
    category: 'Academic' as ActivityCategory,
    startDate: '',
    endDate: '',
    skills: '',
    attachments: [] as File[]
  });

  const activityTypes = [
    { value: 'certificate', label: 'Certificate', icon: Award, color: 'blue' },
    { value: 'internship', label: 'Internship', icon: Briefcase, color: 'green' },
    { value: 'project', label: 'Project', icon: BookOpen, color: 'purple' },
    { value: 'workshop', label: 'Workshop', icon: Users, color: 'orange' },
    { value: 'competition', label: 'Competition', icon: Award, color: 'red' },
    { value: 'volunteer', label: 'Volunteer Work', icon: Users, color: 'blue' }
  ];

  const categories = ['Academic', 'Technical', 'Leadership', 'Sports', 'Cultural', 'Social'];

  const { user } = useAuth();
 const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    // insert row into certificates with pending status (no file path)
    try {
      const { data: studentRow, error: sErr } = await supabase
        .from('students')
        .select('id, class_code')
        .eq('user_id', user.id)
        .maybeSingle();
      if (sErr || !studentRow) {
        throw new Error('Please join a class before adding activities.');
      }

      await addCertificate({
        studentId: studentRow.id,
        classCode: studentRow.class_code,
        filePath: '',
        publicUrl: '',
        issuedName: formData.title,
      });
      toast({
        title: 'Activity logged',
        description: 'Waiting for faculty approval',
      });
    } catch(err){
      console.error('Failed to log activity certificate', err);
      toast({
        variant: 'destructive',
        title: 'Failed to add activity',
        description: (err as Error).message,
      });
      return;
    }
    setIsOpen(false);
    // Reset form
    setFormData({
      title: '',
      organization: '',
      description: '',
      category: 'Academic',
      startDate: '',
      endDate: '',
      skills: '',
      attachments: []
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setFormData(prev => ({ ...prev, attachments: [...prev.attachments, ...files] }));
  };

  const removeFile = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const getTypeColor = (type: string) => {
    const typeData = activityTypes.find(t => t.value === type);
    return typeData?.color || 'blue';
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <Plus className="h-4 w-4 text-blue-600" />
            </div>
            Add New Activity
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Activity Type Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Activity Type</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {activityTypes.map(({ value, label, icon: Icon, color }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setActivityType(value as ActivityType)}
                  className={`p-3 rounded-xl border-2 transition-all text-left space-y-2 ${
                    activityType === value 
                      ? `border-${color}-500 bg-${color}-50` 
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Icon className={`h-4 w-4 ${
                      activityType === value ? `text-${color}-600` : 'text-gray-500'
                    }`} />
                    <span className={`font-medium text-sm ${
                      activityType === value ? `text-${color}-900` : 'text-gray-900'
                    }`}>
                      {label}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Machine Learning Certificate"
                required
                className="bg-white border-gray-300"
              />
            </div>

            {/* Organization */}
            <div className="space-y-2">
              <Label htmlFor="organization">Organization *</Label>
              <Input
                id="organization"
                value={formData.organization}
                onChange={(e) => setFormData(prev => ({ ...prev, organization: e.target.value }))}
                placeholder="e.g., Coursera, Google, University"
                required
                className="bg-white border-gray-300"
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <select
                id="category"
                value={formData.category}
                onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as ActivityCategory }))}
                className="w-full p-2 border border-gray-300 rounded-md bg-white focus:border-blue-500 focus:ring-blue-500"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            {/* Skills */}
            <div className="space-y-2">
              <Label htmlFor="skills">Skills (comma-separated)</Label>
              <Input
                id="skills"
                value={formData.skills}
                onChange={(e) => setFormData(prev => ({ ...prev, skills: e.target.value }))}
                placeholder="e.g., Python, React, Leadership"
                className="bg-white border-gray-300"
              />
            </div>

            {/* Start Date */}
            <div className="space-y-2">
              <Label htmlFor="startDate">Start Date</Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                className="bg-white border-gray-300"
              />
            </div>

            {/* End Date */}
            <div className="space-y-2">
              <Label htmlFor="endDate">End Date</Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                className="bg-white border-gray-300"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe what you learned or accomplished..."
              className="min-h-[100px] bg-white border-gray-300"
            />
          </div>

          {/* File Upload */}
          <div className="space-y-3">
            <Label>Attachments</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-blue-400 transition-colors">
              <input
                type="file"
                multiple
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
              />
              <label htmlFor="file-upload" className="cursor-pointer space-y-2">
                <Upload className="h-6 w-6 text-gray-400 mx-auto" />
                <p className="text-sm text-gray-600">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-500">
                  PDF, Images, or Documents (max 10MB each)
                </p>
              </label>
            </div>

            {/* File List */}
            {formData.attachments.length > 0 && (
              <div className="space-y-2">
                {formData.attachments.map((file, index) => (
                  <div key={index} className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg">
                    <FileText className="h-4 w-4 text-gray-500" />
                    <span className="text-sm text-gray-700 flex-1">{file.name}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              disabled={!formData.title || !formData.organization}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Activity
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}