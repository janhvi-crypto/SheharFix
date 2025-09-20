import React from 'react';
import { Trophy, Medal, Star, Crown, Shield, Zap } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Layout from '@/components/Layout';
import { useApp } from '@/contexts/AppContext';

const Leaderboard = () => {
  const { user } = useApp();

  const topCitizens = [
    {
      id: '1',
      name: 'Rajesh Kumar',
      level: 8,
      points: 2450,
      reports: 23,
      resolved: 18,
      badge: 'Clean City Champion',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=rajesh',
      rank: 1
    },
    {
      id: '2',
      name: 'Sunita Devi',
      level: 7,
      points: 2247,
      reports: 19,
      resolved: 15,
      badge: 'Community Hero',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sunita',
      rank: 2
    },
    {
      id: user?.id || '3',
      name: user?.name || 'Priya Sharma',
      level: user?.level || 5,
      points: user?.points || 1247,
      reports: 12,
      resolved: 8,
      badge: 'Rising Star',
      avatar: user?.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=priya',
      rank: 3
    },
    {
      id: '4',
      name: 'Amit Patel',
      level: 5,
      points: 1156,
      reports: 11,
      resolved: 7,
      badge: 'Civic Warrior',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=amit',
      rank: 4
    },
    {
      id: '5',
      name: 'Deepa Reddy',
      level: 4,
      points: 987,
      reports: 9,
      resolved: 6,
      badge: 'Problem Solver',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=deepa',
      rank: 5
    },
  ];

  const badges = [
    { name: 'Street Guardian', icon: Shield, color: 'text-blue-500', description: 'Reported 10+ road issues' },
    { name: 'Voice of Change', icon: Zap, color: 'text-yellow-500', description: 'Used voice reporting 5+ times' },
    { name: 'Clean City Champion', icon: Crown, color: 'text-purple-500', description: 'Top contributor this month' },
    { name: 'Community Hero', icon: Star, color: 'text-green-500', description: 'Helped resolve 15+ issues' },
    { name: 'Rising Star', icon: Medal, color: 'text-orange-500', description: 'Growing community impact' },
    { name: 'Civic Warrior', icon: Trophy, color: 'text-red-500', description: 'Consistent civic engagement' },
  ];

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-5 h-5 text-yellow-500" />;
      case 2:
        return <Medal className="w-5 h-5 text-gray-400" />;
      case 3:
        return <Trophy className="w-5 h-5 text-amber-600" />;
      default:
        return <span className="w-5 h-5 flex items-center justify-center text-sm font-bold">#{rank}</span>;
    }
  };

  const getRankColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600';
      case 2:
        return 'bg-gradient-to-r from-gray-300 to-gray-500';
      case 3:
        return 'bg-gradient-to-r from-amber-400 to-amber-600';
      default:
        return 'bg-gradient-to-r from-blue-400 to-blue-600';
    }
  };

  const currentUser = topCitizens.find(citizen => citizen.id === user?.id);

  return (
    <Layout searchPlaceholder="Search leaderboard...">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex justify-center items-center space-x-2">
            <Trophy className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Community Leaderboard</h1>
          </div>
          <p className="text-muted-foreground">
            Celebrating our most active community members and neighborhoods
          </p>
        </div>

        {/* Your Progress Card */}
        {currentUser && (
          <Card className="card-gradient border-2 border-primary/20">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-primary" />
                <CardTitle>Your Progress</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-primary">{currentUser.points}</div>
                  <div className="text-sm text-muted-foreground">Community Points</div>
                  <Progress value={(currentUser.points / 2000) * 100} className="mt-2 h-2" />
                  <div className="text-xs text-muted-foreground mt-1">753 to next level</div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold">{currentUser.reports}</div>
                  <div className="text-sm text-muted-foreground">Reports</div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-green-600">{currentUser.resolved}</div>
                  <div className="text-sm text-muted-foreground">Resolved</div>
                </div>
                
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">#{currentUser.rank}</div>
                  <div className="text-sm text-muted-foreground">Rank</div>
                </div>
              </div>
              
              <div className="mt-4 text-center">
                <Badge variant="secondary" className="badge-glow">
                  {currentUser.badge}
                </Badge>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Top Citizens */}
          <div className="lg:col-span-2">
            <Card className="card-gradient">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Trophy className="w-5 h-5 text-primary" />
                  <CardTitle>Top Citizens This Month</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {topCitizens.map((citizen, index) => (
                  <div 
                    key={citizen.id} 
                    className={`flex items-center space-x-4 p-4 rounded-lg border transition-all hover:shadow-md ${
                      citizen.id === user?.id ? 'bg-primary/5 border-primary/20' : 'bg-card'
                    }`}
                  >
                    {/* Rank */}
                    <div className={`leaderboard-rank ${
                      citizen.rank <= 3 ? `rank-${citizen.rank}` : 'bg-muted text-foreground'
                    }`}>
                      {citizen.rank <= 3 ? getRankIcon(citizen.rank) : `#${citizen.rank}`}
                    </div>

                    {/* Avatar */}
                    <Avatar className="w-12 h-12">
                      <AvatarImage src={citizen.avatar} alt={citizen.name} />
                      <AvatarFallback>
                        {citizen.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>

                    {/* Info */}
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold flex items-center space-x-2">
                            <span>{citizen.name}</span>
                            {citizen.id === user?.id && (
                              <Badge variant="outline" className="text-xs">You</Badge>
                            )}
                          </h3>
                          <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                            <span>Level {citizen.level}</span>
                            <span>•</span>
                            <span>{citizen.points} points</span>
                            <span>•</span>
                            <span>{citizen.reports} reports</span>
                            <span>•</span>
                            <span>{citizen.resolved} resolved</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="mt-2">
                        <Badge variant="secondary" className="text-xs">
                          {citizen.badge}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Achievement Badges */}
          <Card className="card-gradient">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Medal className="w-5 h-5 text-primary" />
                <span>Achievement Badges</span>
              </CardTitle>
              <CardDescription>
                Earn badges by contributing to your community
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {badges.map((badge, index) => {
                const IconComponent = badge.icon;
                const isEarned = user?.badges?.includes(badge.name);
                
                return (
                  <div 
                    key={index} 
                    className={`flex items-start space-x-3 p-3 rounded-lg border transition-all ${
                      isEarned 
                        ? 'bg-primary/5 border-primary/20 badge-glow' 
                        : 'bg-card border-border opacity-60'
                    }`}
                  >
                    <IconComponent className={`w-5 h-5 mt-0.5 ${
                      isEarned ? badge.color : 'text-muted-foreground'
                    }`} />
                    <div className="flex-1">
                      <h4 className={`font-medium text-sm ${
                        isEarned ? 'text-foreground' : 'text-muted-foreground'
                      }`}>
                        {badge.name}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        {badge.description}
                      </p>
                      {isEarned && (
                        <Badge variant="secondary" className="mt-2 text-xs">
                          Earned
                        </Badge>
                      )}
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>

        {/* Next Milestone */}
        <Card className="card-gradient">
          <CardHeader>
            <CardTitle>Next Milestone</CardTitle>
            <CardDescription>
              Keep contributing to unlock new achievements
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Crown className="w-5 h-5 text-yellow-500" />
                  <span className="font-medium">Master Guardian</span>
                </div>
                <span className="text-sm text-muted-foreground">2000 points needed</span>
              </div>
              
              <Progress value={((user?.points || 0) / 2000) * 100} className="h-3" />
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-sm text-muted-foreground">Current Level</div>
                  <div className="font-bold">{user?.level || 5}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Next Level</div>
                  <div className="font-bold">{(user?.level || 5) + 1}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Progress</div>
                  <div className="font-bold">{Math.round(((user?.points || 0) / 2000) * 100)}%</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Leaderboard;