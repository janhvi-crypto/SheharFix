import React, { useState, useEffect, forwardRef, useRef } from 'react';
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
  const [isRecording, setIsRecording] = useState(false);
  const [mlPrediction, setMlPrediction] = useState<string | null>(null);
  const [mlConfidence, setMlConfidence] = useState<number>(0);
  const [categoryMismatch, setCategoryMismatch] = useState(false);
  const mismatchToastedRef = useRef(false);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 1000);
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

  // Notify when mismatch is detected (top red banner will also show)
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

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
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

    // Call ML service for prediction
    try {
      const formDataImage = new FormData();
      formDataImage.append('file', file);
      // Use Vite dev proxy to avoid CORS and port issues
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
        // Notify user with an in-app toast about AI suggestion
        const confPercent = Number(result.confidence || 0) * 100;
        toast.success(
          `AI suggests: ${result.prediction} (${confPercent.toFixed(1)}% confidence)`,
        );
      }
    } catch (err) {
      console.error('ML error:', err);
      const message = err instanceof Error ? err.message : 'Failed to get AI prediction';
      toast.error(message || 'Failed to get AI prediction');
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
          const mockAddress = `${latitude.toFixed(4)}, ${longitude.toFixed(4)} - Current Location`;
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
    if (!validateForm()) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (
      mlPrediction &&
      mlConfidence > 0.5 &&
      formData.category &&
      mlPrediction.toLowerCase() !== formData.category.toLowerCase()
    ) {
      setCategoryMismatch(true);
      toast.error(`Category Mismatch: AI suggests "${mlPrediction}". Please review.`);
      return;
    }

    setIsSubmitting(true);
    try {
      // Convert selected image to base64 for Mongo backend (expects JSON with base64 in `media`)
      let mediaBase64 = '';
      if (selectedImage) {
        mediaBase64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            const result = reader.result as string;
            // result is dataURL like: data:image/png;base64,AAAA...
            const commaIdx = result.indexOf(',');
            resolve(commaIdx >= 0 ? result.slice(commaIdx + 1) : result);
          };
          reader.onerror = () => reject(reader.error);
          reader.readAsDataURL(selectedImage);
        });
      }

      const payload: any = {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        priority: formData.priority,
        location: formData.location ? { address: formData.location } : undefined,
        media: mediaBase64 || undefined,
      };

      // Build headers and only include Authorization if we have a real token
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      const isRealToken = token && token !== 'mock-jwt-token-for-testing';
      if (isRealToken) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch('/api/issues', {
        method: 'POST',
        headers,
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errResponse = await response.json().catch(() => ({}));
        throw new Error(errResponse.error || 'Failed to submit the report.');
      }

      toast.success('Issue reported successfully!');
      navigate('/dashboard');

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
            <p className="text-muted-foreground mt-1">Help improve your community by reporting civic issues</p>
          </div>
        </div>

        {categoryMismatch && (
          <div className="bg-red-100 border border-red-500 text-red-700 p-3 mb-4 rounded-md">
            ⚠ You selected "{formData.category}", but our AI detected "{mlPrediction}". Please select the correct category before submitting.
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          <Card>
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
                <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
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
                <Select value={formData.priority} onValueChange={(value) => handleInputChange('priority', value)}>
                  <SelectTrigger id="priority" className={errors.priority ? 'border-destructive' : ''}>
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    {priorityLevels.map(p => (
                      <SelectItem key={p.value} value={p.value}>{p.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.priority && <p className="text-sm text-destructive">{errors.priority}</p>}
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location">Location *</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="location"
                    placeholder="Enter the exact location"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className={errors.location ? 'border-destructive' : ''}
                  />
                  <Button type="button" variant="outline" size="sm" onClick={getCurrentLocation} className="flex items-center gap-2">
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

              {/* Anonymous Submission */}
              <div className="flex items-center space-x-2 pt-2">
                <UICheckbox
                  id="anonymous"
                  checked={!!formData.anonymous}
                  onCheckedChange={(checked) => handleInputChange('anonymous', !!checked)}
                />
                <Label htmlFor="anonymous" className="cursor-pointer text-muted-foreground">
                  Report anonymously (your identity will be hidden)
                </Label>
              </div>

              {/* Submit Button */}
              <Button type="submit" className="w-full mt-8" disabled={isSubmitting}>
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