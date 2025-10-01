import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Building2, Droplets, Trash2, Lightbulb, Waves, TreePine, AlertTriangle, Volume2 } from 'lucide-react';
import { DepartmentCategory, useApp } from '@/contexts/AppContext';
import logo from '@/assets/sheharfix-logo.png';

const DepartmentSelection = () => {
  const { user, setUser } = useApp();

  const departments = [
    {
      value: 'potholes' as DepartmentCategory,
      label: 'Road & Potholes',
      description: 'Handle road maintenance and pothole repairs',
      icon: AlertTriangle,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      value: 'garbage' as DepartmentCategory,
      label: 'Garbage & Sanitation',
      description: 'Manage waste and cleanliness issues',
      icon: Trash2,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      value: 'street lights' as DepartmentCategory,
      label: 'Street Lights',
      description: 'Address street lighting problems',
      icon: Lightbulb,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
    },
    {
      value: 'drainage' as DepartmentCategory,
      label: 'Drainage & Sewage',
      description: 'Handle drainage and waterlogging',
      icon: Waves,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      value: 'water supply' as DepartmentCategory,
      label: 'Water Supply',
      description: 'Manage water supply issues',
      icon: Droplets,
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-50',
    },
    {
      value: 'park maintenance' as DepartmentCategory,
      label: 'Parks & Recreation',
      description: 'Maintain parks and public spaces',
      icon: TreePine,
      color: 'text-emerald-600',
      bgColor: 'bg-emerald-50',
    },
    {
      value: 'traffic signals' as DepartmentCategory,
      label: 'Traffic Management',
      description: 'Handle traffic signals and road safety',
      icon: AlertTriangle,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
    },
    {
      value: 'noise pollution' as DepartmentCategory,
      label: 'Noise & Pollution Control',
      description: 'Address noise and pollution complaints',
      icon: Volume2,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  const handleDepartmentSelect = (department: DepartmentCategory) => {
    if (user) {
      setUser({
        ...user,
        departmentCategory: department,
      });
      window.location.href = '/department-dashboard';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-secondary/20 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <img src={logo} alt="SheharFix" className="w-12 h-12" />
            <div>
              <h1 className="text-3xl font-bold text-gradient">SheharFix</h1>
              <p className="text-sm text-muted-foreground">Select Your Department</p>
            </div>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Choose the department you belong to. You'll manage and resolve issues specific to your department.
          </p>
        </div>

        {/* Department Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {departments.map((dept) => {
            const Icon = dept.icon;
            return (
              <Card
                key={dept.value}
                className="card-gradient hover:shadow-lg transition-all duration-300 cursor-pointer group"
                onClick={() => handleDepartmentSelect(dept.value)}
              >
                <CardContent className="p-6">
                  <div className={`w-12 h-12 ${dept.bgColor} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-6 h-6 ${dept.color}`} />
                  </div>
                  <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">
                    {dept.label}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {dept.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            Need help? Contact your administrator
          </p>
        </div>
      </div>
    </div>
  );
};

export default DepartmentSelection;
