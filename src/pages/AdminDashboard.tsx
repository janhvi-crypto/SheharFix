
import React, { useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle, Clock, Users, MapPin, Navigation, Camera, Settings, IndianRupee, BarChart3, TrendingUp, Shield, Upload, X } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Layout from '@/components/Layout';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';

const AdminDashboard = () => {
  const { user, uploadIssuePhoto, markIssueResolved } = useApp();
  const { toast } = useToast();
  type AdminUiIssue = {
    id: string;
    title: string;
    description: string;
    location: string;
    priority: 'low' | 'medium' | 'high' | 'urgent';
    category: string;
    reportedBy: string;
    reportedDate: string;
    assignedTo?: string;
    image: string;
    afterImage?: string;
    status: 'assigned' | 'in-progress' | 'resolved';
    upvotes: number;
    estimatedTime?: string;
  };
  const [adminIssues, setAdminIssues] = useState<AdminUiIssue[]>([]);
  const [uploadingPhoto, setUploadingPhoto] = useState<string | number | null>(null);
  const [resolvingIssue, setResolvingIssue] = useState<string | number | null>(null);
  const [resolveModal, setResolveModal] = useState<{ open: boolean; issueId: string | number | null; file: File | null; note: string }>({ open: false, issueId: null, file: null, note: '' });

  function resolveImage(row: any): string {
    // For Admin card thumbnails we want original user upload as the primary image (Before)
    if (row.mediaUrl) return row.mediaUrl;
    return '';
  }

  function mapStatus(s: string): 'assigned' | 'in-progress' | 'resolved' {
    switch (s) {
      case 'resolved': return 'resolved';
      case 'in_progress': return 'in-progress';
      case 'acknowledged': return 'assigned';
      default: return 'assigned';
    }
  }

  function capitalize(s: string) { return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/issues');
        if (!res.ok) throw new Error('Failed to load issues');
        const rows = await res.json();
        if (cancelled) return;
        const mapped: AdminUiIssue[] = rows.map((row: any) => ({
          id: row._id,
          title: row.title,
          description: row.description || '',
          location: row.location?.address || '',
          priority: row.priority || 'medium',
          category: capitalize(row.category || 'General'),
          reportedBy: row.createdBy?.username || 'Citizen',
          reportedDate: row.createdAt || new Date().toISOString(),
          assignedTo: '',
          image: row.mediaUrl || resolveImage(row),
          afterImage: row.resolutionPhotoUrl || undefined,
          status: mapStatus(row.status || 'submitted'),
          upvotes: 0,
          estimatedTime: '-',
        }));
        const sorted = mapped.sort((a, b) => {
          const ar = a.status === 'resolved' ? 1 : 0;
          const br = b.status === 'resolved' ? 1 : 0;
          if (ar !== br) return ar - br;
          return new Date(b.reportedDate).getTime() - new Date(a.reportedDate).getTime();
        });
        setAdminIssues(sorted);
      } catch (e) {
        setAdminIssues([]);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Transparency data for administrators
  const transparencyData = {
    budget: {
      total: 245.8,
      allocated: 198.3,
      spent: 167.4,
      remaining: 30.9,
      efficiency: 84.4
    },
    departments: [
      { name: 'Road Infrastructure', budget: 67.2, spent: 58.9, projects: 45, completion: 87.6 },
      { name: 'Waste Management', budget: 45.8, spent: 41.2, projects: 32, completion: 89.9 },
      { name: 'Water & Drainage', budget: 38.4, spent: 32.1, projects: 28, completion: 83.6 },
      { name: 'Street Lighting', budget: 28.7, spent: 24.8, projects: 19, completion: 86.4 },
      { name: 'Parks & Recreation', budget: 18.2, spent: 10.4, projects: 12, completion: 57.1 }
    ],
    performance: {
      issuesResolved: 1247,
      avgResponseTime: 2.8,
      citizenSatisfaction: 87.2,
      budgetUtilization: 84.4,
      staffEfficiency: 91.3
    }
  };

  const stats = [
    { 
      title: 'Pending Issues', 
      value: '47', 
      change: '+3', 
      period: 'new today',
      icon: AlertTriangle, 
      color: 'text-orange-600' 
    },
    { 
      title: 'Resolved Today', 
      value: '23', 
      change: '+8', 
      period: 'vs yesterday',
      icon: CheckCircle, 
      color: 'text-green-600' 
    },
    { 
      title: 'Avg Response Time', 
      value: '2.3', 
      suffix: 'days',
      change: '-18%', 
      period: 'improvement',
      icon: Clock, 
      color: 'text-blue-600' 
    },
    { 
      title: 'Team Members', 
      value: '12', 
      change: '+2', 
      period: 'this month',
      icon: Users, 
      color: 'text-purple-600' 
    },
  ];

  const handlePhotoUpload = async (issueId: string | number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(issueId);
    try {
      // Replace with actual API call to your backend
      const formData = new FormData();
      formData.append('file', file);
      formData.append('issueId', issueId.toString());

      const response = await fetch('/api/issues/upload-progress-photo', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to upload photo');
      }

      const result = await response.json();
      
      // Update local state through context (temporary until real-time updates)
      // Optional: integrate with real backend progress upload; for now, update UI only
      
      toast({
        title: "Photo uploaded successfully",
        description: "Progress photo has been attached to the issue."
      });
    } catch (error) {
      toast({
        title: "Upload failed",
        description: "Failed to upload photo. Please try again.",
        variant: "destructive"
      });
    } finally {
      setUploadingPhoto(null);
    }
  };

  const fileToBase64 = (file: File) => new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.includes(',') ? result.split(',')[1] : result;
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const compressImage = (file: File, maxWidth = 1280, maxHeight = 1280, quality = 0.8): Promise<File> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const url = URL.createObjectURL(file);
      img.onload = () => {
        let { width, height } = img;
        const ratio = Math.min(maxWidth / width, maxHeight / height, 1);
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(width * ratio);
        canvas.height = Math.round(height * ratio);
        const ctx = canvas.getContext('2d');
        if (!ctx) { URL.revokeObjectURL(url); return resolve(file); }
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        canvas.toBlob((blob) => {
          URL.revokeObjectURL(url);
          if (!blob) return resolve(file);
          resolve(new File([blob], file.name.replace(/\.(png|jpg|jpeg)$/i, '.jpg'), { type: 'image/jpeg' }));
        }, 'image/jpeg', quality);
      };
      img.onerror = (e) => { URL.revokeObjectURL(url); reject(e); };
      img.src = url;
    });
  };

  const submitResolve = async () => {
    if (!resolveModal.issueId || !resolveModal.file) {
      toast({ title: 'Resolution photo required', description: 'Please attach a resolution image.', variant: 'destructive' });
      return;
    }
    const issueId = resolveModal.issueId as string | number;
    setResolvingIssue(issueId);
    try {
      const compressed = await compressImage(resolveModal.file);
      const media = await fileToBase64(compressed);
      const headers: Record<string, string> = { 'Content-Type': 'application/json' };
      const token = localStorage.getItem('token');
      if (token) headers['Authorization'] = `Bearer ${token}`;
      const resp = await fetch(`/api/issues/${issueId}/resolve`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ media, note: resolveModal.note || undefined })
      });
      if (!resp.ok) {
        const text = await resp.text().catch(() => '');
        const msg = text || `HTTP ${resp.status}`;
        throw new Error(msg || 'Failed to mark issue as resolved');
      }
      await resp.json();
      // Update UI locally
      setAdminIssues(prev => prev.map(i => i.id === issueId ? { ...i, status: 'resolved', afterImage: `data:image/jpeg;base64,${media}` } : i));
      toast({ title: 'Issue resolved successfully', description: 'The issue has been marked as resolved and moved to public view.' });
      setResolveModal({ open: false, issueId: null, file: null, note: '' });
    } catch (error) {
      toast({ title: 'Failed to resolve', description: 'Failed to mark issue as resolved. Please try again.', variant: 'destructive' });
    } finally {
      setResolvingIssue(null);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'assigned': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'in-progress': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'resolved': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Roads': return '🛣️';
      case 'Sanitation': return '🗑️';
      case 'Drainage': return '🌊';
      case 'Street Lighting': return '💡';
      default: return '⚠️';
    }
  };

  return (
    <>
    <Layout searchPlaceholder="Search assigned issues, locations, or categories...">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col space-y-2">
          <div className="flex items-center space-x-2">
            <Settings className="w-6 h-6 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">
              Administrator Dashboard
            </h1>
          </div>
          <p className="text-muted-foreground">
            Manage and resolve civic issues reported by citizens
          </p>
        </div>

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="card-gradient">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">47</p>
                  <p className="text-sm text-muted-foreground">Assigned Issues</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-gradient">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <IndianRupee className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">₹{transparencyData.budget.spent}L</p>
                  <p className="text-sm text-muted-foreground">Budget Utilized</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-gradient">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{transparencyData.performance.citizenSatisfaction}%</p>
                  <p className="text-sm text-muted-foreground">Citizen Satisfaction</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-gradient">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{transparencyData.performance.staffEfficiency}%</p>
                  <p className="text-sm text-muted-foreground">Staff Efficiency</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Department Budget Overview for Admins */}
        <Card className="card-gradient">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="w-5 h-5" />
              <span>Budget Management Overview</span>
            </CardTitle>
            <CardDescription>Department-wise budget allocation and utilization tracking</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {transparencyData.departments.map((dept, index) => (
                <div key={index} className="p-4 border rounded-lg bg-card/50">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm">{dept.name}</h4>
                      <Badge variant="secondary" className="text-xs">
                        {dept.completion.toFixed(1)}%
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>₹{dept.spent}L / ₹{dept.budget}L</span>
                        <span>{dept.projects} projects</span>
                      </div>
                      <Progress value={dept.completion} className="h-2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Assigned Issues */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Issues Assigned to You</h2>
            <div className="flex space-x-2">
              <Button variant="outline" size="sm">
                <MapPin className="w-4 h-4 mr-2" />
                View on Map
              </Button>
              <Button size="sm" onClick={() => window.location.href = '/manage-issues'}>
                <Settings className="w-4 h-4 mr-2" />
                Manage Issues
              </Button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {adminIssues.map((issue) => (
              <Card key={issue.id} className="card-gradient">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-lg">{getCategoryIcon(issue.category)}</span>
                        <h3 className="font-semibold">{issue.title}</h3>
                        <Badge variant="outline" className={getPriorityColor(issue.priority)}>
                          {issue.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{issue.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <span>📍 {issue.location}</span>
                        <span>👤 {issue.reportedBy}</span>
                        <span>⏱️ Est. {issue.estimatedTime}</span>
                      </div>
                    </div>
                    <Badge variant="outline" className={getStatusColor(issue.status)}>
                      {issue.status.replace('-', ' ')}
                    </Badge>
                  </div>
                  
                  <div className="mb-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <p className="text-xs font-medium text-muted-foreground">Before</p>
                        <img 
                          src={issue.image} 
                          alt="Before resolution"
                          className="w-full h-24 object-cover rounded-lg"
                        />
                      </div>
                      {issue.afterImage && (
                        <div className="space-y-1">
                          <p className="text-xs font-medium text-muted-foreground">After/Progress</p>
                          <img 
                            src={issue.afterImage} 
                            alt="After/Progress"
                            className="w-full h-24 object-cover rounded-lg"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs mb-3">
                    <span className="text-muted-foreground">
                      Reported on {new Date(issue.reportedDate).toLocaleDateString()}
                    </span>
                    <div className="flex items-center space-x-1">
                      <span>👍 {issue.upvotes}</span>
                      <span className="text-muted-foreground">citizen confirmations</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Button size="sm" className="flex-1">
                      <Navigation className="w-3 h-3 mr-1" />
                      Navigate
                    </Button>
                    <div className="flex-1">
                      <Input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        id={`photo-upload-${issue.id}`}
                        onChange={(e) => handlePhotoUpload(issue.id, e)}
                        disabled={uploadingPhoto === issue.id}
                      />
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full"
                        disabled={uploadingPhoto === issue.id}
                        onClick={() => document.getElementById(`photo-upload-${issue.id}`)?.click()}
                      >
                        {uploadingPhoto === issue.id ? (
                          <Upload className="w-3 h-3 mr-1 animate-spin" />
                        ) : (
                          <Camera className="w-3 h-3 mr-1" />
                        )}
                        {uploadingPhoto === issue.id ? 'Uploading...' : 'Upload Photo'}
                      </Button>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      disabled={resolvingIssue === issue.id || issue.status === 'resolved'}
                      onClick={() => {
                        if (issue.status === 'resolved') return;
                        setResolveModal({ open: true, issueId: issue.id, file: null, note: '' });
                      }}
                    >
                      {resolvingIssue === issue.id ? (
                        <CheckCircle className="w-3 h-3 mr-1 animate-spin" />
                      ) : (
                        <CheckCircle className="w-3 h-3 mr-1" />
                      )}
                      {resolvingIssue === issue.id ? 'Resolving...' : 'Mark Resolved'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="card-gradient">
            <CardHeader>
              <CardTitle className="text-lg">Team Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Issues Resolved This Week</span>
                  <span className="font-medium">34</span>
                </div>
                <Progress value={85} className="h-2" />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Target: 40</span>
                  <span>85% Complete</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-gradient">
            <CardHeader>
              <CardTitle className="text-lg">Priority Alerts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span>3 high priority issues</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span>8 overdue assignments</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>12 new reports today</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-gradient">
            <CardHeader>
              <CardTitle className="text-lg">Recent Updates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p>• Street lighting project completed in Ward 185</p>
                <p>• New drainage system installed in BTM Layout</p>
                <p>• Road repair work started on MG Road</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
    {resolveModal.open && (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/50" onClick={() => setResolveModal({ open: false, issueId: null, file: null, note: '' })} />
        <div className="relative bg-card border rounded-lg shadow-lg w-full max-w-md p-4 mx-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold">Resolve Issue</h3>
            <button className="p-1 rounded hover:bg-muted" onClick={() => setResolveModal({ open: false, issueId: null, file: null, note: '' })}>
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium">Resolution Photo (required)</label>
              <input
                type="file"
                accept="image/*"
                className="mt-1 block w-full text-sm"
                onChange={(e) => setResolveModal(prev => ({ ...prev, file: e.target.files?.[0] || null }))}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Resolution Note (optional)</label>
              <textarea
                className="mt-1 w-full border rounded p-2 text-sm bg-background"
                rows={3}
                placeholder="Describe the fix..."
                value={resolveModal.note}
                onChange={(e) => setResolveModal(prev => ({ ...prev, note: e.target.value }))}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setResolveModal({ open: false, issueId: null, file: null, note: '' })}>Cancel</Button>
              <Button onClick={submitResolve} disabled={!!resolvingIssue}>Submit as Resolved</Button>
            </div>
          </div>
        </div>
      </div>
    )}
    </>
  );
};

export default AdminDashboard;
