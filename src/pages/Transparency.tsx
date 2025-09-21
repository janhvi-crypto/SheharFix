import React, { useState, useEffect } from 'react';
import { TrendingUp, IndianRupee, FileText, Award, Shield, BarChart3 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';
import LoadingScreen from '@/components/LoadingScreen';

const Transparency = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 2000);
  }, []);

  const budgetData = [
    { 
      department: 'Road Infrastructure', 
      allocated: 45.2, 
      spent: 38.7, 
      remaining: 6.5, 
      efficiency: 85.6,
      projects: 127
    },
    { 
      department: 'Waste Management', 
      allocated: 32.8, 
      spent: 29.1, 
      remaining: 3.7, 
      efficiency: 88.7,
      projects: 89
    },
    { 
      department: 'Water & Drainage', 
      allocated: 28.5, 
      spent: 24.2, 
      remaining: 4.3, 
      efficiency: 84.9,
      projects: 67
    },
    { 
      department: 'Street Lighting', 
      allocated: 18.7, 
      spent: 16.3, 
      remaining: 2.4, 
      efficiency: 87.2,
      projects: 45
    },
    { 
      department: 'Parks & Recreation', 
      allocated: 12.3, 
      spent: 10.1, 
      remaining: 2.2, 
      efficiency: 82.1,
      projects: 34
    }
  ];

  const achievements = [
    {
      title: 'Digital Governance Excellence Award',
      year: '2024',
      organization: 'Ministry of Electronics & IT',
      description: 'Recognized for innovative citizen engagement platform'
    },
    {
      title: 'Best Municipal Corporation - South India',
      year: '2023',
      organization: 'Urban Development Ministry',
      description: 'Outstanding performance in civic service delivery'
    },
    {
      title: 'Smart City Innovation Award',
      year: '2023',
      organization: 'Smart Cities Mission',
      description: 'Technology-driven solution for citizen grievances'
    }
  ];

  const performanceMetrics = [
    { label: 'Citizen Satisfaction Score', value: 87, target: 85, status: 'excellent' },
    { label: 'Issue Resolution Rate', value: 89, target: 80, status: 'excellent' },
    { label: 'Average Response Time', value: 2.8, target: 3.0, unit: 'days', status: 'good' },
    { label: 'Budget Utilization', value: 86, target: 85, status: 'excellent' },
    { label: 'Digital Adoption Rate', value: 78, target: 75, status: 'good' },
    { label: 'Transparency Index', value: 92, target: 90, status: 'excellent' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600 bg-green-50 border-green-200';
      case 'good': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-orange-600 bg-orange-50 border-orange-200';
    }
  };

  const totalBudget = budgetData.reduce((sum, dept) => sum + dept.allocated, 0);
  const totalSpent = budgetData.reduce((sum, dept) => sum + dept.spent, 0);
  const totalRemaining = budgetData.reduce((sum, dept) => sum + dept.remaining, 0);
  const overallEfficiency = (totalSpent / totalBudget) * 100;

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Layout searchPlaceholder="Search budget, departments, or transparency reports...">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col space-y-2">
          <div className="flex items-center space-x-2">
            <Shield className="w-6 h-6 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Government Transparency Portal</h1>
          </div>
          <p className="text-muted-foreground">
            Complete transparency in budget allocation, utilization, and civic performance metrics
          </p>
        </div>

        {/* Budget Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="card-gradient">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <IndianRupee className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold">₹{totalBudget.toFixed(1)}L</p>
                  <p className="text-sm text-muted-foreground">Total Budget Allocated</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="card-gradient">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-2xl font-bold">₹{totalSpent.toFixed(1)}L</p>
                  <p className="text-sm text-muted-foreground">Amount Utilized</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="card-gradient">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <BarChart3 className="w-5 h-5 text-orange-600" />
                <div>
                  <p className="text-2xl font-bold">{overallEfficiency.toFixed(1)}%</p>
                  <p className="text-sm text-muted-foreground">Utilization Efficiency</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="card-gradient">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <FileText className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold">362</p>
                  <p className="text-sm text-muted-foreground">Active Projects</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Department-wise Budget Breakdown */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-semibold">Department-wise Budget Utilization (2024)</h2>
            <Card className="card-gradient">
              <CardContent className="p-6">
                <div className="space-y-6">
                  {budgetData.map((dept, index) => (
                    <div key={index} className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">{dept.department}</h3>
                          <p className="text-sm text-muted-foreground">
                            {dept.projects} active projects
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">₹{dept.allocated}L allocated</p>
                          <p className="text-sm text-muted-foreground">
                            ₹{dept.spent}L spent ({dept.efficiency}%)
                          </p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Budget Utilization</span>
                          <span className="font-medium">₹{dept.spent}L / ₹{dept.allocated}L</span>
                        </div>
                        <Progress value={dept.efficiency} className="h-2" />
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>{dept.efficiency}% utilized</span>
                          <span>₹{dept.remaining}L remaining</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Performance Metrics */}
            <Card className="card-gradient">
              <CardHeader>
                <CardTitle>Key Performance Indicators</CardTitle>
                <CardDescription>Government performance against set targets</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {performanceMetrics.map((metric, index) => (
                    <div key={index} className="p-4 border rounded-lg bg-card/50">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-sm">{metric.label}</h4>
                        <Badge variant="outline" className={getStatusColor(metric.status)}>
                          {metric.status}
                        </Badge>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Current: {metric.value}{metric.unit || '%'}</span>
                          <span>Target: {metric.target}{metric.unit || '%'}</span>
                        </div>
                        <Progress value={metric.value} className="h-2" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Achievements & Reports */}
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Awards & Recognition</h2>
            <Card className="card-gradient">
              <CardContent className="p-4 space-y-4">
                {achievements.map((achievement, index) => (
                  <div key={index} className="p-3 border rounded-lg bg-card/50">
                    <div className="flex items-start space-x-3">
                      <Award className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <div className="flex-1 space-y-1">
                        <h4 className="font-medium text-sm">{achievement.title}</h4>
                        <p className="text-xs text-muted-foreground">
                          {achievement.organization} • {achievement.year}
                        </p>
                        <p className="text-xs">{achievement.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Public Documents */}
            <Card className="card-gradient">
              <CardHeader>
                <CardTitle className="text-lg">Public Documents</CardTitle>
                <CardDescription>Access transparency reports and documents</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { name: 'Annual Budget Report 2024', size: '2.3 MB', type: 'PDF' },
                  { name: 'Quarterly Performance Review', size: '1.8 MB', type: 'PDF' },
                  { name: 'Citizen Feedback Analysis', size: '945 KB', type: 'PDF' },
                  { name: 'Environmental Impact Report', size: '3.1 MB', type: 'PDF' },
                  { name: 'Digital Governance Metrics', size: '1.2 MB', type: 'PDF' }
                ].map((doc, index) => (
                  <div key={index} className="flex items-center justify-between p-2 border rounded bg-card/30">
                    <div className="flex items-center space-x-2">
                      <FileText className="w-4 h-4 text-red-600" />
                      <div>
                        <p className="text-sm font-medium">{doc.name}</p>
                        <p className="text-xs text-muted-foreground">{doc.type} • {doc.size}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="text-xs">
                      Download
                    </Button>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Contact Information */}
            <Card className="card-gradient">
              <CardHeader>
                <CardTitle className="text-lg">Transparency Officer</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p><strong>Name:</strong> Dr. Rajesh Gupta</p>
                  <p><strong>Designation:</strong> Chief Transparency Officer</p>
                  <p><strong>Email:</strong> transparency@sheharfix.gov.in</p>
                  <p><strong>Phone:</strong> +91-80-2234-5678</p>
                  <p><strong>Office Hours:</strong> Mon-Fri, 9:00 AM - 6:00 PM</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Transparency;
