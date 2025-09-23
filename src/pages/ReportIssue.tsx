import React, { useState, useEffect, useRef } from 'react';

import { Camera, MapPin, Mic, Upload, Send, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import Layout from '@/components/Layout';
import LoadingScreen from '@/components/LoadingScreen';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useApp } from '@/contexts/AppContext';

const ReportIssue = () => {
  const navigate = useNavigate();
  const { token } = useApp();
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    priority: '',
    anonymous: false
  });
  const [geo, setGeo] = useState<{ lat: number; lng: number } | null>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isRecording, setIsRecording] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mlPrediction, setMlPrediction] = useState<string | null>(null);
  const [mlConfidence, setMlConfidence] = useState<number>(0);
  const [categoryMismatch, setCategoryMismatch] = useState(false);
  const mismatchToastedRef = useRef(false);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 2000);
  }, []);

  // Auto-evaluate mismatch whenever prediction, confidence or selected category changes
  useEffect(() => {
    if (
      mlPrediction &&
      mlConfidence > 0.5 &&
      formData.category &&
      mlPrediction.toLowerCase() !== formData.category.toLowerCase()
    ) {
      setCategoryMismatch(true);
    } else {
      setCategoryMismatch(false);
    }
  }, [mlPrediction, mlConfidence, formData.category]);

  // Notify when mismatch is detected
  useEffect(() => {
    if (categoryMismatch && mlPrediction) {
      if (!mismatchToastedRef.current) {
        toast.error(`Category Mismatch: AI suggests "${mlPrediction}". Please review.`);
        mismatchToastedRef.current = true;
      }
    } else {
      mismatchToastedRef.current = false;
    }
  }, [categoryMismatch, mlPrediction]);

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
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.priority) newErrors.priority = 'Priority level is required';
    if (selectedImages.length === 0) newErrors.images = 'At least one image is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    // Handle multiple files for UI
    setSelectedImages(prev => [...prev, ...files].slice(0, 5)); // Max 5 images
    if (errors.images) {
      setErrors(prev => ({ ...prev, images: '' }));
    }

    // Use the first file for ML prediction
    const fileForMl = files[0];
    setMlPrediction(null);
    setMlConfidence(0);
    setCategoryMismatch(false);

    // Call ML service for prediction
    try {
      const formDataImage = new FormData();
      formDataImage.append('file', fileForMl);
      const response = await fetch('/ml/predict', {
        method: 'POST',
        body: formDataImage,
      });
      if (!response.ok) {
        const errText = await response.text().catch(() => '');
        throw new Error(errText || 'Prediction request failed');
      }
      const result = await response.json();
      if (result?.prediction) {
        setMlPrediction(result.prediction);
        setMlConfidence(Number(result.confidence || 0));
        const confPercent = Number(result.confidence || 0) * 100;
        toast.success(
          `AI suggests: ${result.prediction} (${confPercent.toFixed(1)}% confidence)`
        );
      }
    } catch (err) {
      console.error('ML Prediction failed:', err);
      toast.error('Could not get AI category suggestion.');
    }
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const startRecording = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      const voiceText = "There is a large pothole on the main road causing traffic issues. It needs immediate attention.";
      setFormData(prev => ({ ...prev, description: voiceText }));
      toast.success('Voice recording added to description');
    }, 3000);
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const mockAddress = `${latitude.toFixed(4)}, ${longitude.toFixed(4)} - Koramangala, Bangalore`;
          setFormData(prev => ({ ...prev, location: mockAddress }));
          setGeo({ lat: latitude, lng: longitude });
          toast.success('Location added successfully');
        },
        () => {
          toast.error('Unable to get location. Please enter manually.');
        }
      );
    } else {
      toast.error('Geolocation is not supported by this browser.');
    }
  };

  const fileToBase64 = (file: File) =>
    new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        // Strip data URL prefix if present
        const base64 = result.includes(',') ? result.split(',')[1] : result;
        resolve(base64);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error('Please fill in all required fields');
      return;
    }
    // Block submission if AI suggests a different category with enough confidence
    if (categoryMismatch && mlPrediction && mlConfidence > 0.5) {
      toast.error(`Category mismatch: AI suggests "${mlPrediction}". Please adjust the category or change the photo.`);
      return;
    }
    setIsSubmitting(true);
    try {
      // Prepare payload expected by backend
      const firstImage = selectedImages[0];
      const media = firstImage ? await fileToBase64(firstImage) : undefined;

      const payload: any = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category, // backend expects lowercase string
        priority: formData.priority,
        location: {
          address: formData.location.trim() || undefined,
          lat: geo?.lat,
          lng: geo?.lng,
        },
        media,
      };

      const headers: HeadersInit = { 'Content-Type': 'application/json' };
      // Only attach auth when not anonymous and token exists
      const lsToken = localStorage.getItem('token');
      const authToken = token || lsToken;
      if (!formData.anonymous) {
        if (!authToken) {
          toast.error('Please login before submitting to enable ownership and deletion. Or check "Report anonymously".');
          setIsSubmitting(false);
          return;
        }
        (headers as any).Authorization = `Bearer ${authToken}`;
      }

      const resp = await fetch('/api/issues', {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });
      if (!resp.ok) {
        const errText = await resp.text().catch(() => '');
        throw new Error(errText || 'Failed to submit report');
      }
      const created = await resp.json();
      toast.success('Issue reported successfully!');
      // Navigate to dashboard or directly to the created issue page
      navigate('/dashboard');
    } catch (error) {
      console.error('Error submitting issue:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
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
                  className={errors.title ? 'border-destructive' : ''}
                />
                {errors.title && (
                  <p className="text-sm text-destructive">{errors.title}</p>
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
                  className={`min-h-[100px] ${errors.description ? 'border-destructive' : ''}`}
                />
                {errors.description && (
                  <p className="text-sm text-destructive">{errors.description}</p>
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
                    <SelectTrigger className={errors.category ? 'border-destructive' : ''}>
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
                  {errors.category && (
                    <p className="text-sm text-destructive">{errors.category}</p>
                  )}
                  {mlPrediction && mlConfidence > 0.5 && categoryMismatch && (
                    <p className="text-sm text-destructive">
                      AI suggests "{mlPrediction}" ({Math.round(mlConfidence * 100)}%). Please review your selection.
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Priority Level *</Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value) => handleInputChange('priority', value)}
                  >
                    <SelectTrigger className={errors.priority ? 'border-destructive' : ''}>
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
                  {errors.priority && (
                    <p className="text-sm text-destructive">{errors.priority}</p>
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
                  className={errors.location ? 'border-destructive' : ''}
                />
                {errors.location && (
                  <p className="text-sm text-destructive">{errors.location}</p>
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

                {selectedImages.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                    {selectedImages.map((file, index) => (
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

                {errors.images && (
                  <p className="text-sm text-destructive">{errors.images}</p>
                )}
              </div>

              {/* Anonymous Reporting */}
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="anonymous"
                  checked={formData.anonymous}
                  onCheckedChange={(checked) => handleInputChange('anonymous', checked as boolean)}
                />
                <Label htmlFor="anonymous" className="text-sm">
                  Report anonymously (your identity will be hidden)
                </Label>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full btn-citizen"
                disabled={isSubmitting || (mlPrediction && mlConfidence > 0.5 && categoryMismatch)}
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