import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, Clock, Users, MapPin, Settings, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';
import { useApp } from '@/contexts/AppContext';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import potholeImg from '@/assets/sample-pothole.jpg';
import garbageImg from '@/assets/sample-garbage.jpg';
import drainageImg from '@/assets/sample-drainage.jpg';
import streetlightImg from '@/assets/sample-streetlight.jpg';

const DepartmentDashboard = () => {
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

  // Department to issue category mapping
  const getDepartmentIssueCategories = (departmentCategory: string): string[] => {
    const dept = departmentCategory.toLowerCase();
    const mapping: Record<string, string[]> = {
      'potholes': ['potholes', 'road maintenance', 'road damage'],
      'garbage': ['garbage', 'waste management', 'sanitation', 'cleanliness'],
      'street lights': ['street lights', 'street lighting', 'lighting'],
      'drainage': ['drainage', 'sewage', 'waterlogging'],
      'water supply': ['water supply', 'lack of water', 'water shortage', 'water'],
      'park maintenance': ['park maintenance', 'park', 'playground', 'garden'],
      'traffic signals': ['traffic signals', 'traffic lights', 'traffic', 'road rage'],
      'noise pollution': ['noise pollution', 'noise', 'pollution'],
    };
    
    // Find matching department
    for (const [key, categories] of Object.entries(mapping)) {
      if (dept.includes(key) || key.includes(dept)) {
        return categories;
      }
    }
    return [];
  };

  const isIssueBelongsToDepartment = (issueCategory: string, departmentCategory: string): boolean => {
    const allowedCategories = getDepartmentIssueCategories(departmentCategory);
    const issueCat = issueCategory.toLowerCase();
    
    return allowedCategories.some(cat => 
      issueCat.includes(cat) || cat.includes(issueCat)
    );
  };

  useEffect(() => {
    let cancelled = false;
    async function fetchIssues() {
      try {
        const res = await fetch('/api/issues');
        if (!res.ok) throw new Error('Failed to load issues');
        const rows: any[] = await res.json();
        if (cancelled) return;
        
        // Filter issues based on department category
        const departmentCategory = user?.departmentCategory || '';
        const mapped: UiIssue[] = rows
          .filter((row) => {
            if (!departmentCategory) return true;
            const issueCategory = String(row.category || '');
            return isIssueBelongsToDepartment(issueCategory, departmentCategory);
          })
          .map((row) => ({
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

    const handleFocus = () => {
      fetchIssues();
    };
    
    window.addEventListener('focus', handleFocus);
    
    return () => { 
      cancelled = true; 
      window.removeEventListener('focus', handleFocus);
    };
  }, [user?.departmentCategory]);

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
    const cat = category.toLowerCase();
    if (cat.includes('pothole') || cat.includes('road')) return '🛣️';
    if (cat.includes('garbage') || cat.includes('sanitation')) return '🗑️';
    if (cat.includes('drain')) return '🌊';
    if (cat.includes('light')) return '💡';
    if (cat.includes('water')) return '💧';
    if (cat.includes('park')) return '🌳';
    if (cat.includes('traffic')) return '🚦';
    return '⚠️';
  };

  return (
    <Layout searchPlaceholder="Search assigned issues, locations...">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col space-y-2">
          <div className="flex items-center space-x-2">
            <Settings className="w-6 h-6 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">
              {capitalize(user?.departmentCategory || 'Department')} Dashboard
            </h1>
          </div>
          <p className="text-muted-foreground">
            Manage and resolve {user?.departmentCategory} related issues
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
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{issues.filter(i => i.status === 'resolved').length}</p>
                  <p className="text-sm text-muted-foreground">Resolved Issues</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-gradient">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{issues.filter(i => i.status === 'in-progress').length}</p>
                  <p className="text-sm text-muted-foreground">In Progress</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-gradient">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{issues.reduce((acc, i) => acc + (i.upvotes || 0), 0)}</p>
                  <p className="text-sm text-muted-foreground">Total Upvotes</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Assigned Issues */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Issues Assigned to Your Department</h2>
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
                No {user?.departmentCategory} issues found. All caught up!
              </div>
            )}
            {issues.map((issue) => (
              <Card key={issue.id} className="card-gradient">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-lg">{getCategoryIcon(issue.category || '')}</span>
                        <h3 className="font-semibold">{issue.title}</h3>
                        <Badge variant="outline" className={getPriorityColor(issue.priority || 'medium')}>
                          {issue.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{issue.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <span>📍 {issue.location}</span>
                        <span>👤 {issue.reportedBy}</span>
                        <span>👍 {issue.upvotes} votes</span>
                      </div>
                    </div>
                    <Badge variant="outline" className={getStatusColor(issue.status)}>
                      {issue.status.replace('-', ' ')}
                    </Badge>
                  </div>
                  
                  <div className="flex items-center space-x-2 mt-3">
                    <img
                      src={issue.image}
                      alt={issue.title}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    {issue.afterImage && (
                      <img
                        src={issue.afterImage}
                        alt="After"
                        className="w-24 h-24 object-cover rounded-lg"
                      />
                    )}
                  </div>

                  <div className="flex items-center space-x-2 mt-3">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => window.location.href = `/issue/${issue.id}`}
                    >
                      View Details
                    </Button>
                    {issue.status !== 'resolved' && (
                      <Button
                        size="sm"
                        className="flex-1"
                        onClick={() => {
                          toast({
                            title: "Action required",
                            description: "Navigate to issue details to resolve."
                          });
                        }}
                      >
                        Take Action
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DepartmentDashboard;
