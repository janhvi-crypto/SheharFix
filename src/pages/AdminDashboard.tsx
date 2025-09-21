import React, { useEffect, useRef, useState } from 'react';
import { AlertTriangle, CheckCircle, Clock, Users, MapPin, Navigation, Camera, Settings, IndianRupee, BarChart3, TrendingUp, Shield } from 'lucide-react';
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

  // Transparency data for administrators
  const transparencyData = {
    budget: {
      total: 245.8,
      allocated: 198.3,
      spent: 167.4,
      remaining: 30.9,
      efficiency: 84.4
    },
    departments: [
      { name: 'Road Infrastructure', budget: 67.2, spent: 58.9, projects: 45, completion: 87.6 },
      { name: 'Waste Management', budget: 45.8, spent: 41.2, projects: 32, completion: 89.9 },
      { name: 'Water & Drainage', budget: 38.4, spent: 32.1, projects: 28, completion: 83.6 },
      { name: 'Street Lighting', budget: 28.7, spent: 24.8, projects: 19, completion: 86.4 },
      { name: 'Parks & Recreation', budget: 18.2, spent: 10.4, projects: 12, completion: 57.1 }
    ],
    performance: {
      issuesResolved: 1247,
      avgResponseTime: 2.8,
      citizenSatisfaction: 87.2,
      budgetUtilization: 84.4,
      staffEfficiency: 91.3
    }
  };

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

  type AdminIssue = {
    id: number;
    title: string;
    description?: string;
    category?: string;
    priority?: string;
    status: 'assigned' | 'in-progress' | 'resolved' | string;
    location?: string;
    reportedBy?: string;
    reportedDate?: string;
    assignedTo?: string;
    image: string;
    upvotes?: number;
    estimatedTime?: string;
  };

  const [assignedIssues, setAssignedIssues] = useState<AdminIssue[]>([]);
  const [loading, setLoading] = useState(true);
  const refetchIssues = async () => {
    try {
      const res = await fetch('/api/issues');
      if (!res.ok) throw new Error('Failed to fetch');
      const rows: any[] = await res.json();
      // Map to AdminIssue; filter out resolved so the list only shows actionable items
      const mapped: AdminIssue[] = rows
        .filter(r => r.status !== 'resolved')
        .map(r => ({
          id: r.id,
          title: r.title,
          description: r.description || '',
          category: r.category || 'General',
          priority: r.priority || 'medium',
          status: r.status === 'in_progress' ? 'in-progress' : (r.status || 'assigned'),
          location: (r.lat && r.lng) ? `${Number(r.lat).toFixed(4)}, ${Number(r.lng).toFixed(4)}` : undefined,
          reportedBy: r.created_by ? `Citizen #${r.created_by}` : 'Citizen',
          reportedDate: r.created_at,
          assignedTo: undefined,
          image: r.media_path ||
            (String(r.category || '').toLowerCase().includes('pothole') || String(r.category || '').toLowerCase().includes('road') ? samplePothole
            : String(r.category || '').toLowerCase().includes('garbage') || String(r.category || '').toLowerCase().includes('sanitation') ? sampleGarbage
            : String(r.category || '').toLowerCase().includes('drain') ? sampleDrainage
            : sampleStreetlight),
          upvotes: r.upvotes || 0,
          estimatedTime: '2 days'
        }));
      setAssignedIssues(mapped);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refetchIssues();
  }, []);
  const fileInputsRef = useRef<Record<number, HTMLInputElement | null>>({});

  const triggerUpload = (id: number) => {
    const input = fileInputsRef.current[id];
    input?.click();
  };

  const onFileSelected = async (id: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    // Optimistic preview
    const previewUrl = URL.createObjectURL(file);
    setAssignedIssues(prev => prev.map(it => it.id === id ? { ...it, image: previewUrl } : it));
    // Attempt to persist to backend if this ID exists server-side
    try {
      const form = new FormData();
      form.append('media', file);
      const resp = await fetch(`/api/issues/${id}/media`, { method: 'PATCH', body: form });
      if (resp.ok) {
        const data = await resp.json();
        if (data?.media_path) {
          setAssignedIssues(prev => prev.map(it => it.id === id ? { ...it, image: data.media_path } : it));
        }
      }
    } catch {}
    // Reset so selecting the same file again triggers change
    e.currentTarget.value = '';
  };

  const markResolved = async (id: number) => {
    // Optimistic UI update
    setAssignedIssues(prev => prev.filter(it => it.id !== id));
    // Try to sync with backend if the issue exists
    try {
      await fetch(`/api/issues/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'resolved' }),
      });
      // Optionally ensure by refetching
      // await refetchIssues();
      // Increment admin resolved counter for Profile page (used as fallback display)
      const key = 'admin-resolved-count';
      const current = Number(localStorage.getItem(key) || '0');
      localStorage.setItem(key, String(current + 1));
    } catch {}
  };

  

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

        {/* Main Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="card-gradient">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">47</p>
                  <p className="text-sm text-muted-foreground">Assigned Issues</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-gradient">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <IndianRupee className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">₹{transparencyData.budget.spent}L</p>
                  <p className="text-sm text-muted-foreground">Budget Utilized</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-gradient">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{transparencyData.performance.citizenSatisfaction}%</p>
                  <p className="text-sm text-muted-foreground">Citizen Satisfaction</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="card-gradient">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{transparencyData.performance.staffEfficiency}%</p>
                  <p className="text-sm text-muted-foreground">Staff Efficiency</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Department Budget Overview for Admins */}
        <Card className="card-gradient">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="w-5 h-5" />
              <span>Budget Management Overview</span>
            </CardTitle>
            <CardDescription>Department-wise budget allocation and utilization tracking</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {transparencyData.departments.map((dept, index) => (
                <div key={index} className="p-4 border rounded-lg bg-card/50">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium text-sm">{dept.name}</h4>
                      <Badge variant="secondary" className="text-xs">
                        {dept.completion.toFixed(1)}%
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>₹{dept.spent}L / ₹{dept.budget}L</span>
                        <span>{dept.projects} projects</span>
                      </div>
                      <Progress value={dept.completion} className="h-2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

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
            {loading && (
              <div className="text-sm text-muted-foreground">Loading assigned issues…</div>
            )}
            {!loading && assignedIssues.length === 0 && (
              <div className="text-sm text-muted-foreground">No assigned issues. Great job!</div>
            )}
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
                    {/* Hidden input for file selection */}
                    <input
                      ref={el => { fileInputsRef.current[issue.id] = el; }}
                      type="file"
                      accept="image/*"
                      capture="environment"
                      className="hidden"
                      onChange={(e) => onFileSelected(issue.id, e)}
                    />
                    <Button variant="outline" size="sm" className="flex-1" onClick={() => triggerUpload(issue.id)}>
                      <Camera className="w-3 h-3 mr-1" />
                      Upload Photo
                    </Button>
                    <Button
                      variant={issue.status === 'resolved' ? 'default' : 'outline'}
                      size="sm"
                      className={issue.status === 'resolved' ? 'bg-green-600 hover:bg-green-600 text-white' : ''}
                      onClick={() => markResolved(issue.id)}
                    >
                      {issue.status === 'resolved' ? 'Resolved' : 'Mark Resolved'}
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
