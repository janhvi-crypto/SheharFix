import React from 'react';
import { AlertTriangle, CheckCircle, Clock, Users, MapPin, Navigation, Camera, Settings } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';
import { useApp } from '@/contexts/AppContext';
import samplePothole from '@/assets/sample-pothole.jpg';
import sampleGarbage from '@/assets/sample-garbage.jpg';
import sampleDrainage from '@/assets/sample-drainage.jpg';
import sampleStreetlight from '@/assets/sample-streetlight.jpg';

const AdminDashboard = () => {
  const { user } = useApp();

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

  const assignedIssues = [
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
      estimatedTime: '2 days'
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
      estimatedTime: '1 day'
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
      estimatedTime: '3 days'
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
      estimatedTime: '1 day'
    }
  ];

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

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card key={index} className="card-gradient">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <IconComponent className={`w-5 h-5 ${stat.color}`} />
                      <p className="text-sm font-medium text-muted-foreground">
                        {stat.title}
                      </p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-baseline space-x-2">
                      <p className="text-3xl font-bold">
                        {stat.value}
                      </p>
                      {stat.suffix && (
                        <span className="text-lg text-muted-foreground">
                          {stat.suffix}
                        </span>
                      )}
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${stat.color} bg-transparent`}
                      >
                        {stat.change}
                      </Badge>
                      <span className="text-xs text-muted-foreground">
                        {stat.period}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Assigned Issues */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Issues Assigned to You</h2>
            <Button variant="outline" size="sm">
              <MapPin className="w-4 h-4 mr-2" />
              View on Map
            </Button>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {assignedIssues.map((issue) => (
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
                    <img 
                      src={issue.image} 
                      alt="Issue location"
                      className="w-full h-32 object-cover rounded-lg"
                    />
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
                    <Button variant="outline" size="sm" className="flex-1">
                      <Camera className="w-3 h-3 mr-1" />
                      Upload Photo
                    </Button>
                    <Button variant="outline" size="sm">
                      Mark Resolved
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