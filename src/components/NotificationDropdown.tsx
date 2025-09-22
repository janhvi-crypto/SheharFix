import React from 'react';
import { Bell, MapPin, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useTranslation } from '@/contexts/AppContext';

interface Notification {
  id: string;
  type: 'issue_resolved' | 'issue_reported' | 'issue_assigned' | 'status_update';
  title: string;
  message: string;
  location: string;
  time: string;
  isRead: boolean;
}

const NotificationDropdown: React.FC = () => {
  const { t } = useTranslation();

  // Mock notifications data
  const notifications: Notification[] = [
    {
      id: '1',
      type: 'issue_resolved',
      title: 'Pothole Resolved',
      message: 'The pothole on Main Street has been fixed',
      location: 'Main Street, Downtown',
      time: '2 hours ago',
      isRead: false,
    },
    {
      id: '2',
      type: 'issue_reported',
      title: 'New Issue Nearby',
      message: 'Broken streetlight reported in your area',
      location: 'Oak Avenue, Near Park',
      time: '4 hours ago',
      isRead: false,
    },
    {
      id: '3',
      type: 'status_update',
      title: 'Issue Update',
      message: 'Your garbage collection report is in progress',
      location: 'Pine Street, Block 5',
      time: '1 day ago',
      isRead: true,
    },
    {
      id: '4',
      type: 'issue_assigned',
      title: 'Issue Assigned',
      message: 'Drainage problem assigned to Water Department',
      location: 'Elm Street, Sector 7',
      time: '2 days ago',
      isRead: true,
    },
  ];

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'issue_resolved':
        return <CheckCircle className="w-4 h-4 text-success" />;
      case 'issue_reported':
        return <AlertTriangle className="w-4 h-4 text-warning" />;
      case 'issue_assigned':
        return <Clock className="w-4 h-4 text-info" />;
      default:
        return <Bell className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'issue_resolved':
        return 'border-l-success';
      case 'issue_reported':
        return 'border-l-warning';
      case 'issue_assigned':
        return 'border-l-info';
      default:
        return 'border-l-muted';
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <Badge 
              variant="destructive" 
              className="absolute -top-1 -right-1 w-5 h-5 rounded-full p-0 flex items-center justify-center text-xs"
            >
              {unreadCount}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="w-80 bg-popover border border-border/50 backdrop-blur-md"
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <Badge variant="secondary" className="text-xs">
              {unreadCount} new
            </Badge>
          )}
        </div>

        <ScrollArea className="h-96">
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-muted-foreground">
              <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No notifications yet</p>
            </div>
          ) : (
            notifications.map((notification, index) => (
              <div key={notification.id}>
                <DropdownMenuItem 
                  className={`p-4 cursor-pointer border-l-4 ${getNotificationColor(notification.type)} ${
                    !notification.isRead ? 'bg-accent/30' : ''
                  }`}
                >
                  <div className="flex items-start space-x-3 w-full">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm font-medium truncate">
                          {notification.title}
                        </h4>
                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 ml-2" />
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center space-x-1">
                          <MapPin className="w-3 h-3" />
                          <span className="truncate">{notification.location}</span>
                        </div>
                        <span className="flex-shrink-0">{notification.time}</span>
                      </div>
                    </div>
                  </div>
                </DropdownMenuItem>
                {index < notifications.length - 1 && <DropdownMenuSeparator />}
              </div>
            ))
          )}
        </ScrollArea>

        <div className="p-3 border-t">
          <Button variant="ghost" className="w-full text-sm">
            View All Notifications
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default NotificationDropdown;
