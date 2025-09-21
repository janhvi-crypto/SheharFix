import React, { useState, useEffect } from 'react';
import { TrendingUp, AlertTriangle, CheckCircle, Clock, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import Layout from '@/components/Layout';
import LoadingScreen from '@/components/LoadingScreen';

const Analytics = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 2000);
  }, []);

  const issuesByCategory = [
    { category: 'Potholes', count: 14, percentage: 14.3, color: 'bg-purple-500' },
    { category: 'Garbage', count: 10, percentage: 9.5, color: 'bg-red-500' },
    { category: 'Street Lights', count: 9, percentage: 9.5, color: 'bg-orange-500' },
    { category: 'Park Maintenance', count: 19, percentage: 19, color: 'bg-green-500' },
    { category: 'Open Drain', count: 5, percentage: 4.8, color: 'bg-blue-500' },
    { category: 'Noise Pollution', count: 10, percentage: 9.5, color: 'bg-orange-600' },
    { category: 'Water Leak', count: 10, percentage: 9.5, color: 'bg-cyan-500' },
    { category: 'Traffic Signal', count: 10, percentage: 9.5, color: 'bg-green-600' },
  ];

  const issuesByStatus = [
    { status: 'Reported', count: 4, color: 'bg-blue-500' },
    { status: 'Acknowledged', count: 3, color: 'bg-blue-400' },
    { status: 'In Progress', count: 2, color: 'bg-orange-500' },
    { status: 'Resolved', count: 6, color: 'bg-green-500' },
    { status: 'Closed', count: 3, color: 'bg-gray-500' },
  ];

  const monthlyTrends = [
    { month: 'Jan', reported: 15, resolved: 12 },
    { month: 'Feb', reported: 18, resolved: 16 },
    { month: 'Mar', reported: 22, resolved: 19 },
    { month: 'Apr', reported: 25, resolved: 23 },
    { month: 'May', reported: 20, resolved: 22 },
    { month: 'Jun', reported: 28, resolved: 25 },
  ];

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Layout searchPlaceholder="Search analytics data...">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground flex items-center space-x-2">
            <BarChart3 className="w-8 h-8 text-primary" />
            <span>Analytics Dashboard</span>
          </h1>
          <p className="text-muted-foreground mt-1">
            Track and analyze civic issue reporting patterns and resolution rates
          </p>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="card-gradient">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Issues</p>
                  <p className="text-2xl font-bold">98</p>
                  <p className="text-xs text-green-600">+12% this month</p>
                </div>
                <AlertTriangle className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-gradient">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Resolved</p>
                  <p className="text-2xl font-bold">76</p>
                  <p className="text-xs text-green-600">+8% this month</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-gradient">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">In Progress</p>
                  <p className="text-2xl font-bold">15</p>
                  <p className="text-xs text-orange-600">+2 from last week</p>
                </div>
                <Clock className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="card-gradient">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Success Rate</p>
                  <p className="text-2xl font-bold">77%</p>
                  <p className="text-xs text-green-600">+5% improvement</p>
                </div>
                <TrendingUp className="w-8 h-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Issues by Category */}
          <Card className="card-gradient">
            <CardHeader>
              <CardTitle>Issues by Category</CardTitle>
              <CardDescription>Distribution of reported issues by type</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {issuesByCategory.map((item, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{item.category}</span>
                    <span className="text-muted-foreground">
                      {item.percentage}% ({item.count})
                    </span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${item.color}`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Issues by Status */}
          <Card className="card-gradient">
            <CardHeader>
              <CardTitle>Issues by Status</CardTitle>
              <CardDescription>Current status distribution of all issues</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 gap-4">
                {issuesByStatus.map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-3 rounded-lg border bg-card">
                    <div className="flex items-center space-x-3">
                      <div className={`w-3 h-3 rounded-full ${item.color}`} />
                      <span className="font-medium">{item.status}</span>
                    </div>
                    <span className="text-2xl font-bold">{item.count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Monthly Trends */}
        <Card className="card-gradient">
          <CardHeader>
            <CardTitle>Monthly Trends</CardTitle>
            <CardDescription>Issues reported vs resolved over the past 6 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {monthlyTrends.map((month, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between text-sm font-medium">
                    <span>{month.month}</span>
                    <div className="flex space-x-4">
                      <span className="text-blue-600">Reported: {month.reported}</span>
                      <span className="text-green-600">Resolved: {month.resolved}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      <div className="flex-1 bg-muted rounded-full h-2">
                        <div
                          className="h-2 bg-blue-500 rounded-full"
                          style={{ width: `${(month.reported / 30) * 100}%` }}
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <div className="flex-1 bg-muted rounded-full h-2">
                        <div
                          className="h-2 bg-green-500 rounded-full"
                          style={{ width: `${(month.resolved / 30) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance Insights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="card-gradient">
            <CardHeader>
              <CardTitle className="text-lg">Response Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Average</span>
                  <span className="font-medium">2.3 days</span>
                </div>
                <Progress value={77} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  23% faster than last month
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="card-gradient">
            <CardHeader>
              <CardTitle className="text-lg">Resolution Rate</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Current</span>
                  <span className="font-medium">77.5%</span>
                </div>
                <Progress value={77.5} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  Target: 80% by next quarter
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="card-gradient">
            <CardHeader>
              <CardTitle className="text-lg">Community Engagement</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Active Users</span>
                  <span className="font-medium">1,247</span>
                </div>
                <Progress value={85} className="h-2" />
                <p className="text-xs text-muted-foreground">
                  +12% increase this month
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default Analytics;
