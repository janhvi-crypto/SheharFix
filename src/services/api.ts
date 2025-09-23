// API Service Layer for Backend Integration
// Replace these endpoints with your actual backend API URLs

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001/api';

export interface ApiIssue {
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
}

export interface ApiUser {
  id: string;
  name: string;
  email: string;
  role: 'citizen' | 'admin';
  phone?: string;
  avatar?: string;
  points?: number;
  level?: number;
  badges?: string[];
}

export interface ReportIssueRequest {
  title: string;
  description: string;
  location: string;
  category: string;
  priority: string;
  images: File[];
  isAnonymous: boolean;
  reportedBy: string;
}

export interface UpdateIssueRequest {
  issueId: string;
  status?: 'assigned' | 'in-progress' | 'resolved';
  afterImage?: File;
  cost?: string;
  assignedTo?: string;
  estimatedTime?: string;
}

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const token = localStorage.getItem('auth-token');
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  private async uploadFile(file: File, endpoint: string): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    
    const token = localStorage.getItem('auth-token');
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });
    
    if (!response.ok) {
      throw new Error(`Upload failed: ${response.status}`);
    }
    
    const result = await response.json();
    return result.url;
  }

  // Authentication
  async login(email: string, password: string, role: 'citizen' | 'admin'): Promise<{ user: ApiUser; token: string }> {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password, role }),
    });
  }

  async signup(userData: {
    name: string;
    email: string;
    password: string;
    phone: string;
    role: 'citizen' | 'admin';
  }): Promise<{ user: ApiUser; token: string }> {
    return this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logout(): Promise<void> {
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }

  // Issues Management
  async reportIssue(issueData: ReportIssueRequest): Promise<ApiIssue> {
    // First upload images
    const imageUrls: string[] = [];
    for (const image of issueData.images) {
      const imageUrl = await this.uploadFile(image, '/upload/issue-image');
      imageUrls.push(imageUrl);
    }

    // Then create issue
    return this.request('/issues', {
      method: 'POST',
      body: JSON.stringify({
        ...issueData,
        images: imageUrls,
      }),
    });
  }

  async getIssues(): Promise<ApiIssue[]> {
    return this.request('/issues');
  }

  async getResolvedIssues(): Promise<ApiIssue[]> {
    return this.request('/issues?status=resolved');
  }

  async updateIssue(data: UpdateIssueRequest): Promise<ApiIssue> {
    let afterImageUrl = '';
    if (data.afterImage) {
      afterImageUrl = await this.uploadFile(data.afterImage, '/upload/progress-image');
    }

    return this.request(`/issues/${data.issueId}`, {
      method: 'PATCH',
      body: JSON.stringify({
        ...data,
        ...(afterImageUrl && { afterImage: afterImageUrl }),
      }),
    });
  }

  async upvoteIssue(issueId: string): Promise<ApiIssue> {
    return this.request(`/issues/${issueId}/upvote`, {
      method: 'POST',
    });
  }

  async assignIssue(issueId: string, assignedTo: string, estimatedTime: string): Promise<ApiIssue> {
    return this.request(`/issues/${issueId}/assign`, {
      method: 'POST',
      body: JSON.stringify({ assignedTo, estimatedTime }),
    });
  }

  async resolveIssue(issueId: string, afterImage?: File, cost?: string): Promise<ApiIssue> {
    let afterImageUrl = '';
    if (afterImage) {
      afterImageUrl = await this.uploadFile(afterImage, '/upload/resolved-image');
    }

    return this.request(`/issues/${issueId}/resolve`, {
      method: 'POST',
      body: JSON.stringify({
        afterImage: afterImageUrl,
        cost,
      }),
    });
  }

  // Real-time subscriptions
  async subscribeToIssues(callback: (issue: ApiIssue) => void): Promise<() => void> {
    // WebSocket or SSE connection for real-time updates
    const ws = new WebSocket(`${API_BASE_URL.replace('http', 'ws')}/ws/issues`);
    
    ws.onmessage = (event) => {
      const issue = JSON.parse(event.data);
      callback(issue);
    };
    
    // Return cleanup function
    return () => ws.close();
  }

  // Analytics
  async getAnalytics(): Promise<{
    totalIssues: number;
    resolvedIssues: number;
    averageResponseTime: number;
    citizenSatisfaction: number;
    wardStats: Array<{
      ward: string;
      issues: number;
      resolved: number;
      activeRate: number;
    }>;
  }> {
    return this.request('/analytics');
  }
}

export const apiService = new ApiService();
