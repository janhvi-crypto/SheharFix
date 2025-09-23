import { useState, useEffect, useCallback } from 'react';
import { apiService, ApiIssue } from '@/services/api';
import toast from 'react-hot-toast';

export const useIssues = () => {
  const [issues, setIssues] = useState<ApiIssue[]>([]);
  const [resolvedIssues, setResolvedIssues] = useState<ApiIssue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all issues
  const fetchIssues = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const [allIssues, resolved] = await Promise.all([
        apiService.getIssues(),
        apiService.getResolvedIssues()
      ]);
      
      setIssues(allIssues.filter(issue => issue.status !== 'resolved'));
      setResolvedIssues(resolved);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch issues');
      console.error('Error fetching issues:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  // Report new issue
  const reportIssue = useCallback(async (issueData: {
    title: string;
    description: string;
    location: string;
    category: string;
    priority: string;
    images: File[];
    isAnonymous: boolean;
    reportedBy: string;
  }) => {
    try {
      const newIssue = await apiService.reportIssue(issueData);
      setIssues(prev => [newIssue, ...prev]);
      toast.success('Issue reported successfully!');
      return newIssue;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to report issue';
      toast.error(message);
      throw err;
    }
  }, []);

  // Update issue (for admin actions)
  const updateIssue = useCallback(async (
    issueId: string,
    updates: {
      status?: 'assigned' | 'in-progress' | 'resolved';
      afterImage?: File;
      cost?: string;
      assignedTo?: string;
      estimatedTime?: string;
    }
  ) => {
    try {
      const updatedIssue = await apiService.updateIssue({
        issueId,
        ...updates
      });
      
      if (updatedIssue.status === 'resolved') {
        // Move to resolved issues
        setIssues(prev => prev.filter(issue => issue.id !== issueId));
        setResolvedIssues(prev => [updatedIssue, ...prev]);
        toast.success('Issue marked as resolved!');
      } else {
        // Update in current issues
        setIssues(prev => 
          prev.map(issue => 
            issue.id === issueId ? updatedIssue : issue
          )
        );
        toast.success('Issue updated successfully!');
      }
      
      return updatedIssue;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update issue';
      toast.error(message);
      throw err;
    }
  }, []);

  // Upvote issue
  const upvoteIssue = useCallback(async (issueId: string) => {
    try {
      const updatedIssue = await apiService.upvoteIssue(issueId);
      setIssues(prev => 
        prev.map(issue => 
          issue.id === issueId ? updatedIssue : issue
        )
      );
      toast.success('Vote recorded!');
      return updatedIssue;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to upvote issue';
      toast.error(message);
      throw err;
    }
  }, []);

  // Real-time subscription
  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    const setupRealTimeUpdates = async () => {
      try {
        unsubscribe = await apiService.subscribeToIssues((updatedIssue) => {
          if (updatedIssue.status === 'resolved') {
            setIssues(prev => prev.filter(issue => issue.id !== updatedIssue.id));
            setResolvedIssues(prev => [updatedIssue, ...prev]);
          } else {
            setIssues(prev => {
              const existingIndex = prev.findIndex(issue => issue.id === updatedIssue.id);
              if (existingIndex >= 0) {
                // Update existing issue
                const updated = [...prev];
                updated[existingIndex] = updatedIssue;
                return updated;
              } else {
                // Add new issue
                return [updatedIssue, ...prev];
              }
            });
          }
        });
      } catch (err) {
        console.error('Failed to setup real-time updates:', err);
      }
    };

    setupRealTimeUpdates();

    return () => {
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  // Initial data load
  useEffect(() => {
    fetchIssues();
  }, [fetchIssues]);

  return {
    issues,
    resolvedIssues,
    loading,
    error,
    reportIssue,
    updateIssue,
    upvoteIssue,
    refetch: fetchIssues
  };
};
