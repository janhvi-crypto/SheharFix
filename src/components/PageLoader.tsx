import React from 'react';
import { Loader2 } from 'lucide-react';
import logo from '@/assets/sheharfix-logo.png';

interface PageLoaderProps {
  message?: string;
}

const PageLoader: React.FC<PageLoaderProps> = ({ message = "Loading..." }) => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center">
      <div className="text-center space-y-6 animate-fade-in-up">
        {/* Logo */}
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-card rounded-2xl shadow-lg flex items-center justify-center">
            <img 
              src={logo} 
              alt="SheharFix" 
              className="w-12 h-12 object-contain"
            />
          </div>
        </div>

        {/* Loading Animation */}
        <div className="flex justify-center">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
        </div>

        {/* Message */}
        <p className="text-muted-foreground animate-pulse">
          {message}
        </p>
      </div>
    </div>
  );
};

export default PageLoader;
