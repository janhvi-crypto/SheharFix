import React from 'react';
import { Wrench, Clock } from 'lucide-react';
import logo from '@/assets/sheharfix-logo.png';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface ComingSoonProps {
  title?: string;
  description?: string;
}

const ComingSoon: React.FC<ComingSoonProps> = ({
  title = 'Coming Soon',
  description = "We're working hard to bring you this feature. Stay tuned for updates!",
}) => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center space-y-6 p-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
        {/* Logo */}
        <div className="flex justify-center">
          <div className="w-20 h-20 bg-card rounded-2xl shadow-lg flex items-center justify-center">
            <img src={logo} alt="SheharFix" className="w-12 h-12 object-contain" />
          </div>
        </div>

        {/* Animated Icons */}
        <div className="flex items-center justify-center gap-4">
          <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center">
            <Wrench className="w-7 h-7 text-primary animate-spin" />
          </div>
          <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center">
            <Clock className="w-7 h-7 text-primary animate-pulse" />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-3">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
            {title}
          </h1>
          <p className="text-base md:text-lg text-muted-foreground max-w-lg mx-auto">
            {description}
          </p>
        </div>

        {/* Action */}
        <Link to="/">
          <Button className="mt-4">Go back home</Button>
        </Link>
      </div>
    </div>
  );
};

export default ComingSoon;
