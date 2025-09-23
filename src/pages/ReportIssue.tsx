import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import Layout from '@/components/Layout';
import LoadingScreen from '@/components/LoadingScreen';
import { useApp } from '@/contexts/AppContext';
import { Camera, MapPin, Mic, Upload, ArrowLeft, AlertCircle, Send } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ReportIssue = () => {
  const { user, uploadIssuePhoto } = useApp();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    category: '',
    priority: '',
    images: [] as File[],
    isAnonymous: false,
    reportedBy: user?.name || 'Anonymous'
  });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isRecording, setIsRecording] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  React.useEffect(() => {
    // Simulate initial loading
    setTimeout(() => setInitialLoading(false), 1500);
  }, []);

  const categories = [
    'Potholes',
    'Garbage',
    'Street Lights',
    'Drainage',
    'Water Supply',
    'Sanitation',
    'Traffic Signals',
    'Park Maintenance',
    'Noise Pollution',
    'Other'
  ];

  const priorityLevels = [
    { value: 'low', label: 'Low Priority', color: 'text-green-600' },
    { value: 'medium', label: 'Medium Priority', color: 'text-yellow-600' },
    { value: 'high', label: 'High Priority', color: 'text-orange-600' },
    { value: 'urgent', label: 'Urgent', color: 'text-red-600' }
  ];

  const validateForm = () => {
    const errors: Record<string, string> = {};

    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    }

    if (!formData.category) {
      errors.category = 'Category is required';
    }

    if (!formData.location.trim()) {
      errors.location = 'Location is required';
    }

    if (!formData.priority) {
      errors.priority = 'Priority level is required';
    }

    if (formData.images.length === 0) {
      errors.images = 'At least one image is required';
    }

    return errors;
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear validation error when user starts typing
    if (validationErrors[field]) {
      setValidationErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      setFormData(prev => ({ 
        ...prev, 
        images: [...prev.images, ...files].slice(0, 5) // Max 5 images
      }));
      if (validationErrors.images) {
        setValidationErrors(prev => ({ ...prev, images: '' }));
      }
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const startRecording = () => {
    setIsRecording(true);
    // Mock voice recording - in real app would use Web Speech API
    setTimeout(() => {
      setIsRecording(false);
      const voiceText = "There is a large pothole on the main road causing traffic issues. It needs immediate attention.";
      setFormData(prev => ({ ...prev, description: voiceText }));
    }, 3000);
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // Mock reverse geocoding
          const mockAddress = `${latitude.toFixed(4)}, ${longitude.toFixed(4)} - Koramangala, Bangalore`;
          setFormData(prev => ({ ...prev, location: mockAddress }));
        },
        (error) => {
          console.error('Unable to get location:', error);
        }
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setIsSubmitting(true);
    try {
      // For now, just upload the first image and create a mock issue
      // In your backend integration, you'll handle multiple images
      if (formData.images.length > 0) {
        await uploadIssuePhoto(Date.now(), formData.images[0]);
      }
      
      // Create a simple success feedback
      console.log('Issue submitted:', {
        title: formData.title,
        description: formData.description,
        location: formData.location,
        category: formData.category,
        priority: formData.priority,
        isAnonymous: formData.isAnonymous,
        reportedBy: formData.reportedBy
      });
      
      // Reset form after successful submission
      setFormData({
        title: '',
        description: '',
        location: '',
        category: '',
        priority: '',
        images: [],
        isAnonymous: false,
        reportedBy: user?.name || 'Anonymous'
      });
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Failed to submit report:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (initialLoading) {
    return <LoadingScreen />;
  }

  return (
    <Layout searchPlaceholder="Search previous reports...">
      <div className="max-w-2xl mx-auto p-6">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/dashboard')}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          
          <div>
            <h1 className="text-3xl font-bold text-foreground">Report New Issue</h1>
            <p className="text-muted-foreground mt-1">
              Help improve your community by reporting civic issues
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <Card className="card-gradient">
            <CardHeader>
              <CardTitle>Issue Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Issue Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Pothole on MG Road"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className={validationErrors.title ? 'border-destructive' : ''}
                />
                {validationErrors.title && (
                  <p className="text-sm text-destructive">{validationErrors.title}</p>
                )}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="description">Description *</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={startRecording}
                    disabled={isRecording}
                    className="flex items-center space-x-2"
                  >
                    <Mic className={`w-4 h-4 ${isRecording ? 'text-red-500 animate-pulse' : ''}`} />
                    <span>{isRecording ? 'Recording...' : 'Voice Input'}</span>
                  </Button>
                </div>
                <Textarea
                  id="description"
                  placeholder="Describe the issue in detail..."
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className={`min-h-[100px] ${validationErrors.description ? 'border-destructive' : ''}`}
                />
                {validationErrors.description && (
                  <p className="text-sm text-destructive">{validationErrors.description}</p>
                )}
              </div>

              {/* Category and Priority */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => handleInputChange('category', value)}
                  >
                    <SelectTrigger className={validationErrors.category ? 'border-destructive' : ''}>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category.toLowerCase()}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {validationErrors.category && (
                    <p className="text-sm text-destructive">{validationErrors.category}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Priority Level *</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value) => handleInputChange('priority', value)}
                  >
                    <SelectTrigger className={validationErrors.priority ? 'border-destructive' : ''}>
                      <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                      {priorityLevels.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          <span className={level.color}>{level.label}</span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {validationErrors.priority && (
                    <p className="text-sm text-destructive">{validationErrors.priority}</p>
                  )}
                </div>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="location">Location *</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={getCurrentLocation}
                    className="flex items-center space-x-2"
                  >
                    <MapPin className="w-4 h-4" />
                    <span>Use Current Location</span>
                  </Button>
                </div>
                <Input
                  id="location"
                  placeholder="Enter the exact location"
                  value={formData.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                  className={validationErrors.location ? 'border-destructive' : ''}
                />
                {validationErrors.location && (
                  <p className="text-sm text-destructive">{validationErrors.location}</p>
                )}
              </div>

              {/* Image Upload */}
              <div className="space-y-2">
                <Label>Photos * (Max 5)</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      Click to upload photos or drag and drop
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      PNG, JPG up to 5MB each
                    </p>
                  </label>
                </div>

                {/* Selected Images Preview */}
                {formData.images.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                    {formData.images.map((file, index) => (
                      <div key={index} className="relative">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Upload ${index + 1}`}
                          className="w-full h-24 object-cover rounded-lg border"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0"
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                {validationErrors.images && (
                  <p className="text-sm text-destructive">{validationErrors.images}</p>
                )}
              </div>

              {/* Anonymous Reporting */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="anonymous"
                  checked={formData.isAnonymous}
                  onCheckedChange={(checked) => handleInputChange('isAnonymous', checked as boolean)}
                />
                <Label htmlFor="anonymous" className="text-sm">
                  Report anonymously (your identity will be hidden)
                </Label>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full btn-citizen"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  'Submitting Report...'
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Submit Report
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </form>
      </div>
    </Layout>
  );
};

export default ReportIssue;
