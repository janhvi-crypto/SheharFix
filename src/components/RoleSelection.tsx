import React from 'react';
import { Globe, Sun, Moon, Users, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTheme } from 'next-themes';
import { useApp, useTranslation, Language } from '@/contexts/AppContext';
import logo from '@/assets/sheharfix-logo.png';

interface RoleSelectionProps {
  onContinue: (role: 'citizen' | 'admin') => void;
}

const RoleSelection: React.FC<RoleSelectionProps> = ({ onContinue }) => {
  const { theme, setTheme } = useTheme();
  const { language, setLanguage } = useApp();
  const { t } = useTranslation();

  const languageOptions = [
    { value: 'en', label: 'English' },
    { value: 'hi', label: 'हिन्दी' },
    { value: 'mr', label: 'मराठी' }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header with controls */}
      <div className="flex justify-center items-center p-4 space-x-4">
        {/* Language Selector */}
        <div className="flex items-center space-x-2">
          <Globe className="w-4 h-4 text-muted-foreground" />
          <Select
            value={language}
            onValueChange={(value: Language) => setLanguage(value)}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {languageOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Theme Toggle */}
        <Button
          variant="outline"
          size="icon"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </Button>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center space-x-3 mb-4">
              <img src={logo} alt="SheharFix" className="w-12 h-12" />
              <div>
                <h1 className="text-4xl font-bold text-foreground">SheharFix</h1>
                <p className="text-lg text-muted-foreground">{t('findItFlagItFixIt')}</p>
              </div>
            </div>
            <h2 className="text-2xl font-semibold text-foreground mb-2">
              {t('chooseRole')}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Citizen Card */}
            <Card className="card-gradient hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardHeader className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-citizen rounded-2xl flex items-center justify-center">
                  <Users className="w-8 h-8 text-citizen-foreground" />
                </div>
                <CardTitle className="text-2xl">{t('citizen')}</CardTitle>
                <CardDescription className="text-base">
                  Report issues and track progress in your community
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-sm">
                    <div className="w-2 h-2 bg-citizen rounded-full"></div>
                    <span>{t('reportIssues')}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <div className="w-2 h-2 bg-citizen rounded-full"></div>
                    <span>{t('trackProgress')}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <div className="w-2 h-2 bg-citizen rounded-full"></div>
                    <span>{t('earnPoints')}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <div className="w-2 h-2 bg-citizen rounded-full"></div>
                    <span>{t('voiceReporting')}</span>
                  </div>
                </div>
                <Button 
                  className="w-full btn-citizen"
                  onClick={() => onContinue('citizen')}
                >
                  {t('continueAsCitizen')}
                </Button>
              </CardContent>
            </Card>

            {/* Administrator Card */}
            <Card className="card-gradient hover:shadow-lg transition-all duration-300 hover:scale-105">
              <CardHeader className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-admin rounded-2xl flex items-center justify-center">
                  <Shield className="w-8 h-8 text-admin-foreground" />
                </div>
                <CardTitle className="text-2xl">{t('administrator')}</CardTitle>
                <CardDescription className="text-base">
                  Manage and resolve civic issues efficiently
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 text-sm">
                    <div className="w-2 h-2 bg-admin rounded-full"></div>
                    <span>{t('manageIssues')}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <div className="w-2 h-2 bg-admin rounded-full"></div>
                    <span>{t('accessAnalytics')}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <div className="w-2 h-2 bg-admin rounded-full"></div>
                    <span>{t('uploadPhotos')}</span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <div className="w-2 h-2 bg-admin rounded-full"></div>
                    <span>{t('navigateLocations')}</span>
                  </div>
                </div>
                <Button 
                  className="w-full btn-admin"
                  onClick={() => onContinue('admin')}
                >
                  {t('continueAsAdmin')}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleSelection;