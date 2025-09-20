import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingScreen from '@/components/LoadingScreen';
import RoleSelection from '@/components/RoleSelection';
import LoginForm from '@/components/LoginForm';
import { useApp, UserRole } from '@/contexts/AppContext';

const Index = () => {
  const [currentStep, setCurrentStep] = useState<'loading' | 'role-selection' | 'login' | 'dashboard'>('loading');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const { user, isLoading } = useApp();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      if (user) {
        // User is already logged in, redirect to appropriate dashboard
        navigate(user.role === 'citizen' ? '/dashboard' : '/admin-dashboard');
      } else {
        setCurrentStep('role-selection');
      }
    }
  }, [user, isLoading, navigate]);

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setCurrentStep('login');
  };

  const handleLoginSuccess = () => {
    setCurrentStep('dashboard');
    // Navigation will be handled by the useEffect above
  };

  const handleBack = () => {
    setCurrentStep('role-selection');
    setSelectedRole(null);
  };

  if (isLoading || currentStep === 'loading') {
    return <LoadingScreen />;
  }

  if (currentStep === 'role-selection') {
    return <RoleSelection onContinue={handleRoleSelect} />;
  }

  if (currentStep === 'login' && selectedRole) {
    return (
      <LoginForm
        role={selectedRole}
        onBack={handleBack}
        onSuccess={handleLoginSuccess}
      />
    );
  }

  return <LoadingScreen />;
};

export default Index;
