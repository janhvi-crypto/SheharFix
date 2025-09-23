import React, { useEffect, useState } from 'react';
import { Plus, TrendingUp, AlertCircle, CheckCircle, Clock, Users, BarChart3, Trophy, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Layout from '@/components/Layout';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/contexts/AppContext';
import potholeImg from '@/assets/sample-pothole.jpg';
import garbageImg from '@/assets/sample-garbage.jpg';
import drainageImg from '@/assets/sample-drainage.jpg';
import streetlightImg from '@/assets/sample-streetlight.jpg';
import { format } from 'date-fns';

const CitizenDashboard = () => {
  const navigate = useNavigate();
  const { user } = useApp();

  const stats = [
    { title: 'Issues Reported', value: '12', change: '+2', icon: AlertCircle, color: 'text-blue-600' },
    { title: 'Issues Resolved', value: '8', change: '+3', icon: CheckCircle, color: 'text-green-600' },
    { title: 'In Progress', value: '2', change: '0', icon: Clock, color: 'text-orange-600' },
    { title: 'Community Impact', value: '1,247', change: '+89', icon: Users, color: 'text-purple-600' },
  ];

  type UiIssue = {
    id: string; // Mongo _id
    title: string;
    description?: string;
    category?: string;
    status: string;
    reportedBy: string;
    date: string;
    image: string;
    location?: string;
    createdById?: string;
  };

  const [recentIssues, setRecentIssues] = useState<UiIssue[]>([]);
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
          location: row.location?.address,
          createdById: row.createdBy?._id || row.createdBy?.id,
        }))
        .sort((a, b) => {
          const aResolved = a.status === 'resolved' ? 1 : 0;
          const bResolved = b.status === 'resolved' ? 1 : 0;
          if (aResolved !== bResolved) return aResolved - bResolved; // unresolved first
          return new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime();
        });
        setRecentIssues(mapped);
      } catch (e) {
        // On error, keep empty list silently for now
        setRecentIssues([]);
      } finally {
        if (!cancelled) setLoadingIssues(false);
      }
    }
    fetchIssues();
    return () => { cancelled = true; };
  }, []);

  async function handleDeleteIssue(id: string) {
    try {
      const proceed = window.confirm('Delete this issue permanently?');
      if (!proceed) return;
      const lsToken = localStorage.getItem('token');
      const resp = await fetch(`/api/issues/${id}`, {
        method: 'DELETE',
        headers: lsToken ? { Authorization: `Bearer ${lsToken}` } : undefined,
      });
      if (!resp.ok && resp.status !== 204) {
        if (resp.status === 401 || resp.status === 403) {
          throw new Error('Only the original reporter can delete this issue.');
        }
        throw new Error('Failed to delete issue');
      }
      // Optimistically update UI
      setRecentIssues(prev => prev.filter(i => i.id !== id));
    } catch (e: any) {
      window.alert(e.message || 'Failed to delete issue');
    }
  }

  function resolveImage(row: any): string {
    // First check for resolution photo
    if (row.resolutionPhotoUrl) {
      // If it's a relative path, prefix with API base URL
      if (row.resolutionPhotoUrl.startsWith('/')) {
        return `${window.location.origin}${row.resolutionPhotoUrl}`;
      }
      return row.resolutionPhotoUrl;
    }
    
    // Check for media URL
    if (row.mediaUrl) {
      // If it's a relative path, prefix with API base URL  
      if (row.mediaUrl.startsWith('/')) {
        return `${window.location.origin}${row.mediaUrl}`;
      }
      return row.mediaUrl;
    }
    
    // Check for media path (SQLite compatibility)
    if (row.media_path) {
      if (row.media_path.startsWith('/')) {
        return `${window.location.origin}${row.media_path}`;
      }
      return row.media_path;
    }
    
    // Fallback to category-based images
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
      case 'in_progress': return 'in_progress';
      case 'acknowledged': return 'acknowledged';
      default: return 'reported';
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'status-resolved';
      case 'in_progress': return 'status-progress';
      case 'acknowledged': return 'status-acknowledged';
      default: return 'status-reported';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'resolved': return 'Resolved';
      case 'in_progress': return 'In Progress';
      case 'acknowledged': return 'Acknowledged';
      default: return 'Reported';
    }
  };

  return (
    <Layout>
      <div className="p-6 space-y-6">
        {/* Welcome Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Welcome back, {user?.name?.split(' ')[0]}!
            </h1>
            <p className="text-muted-foreground mt-1">
              Track your community impact and report new issues
            </p>
          </div>
          <Button
            onClick={() => navigate('/report-issue')}
            className="mt-4 sm:mt-0 btn-citizen"
          >
            <Plus className="w-4 h-4 mr-2" />
            Report New Issue
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const IconComponent = stat.icon;
            return (
              <Card key={index} className="card-gradient">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">
                        {stat.title}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <p className="text-2xl font-bold">{stat.value}</p>
                        <Badge variant="secondary" className="text-xs">
                          {stat.change}
                        </Badge>
                      </div>
                    </div>
                    <IconComponent className={`w-8 h-8 ${stat.color}`} />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Progress Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Community Impact */}
          <Card className="card-gradient">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                <span>Your Progress</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span>Community Points</span>
                  <span>{user?.points || 0}/2000</span>
                </div>
                <Progress value={((user?.points || 0) / 2000) * 100} className="h-2" />
                <p className="text-xs text-muted-foreground mt-1">
                  753 points to next level
                </p>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium text-sm">Recent Achievements</h4>
                <div className="flex flex-wrap gap-1">
                  {user?.badges?.map((badge, index) => (
                    <Badge key={index} variant="outline" className="text-xs badge-glow">
                      {badge}
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="card-gradient">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => navigate('/report-issue')}
              >
                <Plus className="w-4 h-4 mr-2" />
                Report New Issue
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => navigate('/analytics')}
              >
                <BarChart3 className="w-4 h-4 mr-2" />
                View Analytics
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => navigate('/leaderboard')}
              >
                <Trophy className="w-4 h-4 mr-2" />
                Leaderboard
              </Button>
            </CardContent>
          </Card>

          {/* This Month Stats */}
          <Card className="card-gradient">
            <CardHeader>
              <CardTitle>This Month</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Issues Reported</span>
                <span className="font-bold">5</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Issues Resolved</span>
                <span className="font-bold">3</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Points Earned</span>
                <span className="font-bold">180</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-span">Community Rank</span>
                <span className="font-bold">#3</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Community Issues */}
        <Card className="card-gradient">
          <CardHeader>
            <CardTitle>Recent Community Issues</CardTitle>
            <CardDescription>
              Latest issues reported by fellow citizens in your area
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {loadingIssues && (
                <div className="text-sm text-muted-foreground">Loading latest issues…</div>
              )}
              {!loadingIssues && recentIssues.length === 0 && (
                <div className="text-sm text-muted-foreground">No issues reported yet. Be the first to report!</div>
              )}
              {recentIssues.map((issue) => (
                <div
                  key={issue.id}
                  className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 p-4 rounded-lg border bg-card hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => navigate(`/issue/${issue.id}`)}
                >
                  <img
                    src={issue.image}
                    alt={issue.title}
                    className="w-full sm:w-24 h-24 object-cover rounded-lg"
                    onError={(e) => {
                      // If image fails to load, use fallback based on category
                      const target = e.target as HTMLImageElement;
                      const cat = issue.category?.toLowerCase() || '';
                      if (cat.includes('pothole') || cat.includes('road')) {
                        target.src = potholeImg;
                      } else if (cat.includes('garbage') || cat.includes('sanitation')) {
                        target.src = garbageImg;
                      } else if (cat.includes('drain')) {
                        target.src = drainageImg;
                      } else if (cat.includes('light')) {
                        target.src = streetlightImg;
                      } else {
                        target.src = potholeImg;
                      }
                    }}
                  />
                  <div className="flex-1">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-sm">{issue.title}</h3>
                        <p className="text-xs text-muted-foreground mt-1">
                          {issue.description}
                        </p>
                        <div className="flex items-center space-x-2 mt-2">
                          <Badge variant="outline" className="text-xs">
                            {issue.category}
                          </Badge>
                          <span className={`status-badge ${getStatusColor(issue.status)}`}>
                            {getStatusLabel(issue.status)}
                          </span>
                        </div>
                      </div>
                      {(user && issue.createdById && user.id === issue.createdById && user.role !== 'admin') && (
                        <div className="ml-4">
                          <Button
                            variant="destructive"
                            size="sm"
                            className="h-7 px-2"
                            title="Delete issue"
                            onClick={(e) => { e.stopPropagation(); handleDeleteIssue(issue.id); }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs text-muted-foreground">
                        By {issue.reportedBy}{issue.location ? ` • ${issue.location}` : ''}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {issue.date}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default CitizenDashboard;
