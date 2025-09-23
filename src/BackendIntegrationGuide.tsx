import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const BackendIntegrationGuide = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Backend Integration Guide</h1>
        <p className="text-muted-foreground">
          Complete guide to integrate your backend with the SheharFix frontend
        </p>
      </div>

      <Tabs defaultValue="api-endpoints" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="api-endpoints">API Endpoints</TabsTrigger>
          <TabsTrigger value="data-models">Data Models</TabsTrigger>
          <TabsTrigger value="real-time">Real-time Updates</TabsTrigger>
          <TabsTrigger value="implementation">Implementation</TabsTrigger>
        </TabsList>

        <TabsContent value="api-endpoints">
          <Card>
            <CardHeader>
              <CardTitle>Required API Endpoints</CardTitle>
              <CardDescription>
                These are the endpoints your backend needs to implement
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Badge variant="outline" className="bg-green-100">POST /api/auth/login</Badge>
                <p className="text-sm">User authentication with email/password and role</p>
                <pre className="text-xs bg-gray-100 p-2 rounded">
{`{
  "email": "user@example.com",
  "password": "password123",
  "role": "citizen" | "admin"
}`}
                </pre>
              </div>

              <div className="space-y-2">
                <Badge variant="outline" className="bg-blue-100">POST /api/issues</Badge>
                <p className="text-sm">Report new civic issue with images</p>
                <pre className="text-xs bg-gray-100 p-2 rounded">
{`{
  "title": "Pothole on MG Road",
  "description": "Large pothole causing traffic issues",
  "location": "MG Road, Koramangala",
  "category": "roads",
  "priority": "high",
  "images": ["url1", "url2"],
  "isAnonymous": false,
  "reportedBy": "user-id"
}`}
                </pre>
              </div>

              <div className="space-y-2">
                <Badge variant="outline" className="bg-orange-100">GET /api/issues</Badge>
                <p className="text-sm">Get all active issues (for admin dashboard)</p>
              </div>

              <div className="space-y-2">
                <Badge variant="outline" className="bg-purple-100">POST /api/issues/:id/resolve</Badge>
                <p className="text-sm">Mark issue as resolved with after image and cost</p>
                <pre className="text-xs bg-gray-100 p-2 rounded">
{`{
  "afterImage": "resolved-image-url",
  "cost": "₹15,000",
  "resolvedDate": "2024-01-20"
}`}
                </pre>
              </div>

              <div className="space-y-2">
                <Badge variant="outline" className="bg-red-100">GET /api/issues?status=resolved</Badge>
                <p className="text-sm">Get resolved issues (for public view)</p>
              </div>

              <div className="space-y-2">
                <Badge variant="outline" className="bg-yellow-100">POST /api/upload/issue-image</Badge>
                <p className="text-sm">Upload issue images (multipart/form-data)</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="data-models">
          <Card>
            <CardHeader>
              <CardTitle>Data Models</CardTitle>
              <CardDescription>
                Database schema and data structures
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Issue Model</h4>
                <pre className="text-xs bg-gray-100 p-3 rounded">
{`interface Issue {
  id: string;
  title: string;
  description: string;
  location: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  images: string[];
  reportedBy: string;
  reportedDate: string;
  status: 'reported' | 'assigned' | 'in-progress' | 'resolved';
  assignedTo?: string;
  estimatedTime?: string;
  upvotes: number;
  afterImage?: string;
  resolvedDate?: string;
  department?: string;
  cost?: string;
  isAnonymous?: boolean;
}`}
                </pre>
              </div>

              <div>
                <h4 className="font-semibold mb-2">User Model</h4>
                <pre className="text-xs bg-gray-100 p-3 rounded">
{`interface User {
  id: string;
  name: string;
  email: string;
  role: 'citizen' | 'admin';
  phone?: string;
  avatar?: string;
  points?: number;
  level?: number;
  badges?: string[];
  createdAt: string;
  updatedAt: string;
}`}
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="real-time">
          <Card>
            <CardHeader>
              <CardTitle>Real-time Updates</CardTitle>
              <CardDescription>
                WebSocket/SSE implementation for live updates
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">WebSocket Events</h4>
                <div className="space-y-2">
                  <Badge variant="outline">issue_reported</Badge>
                  <p className="text-sm">When a new issue is reported by citizens</p>
                  
                  <Badge variant="outline">issue_assigned</Badge>
                  <p className="text-sm">When admin assigns issue to department</p>
                  
                  <Badge variant="outline">issue_updated</Badge>
                  <p className="text-sm">When progress photo is uploaded</p>
                  
                  <Badge variant="outline">issue_resolved</Badge>
                  <p className="text-sm">When issue is marked as resolved</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Event Payload</h4>
                <pre className="text-xs bg-gray-100 p-3 rounded">
{`{
  "type": "issue_reported",
  "data": {
    "issue": Issue,
    "user": User
  },
  "timestamp": "2024-01-20T10:30:00Z"
}`}
                </pre>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="implementation">
          <Card>
            <CardHeader>
              <CardTitle>Implementation Steps</CardTitle>
              <CardDescription>
                Step-by-step guide to integrate your backend
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold">1. Update API Configuration</h4>
                <p className="text-sm">Update the API_BASE_URL in <code>src/services/api.ts</code></p>
                <pre className="text-xs bg-gray-100 p-2 rounded">
{`const API_BASE_URL = 'https://your-backend-url.com/api';`}
                </pre>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">2. Replace Mock Data</h4>
                <p className="text-sm">Remove mock data from <code>src/contexts/AppContext.tsx</code></p>
                <p className="text-sm">Use <code>useIssues</code> hook in components</p>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">3. Enable Real-time Updates</h4>
                <p className="text-sm">Configure WebSocket/SSE connection in components</p>
                <pre className="text-xs bg-gray-100 p-2 rounded">
{`import { useRealTimeUpdates } from '@/utils/realTimeUpdates';

useRealTimeUpdates('issue_reported', (event) => {
  // Handle new issue reported
  refetchIssues();
});`}
                </pre>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">4. Authentication</h4>
                <p className="text-sm">Implement JWT token management and role-based access</p>
              </div>

              <div className="space-y-2">
                <h4 className="font-semibold">5. File Upload</h4>
                <p className="text-sm">Configure image upload endpoints and storage</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default BackendIntegrationGuide;
