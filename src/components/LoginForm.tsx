import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Users, Shield } from 'lucide-react';
import { useApp, useTranslation, UserRole } from '@/contexts/AppContext';
import toast from 'react-hot-toast';

interface LoginFormProps {
  role: UserRole;
  onBack: () => void;
  onSuccess: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ role, onBack, onSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  
  const { login } = useApp();
  const { t } = useTranslation();

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    
    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fill in all required fields correctly');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const success = await login(email, password, role);
      if (success) {
        toast.success(`Welcome! Logged in as ${role}`);
        onSuccess();
      } else {
        toast.error('Invalid credentials');
      }
    } catch (error) {
      toast.error('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const roleConfig = {
    citizen: {
      icon: Users,
      color: 'citizen',
      title: t('citizen'),
      description: 'Access your citizen dashboard to report and track issues'
    },
    admin: {
      icon: Shield,
      color: 'admin',
      title: t('administrator'),
      description: 'Access administrative tools to manage civic issues'
    }
  };

  const config = roleConfig[role];
  const IconComponent = config.icon;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Card className="card-gradient">
          <CardHeader className="text-center space-y-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={onBack}
              className="absolute left-4 top-4"
            >
              <ArrowLeft className="w-4 h-4" />
            </Button>
            
            <div className={`w-16 h-16 mx-auto bg-${config.color} rounded-2xl flex items-center justify-center`}>
              <IconComponent className={`w-8 h-8 text-${config.color}-foreground`} />
            </div>
            
            <div>
              <CardTitle className="text-2xl">{t('login')}</CardTitle>
              <CardDescription className="mt-2">
                {config.description}
              </CardDescription>
            </div>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">{t('email')}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={errors.email ? 'border-destructive' : ''}
                />
                {errors.email && (
                  <p className="text-sm text-destructive">{errors.email}</p>
                )}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">{t('password')}</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={errors.password ? 'border-destructive' : ''}
                />
                {errors.password && (
                  <p className="text-sm text-destructive">{errors.password}</p>
                )}
              </div>
              
              <Button
                type="submit"
                className={`w-full ${role === 'citizen' ? 'btn-citizen' : 'btn-admin'}`}
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : t('login')}
              </Button>
            </form>
            
            {/* Demo credentials hint */}
            <div className="mt-4 p-3 bg-muted rounded-lg">
              <p className="text-xs text-muted-foreground text-center">
                <strong>Demo:</strong> Use any email and password (min 6 chars)
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default LoginForm;