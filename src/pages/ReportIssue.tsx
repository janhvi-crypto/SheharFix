import React, { useState, useEffect } from 'react';
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

const ReportIssue = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    priority: '',
    anonymous: false // State for anonymous feature
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isRecording, setIsRecording] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mlPrediction, setMlPrediction] = useState<string | null>(null);
  const [mlConfidence, setMlConfidence] = useState<number>(0);
  const [categoryMismatch, setCategoryMismatch] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 2000);
  }, []);

  const categories = [
    'pothole',
    'garbage',
    'streetlight',
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

  const validateForm = (): Record<string, string> => {
    const newErrors: Record<string, string> = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.priority) newErrors.priority = 'Priority level is required';
    if (!selectedImage) newErrors.photo = 'An image is required';
    return newErrors;
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

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setMlPrediction(null);
      setMlConfidence(0);
      setCategoryMismatch(false);
      if (errors.photo) {
        setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors.photo;
          return newErrors;
        });
      }

      const formDataImage = new FormData();
      formDataImage.append('file', file);

      try {
        const response = await fetch('http://127.0.0.1:8000/predict', {
          method: 'POST',
          body: formDataImage,
        });
        if (!response.ok) throw new Error('Prediction request failed');
        const result = await response.json();
        console.log('ML Prediction:', result);
        if (result.prediction) {
          setMlPrediction(result.prediction);
          setMlConfidence(result.confidence);
        }
      } catch (err) {
        console.error('ML error:', err);
        toast.error('Failed to get AI prediction');
      }
    }
  };

  const removeImage = () => {
    setSelectedImage(null);
    setMlPrediction(null);
    setMlConfidence(0);
    setCategoryMismatch(false);
  };

  const startRecording = () => {
    setIsRecording(true);
    setTimeout(() => {
      setIsRecording(false);
      const voiceText = 'There is a large pothole on the main road causing traffic issues. It needs immediate attention.';
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
          handleInputChange('location', mockAddress);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCategoryMismatch(false);

    const validationErrors = validateForm();
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length > 0) {
      toast.error('Please fill in all required fields');
      const firstErrorKey = Object.keys(validationErrors)[0];
      const errorElement = document.getElementById(firstErrorKey);
      errorElement?.focus({ preventScroll: true });
      errorElement?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }

    if (mlPrediction && mlConfidence > 0.5 && mlPrediction.toLowerCase() !== formData.category.toLowerCase()) {
      setCategoryMismatch(true);
      toast.error(`Category Mismatch: AI suggests "${mlPrediction}". Please review.`);
      return;
    }

    setIsSubmitting(true);
    try {
      const form = new FormData();
      form.append('title', formData.title);
      form.append('description', formData.description);
      form.append('category', formData.category);
      form.append('priority', formData.priority || 'medium');
      // Extract lat/lng if user used current location format "lat, lng - ..."
      const locMatch = formData.location.match(/([-+]?\d*\.?\d+),\s*([-+]?\d*\.?\d+)/);
      if (locMatch) {
        form.append('lat', locMatch[1]);
        form.append('lng', locMatch[2]);
      }
      if (selectedImage) {
        form.append('media', selectedImage);
      }

      const resp = await fetch('/api/issues', {
        method: 'POST',
        body: form,
        // Authorization header optional; if you wire login to backend later, include token here
      });
      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to submit');
      }

      toast.success('Issue reported successfully!');
      navigate('/dashboard');
    } catch (error) {
      console.error(error);
      toast.error('Failed to submit report. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <LoadingScreen />;

  return (
    <Layout searchPlaceholder="Search previous reports...">
      <div className="max-w-2xl mx-auto p-6">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => navigate('/dashboard')} className="mb-4">
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

        <form onSubmit={handleSubmit} noValidate>
          {categoryMismatch && (
            <div className="bg-red-100 border border-red-500 text-red-700 p-3 mb-4 rounded-md">
              ⚠ You selected "{formData.category}", but our AI detected "{mlPrediction}". Please select the correct category before submitting.
            </div>
          )}

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
                {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
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
                {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleInputChange('category', value)}
                >
                  <SelectTrigger id="category" className={errors.category ? 'border-destructive' : ''}>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat.toLowerCase()}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {mlPrediction && mlConfidence > 0 && (
                  <p className="text-sm text-green-700 mt-1">
                    AI Suggestion: {mlPrediction} ({(mlConfidence * 100).toFixed(1)}% confidence)
                  </p>
                )}
                {errors.category && <p className="text-sm text-destructive">{errors.category}</p>}
              </div>

              {/* Priority */}
              <div className="space-y-2">
                <Label htmlFor="priority">Priority Level *</Label>
                <Select
                  value={formData.priority}
                  onValueChange={(value) => handleInputChange('priority', value)}
                >
                  <SelectTrigger id="priority" className={errors.priority ? 'border-destructive' : ''}>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    {priorityLevels.map(p => (
                      <SelectItem key={p.value} value={p.value} className={p.color}>{p.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.priority && <p className="text-sm text-destructive">{errors.priority}</p>}
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    id="location"
                    placeholder="Enter the exact location"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className={`w-full ${errors.location ? 'border-destructive' : ''}`}
                  />
                  <Button type="button" variant="outline" size="sm" onClick={getCurrentLocation} className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4" />
                    <span>Use Current Location</span>
                  </Button>
                </div>
                {errors.location && <p className="text-sm text-destructive">{errors.location}</p>}
              </div>

              {/* Photo Upload */}
              <div className="space-y-2" id="photo">
                <Label>Photo * (Only 1 allowed)</Label>
                <div className={`border-2 border-dashed rounded-lg p-6 text-center ${errors.photo ? 'border-destructive' : 'border-border'}`}>
                  <input
                    type="file"
                    accept="image/png, image/jpeg"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Click to upload a photo</p>
                    <p className="text-xs text-muted-foreground mt-1">PNG, JPG up to 5MB</p>
                  </label>
                </div>
                {selectedImage && (
                  <div className="relative w-40 h-40 mt-4">
                    <img
                      src={URL.createObjectURL(selectedImage)}
                      alt="Uploaded preview"
                      className="w-full h-full object-cover rounded-lg border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={removeImage}
                      className="absolute -top-2 -right-2 w-6 h-6 rounded-full p-0"
                    >
                      ×
                    </Button>
                  </div>
                )}
                {errors.photo && <p className="text-sm text-destructive">{errors.photo}</p>}
              </div>
              
              {/* Anonymous Submission - ADDED AS REQUESTED */}
              <div className="flex items-center space-x-2 pt-2">
                <Checkbox
                  id="anonymous"
                  checked={!!formData.anonymous}
                  onCheckedChange={(checked) => handleInputChange('anonymous', !!checked)}
                />
                <Label htmlFor="anonymous" className="cursor-pointer text-muted-foreground">
                  Report anonymously (your identity will be hidden)
                </Label>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full btn-citizen !mt-8" // Added !mt-8 for more space
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
