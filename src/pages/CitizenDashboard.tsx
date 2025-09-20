import React from 'react';
import { Plus, TrendingUp, AlertCircle, CheckCircle, Clock, Users, BarChart3, Trophy } from 'lucide-react';
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

const CitizenDashboard = () => {
  const navigate = useNavigate();
  const { user } = useApp();

  const stats = [
    { title: 'Issues Reported', value: '12', change: '+2', icon: AlertCircle, color: 'text-blue-600' },
    { title: 'Issues Resolved', value: '8', change: '+3', icon: CheckCircle, color: 'text-green-600' },
    { title: 'In Progress', value: '2', change: '0', icon: Clock, color: 'text-orange-600' },
    { title: 'Community Impact', value: '1,247', change: '+89', icon: Users, color: 'text-purple-600' },
  ];

  const recentIssues = [
    {
      id: 1,
      title: 'Pothole on MG Road',
      description: 'Large pothole causing traffic issues near the intersection with Church Street.',
      category: 'Roads',
      status: 'resolved',
      reportedBy: 'Rajesh Kumar',
      date: '2024-01-15',
      image: potholeImg,
      location: 'MG Road, Bangalore'
    },
    {
      id: 2,
      title: 'Garbage accumulation near Park',
      description: 'Overflowing garbage bins and scattered waste near Cubbon Park entrance.',
      category: 'Sanitation',
      status: 'progress',
      reportedBy: 'Priya Sharma',
      date: '2024-01-14',
      image: garbageImg,
      location: 'Cubbon Park, Bangalore'
    },
    {
      id: 3,
      title: 'Blocked drainage system',
      description: 'Water logging during rains due to blocked drainage on residential street.',
      category: 'Drainage',
      status: 'acknowledged',
      reportedBy: 'Amit Patel',
      date: '2024-01-13',
      image: drainageImg,
      location: 'Koramangala, Bangalore'
    },
    {
      id: 4,
      title: 'Street light not working',
      description: 'Multiple street lights are not functioning, making the area unsafe during nighttime.',
      category: 'Lighting',
      status: 'reported',
      reportedBy: 'Sunita Devi',
      date: '2024-01-12',
      image: streetlightImg,
      location: 'Jayanagar, Bangalore'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'resolved': return 'status-resolved';
      case 'progress': return 'status-progress';
      case 'acknowledged': return 'status-acknowledged';
      default: return 'status-reported';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'resolved': return 'Resolved';
      case 'progress': return 'In Progress';
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
                <span className="text-sm">Community Rank</span>
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
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs text-muted-foreground">
                        By {issue.reportedBy} • {issue.location}
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