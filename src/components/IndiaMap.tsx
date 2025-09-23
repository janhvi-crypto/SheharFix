import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Filter, Eye, Activity } from 'lucide-react';

// Mock data for issue markers across India
interface IssueMarker {
  id: number;
  lat: number;
  lng: number;
  title: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  status: 'open' | 'in-progress' | 'resolved';
  reportCount: number;
  state: string;
}

export interface IndiaMapProps {
  className?: string;
}

const IndiaMap: React.FC<IndiaMapProps> = ({ className = "" }) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [heatmapMode, setHeatmapMode] = useState<boolean>(false);

  // Mock issue data across India
  const issueMarkers: IssueMarker[] = [
    { id: 1, lat: 28.6139, lng: 77.2090, title: 'Delhi Road Pothole', category: 'Roads', priority: 'high', status: 'open', reportCount: 15, state: 'Delhi' },
    { id: 2, lat: 19.0760, lng: 72.8777, title: 'Mumbai Drainage Block', category: 'Drainage', priority: 'medium', status: 'in-progress', reportCount: 8, state: 'Maharashtra' },
    { id: 3, lat: 12.9716, lng: 77.5946, title: 'Bangalore Street Light', category: 'Lighting', priority: 'high', status: 'open', reportCount: 22, state: 'Karnataka' },
    { id: 4, lat: 13.0827, lng: 80.2707, title: 'Chennai Garbage Issue', category: 'Sanitation', priority: 'low', status: 'resolved', reportCount: 5, state: 'Tamil Nadu' },
    { id: 5, lat: 22.5726, lng: 88.3639, title: 'Kolkata Water Problem', category: 'Water', priority: 'medium', status: 'open', reportCount: 12, state: 'West Bengal' },
    { id: 6, lat: 26.9124, lng: 75.7873, title: 'Jaipur Road Repair', category: 'Roads', priority: 'high', status: 'in-progress', reportCount: 18, state: 'Rajasthan' },
    { id: 7, lat: 23.0225, lng: 72.5714, title: 'Ahmedabad Drainage', category: 'Drainage', priority: 'medium', status: 'open', reportCount: 9, state: 'Gujarat' },
    { id: 8, lat: 17.3850, lng: 78.4867, title: 'Hyderabad Sanitation', category: 'Sanitation', priority: 'high', status: 'open', reportCount: 14, state: 'Telangana' },
  ];

  // Mock state data for heatmap across India
  const stateData = [
    { name: 'Maharashtra', totalReports: 245, highPriority: 45, lat: 19.7515, lng: 75.7139 },
    { name: 'Karnataka', totalReports: 189, highPriority: 32, lat: 15.3173, lng: 75.7139 },
    { name: 'Delhi', totalReports: 167, highPriority: 28, lat: 28.7041, lng: 77.1025 },
    { name: 'Tamil Nadu', totalReports: 134, highPriority: 22, lat: 11.1271, lng: 78.6569 },
    { name: 'West Bengal', totalReports: 98, highPriority: 15, lat: 22.9868, lng: 87.8550 },
    { name: 'Rajasthan', totalReports: 87, highPriority: 12, lat: 27.0238, lng: 74.2179 },
    { name: 'Gujarat', totalReports: 76, highPriority: 9, lat: 22.2587, lng: 71.1924 },
    { name: 'Telangana', totalReports: 65, highPriority: 8, lat: 18.1124, lng: 79.0193 },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'border-red-500';
      case 'in-progress': return 'border-yellow-500';
      case 'resolved': return 'border-green-500';
      default: return 'border-gray-500';
    }
  };

  const filteredIssues = issueMarkers.filter(issue => {
    if (selectedFilter === 'all') return true;
    if (selectedFilter === 'high-priority') return issue.priority === 'high';
    if (selectedFilter === 'open') return issue.status === 'open';
    if (selectedFilter === 'maharashtra') return issue.state === 'Maharashtra';
    if (selectedFilter === 'karnataka') return issue.state === 'Karnataka';
    if (selectedFilter === 'delhi') return issue.state === 'Delhi';
    return true;
  });

  const heatmapData = stateData.map(state => ({
    ...state,
    intensity: Math.min((state.totalReports / 250) * 100, 100)
  }));

  return (
    <div className={`space-y-4 ${className}`}>
      <Card className="card-gradient">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="w-5 h-5" />
                <span>Interactive India Map</span>
              </CardTitle>
              <CardDescription>
                Live tracking of civic issues across Indian states
              </CardDescription>
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant={heatmapMode ? "default" : "outline"}
                size="sm"
                onClick={() => setHeatmapMode(!heatmapMode)}
              >
                <Activity className="w-4 h-4 mr-2" />
                {heatmapMode ? 'Show Markers' : 'Heatmap'}
              </Button>
              <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                <SelectTrigger className="w-40">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All India</SelectItem>
                  <SelectItem value="high-priority">High Priority</SelectItem>
                  <SelectItem value="open">Open Issues</SelectItem>
                  <SelectItem value="maharashtra">Maharashtra</SelectItem>
                  <SelectItem value="karnataka">Karnataka</SelectItem>
                  <SelectItem value="delhi">Delhi</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Mock map area */}
          <div className="relative w-full h-96 bg-gray-100 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 overflow-hidden">
            {/* Map background pattern */}
            <div className="absolute inset-0 opacity-10">
              <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />
              </svg>
            </div>

            {/* Issue Markers or Heatmap */}
            {!heatmapMode ? (
              <>
                {/* Issue Markers */}
                {filteredIssues.map((issue, index) => (
                  <div
                    key={issue.id}
                    className={`absolute w-6 h-6 rounded-full border-2 ${getPriorityColor(issue.priority)} ${getStatusColor(issue.status)} cursor-pointer hover:scale-125 transition-transform`}
                    style={{
                      left: `${20 + (index * 15) % 60}%`,
                      top: `${20 + (index * 12) % 50}%`,
                    }}
                    title={`${issue.title} - ${issue.category}`}
                  >
                    <div className="w-full h-full rounded-full bg-current opacity-80"></div>
                  </div>
                ))}
                
                {/* Legend for markers */}
                <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-sm rounded-lg p-3 border">
                  <h4 className="text-sm font-medium mb-2">Issue Priority</h4>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-xs">High Priority</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="text-xs">Medium Priority</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-xs">Low Priority</span>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                {/* Heatmap circles */}
                {heatmapData.map((state, index) => (
                  <div
                    key={state.name}
                    className="absolute rounded-full opacity-60 cursor-pointer hover:opacity-80 transition-opacity"
                    style={{
                      left: `${25 + (index * 18) % 50}%`,
                      top: `${25 + (index * 15) % 40}%`,
                      width: `${Math.max(30, state.intensity / 2)}px`,
                      height: `${Math.max(30, state.intensity / 2)}px`,
                      backgroundColor: state.intensity > 70 ? '#ef4444' : 
                                     state.intensity > 40 ? '#f97316' : 
                                     state.intensity > 20 ? '#eab308' : '#22c55e',
                    }}
                    title={`${state.name}: ${state.totalReports} reports`}
                  ></div>
                ))}
                
                {/* Legend for heatmap */}
                <div className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-sm rounded-lg p-3 border">
                  <h4 className="text-sm font-medium mb-2">Report Density</h4>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span className="text-xs">Very High (200+)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                      <span className="text-xs">High (100-199)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="text-xs">Medium (50-99)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-xs">Low (0-49)</span>
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Live Updates Indicator */}
            <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm rounded-lg px-3 py-2 border">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs font-medium">Live Updates</span>
              </div>
            </div>

            {/* Center label */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm font-medium">All India Civic Issues Map</p>
                <p className="text-xs">{filteredIssues.length} issues displayed across India</p>
                <p className="text-xs mt-1">Real-time data from {stateData.length} states</p>
              </div>
            </div>
          </div>

          {/* State Summary when in heatmap mode */}
          {heatmapMode && (
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-3">India State-wise Issue Distribution</h4>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-3">
              {stateData.map((state) => (
                <div key={state.name} className="p-3 border rounded-lg bg-card/50">
                  <div className="text-sm font-medium">{state.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {state.totalReports} reports
                  </div>
                  <div className="flex items-center space-x-1 mt-1">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-xs">{state.highPriority} high priority</span>
                  </div>
                </div>
              ))}
              </div>
            </div>
          )}

          {/* Live Issue Feed */}
          <div className="mt-4">
            <h4 className="text-sm font-medium mb-2 flex items-center space-x-2">
              <Activity className="w-4 h-4" />
              <span>Live Issue Feed - All India</span>
            </h4>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {filteredIssues.slice(0, 5).map((issue) => (
                <div key={issue.id} className="flex items-center justify-between text-xs p-2 border rounded bg-card/30">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className={getPriorityColor(issue.priority) + ' text-white border-0'}>
                      {issue.priority}
                    </Badge>
                    <span>{issue.title}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-muted-foreground">
                    <Eye className="w-3 h-3" />
                    <span>{issue.reportCount}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default IndiaMap;
