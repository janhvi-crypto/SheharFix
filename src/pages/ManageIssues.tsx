import React, { useState, useEffect } from 'react';
import { Settings, Filter, Search, MapPin, Bot, Eye, Navigation, Camera, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Layout from '@/components/Layout';
import LoadingScreen from '@/components/LoadingScreen';
import AIIssueAnalyzer from '@/components/AIIssueAnalyzer';
import IndiaMap from '@/components/IndiaMap';
import indiaIssueMapImage from '@/assets/india-issue-map.jpg';
import BeforeAfterGallery from '@/components/BeforeAfterGallery';
import ImageViewer from '@/components/ImageViewer';
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

const ManageIssues = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedIssue, setSelectedIssue] = useState<number | null>(null);
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 2000);
  }, []);

  const issues = [
    {
      id: 1,
      title: 'Large pothole on MG Road',
      description: 'Deep pothole causing traffic congestion near bus stop',
      location: 'MG Road, Koramangala',
      priority: 'high',
      category: 'Roads',
      reportedBy: 'Arjun Mehta',
      reportedDate: '2024-01-20',
      assignedTo: 'Road Maintenance Team',
      image: samplePothole,
      status: 'in-progress',
      upvotes: 15,
      estimatedTime: '2 days',
      aiScore: 92,
      riskFactors: ['Public Safety', 'High Traffic', 'Vehicle Damage']
    },
    {
      id: 2,
      title: 'Overflowing garbage bin',
      description: 'Garbage bin overflowing for 3 days, creating hygiene issues',
      location: 'Jayanagar 4th Block',
      priority: 'medium',
      category: 'Sanitation',
      reportedBy: 'Priya Sharma',
      reportedDate: '2024-01-19',
      assignedTo: 'Sanitation Department',
      image: sampleGarbage,
      status: 'assigned',
      upvotes: 8,
      estimatedTime: '1 day',
      aiScore: 75,
      riskFactors: ['Health Risk', 'Odor Issues']
    },
    {
      id: 3,
      title: 'Blocked drainage causing flooding',
      description: 'Drainage system completely blocked after recent rains',
      location: 'BTM Layout 2nd Stage',
      priority: 'high',
      category: 'Drainage',
      reportedBy: 'Rajeev Kumar',
      reportedDate: '2024-01-18',
      assignedTo: 'Water Works Department',
      image: sampleDrainage,
      status: 'in-progress',
      upvotes: 22,
      estimatedTime: '3 days',
      aiScore: 88,
      riskFactors: ['Flooding Risk', 'Property Damage', 'Traffic Disruption']
    },
    {
      id: 4,
      title: 'Street light not working',
      description: 'Multiple street lights not functioning, safety concern',
      location: 'Indiranagar 12th Main',
      priority: 'medium',
      category: 'Street Lighting',
      reportedBy: 'Meera Iyer',
      reportedDate: '2024-01-17',
      assignedTo: 'Electrical Department',
      image: sampleStreetlight,
      status: 'assigned',
      upvotes: 6,
      estimatedTime: '1 day',
      aiScore: 70,
      riskFactors: ['Safety Concern', 'Night Visibility']
    }
  ];

  const beforeAfterImages = [
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
      resolvedDate: '2024-01-10'
    },
    {
      before: beforeStreetlight,
      after: afterStreetlight,
      title: 'Street Light Installation',
      category: 'Lighting',
      location: 'Indiranagar 12th Main',
      resolvedDate: '2024-01-12'
    }
  ];

  const filteredIssues = issues.filter(issue => {
    const matchesSearch = issue.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         issue.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || issue.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || issue.priority === priorityFilter;
    
    return matchesSearch && matchesStatus && matchesPriority;
  });

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

  const openImageViewer = (index: number) => {
    setCurrentImageIndex(index);
    setShowImageViewer(true);
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Layout searchPlaceholder="Search issues, locations, or categories...">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col space-y-2">
          <div className="flex items-center space-x-2">
            <Settings className="w-6 h-6 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">
              Issue Management System
            </h1>
          </div>
          <p className="text-muted-foreground">
            AI-powered issue prioritization and comprehensive management dashboard
          </p>
        </div>

        {/* Filters and Search */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                  <Input
                    placeholder="Search issues, locations, or descriptions..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-40">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Status</SelectItem>
                    <SelectItem value="assigned">Assigned</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={priorityFilter} onValueChange={setPriorityFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Priority</SelectItem>
                    <SelectItem value="high">High Priority</SelectItem>
                    <SelectItem value="medium">Medium Priority</SelectItem>
                    <SelectItem value="low">Low Priority</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content Tabs */}
        <Tabs defaultValue="issues" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="issues">Issue Queue</TabsTrigger>
            <TabsTrigger value="map">Interactive Map</TabsTrigger>
            <TabsTrigger value="analytics">AI Analytics</TabsTrigger>
            <TabsTrigger value="gallery">Before/After</TabsTrigger>
          </TabsList>

          {/* Issue Queue Tab */}
          <TabsContent value="issues" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Issues List */}
              <div className="lg:col-span-2 space-y-4">
                {filteredIssues.map((issue) => (
                  <Card 
                    key={issue.id} 
                    className={`card-gradient cursor-pointer transition-all hover:shadow-lg ${
                      selectedIssue === issue.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setSelectedIssue(selectedIssue === issue.id ? null : issue.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="text-lg">{getCategoryIcon(issue.category)}</span>
                            <h3 className="font-semibold">{issue.title}</h3>
                            <Badge variant="outline" className={getPriorityColor(issue.priority)}>
                              {issue.priority}
                            </Badge>
                            <div className="flex items-center space-x-1">
                              <Bot className="w-4 h-4 text-primary" />
                              <span className="text-xs font-medium">{issue.aiScore}%</span>
                            </div>
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">{issue.description}</p>
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground mb-2">
                            <span>📍 {issue.location}</span>
                            <span>👤 {issue.reportedBy}</span>
                            <span>⏱️ Est. {issue.estimatedTime}</span>
                          </div>
                          
                          {/* AI Risk Factors */}
                          <div className="flex flex-wrap gap-1 mb-2">
                            {issue.riskFactors.map((factor, idx) => (
                              <Badge key={idx} variant="secondary" className="text-xs">
                                {factor}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        
                        <div className="flex flex-col items-end space-y-2">
                          <Badge variant="outline" className={getStatusColor(issue.status)}>
                            {issue.status.replace('-', ' ')}
                          </Badge>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={(e) => {
                              e.stopPropagation();
                              openImageViewer(0);
                            }}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                      
                      <div className="mb-3">
                        <img 
                          src={issue.image} 
                          alt="Issue location"
                          className="w-full h-32 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation();
                            openImageViewer(0);
                          }}
                        />
                      </div>
                      
                      <div className="flex items-center justify-between text-xs mb-3">
                        <span className="text-muted-foreground">
                          Reported on {new Date(issue.reportedDate).toLocaleDateString()}
                        </span>
                        <div className="flex items-center space-x-1">
                          <span>👍 {issue.upvotes}</span>
                          <span className="text-muted-foreground">confirmations</span>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button size="sm" className="flex-1">
                          <Navigation className="w-3 h-3 mr-1" />
                          Navigate
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Camera className="w-3 h-3 mr-1" />
                          Upload Photo
                        </Button>
                        <Button variant="outline" size="sm">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Resolve
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* AI Analysis Sidebar */}
              <div>
                {selectedIssue ? (
                  <AIIssueAnalyzer />
                ) : (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <Bot className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                      <h3 className="font-semibold mb-2">AI Analysis Ready</h3>
                      <p className="text-sm text-muted-foreground">
                        Select an issue to see detailed AI-powered priority analysis and recommendations.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </TabsContent>

          {/* Interactive Map Tab */}
          <TabsContent value="map">
            <Card className="card-gradient">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5" />
                  <span>India Issue Map</span>
                </CardTitle>
                <CardDescription>
                  Real-time visualization of reported issues across India
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative mb-6">
                  <img 
                    src={indiaIssueMapImage}
                    alt="Live India Issue Map"
                    className="w-full h-96 object-cover rounded-lg"
                  />
                  
                  {/* Live Updates Overlay */}
                  <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm rounded-lg px-3 py-2 border">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs font-medium">Live Updates</span>
                    </div>
                  </div>
                  
                  {/* Interactive Controls */}
                  <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-sm rounded-lg p-3 border">
                    <div className="flex items-center space-x-2 mb-2">
                      <Button size="sm" variant="outline">
                        <Eye className="w-3 h-3 mr-1" />
                        Markers
                      </Button>
                      <Button size="sm" variant="outline">
                        <MapPin className="w-3 h-3 mr-1" />
                        Heatmap
                      </Button>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      🔴 High Priority • 🟡 Medium • 🟢 Low
                    </div>
                  </div>

                  {/* Issue Statistics Overlay */}
                  <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm rounded-lg p-3 border">
                    <div className="text-xs space-y-1">
                      <div className="font-medium">India Issue Statistics</div>
                      <div>Total Reports: 3,847</div>
                      <div>High Priority: 542</div>
                      <div>States Covered: 28</div>
                    </div>
                  </div>
                </div>
                
                {/* Interactive component for additional functionality */}
                <IndiaMap />
              </CardContent>
            </Card>
          </TabsContent>

          {/* AI Analytics Tab */}
          <TabsContent value="analytics">
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Bot className="w-5 h-5 text-primary" />
                    <span>AI-Powered Analytics Dashboard</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">
                    Advanced analytics and insights powered by machine learning algorithms
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
                      <CardContent className="p-4">
                        <h4 className="font-semibold text-blue-900 mb-2">Predictive Analysis</h4>
                        <p className="text-sm text-blue-700 mb-3">
                          AI predicts 73% chance of increased pothole reports in MG Road area due to upcoming monsoon season.
                        </p>
                        <Badge className="bg-blue-100 text-blue-800">High Confidence</Badge>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                      <CardContent className="p-4">
                        <h4 className="font-semibold text-green-900 mb-2">Resource Optimization</h4>
                        <p className="text-sm text-green-700 mb-3">
                          Optimal team allocation suggests deploying 2 additional units to Koramangala district this week.
                        </p>
                        <Badge className="bg-green-100 text-green-800">Actionable</Badge>
                      </CardContent>
                    </Card>

                    <Card className="bg-gradient-to-br from-orange-50 to-red-50 border-orange-200">
                      <CardContent className="p-4">
                        <h4 className="font-semibold text-orange-900 mb-2">Risk Assessment</h4>
                        <p className="text-sm text-orange-700 mb-3">
                          High-risk areas identified: 3 locations with safety score below 40% requiring immediate attention.
                        </p>
                        <Badge className="bg-orange-100 text-orange-800">Critical</Badge>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>

              <AIIssueAnalyzer />
            </div>
          </TabsContent>

          {/* Before/After Gallery Tab */}
          <TabsContent value="gallery">
            <Card>
              <CardHeader>
                <CardTitle>Before & After Gallery</CardTitle>
                <p className="text-muted-foreground">
                  Visual evidence of completed work and issue resolutions
                </p>
              </CardHeader>
              <CardContent>
                <BeforeAfterGallery images={beforeAfterImages} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Image Viewer */}
        <ImageViewer
          isOpen={showImageViewer}
          onClose={() => setShowImageViewer(false)}
          images={[
            { src: samplePothole, alt: "Pothole on MG Road", title: "Issue Photo" }
          ]}
          currentIndex={currentImageIndex}
        />
      </div>
    </Layout>
  );
};

export default ManageIssues;
