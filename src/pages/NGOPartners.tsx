import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart, Search, MapPin, Users, Mail, Phone, ExternalLink, Filter } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Layout from '@/components/Layout';
import LoadingScreen from '@/components/LoadingScreen';

const NGOPartners = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 2000);
  }, []);

  const ngoPartners = [
    {
      id: 1,
      name: 'Green Earth Foundation',
      category: 'Environment',
      description: 'Dedicated to environmental conservation and sustainable development in urban areas',
      location: 'Koramangala, Bangalore',
      established: '2018',
      volunteers: 145,
      projects: 23,
      contact: {
        email: 'contact@greenearthfoundation.org',
        phone: '+91-80-4567-8901',
        website: 'www.greenearthfoundation.org'
      },
      focus: ['Tree Plantation', 'Waste Management', 'Water Conservation'],
      impact: 'Planted 5,000+ trees, cleaned 50+ parks',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=250&fit=crop'
    },
    {
      id: 2,
      name: 'Seva Sangh Welfare Society',
      category: 'Community Development',
      description: 'Empowering communities through education, healthcare, and skill development programs',
      location: 'Jayanagar, Bangalore',
      established: '2015',
      volunteers: 89,
      projects: 18,
      contact: {
        email: 'info@sevasangh.org',
        phone: '+91-80-3456-7890',
        website: 'www.sevasangh.org'
      },
      focus: ['Education', 'Healthcare', 'Women Empowerment'],
      impact: 'Educated 2,000+ children, conducted 100+ health camps',
      rating: 4.6,
      image: 'https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&h=250&fit=crop'
    },
    {
      id: 3,
      name: 'Urban Mobility Initiative',
      category: 'Transportation',
      description: 'Promoting sustainable transportation and improving urban mobility solutions',
      location: 'Indiranagar, Bangalore',
      established: '2020',
      volunteers: 67,
      projects: 12,
      contact: {
        email: 'hello@urbanmobility.org',
        phone: '+91-80-2345-6789',
        website: 'www.urbanmobility.org'
      },
      focus: ['Public Transport', 'Cycling Infrastructure', 'Traffic Management'],
      impact: 'Improved 25+ bus stops, created 15+ cycling lanes',
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=400&h=250&fit=crop'
    },
    {
      id: 4,
      name: 'Digital Literacy Foundation',
      category: 'Education',
      description: 'Bridging the digital divide through technology education and digital inclusion programs',
      location: 'BTM Layout, Bangalore',
      established: '2019',
      volunteers: 112,
      projects: 16,
      contact: {
        email: 'support@digitalliteracy.org',
        phone: '+91-80-1234-5678',
        website: 'www.digitalliteracy.org'
      },
      focus: ['Digital Skills', 'Computer Training', 'Internet Access'],
      impact: 'Trained 3,500+ people, set up 20+ computer centers',
      rating: 4.9,
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=400&h=250&fit=crop'
    },
    {
      id: 5,
      name: 'Health for All Initiative',
      category: 'Healthcare',
      description: 'Providing accessible healthcare services and health awareness programs in communities',
      location: 'HSR Layout, Bangalore',
      established: '2017',
      volunteers: 203,
      projects: 31,
      contact: {
        email: 'care@healthforall.org',
        phone: '+91-80-9876-5432',
        website: 'www.healthforall.org'
      },
      focus: ['Primary Healthcare', 'Mental Health', 'Health Awareness'],
      impact: 'Served 10,000+ patients, conducted 200+ awareness sessions',
      rating: 4.8,
      image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=250&fit=crop'
    },
    {
      id: 6,
      name: 'Women Empowerment Collective',
      category: 'Women Rights',
      description: 'Supporting women through skill development, entrepreneurship, and rights awareness',
      location: 'Whitefield, Bangalore',
      established: '2016',
      volunteers: 78,
      projects: 14,
      contact: {
        email: 'empower@wecollective.org',
        phone: '+91-80-8765-4321',
        website: 'www.wecollective.org'
      },
      focus: ['Skill Development', 'Entrepreneurship', 'Legal Aid'],
      impact: 'Empowered 1,500+ women, started 300+ micro-enterprises',
      rating: 4.7,
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=250&fit=crop'
    }
  ];

  const categories = ['all', 'Environment', 'Community Development', 'Transportation', 'Education', 'Healthcare', 'Women Rights'];

  const filteredNGOs = ngoPartners.filter(ngo => {
    const matchesSearch = ngo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ngo.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ngo.focus.some(f => f.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || ngo.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    const colors = {
      'Environment': 'bg-green-100 text-green-800 border-green-200',
      'Community Development': 'bg-blue-100 text-blue-800 border-blue-200',
      'Transportation': 'bg-purple-100 text-purple-800 border-purple-200',
      'Education': 'bg-orange-100 text-orange-800 border-orange-200',
      'Healthcare': 'bg-red-100 text-red-800 border-red-200',
      'Women Rights': 'bg-pink-100 text-pink-800 border-pink-200'
    };
    return colors[category] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  if (isLoading) {
    return <LoadingScreen />;
  }

  return (
    <Layout searchPlaceholder="Search NGO partners by name, category, or focus area...">
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col space-y-2">
          <div className="flex items-center space-x-2">
            <Heart className="w-6 h-6 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">NGO Partners</h1>
          </div>
          <p className="text-muted-foreground">
            Partnering with NGOs to create positive impact in our communities
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search NGOs by name, focus area, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Filter className="w-4 h-4 text-muted-foreground" />
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>
                    {category === 'all' ? 'All Categories' : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="card-gradient">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Heart className="w-5 h-5 text-red-600" />
                <div>
                  <p className="text-2xl font-bold">{ngoPartners.length}</p>
                  <p className="text-sm text-muted-foreground">Partner NGOs</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="card-gradient">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold">{ngoPartners.reduce((sum, ngo) => sum + ngo.volunteers, 0)}</p>
                  <p className="text-sm text-muted-foreground">Active Volunteers</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="card-gradient">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <ExternalLink className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-2xl font-bold">{ngoPartners.reduce((sum, ngo) => sum + ngo.projects, 0)}</p>
                  <p className="text-sm text-muted-foreground">Active Projects</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="card-gradient">
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold">{categories.length - 1}</p>
                  <p className="text-sm text-muted-foreground">Focus Areas</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* NGO Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNGOs.map((ngo) => (
            <Card key={ngo.id} className="card-gradient hover:shadow-lg transition-all duration-300">
              <div className="relative">
                <img 
                  src={ngo.image} 
                  alt={ngo.name}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
                <Badge 
                  variant="secondary" 
                  className={`absolute top-3 right-3 ${getCategoryColor(ngo.category)}`}
                >
                  {ngo.category}
                </Badge>
              </div>
              
              <CardContent className="p-4 space-y-3">
                <div>
                  <h3 className="font-bold text-lg">{ngo.name}</h3>
                  <p className="text-sm text-muted-foreground">{ngo.description}</p>
                </div>

                <div className="flex items-center text-sm text-muted-foreground space-x-4">
                  <div className="flex items-center space-x-1">
                    <MapPin className="w-3 h-3" />
                    <span>{ngo.location}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="w-3 h-3" />
                    <span>{ngo.volunteers} volunteers</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Focus Areas:</p>
                  <div className="flex flex-wrap gap-1">
                    {ngo.focus.map((area, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {area}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium">Impact:</p>
                  <p className="text-xs text-muted-foreground">{ngo.impact}</p>
                </div>

                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="text-sm">
                    <span className="text-yellow-500">⭐</span>
                    <span className="font-medium ml-1">{ngo.rating}</span>
                    <span className="text-muted-foreground ml-1">• Est. {ngo.established}</span>
                  </div>
                  <div className="flex space-x-1">
                    <Button variant="ghost" size="sm" className="text-xs p-2">
                      <Mail className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-xs p-2">
                      <Phone className="w-3 h-3" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-xs p-2">
                      <ExternalLink className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredNGOs.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No NGO partners found matching your criteria.</p>
            <Button 
              variant="outline" 
              onClick={() => {
                setSearchTerm('');
                setSelectedCategory('all');
              }}
              className="mt-2"
            >
              Clear Filters
            </Button>
          </div>
        )}

        {/* Partnership Information */}
        <Card className="card-gradient">
          <CardHeader>
            <CardTitle>Partner with SheharFix</CardTitle>
            <CardDescription>
              Are you an NGO working on civic issues? Join our network of partners to amplify your impact.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
              <div className="flex-1">
                <p className="text-sm">
                  We're always looking for passionate organizations to collaborate with. Together, we can make our cities better.
                </p>
              </div>
              <Button className="whitespace-nowrap" onClick={() => navigate('/partner/apply')}>
                <Heart className="w-4 h-4 mr-2" />
                Become a Partner
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default NGOPartners;
