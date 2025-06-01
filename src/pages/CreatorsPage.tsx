import { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useQuery } from '@tanstack/react-query';
import { apiService } from '@/services/api';
import { useToast } from '@/components/ui/use-toast';
import { 
  Users, 
  Search, 
  Instagram, 
  Youtube, 
  Twitter, 
  Linkedin,
  Filter,
  ArrowUpDown,
  MessageSquare,
  Handshake
} from 'lucide-react';

const CreatorsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [platformFilter, setPlatformFilter] = useState('');
  const [sortBy, setSortBy] = useState('followers');
  const { toast } = useToast();

  const { data: creators, isLoading } = useQuery({
    queryKey: ['creators'],
    queryFn: () => apiService.getCreators(),
  });

  const filteredCreators = creators?.filter((creator: any) => {
    const matchesSearch = creator.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         creator.handle.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlatform = !platformFilter || creator.platforms.includes(platformFilter);
    return matchesSearch && matchesPlatform;
  });

  const sortedCreators = filteredCreators?.sort((a: any, b: any) => {
    switch (sortBy) {
      case 'followers':
        return b.followers - a.followers;
      case 'engagement':
        return b.engagement_rate - a.engagement_rate;
      default:
        return 0;
    }
  });

  return (
    <Layout>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Creators</h1>
          <p className="text-gray-600">Discover and connect with influencers across platforms</p>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search creators..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={platformFilter} onValueChange={setPlatformFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Platform" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Platforms</SelectItem>
              <SelectItem value="instagram">Instagram</SelectItem>
              <SelectItem value="youtube">YouTube</SelectItem>
              <SelectItem value="twitter">Twitter</SelectItem>
              <SelectItem value="linkedin">LinkedIn</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="followers">Followers</SelectItem>
              <SelectItem value="engagement">Engagement Rate</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="w-[180px]">
            <Filter className="mr-2 h-4 w-4" />
            More Filters
          </Button>
        </div>

        {/* Creators Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedCreators?.map((creator: any) => (
            <Card key={creator.id} className="border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                      <Users className="h-6 w-6 text-gray-500" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{creator.name}</h3>
                      <p className="text-sm text-gray-500">@{creator.handle}</p>
                    </div>
                  </div>
                  <Badge variant={creator.available ? "success" : "secondary"}>
                    {creator.available ? "Available" : "Unavailable"}
                  </Badge>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-500">Followers</p>
                    <p className="text-lg font-semibold">{creator.followers.toLocaleString()}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-500">Engagement</p>
                    <p className="text-lg font-semibold">{creator.engagement_rate}%</p>
                  </div>
                </div>

                <div className="flex gap-2 mb-4">
                  {creator.platforms.map((platform: string) => {
                    const Icon = {
                      instagram: Instagram,
                      youtube: Youtube,
                      twitter: Twitter,
                      linkedin: Linkedin
                    }[platform.toLowerCase()];
                    return Icon ? (
                      <div key={platform} className="p-2 bg-gray-100 rounded-lg">
                        <Icon className="h-4 w-4 text-gray-600" />
                      </div>
                    ) : null;
                  })}
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" className="flex-1">
                    View Profile
                  </Button>
                  <Button className="flex-1">
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Contact
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {!isLoading && (!sortedCreators || sortedCreators.length === 0) && (
          <Card className="border-0 shadow-md">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Users className="h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No creators found</h3>
              <p className="text-gray-600 mb-6 text-center max-w-md">
                Try adjusting your search or filters to find the creators you're looking for.
              </p>
              <Button onClick={() => {
                setSearchQuery('');
                setPlatformFilter('');
              }}>
                Clear Filters
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default CreatorsPage;
