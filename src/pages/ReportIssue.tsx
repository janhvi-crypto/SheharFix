import React, { useState, useEffect, forwardRef } from 'react';
import { MapPin, Mic, Upload, Send, ArrowLeft } from 'lucide-react';
import { Button as UIButton, ButtonProps } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox as UICheckbox } from '@/components/ui/checkbox';
import Layout from '@/components/Layout';
import LoadingScreen from '@/components/LoadingScreen';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useApp } from '@/contexts/AppContext';

// FIX: Using forwardRef for shadcn component type compatibility
const Button = forwardRef<HTMLButtonElement, ButtonProps>((props, ref) => (
  <UIButton {...props} ref={ref} />
));


const ReportIssue = () => {
  const navigate = useNavigate();
  const { token } = useApp(); // Use the hook to get context
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    priority: '',
    anonymous: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000);
  }, []);

  const categories = ['pothole', 'garbage', 'streetlight', 'Drainage', 'Water Supply', 'Sanitation', 'Traffic Signals', 'Park Maintenance', 'Noise Pollution', 'Other'];
  const priorityLevels = [
    { value: 'low', label: 'Low Priority' },
    { value: 'medium', label: 'Medium Priority' },
    { value: 'high', label: 'High Priority' },
    { value: 'urgent', label: 'Urgent' },
  ];

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.priority) newErrors.priority = 'Priority level is required';
    if (!selectedImage) newErrors.photo = 'An image is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
        setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[field];
            return newErrors;
        });
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      if (errors.photo) {
        setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors.photo;
            return newErrors;
        });
      }
    }
  };

  const removeImage = () => setSelectedImage(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      // Build multipart form-data to match server on port 3001
      const fd = new FormData();
      fd.append('title', formData.title);
      fd.append('description', formData.description);
      fd.append('category', formData.category);
      fd.append('priority', formData.priority);
      // Location is optional in server; keep simple fields for now
      fd.append('lat', '');
      fd.append('lng', '');
      if (selectedImage) {
        fd.append('media', selectedImage);
      }

      // Build headers and only include Authorization if we have a real token
      const headers: Record<string, string> = {};
      const isRealToken = token && token !== 'mock-jwt-token-for-testing';
      if (isRealToken) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('/api/issues', {
        method: 'POST',
        headers, // do NOT set Content-Type; browser sets multipart boundary
        body: fd,
      });

      if (!response.ok) {
        const errResponse = await response.json().catch(() => ({}));
        throw new Error(errResponse.error || 'Failed to submit the report.');
      }

      toast.success('Issue reported successfully!');
      navigate('/citizen-dashboard');

    } catch (error: any) {
      console.error(error);
      toast.error(error.message || 'An unexpected error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <LoadingScreen />;

  return (
    <Layout>
        <div className="max-w-2xl mx-auto p-6">
            <div className="mb-6">
                <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mb-4">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Dashboard
                </Button>
                <div>
                    <h1 className="text-3xl font-bold">Report New Issue</h1>
                    <p className="text-muted-foreground mt-1">
                        Help improve your community by reporting civic issues
                    </p>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <Card>
                    <CardHeader>
                        <CardTitle>Issue Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        {/* Title */}
                        <div className="space-y-2">
                            <Label htmlFor="title">Issue Title *</Label>
                            <Input id="title" value={formData.title} onChange={(e) => handleInputChange('title', e.target.value)} />
                            {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
                        </div>
                        {/* Description */}
                        <div className="space-y-2">
                            <Label htmlFor="description">Description *</Label>
                            <Textarea id="description" value={formData.description} onChange={(e) => handleInputChange('description', e.target.value)} />
                            {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
                        </div>
                        {/* Category */}
                        <div className="space-y-2">
                            <Label htmlFor="category">Category *</Label>
                            <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                                <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                                <SelectContent>
                                    {categories.map(cat => <SelectItem key={cat} value={cat.toLowerCase()}>{cat}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            {errors.category && <p className="text-sm text-destructive">{errors.category}</p>}
                        </div>
                        {/* Priority */}
                        <div className="space-y-2">
                            <Label htmlFor="priority">Priority Level *</Label>
                            <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                                <SelectTrigger><SelectValue placeholder="Select priority" /></SelectTrigger>
                                <SelectContent>
                                    {priorityLevels.map(p => <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>)}
                                </SelectContent>
                            </Select>
                            {errors.priority && <p className="text-sm text-destructive">{errors.priority}</p>}
                        </div>
                        {/* Location */}
                        <div className="space-y-2">
                            <Label htmlFor="location">Location *</Label>
                            <Input id="location" value={formData.location} onChange={(e) => handleInputChange('location', e.target.value)} />
                            {errors.location && <p className="text-sm text-destructive">{errors.location}</p>}
                        </div>
                        {/* Photo Upload */}
                        <div className="space-y-2">
                            <Label>Photo *</Label>
                            <Input type="file" accept="image/*" onChange={handleImageUpload} />
                            {errors.photo && <p className="text-sm text-destructive">{errors.photo}</p>}
                            {selectedImage && <Button variant="link" onClick={removeImage}>Remove Image</Button>}
                        </div>
                        {/* Anonymous Submission */}
                        <div className="flex items-center space-x-2 pt-2">
                            <UICheckbox id="anonymous" checked={formData.anonymous} onCheckedChange={(checked) => handleInputChange('anonymous', !!checked)} />
                            <Label htmlFor="anonymous">Report anonymously</Label>
                        </div>
                        {/* Submit Button */}
                        <Button type="submit" className="w-full" disabled={isSubmitting}>
                            {isSubmitting ? 'Submitting...' : 'Submit Report'}
                        </Button>
                    </CardContent>
                </Card>
            </form>
        </div>
    </Layout>
  );
};

export default ReportIssue;