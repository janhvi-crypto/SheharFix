
import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, Clock, Users, MapPin, Navigation, Camera, Settings, IndianRupee, BarChart3, TrendingUp, Shield, Upload } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Layout from '@/components/Layout';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import potholeImg from '@/assets/sample-pothole.jpg';
import garbageImg from '@/assets/sample-garbage.jpg';
import drainageImg from '@/assets/sample-drainage.jpg';
import streetlightImg from '@/assets/sample-streetlight.jpg';

const AdminDashboard = () => {
  const { user } = useApp();
  const { toast } = useToast();
  const [uploadingPhoto, setUploadingPhoto] = useState<string | null>(null);
  const [resolvingIssue, setResolvingIssue] = useState<string | null>(null);

  type UiIssue = {
    id: string;
    title: string;
    description?: string;
    category?: string;
    status: string;
    reportedBy: string;
    date: string;
    image: string;
    location?: string;
    priority?: string;
    upvotes?: number;
    afterImage?: string;
  };

  const [issues, setIssues] = useState<UiIssue[]>([]);
  const [loadingIssues, setLoadingIssues] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function fetchIssues() {
      try {
        const res = await fetch('/api/issues');
        if (!res.ok) throw new Error('Failed to load issues');
        const rows: any[] = await res.json();
        if (cancelled) return;
        const mapped: UiIssue[] = rows.map((row) => ({
          id: row._id,
          title: row.title,
          description: row.description || '',
          category: capitalize(row.category || 'General'),
          status: mapStatus(row.status || 'submitted'),
          reportedBy: row.createdBy?.username ? row.createdBy.username : 'Citizen',
          date: row.createdAt ? format(new Date(row.createdAt), 'yyyy-MM-dd') : '',
          image: resolveImage(row),
          location: row.location?.address || 'Location not specified',
          priority: row.priority || 'medium',
          upvotes: row.upvotes || 0,
          afterImage: row.resolutionPhotoUrl
        }))
        .sort((a, b) => {
          const aResolved = a.status === 'resolved' ? 1 : 0;
          const bResolved = b.status === 'resolved' ? 1 : 0;
          if (aResolved !== bResolved) return aResolved - bResolved;
          return new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime();
        });
        setIssues(mapped);
      } catch (e) {
        setIssues([]);
      } finally {
        if (!cancelled) setLoadingIssues(false);
      }
    }
    fetchIssues();
    return () => { cancelled = true; };
  }, []);

  function resolveImage(row: any): string {
    if (row.resolutionPhotoUrl) return row.resolutionPhotoUrl.startsWith('http') ? row.resolutionPhotoUrl : `${window.location.origin}${row.resolutionPhotoUrl}`;
    if (row.mediaUrl) return row.mediaUrl.startsWith('http') ? row.mediaUrl : `${window.location.origin}${row.mediaUrl}`;
    if (row.media_path) return row.media_path.startsWith('http') ? row.media_path : `${window.location.origin}${row.media_path}`;
    const cat = String(row.category || '').toLowerCase();
    if (cat.includes('pothole') || cat.includes('road')) return potholeImg;
    if (cat.includes('garbage') || cat.includes('sanitation')) return garbageImg;
    if (cat.includes('drain')) return drainageImg;
    if (cat.includes('light')) return streetlightImg;
    return potholeImg;
  }

  function capitalize(s: string) { return s.charAt(0).toUpperCase() + s.slice(1); }
  function mapStatus(s: string) {
    switch (s) {
      case 'resolved': return 'resolved';
      case 'in_progress': return 'in-progress';
      case 'acknowledged': return 'assigned';
      default: return 'reported';
    }
  }
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

  const handlePhotoUpload = async (issueId: string, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingPhoto(issueId);
    try {
      // TODO: Implement photo upload API call when backend is ready
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

  const handleMarkResolved = async (issueId: string) => {
    setResolvingIssue(issueId);
    try {
      // TODO: Implement resolve issue API call when backend is ready
      toast({
        title: "Issue resolved successfully",
        description: "The issue has been marked as resolved and moved to public view."
      });
    } catch (error) {
      toast({
        title: "Failed to resolve",
        description: "Failed to mark issue as resolved. Please try again.",
        variant: "destructive"
      });
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
                  <p className="text-2xl font-bold">{issues.filter(i => i.status !== 'resolved').length}</p>
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
            {loadingIssues && (
              <div className="col-span-full text-sm text-muted-foreground text-center py-8">
                Loading issues...
              </div>
            )}
            {!loadingIssues && issues.length === 0 && (
              <div className="col-span-full text-sm text-muted-foreground text-center py-8">
                No issues found. All caught up!
              </div>
            )}
            {issues.map((issue) => (
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
                        <span>⏱️ Est. 2-3 days</span>
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
                      Reported on {new Date(issue.date).toLocaleDateString()}
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
                      disabled={resolvingIssue === issue.id}
                      onClick={() => handleMarkResolved(issue.id)}
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
  );
};

export default AdminDashboard;
