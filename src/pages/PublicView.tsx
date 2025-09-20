import React from 'react';
import { MapPin, Clock, CheckCircle, AlertTriangle, Users, Eye } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';
import samplePothole from '@/assets/sample-pothole.jpg';
import sampleGarbage from '@/assets/sample-garbage.jpg';
import sampleDrainage from '@/assets/sample-drainage.jpg';
import sampleStreetlight from '@/assets/sample-streetlight.jpg';

const PublicView = () => {
  const resolvedIssues = [
    {
      id: 1,
      title: 'Pothole Repair on MG Road',
      description: 'Large pothole causing traffic issues near bus stop',
      location: 'MG Road, Koramangala',
      ward: 'Ward 185',
      category: 'Roads',
      reportedBy: 'Arjun Mehta',
      resolvedDate: '2024-01-15',
      beforeImage: samplePothole,
      afterImage: samplePothole,
      status: 'resolved',
      upvotes: 23,
      responseTime: '3 days'
    },
    {
      id: 2,
      title: 'Garbage Collection Improved',
      description: 'Irregular garbage collection in residential area',
      location: 'Jayanagar 4th Block',
      ward: 'Ward 167',
      category: 'Sanitation',
      reportedBy: 'Priya Sharma',
      resolvedDate: '2024-01-12',
      beforeImage: sampleGarbage,
      afterImage: sampleGarbage,
      status: 'resolved',
      upvotes: 18,
      responseTime: '2 days'
    },
    {
      id: 3,
      title: 'Drainage System Cleared',
      description: 'Blocked drainage causing waterlogging during rains',
      location: 'BTM Layout 2nd Stage',
      ward: 'Ward 198',
      category: 'Drainage',
      reportedBy: 'Rajeev Kumar',
      resolvedDate: '2024-01-10',
      beforeImage: sampleDrainage,
      afterImage: sampleDrainage,
      status: 'resolved',
      upvotes: 31,
      responseTime: '5 days'
    },
    {
      id: 4,
      title: 'Street Light Installation',
      description: 'Dark street with no lighting causing safety concerns',
      location: 'Indiranagar 12th Main',
      ward: 'Ward 152',
      category: 'Street Lighting',
      reportedBy: 'Meera Iyer',
      resolvedDate: '2024-01-08',
      beforeImage: sampleStreetlight,
      afterImage: sampleStreetlight,
      status: 'resolved',
      upvotes: 27,
      responseTime: '4 days'
    }
  ];

  const wardLeaderboard = [
    { ward: 'Ward 185 - Koramangala', issues: 47, resolved: 42, activeRate: 89.4 },
    { ward: 'Ward 167 - Jayanagar', issues: 39, resolved: 35, activeRate: 89.7 },
    { ward: 'Ward 152 - Indiranagar', issues: 34, resolved: 31, activeRate: 91.2 },
    { ward: 'Ward 198 - BTM Layout', issues: 28, resolved: 24, activeRate: 85.7 },
    { ward: 'Ward 174 - HSR Layout', issues: 25, resolved: 22, activeRate: 88.0 }
  ];

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

  return (
    <Layout searchPlaceholder="Search resolved issues, wards, or categories...">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col space-y-2">
          <div className="flex items-center space-x-2">
            <Eye className="w-6 h-6 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Public View</h1>
          </div>
          <p className="text-muted-foreground">
            Transparent view of civic issues and their resolution across all wards
          </p>
        </div>

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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Resolved Issues */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-semibold">Recently Resolved Issues</h2>
            {resolvedIssues.map((issue) => (
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
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <span>📍 {issue.location}</span>
                        <span>👤 {issue.reportedBy}</span>
                        <span>⏱️ {issue.responseTime}</span>
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
                        className="w-full h-24 object-cover rounded-lg"
                      />
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground">After</p>
                      <img 
                        src={issue.afterImage} 
                        alt="After resolution"
                        className="w-full h-24 object-cover rounded-lg opacity-90"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                      Resolved on {new Date(issue.resolvedDate).toLocaleDateString()}
                    </span>
                    <div className="flex items-center space-x-1">
                      <span>👍 {issue.upvotes}</span>
                      <span className="text-muted-foreground">community confirmations</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Ward Leaderboard */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Ward Activity Leaderboard</h2>
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
      </div>
    </Layout>
  );
};

export default PublicView;