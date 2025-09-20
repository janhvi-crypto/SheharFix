import React from 'react';
import logo from '@/assets/sheharfix-logo.png';

const LoadingScreen = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center">
      <div className="text-center space-y-8 animate-fade-in-up">
        {/* Logo */}
        <div className="flex justify-center">
          <div className="w-24 h-24 bg-white rounded-2xl shadow-lg flex items-center justify-center">
            <img 
              src={logo} 
              alt="SheharFix" 
              className="w-16 h-16 object-contain"
            />
          </div>
        </div>

        {/* App Name */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground">
            SheharFix
          </h1>
          <p className="text-lg text-muted-foreground">
            Find It, Flag It, Fix It
          </p>
        </div>

        {/* Loading Animation */}
        <div className="flex justify-center items-center space-x-2">
          <div className="loading-dots">
            <div style={{ '--i': 0 } as React.CSSProperties}></div>
            <div style={{ '--i': 1 } as React.CSSProperties}></div>
            <div style={{ '--i': 2 } as React.CSSProperties}></div>
          </div>
        </div>

        <p className="text-sm text-muted-foreground animate-pulse">
          Loading your dashboard...
        </p>
      </div>
    </div>
  );
};

export default LoadingScreen;