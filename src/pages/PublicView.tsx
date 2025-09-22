import React, { useState, useEffect } from 'react';
import { MapPin, Clock, CheckCircle, AlertTriangle, Users, Eye } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';
import LoadingScreen from '@/components/LoadingScreen';
import toast from 'react-hot-toast';

type Issue = {
  _id: string;
  title: string;
  description?: string;
  category?: string;
  priority?: string;
  status: 'submitted' | 'acknowledged' | 'in_progress' | 'resolved';
  location?: { lat?: number; lng?: number; address?: string };
  mediaUrl?: string; // before image
  resolutionPhotoUrl?: string; // after image
  createdAt: string;
  resolvedAt?: string;
  createdBy?: { username?: string } | null;
};

const PublicView = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [issues, setIssues] = useState<Issue[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        const resp = await fetch('/api/issues');
        if (!resp.ok) throw new Error('Failed to load issues');
        const data: Issue[] = await resp.json();
        const resolved = data.filter(i => i.status === 'resolved');
        resolved.sort((a, b) => {
          const ad = new Date(a.resolvedAt || a.createdAt).getTime();
          const bd = new Date(b.resolvedAt || b.createdAt).getTime();
          return bd - ad;
        });
        setIssues(resolved);
      } catch (e: any) {
        console.error(e);
        setError(e.message || 'Failed to load');
        toast.error('Failed to load resolved issues');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, []);

  const resolvedIssues = issues;

  const wardLeaderboard = [
    { ward: 'Ward 185 - Koramangala', issues: 47, resolved: 42, activeRate: 89.4 },
    { ward: 'Ward 167 - Jayanagar', issues: 39, resolved: 35, activeRate: 89.7 },
    { ward: 'Ward 152 - Indiranagar', issues: 34, resolved: 31, activeRate: 91.2 },
    { ward: 'Ward 198 - BTM Layout', issues: 28, resolved: 24, activeRate: 85.7 },
    { ward: 'Ward 174 - HSR Layout', issues: 25, resolved: 22, activeRate: 88.0 }
  ];

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'roads':
      case 'road':
      case 'pothole': return '🛣️';
      case 'sanitation':
      case 'garbage': return '🗑️';
      case 'drainage': return '🌊';
      case 'streetlight':
      case 'street lighting': return '💡';
      default: return '⚠️';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'roads':
      case 'road':
      case 'pothole': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'sanitation':
      case 'garbage': return 'bg-green-100 text-green-800 border-green-200';
      case 'drainage': return 'bg-cyan-100 text-cyan-800 border-cyan-200';
      case 'streetlight':
      case 'street lighting': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const formatResponseTime = (createdAt: string, resolvedAt?: string) => {
    if (!resolvedAt) return '';
    const start = new Date(createdAt).getTime();
    const end = new Date(resolvedAt).getTime();
    const diffMs = Math.max(end - start, 0);
    const days = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    return `${days} day${days === 1 ? '' : 's'}`;
  };

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
                  <p className="text-2xl font-bold">{resolvedIssues.length}</p>
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
                  <p className="text-2xl font-bold">
                    {resolvedIssues.length > 0
                      ? Math.round(
                          resolvedIssues.reduce((acc, i) => {
                            const s = new Date(i.createdAt).getTime();
                            const e = new Date(i.resolvedAt || i.createdAt).getTime();
                            return acc + Math.max(e - s, 0);
                          }, 0) /
                            resolvedIssues.length /
                            (1000 * 60 * 60 * 24)
                        )
                      : 0}
                  </p>
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
            {error && (
              <div className="p-3 rounded-md bg-red-100 text-red-700 border border-red-300">{error}</div>
            )}
            {resolvedIssues.length === 0 && !error && (
              <Card className="card-gradient">
                <CardContent className="p-6 text-center text-muted-foreground">
                  No resolved issues yet. Check back soon.
                </CardContent>
              </Card>
            )}
            {resolvedIssues.map((issue) => (
              <Card key={issue._id} className="card-gradient">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-lg">{getCategoryIcon((issue.category || '').toLowerCase())}</span>
                        <h3 className="font-semibold">{issue.title}</h3>
                        <Badge variant="outline" className={getCategoryColor((issue.category || '').toLowerCase())}>
                          {issue.category || 'General'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{issue.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <span>📍 {issue.location?.address || '—'}</span>
                        <span>👤 {issue.createdBy?.username || 'Anonymous'}</span>
                        <span>⏱️ {formatResponseTime(issue.createdAt, issue.resolvedAt)}</span>
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
                      {issue.mediaUrl ? (
                        <img 
                          src={issue.mediaUrl}
                          alt="Before resolution"
                          className="w-full h-24 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="w-full h-24 rounded-lg bg-muted flex items-center justify-center text-xs text-muted-foreground">No image</div>
                      )}
                    </div>
                    <div className="space-y-1">
                      <p className="text-xs font-medium text-muted-foreground">After</p>
                      {issue.resolutionPhotoUrl ? (
                        <img 
                          src={issue.resolutionPhotoUrl}
                          alt="After resolution"
                          className="w-full h-24 object-cover rounded-lg opacity-90"
                        />
                      ) : (
                        <div className="w-full h-24 rounded-lg bg-muted flex items-center justify-center text-xs text-muted-foreground">Pending</div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground">
                      {issue.resolvedAt ? (
                        <>Resolved on {new Date(issue.resolvedAt).toLocaleDateString()}</>
                      ) : (
                        <>Resolution in progress</>
                      )}
                    </span>
                    <div />
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
