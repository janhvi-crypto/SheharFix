import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, TrendingUp, TrendingDown, Activity, AlertTriangle, Eye, Filter, Calendar } from 'lucide-react';
import Layout from '@/components/Layout';
import indiaHeatmapImage from '@/assets/india-heatmap.jpg';

const Heatmap = () => {
  const [selectedState, setSelectedState] = useState('all');
  const [selectedTimeframe, setSelectedTimeframe] = useState('7d');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock heatmap data
  const heatmapStats = {
    totalIssues: 3847,
    resolvedIssues: 2945,
    pendingIssues: 902,
    averageResolutionTime: 4.2,
    highPriorityAreas: 23,
    improvementRate: 18.5
  };

  const stateData = [
    { name: 'Maharashtra', issues: 1245, density: 'high', trend: 'up', improvement: 15 },
    { name: 'Karnataka', issues: 892, density: 'high', trend: 'down', improvement: -8 },
    { name: 'Delhi', issues: 756, density: 'very-high', trend: 'up', improvement: 22 },
    { name: 'Tamil Nadu', issues: 634, density: 'medium', trend: 'stable', improvement: 5 },
    { name: 'Gujarat', issues: 523, density: 'medium', trend: 'up', improvement: 12 },
    { name: 'West Bengal', issues: 445, density: 'medium', trend: 'down', improvement: -3 },
    { name: 'Rajasthan', issues: 387, density: 'low', trend: 'up', improvement: 8 },
    { name: 'Uttar Pradesh', issues: 334, density: 'low', trend: 'stable', improvement: 2 }
  ];

  const categoryHeatmap = [
    { category: 'Roads & Infrastructure', percentage: 35, color: 'bg-red-500', issues: 1347 },
    { category: 'Waste Management', percentage: 28, color: 'bg-orange-500', issues: 1077 },
    { category: 'Water & Drainage', percentage: 18, color: 'bg-yellow-500', issues: 692 },
    { category: 'Street Lighting', percentage: 12, color: 'bg-blue-500', issues: 462 },
    { category: 'Parks & Recreation', percentage: 7, color: 'bg-green-500', issues: 269 }
  ];

  const getDensityColor = (density: string) => {
    switch (density) {
      case 'very-high': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="w-4 h-4 text-green-600" />;
      case 'down': return <TrendingDown className="w-4 h-4 text-red-600" />;
      default: return <Activity className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <Layout searchPlaceholder="Search states, categories, or issue types...">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col space-y-2">
          <div className="flex items-center space-x-2">
            <MapPin className="w-6 h-6 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Issue Heatmap</h1>
          </div>
          <p className="text-muted-foreground">
            Visualize issue density and trends across India
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4">
          <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
            <SelectTrigger className="w-48">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Select timeframe" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24 Hours</SelectItem>
              <SelectItem value="7d">Last 7 Days</SelectItem>
              <SelectItem value="30d">Last 30 Days</SelectItem>
              <SelectItem value="3m">Last 3 Months</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedState} onValueChange={setSelectedState}>
            <SelectTrigger className="w-48">
              <MapPin className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Select state" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All States</SelectItem>
              <SelectItem value="maharashtra">Maharashtra</SelectItem>
              <SelectItem value="karnataka">Karnataka</SelectItem>
              <SelectItem value="delhi">Delhi</SelectItem>
              <SelectItem value="tamil-nadu">Tamil Nadu</SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-48">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              <SelectItem value="roads">Roads & Infrastructure</SelectItem>
              <SelectItem value="waste">Waste Management</SelectItem>
              <SelectItem value="water">Water & Drainage</SelectItem>
              <SelectItem value="lighting">Street Lighting</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="card-gradient">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Eye className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{heatmapStats.totalIssues.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Total Issues</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-gradient">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{heatmapStats.resolvedIssues.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Resolved</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-gradient">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <AlertTriangle className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{heatmapStats.highPriorityAreas}</p>
                  <p className="text-sm text-muted-foreground">High Priority Areas</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-gradient">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Activity className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{heatmapStats.averageResolutionTime} days</p>
                  <p className="text-sm text-muted-foreground">Avg Resolution</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Heatmap */}
        <Card className="card-gradient">
          <CardHeader>
            <CardTitle>India Issue Density Heatmap</CardTitle>
            <CardDescription>
              Color-coded visualization of issue density across different states
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <img 
                src={indiaHeatmapImage}
                alt="India Issue Density Heatmap"
                className="w-full h-96 object-cover rounded-lg"
              />
              
              {/* Heatmap Legend */}
              <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-sm rounded-lg p-3 border">
                <h4 className="text-sm font-medium mb-2">Issue Density</h4>
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded"></div>
                    <span className="text-xs">Very High (500+ issues)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-orange-500 rounded"></div>
                    <span className="text-xs">High (200-499 issues)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-yellow-500 rounded"></div>
                    <span className="text-xs">Medium (50-199 issues)</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                    <span className="text-xs">Low (0-49 issues)</span>
                  </div>
                </div>
              </div>

              {/* Live Updates Indicator */}
              <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm rounded-lg px-3 py-2 border">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-medium">Live Updates</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* State-wise Data */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* State Rankings */}
          <Card className="card-gradient">
            <CardHeader>
              <CardTitle>State-wise Issue Reports</CardTitle>
              <CardDescription>
                Ranking of states by issue volume and trends
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stateData.map((state, index) => (
                  <div key={state.name} className="flex items-center justify-between p-3 border rounded-lg bg-card/50">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{state.name}</p>
                        <p className="text-sm text-muted-foreground">{state.issues} issues</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className={getDensityColor(state.density)}>
                        {state.density.replace('-', ' ')}
                      </Badge>
                      {getTrendIcon(state.trend)}
                      <span className={`text-sm font-medium ${
                        state.improvement > 0 ? 'text-green-600' : 
                        state.improvement < 0 ? 'text-red-600' : 'text-gray-600'
                      }`}>
                        {state.improvement > 0 ? '+' : ''}{state.improvement}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Category Distribution */}
          <Card className="card-gradient">
            <CardHeader>
              <CardTitle>Issue Category Distribution</CardTitle>
              <CardDescription>
                Breakdown of issues by category type
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {categoryHeatmap.map((category) => (
                  <div key={category.category} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">{category.category}</span>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-muted-foreground">{category.issues}</span>
                        <span className="text-sm font-medium">{category.percentage}%</span>
                      </div>
                    </div>
                    <Progress value={category.percentage} className="h-2" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap gap-4">
          <Button onClick={() => window.location.href = '/manage-issues'}>
            <AlertTriangle className="w-4 h-4 mr-2" />
            View All Issues
          </Button>
          <Button variant="outline">
            <MapPin className="w-4 h-4 mr-2" />
            Export Heatmap Data
          </Button>
          <Button variant="outline">
            <TrendingUp className="w-4 h-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>
    </Layout>
  );
};

export default Heatmap;
