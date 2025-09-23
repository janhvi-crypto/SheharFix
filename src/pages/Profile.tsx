import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Award, Trash2, Edit, Save, X, Shield, Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import Layout from '@/components/Layout';
import LoadingScreen from '@/components/LoadingScreen';
import { useApp, useTranslation } from '@/contexts/AppContext';
import toast from 'react-hot-toast';

const Profile: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { user, logout } = useApp();
  const { t } = useTranslation();

  // Mock user stats for display
  const userStats = {
    issuesReported: 15,
    issuesResolved: user?.role === 'admin' ? 127 : 12,
    totalPoints: user?.points || 850,
    currentLevel: user?.level || 5,
    joinDate: 'March 2024',
    location: 'Mumbai, Maharashtra',
    bio: user?.role === 'admin' 
      ? 'Municipal Administrator focused on making our city better through efficient issue resolution.'
      : 'Active citizen committed to improving our community by reporting and tracking civic issues.',
  };

  const [editData, setEditData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '+91 98765 43210',
    location: userStats.location,
    bio: userStats.bio,
  });

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success('Profile updated successfully!');
    setIsEditing(false);
    setIsSaving(false);
  };

  const handleDeleteAccount = async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success('Account deleted successfully');
    logout();
    
    // Redirect to role selection page
    window.location.href = '/';
  };

  const handleInputChange = (field: string, value: string) => {
    setEditData(prev => ({ ...prev, [field]: value }));
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Layout searchPlaceholder="Search your activity, reports, or settings...">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="space-y-8">
          {/* Profile Header */}
          <Card className="card-gradient">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <Avatar className="w-20 h-20">
                      <AvatarImage src={user?.avatar} alt={user?.name} />
                      <AvatarFallback className="text-2xl">
                        {user?.name?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <Button
                        size="icon"
                        variant="secondary"
                        className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full"
                      >
                        <Camera className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    {isEditing ? (
                      <Input
                        value={editData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="text-2xl font-bold h-auto py-1"
                      />
                    ) : (
                      <h1 className="text-2xl font-bold">{user?.name}</h1>
                    )}
                    
                    <div className="flex items-center space-x-2">
                      {user?.role === 'admin' ? (
                        <Shield className="w-4 h-4 text-admin" />
                      ) : (
                        <User className="w-4 h-4 text-citizen" />
                      )}
                      <Badge 
                        variant="secondary"
                        className={user?.role === 'admin' ? 'bg-admin/10 text-admin' : 'bg-citizen/10 text-citizen'}
                      >
                        {user?.role === 'admin' ? 'Administrator' : 'Citizen'}
                      </Badge>
                      {user?.role === 'citizen' && (
                        <Badge variant="outline">Level {userStats.currentLevel}</Badge>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {isEditing ? (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsEditing(false)}
                        disabled={isSaving}
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleSave}
                        disabled={isSaving}
                        className="btn-citizen"
                      >
                        {isSaving ? (
                          <div className="loading-dots mr-2">
                            <div style={{ '--i': 0 } as any}></div>
                            <div style={{ '--i': 1 } as any}></div>
                            <div style={{ '--i': 2 } as any}></div>
                          </div>
                        ) : (
                          <Save className="w-4 h-4 mr-2" />
                        )}
                        Save Changes
                      </Button>
                    </>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Personal Information */}
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>
                    Manage your account details and preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      {isEditing ? (
                        <Input
                          id="email"
                          type="email"
                          value={editData.email}
                          onChange={(e) => handleInputChange('email', e.target.value)}
                        />
                      ) : (
                        <div className="flex items-center space-x-2 p-2">
                          <Mail className="w-4 h-4 text-muted-foreground" />
                          <span>{editData.email}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      {isEditing ? (
                        <Input
                          id="phone"
                          type="tel"
                          value={editData.phone}
                          onChange={(e) => handleInputChange('phone', e.target.value)}
                        />
                      ) : (
                        <div className="flex items-center space-x-2 p-2">
                          <Phone className="w-4 h-4 text-muted-foreground" />
                          <span>{editData.phone}</span>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    {isEditing ? (
                      <Input
                        id="location"
                        value={editData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                      />
                    ) : (
                      <div className="flex items-center space-x-2 p-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span>{editData.location}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    {isEditing ? (
                      <Textarea
                        id="bio"
                        value={editData.bio}
                        onChange={(e) => handleInputChange('bio', e.target.value)}
                        rows={3}
                      />
                    ) : (
                      <p className="p-2 text-sm text-muted-foreground">
                        {editData.bio}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center space-x-2 p-2">
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      Member since {userStats.joinDate}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* Danger Zone */}
              <Card className="border-destructive/20">
                <CardHeader>
                  <CardTitle className="text-destructive">Danger Zone</CardTitle>
                  <CardDescription>
                    Irreversible and destructive actions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button variant="destructive" size="sm">
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete Account
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action cannot be undone. This will permanently delete your
                          account and remove all your data from our servers, including:
                          <ul className="list-disc list-inside mt-2 space-y-1">
                            <li>All reported issues and their history</li>
                            <li>Your profile information and settings</li>
                            <li>Points, badges, and achievements</li>
                            <li>All associated media and files</li>
                          </ul>
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDeleteAccount}
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                          Yes, delete my account
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardContent>
              </Card>
            </div>

            {/* Stats and Activity */}
            <div className="space-y-6">
              {/* Activity Stats */}
              <Card>
                <CardHeader>
                  <CardTitle>Activity Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Issues Reported</span>
                    <Badge variant="secondary">{userStats.issuesReported}</Badge>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">
                      {user?.role === 'admin' ? 'Issues Resolved' : 'Issues Resolved'}
                    </span>
                    <Badge variant="secondary">{userStats.issuesResolved}</Badge>
                  </div>

                  {user?.role === 'citizen' && (
                    <>
                      <Separator />
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Total Points</span>
                        <Badge className="bg-primary text-primary-foreground">
                          {userStats.totalPoints}
                        </Badge>
                      </div>

                      <Separator />
                      
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Current Level</span>
                        <Badge variant="outline">Level {userStats.currentLevel}</Badge>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>

              {/* Achievements (for citizens) */}
              {user?.role === 'citizen' && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Award className="w-5 h-5" />
                      <span>Achievements</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center p-3 rounded-lg bg-accent/20">
                        <div className="text-2xl mb-1">🏆</div>
                        <div className="text-xs text-muted-foreground">First Report</div>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-accent/20">
                        <div className="text-2xl mb-1">⭐</div>
                        <div className="text-xs text-muted-foreground">5 Star Reporter</div>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-accent/20">
                        <div className="text-2xl mb-1">🎯</div>
                        <div className="text-xs text-muted-foreground">10 Reports</div>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-accent/20">
                        <div className="text-2xl mb-1">🌟</div>
                        <div className="text-xs text-muted-foreground">Community Hero</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
