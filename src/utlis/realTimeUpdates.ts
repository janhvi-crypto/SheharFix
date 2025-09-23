// Real-time updates utility for WebSocket/SSE integration

export interface RealTimeEvent {
  type: 'issue_reported' | 'issue_updated' | 'issue_resolved' | 'issue_assigned';
  data: any;
  timestamp: string;
}

export class RealTimeService {
  private ws: WebSocket | null = null;
  private eventSource: EventSource | null = null;
  private listeners: Map<string, ((event: RealTimeEvent) => void)[]> = new Map();

  // WebSocket implementation
  connectWebSocket(url: string) {
    try {
      this.ws = new WebSocket(url);
      
      this.ws.onopen = () => {
        console.log('WebSocket connected');
      };
      
      this.ws.onmessage = (event) => {
        try {
          const realTimeEvent: RealTimeEvent = JSON.parse(event.data);
          this.notifyListeners(realTimeEvent.type, realTimeEvent);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };
      
      this.ws.onclose = () => {
        console.log('WebSocket disconnected');
        // Implement reconnection logic
        setTimeout(() => this.connectWebSocket(url), 3000);
      };
      
      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
    } catch (error) {
      console.error('Error connecting to WebSocket:', error);
    }
  }

  // Server-Sent Events implementation
  connectSSE(url: string) {
    try {
      this.eventSource = new EventSource(url);
      
      this.eventSource.onopen = () => {
        console.log('SSE connected');
      };
      
      this.eventSource.onmessage = (event) => {
        try {
          const realTimeEvent: RealTimeEvent = JSON.parse(event.data);
          this.notifyListeners(realTimeEvent.type, realTimeEvent);
        } catch (error) {
          console.error('Error parsing SSE message:', error);
        }
      };
      
      this.eventSource.onerror = (error) => {
        console.error('SSE error:', error);
      };
    } catch (error) {
      console.error('Error connecting to SSE:', error);
    }
  }

  // Subscribe to specific event types
  subscribe(eventType: string, callback: (event: RealTimeEvent) => void) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, []);
    }
    
    this.listeners.get(eventType)!.push(callback);
    
    // Return unsubscribe function
    return () => {
      const callbacks = this.listeners.get(eventType);
      if (callbacks) {
        const index = callbacks.indexOf(callback);
        if (index > -1) {
          callbacks.splice(index, 1);
        }
      }
    };
  }

  // Notify all listeners for an event type
  private notifyListeners(eventType: string, event: RealTimeEvent) {
    const callbacks = this.listeners.get(eventType) || [];
    callbacks.forEach(callback => {
      try {
        callback(event);
      } catch (error) {
        console.error('Error in event callback:', error);
      }
    });
  }

  // Send message via WebSocket
  send(message: any) {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(message));
    }
  }

  // Disconnect
  disconnect() {
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
    
    this.listeners.clear();
  }
}

// Singleton instance
export const realTimeService = new RealTimeService();

// React hook for real-time updates
import { useEffect } from 'react';

export const useRealTimeUpdates = (
  eventType: string,
  callback: (event: RealTimeEvent) => void,
  deps: any[] = []
) => {
  useEffect(() => {
    const unsubscribe = realTimeService.subscribe(eventType, callback);
    return unsubscribe;
  }, deps);
};
