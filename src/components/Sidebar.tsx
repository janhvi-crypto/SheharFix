
import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  AlertTriangle, 
  BarChart3, 
  Trophy, 
  User, 
  Eye, 
  Shield, 
  LogOut,
  Users,
  MapPin,
  Heart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useApp, useTranslation } from '@/contexts/AppContext';
import PageLoader from './PageLoader';
import logo from '@/assets/sheharfix-logo.png';

const Sidebar = () => {
  const { user, logout, isNavigating, setIsNavigating } = useApp();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleNavigation = async (path: string) => {
    setIsNavigating(true);
    // Simulate loading time for better UX
    await new Promise(resolve => setTimeout(resolve, 800));
    navigate(path);
    setIsNavigating(false);
  };

  const handleLogout = async () => {
    setIsNavigating(true);
    logout();
    await new Promise(resolve => setTimeout(resolve, 500));
    navigate('/');
    setIsNavigating(false);
  };

  const citizenNavItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: t('dashboard') },
    { path: '/report-issue', icon: AlertTriangle, label: t('reportIssue') },
    { path: '/analytics', icon: BarChart3, label: t('analytics') },
    { path: '/leaderboard', icon: Trophy, label: t('leaderboard') },
  ];

  const adminNavItems = [
    { path: '/admin-dashboard', icon: LayoutDashboard, label: t('dashboard') },
    { path: '/manage-issues', icon: AlertTriangle, label: 'Manage Issues' },
    { path: '/admin-analytics', icon: BarChart3, label: t('analytics') },
    { path: '/heatmap', icon: MapPin, label: 'Heatmap' },
    { path: '/transparency', icon: Shield, label: t('transparency') },
  ];

  const communityItems = [
    { path: '/public-view', icon: Eye, label: t('publicView') },
    { path: '/ngo', icon: Heart, label: 'NGO Partners' },
  ];

  const navItems = user?.role === 'citizen' ? citizenNavItems : adminNavItems;

  const getNavClassName = ({ isActive }: { isActive: boolean }) =>
    `flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors w-full ${
      isActive
        ? 'bg-primary text-primary-foreground'
        : 'text-muted-foreground hover:text-foreground hover:bg-accent'
    }`;

  if (isNavigating) {
    return <PageLoader message="Navigating..." />;
  }

  return (
    <div className="w-64 h-screen bg-card border-r flex flex-col">
      {/* Logo and App Info */}
      <div className="p-6 border-b">
        <div className="flex items-center space-x-3">
          <img src={logo} alt="SheharFix" className="w-10 h-10" />
          <div>
            <h1 className="font-bold text-lg">SheharFix</h1>
            <p className="text-xs text-muted-foreground">Issue Reporting System</p>
          </div>
        </div>
      </div>

      {/* User Profile */}
      <div className="p-4 border-b">
        <div className="flex items-center space-x-3">
          <Avatar className="w-10 h-10">
            <AvatarImage src={user?.avatar} alt={user?.name} />
            <AvatarFallback>
              {user?.name?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{user?.name}</p>
            {user?.role === 'citizen' && (
              <div className="flex items-center space-x-2">
                <span className="text-xs text-muted-foreground">Level {user.level}</span>
                <Badge variant="secondary" className="text-xs">
                  {user.points} pts
                </Badge>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4 space-y-6">
        {/* Main Navigation */}
        <div>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Navigation
          </h3>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={getNavClassName}
                >
                  <IconComponent className="w-4 h-4" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Community Section */}
        <div>
          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            Community
          </h3>
          <nav className="space-y-1">
            {communityItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={getNavClassName}
                >
                  <IconComponent className="w-4 h-4" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="p-4 border-t space-y-2">
        <NavLink
          to="/profile"
          className={getNavClassName}
        >
          <User className="w-4 h-4" />
          <span>{t('profile')}</span>
        </NavLink>
        
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="flex items-center space-x-3 px-3 py-2 text-sm w-full text-left justify-start text-muted-foreground hover:text-foreground hover:bg-accent"
        >
          <LogOut className="w-4 h-4" />
          <span>{t('signOut')}</span>
        </Button>
      </div>
    </div>
  );
};

export default Sidebar;
