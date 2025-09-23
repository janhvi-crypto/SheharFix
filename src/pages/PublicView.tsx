
import React, { useState, useEffect } from 'react';
import { MapPin, Clock, CheckCircle, AlertTriangle, Users, Eye, Search, Filter, Calendar, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Layout from '@/components/Layout';
import LoadingScreen from '@/components/LoadingScreen';
import ImageViewer from '@/components/ImageViewer';
import BeforeAfterGallery from '@/components/BeforeAfterGallery';
import { useApp } from '@/contexts/AppContext';
import samplePothole from '@/assets/sample-pothole.jpg';
import sampleGarbage from '@/assets/sample-garbage.jpg';
import sampleDrainage from '@/assets/sample-drainage.jpg';
import sampleStreetlight from '@/assets/sample-streetlight.jpg';
import beforePothole from '@/assets/before-pothole.jpg';
import afterPothole from '@/assets/after-pothole.jpg';
import beforeGarbage from '@/assets/before-garbage.jpg';
import afterGarbage from '@/assets/after-garbage.jpg';
import beforeStreetlight from '@/assets/before-streetlight.jpg';
import afterStreetlight from '@/assets/after-streetlight.jpg';

const PublicView = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [selectedImages, setSelectedImages] = useState<{ src: string; alt: string; title?: string }[]>([]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { user, resolvedIssues: contextResolvedIssues } = useApp();
  const [backendResolved, setBackendResolved] = useState<Array<{
    id: string;
    title: string;
    description: string;
    location: string;
    ward?: string;
    category: string;
    reportedBy: string;
    resolvedDate: string;
    beforeImage: string;
    afterImage: string;
    status: 'resolved';
    upvotes: number;
    responseTime?: string;
    completionDate?: string;
    department?: string;
    cost?: string;
  }>>([]);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 2000);
  }, []);

  // Fetch resolved issues from backend so public view reflects actual admin actions
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch('/api/issues?status=resolved');
        if (!res.ok) throw new Error('Failed to load resolved issues');
        const rows = await res.json();
        if (cancelled) return;
        const mapped = rows.map((row: any) => ({
          id: row._id,
          title: row.title,
          description: row.description || '',
          location: row.location?.address || '',
          ward: undefined,
          category: (row.category || 'General').charAt(0).toUpperCase() + String(row.category || 'general').slice(1),
          reportedBy: row.createdBy?.username || 'Citizen',
          resolvedDate: row.resolvedAt ? new Date(row.resolvedAt).toISOString().split('T')[0] : (row.updatedAt || new Date().toISOString()),
          beforeImage: row.mediaUrl || samplePothole,
          afterImage: row.resolutionPhotoUrl || row.mediaUrl || samplePothole,
          status: 'resolved' as const,
          upvotes: 0,
          responseTime: undefined,
          completionDate: row.resolvedAt ? new Date(row.resolvedAt).toISOString().split('T')[0] : undefined,
          department: undefined,
          cost: row.resolutionNote || undefined,
        }));
        setBackendResolved(mapped);
      } catch (e) {
        setBackendResolved([]);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // Lightweight polling to keep gallery updated every 30s
  useEffect(() => {
    const id = setInterval(async () => {
      try {
        const res = await fetch('/api/issues?status=resolved');
        if (!res.ok) return;
        const rows = await res.json();
        const mapped = rows.map((row: any) => ({
          id: row._id,
          title: row.title,
          description: row.description || '',
          location: row.location?.address || '',
          ward: undefined,
          category: (row.category || 'General').charAt(0).toUpperCase() + String(row.category || 'general').slice(1),
          reportedBy: row.createdBy?.username || 'Citizen',
          resolvedDate: row.resolvedAt ? new Date(row.resolvedAt).toISOString().split('T')[0] : (row.updatedAt || new Date().toISOString()),
          beforeImage: row.mediaUrl || samplePothole,
          afterImage: row.resolutionPhotoUrl || row.mediaUrl || samplePothole,
          status: 'resolved' as const,
          upvotes: 0,
          responseTime: undefined,
          completionDate: row.resolvedAt ? new Date(row.resolvedAt).toISOString().split('T')[0] : undefined,
          department: undefined,
          cost: row.resolutionNote || undefined,
        }));
        setBackendResolved(mapped);
      } catch {}
    }, 30000);
    return () => clearInterval(id);
  }, []);

  // Combine context resolved issues with static demo data
  const staticResolvedIssues = [
    {
      id: 101,
      title: 'Pothole Repair on MG Road',
      description: 'Large pothole causing traffic issues near bus stop',
      location: 'MG Road, Koramangala',
      ward: 'Ward 185',
      category: 'Roads',
      reportedBy: 'Arjun Mehta',
      resolvedDate: '2024-01-15',
      beforeImage: beforePothole,
      afterImage: afterPothole,
      status: 'resolved' as const,
      upvotes: 23,
      responseTime: '3 days',
      completionDate: '2024-01-15',
      department: 'Road Maintenance',
      cost: '₹25,000'
    },
    {
      id: 102,
      title: 'Garbage Collection Improved',
      description: 'Irregular garbage collection in residential area',
      location: 'Jayanagar 4th Block',
      ward: 'Ward 167',
      category: 'Sanitation',
      reportedBy: 'Priya Sharma',
      resolvedDate: '2024-01-12',
      beforeImage: beforeGarbage,
      afterImage: afterGarbage,
      status: 'resolved' as const,
      upvotes: 18,
      responseTime: '2 days',
      completionDate: '2024-01-12',
      department: 'Sanitation',
      cost: '₹8,000'
    },
    {
      id: 103,
      title: 'Drainage System Cleared',
      description: 'Blocked drainage causing waterlogging during rains',
      location: 'BTM Layout 2nd Stage',
      ward: 'Ward 198',
      category: 'Drainage',
      reportedBy: 'Rajeev Kumar',
      resolvedDate: '2024-01-10',
      beforeImage: sampleDrainage,
      afterImage: sampleDrainage,
      status: 'resolved' as const,
      upvotes: 31,
      responseTime: '5 days',
      completionDate: '2024-01-10',
      department: 'Water Works',
      cost: '₹45,000'
    },
    {
      id: 104,
      title: 'Street Light Installation',
      description: 'Dark street with no lighting causing safety concerns',
      location: 'Indiranagar 12th Main',
      ward: 'Ward 152',
      category: 'Street Lighting',
      reportedBy: 'Meera Iyer',
      resolvedDate: '2024-01-08',
      beforeImage: beforeStreetlight,
      afterImage: afterStreetlight,
      status: 'resolved' as const,
      upvotes: 27,
      responseTime: '4 days',
      completionDate: '2024-01-08',
      department: 'Electrical',
      cost: '₹18,000'
    }
  ];

  // Build gallery images from backend resolved items first, then append static samples
  const backendGallery = backendResolved.map((i) => ({
    before: i.beforeImage,
    after: i.afterImage,
    title: i.title,
    category: i.category,
    location: i.location,
    resolvedDate: i.resolvedDate,
  }));

  const beforeAfterGallery = [...backendGallery, ...staticBeforeAfterGallery];

  // Convert context issues to public view format and merge with static data
  const convertedContextIssues = contextResolvedIssues.map(issue => ({
    ...issue,
    beforeImage: issue.image,
    afterImage: issue.afterImage || issue.image,
    ward: `Ward ${Math.floor(Math.random() * 200) + 100}`,
    responseTime: issue.estimatedTime,
    completionDate: issue.resolvedDate!,
    department: issue.assignedTo
  }));

  const resolvedIssues = [...backendResolved, ...convertedContextIssues, ...staticResolvedIssues];

  const staticBeforeAfterGallery = [
    {
      before: beforePothole,
      after: afterPothole,
      title: 'MG Road Pothole Repair',
      category: 'Roads',
      location: 'MG Road, Koramangala',
      resolvedDate: '2024-01-15'
    },
    {
      before: beforeGarbage,
      after: afterGarbage,
      title: 'Garbage Management Improvement',
      category: 'Sanitation',
      location: 'Jayanagar 4th Block',
      resolvedDate: '2024-01-12'
    },
    {
      before: beforeStreetlight,
      after: afterStreetlight,
      title: 'Street Light Installation',
      category: 'Lighting',
      location: 'Indiranagar 12th Main',
      resolvedDate: '2024-01-08'
    }
  ];

  const filteredIssues = resolvedIssues.filter(issue => {
    const matchesSearch = issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         issue.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         issue.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || issue.category === categoryFilter;
    const matchesDate = dateFilter === 'all' || 
                       (dateFilter === 'week' && new Date(issue.resolvedDate) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)) ||
                       (dateFilter === 'month' && new Date(issue.resolvedDate) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
    
    return matchesSearch && matchesCategory && matchesDate;
  });

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Roads': return '🛣️';
      case 'Sanitation': return '🗑️';
      case 'Drainage': return '🌊';
      case 'Street Lighting': return '💡';
      default: return '⚠️';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Roads': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Sanitation': return 'bg-green-100 text-green-800 border-green-200';
      case 'Drainage': return 'bg-cyan-100 text-cyan-800 border-cyan-200';
      case 'Street Lighting': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const openImageViewer = (images: { src: string; alt: string; title?: string }[], startIndex: number = 0) => {
    setSelectedImages(images);
    setCurrentImageIndex(startIndex);
    setShowImageViewer(true);
  };

  const closeImageViewer = () => {
    setShowImageViewer(false);
    setSelectedImages([]);
    setCurrentImageIndex(0);
  };

  const handleNextImage = () => {
    if (currentImageIndex < selectedImages.length - 1) {
      setCurrentImageIndex(currentImageIndex + 1);
    }
  };

  const handlePreviousImage = () => {
    if (currentImageIndex > 0) {
      setCurrentImageIndex(currentImageIndex - 1);
    }
  };

  const wardLeaderboard = [
    { ward: 'Ward 185 - Koramangala', issues: 47, resolved: 42, activeRate: 89.4 },
    { ward: 'Ward 167 - Jayanagar', issues: 39, resolved: 35, activeRate: 89.7 },
    { ward: 'Ward 152 - Indiranagar', issues: 34, resolved: 31, activeRate: 91.2 },
    { ward: 'Ward 198 - BTM Layout', issues: 28, resolved: 24, activeRate: 85.7 },
    { ward: 'Ward 174 - HSR Layout', issues: 25, resolved: 22, activeRate: 88.0 }
  ];

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Layout searchPlaceholder="Search resolved issues, wards, or categories...">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col space-y-2">
          <div className="flex items-center space-x-2">
            <Eye className="w-6 h-6 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Public Transparency Portal</h1>
          </div>
          <p className="text-muted-foreground">
            Real-time view of civic issues resolution and community progress across all wards
          </p>
        </div>

        {/* Enhanced Search and Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search issues, locations, departments..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger className="w-40">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="Roads">Roads</SelectItem>
                    <SelectItem value="Sanitation">Sanitation</SelectItem>
                    <SelectItem value="Drainage">Drainage</SelectItem>
                    <SelectItem value="Street Lighting">Street Lighting</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger className="w-40">
                    <Calendar className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="card-gradient">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-2xl font-bold">1,247</p>
                  <p className="text-sm text-muted-foreground">Issues Resolved</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="card-gradient">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold">2.8</p>
                  <p className="text-sm text-muted-foreground">Avg Response Days</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="card-gradient">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold">4,892</p>
                  <p className="text-sm text-muted-foreground">Active Citizens</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="card-gradient">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-orange-600" />
                <div>
                  <p className="text-2xl font-bold">198</p>
                  <p className="text-sm text-muted-foreground">Active Wards</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="resolved" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="resolved">Resolved Issues</TabsTrigger>
            <TabsTrigger value="gallery">Before/After Gallery</TabsTrigger>
            <TabsTrigger value="analytics">Community Analytics</TabsTrigger>
          </TabsList>

          {/* Resolved Issues Tab */}
          <TabsContent value="resolved" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Resolved Issues List */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold">Recently Resolved Issues</h2>
                  <Badge variant="secondary">{filteredIssues.length} results</Badge>
                </div>
                
                {filteredIssues.map((issue) => (
                  <Card key={issue.id} className="card-gradient">
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-lg">{getCategoryIcon(issue.category)}</span>
                            <h3 className="font-semibold">{issue.title}</h3>
                            <Badge variant="outline" className={getCategoryColor(issue.category)}>
                              {issue.category}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{issue.description}</p>
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground mb-2">
                            <span>📍 {issue.location}</span>
                            <span>👤 {issue.reportedBy}</span>
                            <span>⏱️ {issue.responseTime}</span>
                            {user?.role === 'admin' && (
                              <>
                                <span>🏢 {issue.department}</span>
                                <span>💰 {issue.cost}</span>
                              </>
                            )}
                          </div>
                        </div>
                        <Badge variant="default" className="bg-green-100 text-green-800 border-green-200">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Resolved
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 mb-3">
                        <div className="space-y-1">
                          <p className="text-xs font-medium text-muted-foreground">Before</p>
                          <img 
                            src={issue.beforeImage} 
                            alt="Before resolution"
                            className="w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={() => openImageViewer([
                              { src: issue.beforeImage, alt: `Before - ${issue.title}`, title: `Before: ${issue.title}` },
                              { src: issue.afterImage, alt: `After - ${issue.title}`, title: `After: ${issue.title}` }
                            ], 0)}
                          />
                        </div>
                        <div className="space-y-1">
                          <p className="text-xs font-medium text-muted-foreground">After</p>
                          <img 
                            src={issue.afterImage} 
                            alt="After resolution"
                            className="w-full h-24 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                            onClick={() => openImageViewer([
                              { src: issue.beforeImage, alt: `Before - ${issue.title}`, title: `Before: ${issue.title}` },
                              { src: issue.afterImage, alt: `After - ${issue.title}`, title: `After: ${issue.title}` }
                            ], 1)}
                          />
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-xs">
                          <span className="text-muted-foreground">
                            Resolved on {new Date(issue.resolvedDate).toLocaleDateString()}
                          </span>
                          <div className="flex items-center space-x-1">
                            <span>👍 {issue.upvotes}</span>
                            <span className="text-muted-foreground">confirmations</span>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => openImageViewer([
                            { src: issue.beforeImage, alt: `Before - ${issue.title}`, title: `Before: ${issue.title}` },
                            { src: issue.afterImage, alt: `After - ${issue.title}`, title: `After: ${issue.title}` }
                          ])}
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          View Images
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Ward Leaderboard */}
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Ward Performance</h2>
                <Card className="card-gradient">
                  <CardHeader>
                    <CardTitle className="text-lg">Most Active Wards</CardTitle>
                    <CardDescription>Based on citizen participation and issue resolution</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {wardLeaderboard.map((ward, index) => (
                      <div key={index} className="p-3 border rounded-lg bg-card/50">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                              index === 0 ? 'bg-yellow-100 text-yellow-800' : 
                              index === 1 ? 'bg-gray-100 text-gray-800' :
                              index === 2 ? 'bg-orange-100 text-orange-800' :
                              'bg-blue-100 text-blue-800'
                            }`}>
                              {index + 1}
                            </div>
                            <div>
                              <p className="font-medium text-sm">{ward.ward}</p>
                              <p className="text-xs text-muted-foreground">
                                {ward.resolved}/{ward.issues} resolved
                              </p>
                            </div>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {ward.activeRate}%
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Performance Metrics */}
                <Card className="card-gradient">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center space-x-2">
                      <TrendingUp className="w-5 h-5" />
                      <span>Performance Insights</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Avg Resolution Time</span>
                      <span className="font-medium">2.8 days</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Success Rate</span>
                      <span className="font-medium text-green-600">89.2%</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Citizen Satisfaction</span>
                      <span className="font-medium text-blue-600">92.5%</span>
                    </div>
                    {user?.role === 'admin' && (
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Total Cost Saved</span>
                        <span className="font-medium text-purple-600">₹2.4L</span>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* QR Code Access */}
                <Card className="card-gradient">
                  <CardHeader>
                    <CardTitle className="text-lg">Quick Access</CardTitle>
                    <CardDescription>Scan QR codes in your neighborhood</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center space-y-3">
                      <div className="w-24 h-24 mx-auto bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                        <span className="text-2xl">📱</span>
                      </div>
                      <p className="text-sm">Scan neighborhood QR codes to view ward-specific issues and progress</p>
                      <Button variant="outline" size="sm">
                        Use Camera to Scan
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Before/After Gallery Tab */}
          <TabsContent value="gallery">
            <Card>
              <CardHeader>
                <CardTitle>Community Success Stories</CardTitle>
                <CardDescription>
                  Visual evidence of completed civic improvements and community collaboration
                </CardDescription>
              </CardHeader>
              <CardContent>
                <BeforeAfterGallery images={beforeAfterGallery} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Community Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="card-gradient">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="text-2xl font-bold">1,247</p>
                      <p className="text-sm text-muted-foreground">Issues Resolved</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="card-gradient">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="text-2xl font-bold">2.8</p>
                      <p className="text-sm text-muted-foreground">Avg Response Days</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="card-gradient">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="text-2xl font-bold">4,892</p>
                      <p className="text-sm text-muted-foreground">Active Citizens</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card className="card-gradient">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-5 h-5 text-orange-600" />
                    <div>
                      <p className="text-2xl font-bold">198</p>
                      <p className="text-sm text-muted-foreground">Active Wards</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Additional Analytics */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="card-gradient">
                <CardHeader>
                  <CardTitle>Resolution Trends</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">This Month</span>
                      <span className="font-semibold">127 resolved</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="h-2 bg-green-500 rounded-full" style={{ width: '85%' }} />
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>Target: 150</span>
                      <span>85% Complete</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="card-gradient">
                <CardHeader>
                  <CardTitle>Top Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm">🛣️ Roads</span>
                      <span className="font-semibold">45%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">🗑️ Sanitation</span>
                      <span className="font-semibold">28%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">🌊 Drainage</span>
                      <span className="font-semibold">18%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">💡 Lighting</span>
                      <span className="font-semibold">9%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Image Viewer Component */}
        <ImageViewer
          isOpen={showImageViewer}
          onClose={closeImageViewer}
          images={selectedImages}
          currentIndex={currentImageIndex}
          onNext={currentImageIndex < selectedImages.length - 1 ? handleNextImage : undefined}
          onPrevious={currentImageIndex > 0 ? handlePreviousImage : undefined}
        />
      </div>
    </Layout>
  );
};

export default PublicView;
