import React, { useEffect, useRef, useState } from 'react';
import { useApp } from '@/contexts/AppContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Camera, ShieldCheck, Award, UserCog } from 'lucide-react';

const Profile: React.FC = () => {
  const { user } = useApp();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const isAdmin = user?.role === 'admin';
  const [adminCounts, setAdminCounts] = useState({ open: 0, inProgress: 0, resolved30d: 0 });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // For now we just show a client-side update UX. Integrate API later.
    localStorage.setItem('sheharfix-user', JSON.stringify({ ...user, name, email, avatar }));
    // A small visual feedback can be added via toast libs already included
    // but we keep it simple
    alert('Profile saved locally. Backend integration coming soon.');
  };

  const pickAvatarFile = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarFile: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const form = new FormData();
      form.append('avatar', file);
      const res = await fetch('/api/uploads/avatar', {
        method: 'POST',
        body: form,
      });
      if (!res.ok) throw new Error('Upload failed');
      const data = await res.json();
      if (data?.url) {
        setAvatar(data.url);
      }
    } catch (err) {
      alert('Failed to upload avatar. Please try again.');
    } finally {
      setUploading(false);
      // reset input so selecting the same file again triggers change
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="flex items-center gap-4 animate-in fade-in slide-in-from-top-2 duration-500">
          <Avatar className="w-16 h-16">
            <AvatarImage src={avatar || user?.avatar} alt={user?.name} />
            <AvatarFallback>{user?.name?.charAt(0).toUpperCase()}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">{user?.name}</h1>
            <p className="text-sm text-muted-foreground capitalize">{user?.role}</p>
            {user?.role === 'citizen' && (
              <div className="mt-2 flex items-center gap-2">
                <Badge variant="secondary">Level {user?.level}</Badge>
                <Badge variant="outline">{user?.points} pts</Badge>
              </div>
            )}
          </div>
        </div>

        <Tabs defaultValue="details" className="w-full animate-in fade-in slide-in-from-bottom-2 duration-500">
          <TabsList>
            <TabsTrigger value="details">Profile</TabsTrigger>
            <TabsTrigger value="security">Security</TabsTrigger>
            {isAdmin ? (
              <TabsTrigger value="admin">Admin</TabsTrigger>
            ) : (
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
            )}
          </TabsList>

          <TabsContent value="details" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><UserCog className="w-5 h-5 text-primary" /> Profile details</CardTitle>
                <CardDescription>Manage your personal information</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full name</Label>
                    <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="avatar">Avatar URL</Label>
                    <div className="flex gap-3">
                      <Input id="avatar" value={avatar} onChange={(e) => setAvatar(e.target.value)} placeholder="https://..." />
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarFile}
                      />
                      <Button type="button" variant="secondary" onClick={pickAvatarFile} disabled={uploading}>
                        <Camera className="w-4 h-4 mr-2" />{uploading ? 'Uploading...' : 'Upload'}
                      </Button>
                    </div>
                    <p className="text-xs text-muted-foreground">Choose a file to upload, or paste an image URL directly.</p>
                  </div>
                  <div className="md:col-span-2 flex justify-end">
                    <Button type="submit">Save changes</Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2"><ShieldCheck className="w-5 h-5 text-primary" /> Security</CardTitle>
                <CardDescription>Update your password and session preferences</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="current">Current password</Label>
                    <Input id="current" type="password" placeholder="••••••••" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new">New password</Label>
                    <Input id="new" type="password" placeholder="••••••••" />
                  </div>
                </div>
                <div className="flex justify-end mt-6">
                  <Button type="button" variant="default">Update password</Button>
                </div>
                <Separator className="my-6" />
                <div className="text-sm text-muted-foreground">Multi-factor authentication and sessions management coming soon.</div>
              </CardContent>
            </Card>
          </TabsContent>

          {!isAdmin && (
            <TabsContent value="achievements">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Award className="w-5 h-5 text-primary" /> Achievements</CardTitle>
                  <CardDescription>Your badges and milestones</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {(user?.badges || []).map((b) => (
                      <Badge key={b} variant="secondary" className="animate-in zoom-in duration-500">{b}</Badge>
                    ))}
                    {(!user?.badges || user.badges.length === 0) && (
                      <p className="text-sm text-muted-foreground">Earn badges by reporting and helping resolve issues.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {isAdmin && (
            <TabsContent value="admin">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><UserCog className="w-5 h-5 text-primary" /> Admin overview</CardTitle>
                  <CardDescription>Quick glance at administrative stats</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="p-4 animate-in fade-in duration-500">
                      <div className="text-sm text-muted-foreground">Open issues</div>
                      <div className="text-2xl font-semibold">{adminCounts.open}</div>
                    </Card>
                    <Card className="p-4 animate-in fade-in delay-100 duration-500">
                      <div className="text-sm text-muted-foreground">In progress</div>
                      <div className="text-2xl font-semibold">{adminCounts.inProgress}</div>
                    </Card>
                    <Card className="p-4 animate-in fade-in delay-200 duration-500">
                      <div className="text-sm text-muted-foreground">Resolved (30d)</div>
                      <div className="text-2xl font-semibold">{adminCounts.resolved30d}</div>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
