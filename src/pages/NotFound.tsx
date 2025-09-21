import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Wrench, ArrowLeft } from "lucide-react";
import logo from '@/assets/sheharfix-logo.png';

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center space-y-6 p-8">
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

        {/* Construction Icon */}
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <Wrench className="w-8 h-8 text-primary animate-pulse" />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <h1 className="text-4xl font-bold text-foreground">Coming Soon</h1>
          <p className="text-xl text-muted-foreground max-w-md">
            We're working hard to bring you this feature. Stay tuned for updates!
          </p>
          <p className="text-sm text-muted-foreground">
            This page will be available in a future update
          </p>
        </div>

        {/* Action Button */}
        <Link to="/">
          <Button className="mt-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Return to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
