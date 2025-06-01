
import { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { 
  Plus, 
  Target, 
  Edit, 
  Trash2, 
  Sparkles,
  Calendar,
  IndianRupee,
  Users as UsersIcon
} from 'lucide-react';

const CampaignsPage = () => {
  const { data: creatorsData } = useQuery({
    queryKey: ['creators'],
    queryFn: () => apiService.getCreators(),
  });
  
  const [searchQuery, setSearchQuery] = useState(`{
    "query": "beauty influencers in Bangalore with high engagement",
    "campaign_id": "5a1f1134-b97e-4a83-b9aa-8b23f64113c6"
  }`);
  const [selectedCampaign, setSelectedCampaign] = useState('');

  const aiSearchMutation = useMutation({
    mutationFn: ({ query, campaignId }: { query: string, campaignId: string }) =>
      apiService.searchCreators(query, campaignId),
    onSuccess: (data) => {
      toast({
        title: "AI Search Complete!",
        description: `Found ${data.results?.length || 0} matching creators with AI insights.`,
      });
    },
  });

  const handleAISearch = ({query, campaignId}: {query?: string, campaignId?: string}) => {
    if (!searchQuery.trim()) {
      toast({
        title: "Search query required",
        description: "Please enter a search query to find creators.",
        variant: "destructive",
      });
      return;
    }
    
    if (!selectedCampaign) {
      toast({
        title: "Campaign selection required",
        description: "Please select a campaign for AI-powered matching.",
        variant: "destructive",
      });
      return;
    }

    if (!query) {
      query = searchQuery;
    } 
    if (!campaignId) {
      campaignId = selectedCampaign;
    }

    aiSearchMutation.mutate({ query: searchQuery, campaignId: selectedCampaign });
  };
  
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    brief: '',
    platforms: [] as string[],
    audience: '',
    budget: ''
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: campaignsData, isLoading } = useQuery({
    queryKey: ['campaigns'],
    queryFn: () => apiService.getCampaigns(),
  });

  const createCampaignMutation = useMutation({
    mutationFn: (campaignData: any) => apiService.createCampaign(campaignData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      setIsCreateDialogOpen(false);
      setFormData({ title: '', brief: '', platforms: [], audience: '', budget: '' });
      toast({
        title: "Campaign created successfully!",
        description: "Your campaign is now ready for creator discovery.",
      });
    },
    onError: () => {
      toast({
        title: "Error creating campaign",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const enhanceBriefMutation = useMutation({
    mutationFn: (campaignId: string) => apiService.enhanceCampaignBrief(campaignId),
    onSuccess: (data, campaignId) => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      toast({
        title: "Brief enhanced with AI!",
        description: "Your campaign brief has been improved and optimized.",
      });
    },
  });

  const deleteCampaignMutation = useMutation({
    mutationFn: (campaignId: string) => apiService.deleteCampaign(campaignId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['campaigns'] });
      toast({
        title: "Campaign deleted",
        description: "The campaign has been removed from your account.",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createCampaignMutation.mutate(formData);
  };

  const handlePlatformChange = (platform: string) => {
    setFormData(prev => ({
      ...prev,
      platforms: prev.platforms.includes(platform)
        ? prev.platforms.filter(p => p !== platform)
        : [...prev.platforms, platform]
    }));
  };

  const platforms = ['Instagram', 'TikTok', 'YouTube', 'Twitter', 'LinkedIn'];

  return (
    <Layout>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Campaigns</h1>
            <p className="text-gray-600">Create and manage your influencer marketing campaigns</p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Campaign
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create New Campaign</DialogTitle>
                <DialogDescription>
                  Set up your influencer marketing campaign with AI-powered optimization
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Campaign Title</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Summer Collection 2024"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="budget">Budget (INR)</Label>
                    <Input
                      id="budget"
                      value={formData.budget}
                      onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                      placeholder="₹50,000"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="brief">Campaign Brief</Label>
                  <Textarea
                    id="brief"
                    value={formData.brief}
                    onChange={(e) => setFormData({ ...formData, brief: e.target.value })}
                    placeholder="Describe your campaign goals, messaging, and requirements..."
                    rows={4}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="audience">Target Audience</Label>
                  <Input
                    id="audience"
                    value={formData.audience}
                    onChange={(e) => setFormData({ ...formData, audience: e.target.value })}
                    placeholder="Young professionals aged 25-35 interested in fashion"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Platforms</Label>
                  <div className="flex flex-wrap gap-2">
                    {platforms.map((platform) => (
                      <Button
                        key={platform}
                        type="button"
                        variant={formData.platforms.includes(platform) ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePlatformChange(platform)}
                      >
                        {platform}
                      </Button>
                    ))}
                  </div>
                </div>

                <DialogFooter>
                  <Button 
                    type="submit" 
                    disabled={createCampaignMutation.isPending}
                    className="w-full md:w-auto"
                  >
                    {createCampaignMutation.isPending ? 'Creating...' : 'Create Campaign'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Campaigns Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : campaignsData?.campaigns?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {campaignsData.campaigns.map((campaign: any) => (
              <Card key={campaign.id} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-2">{campaign.title}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {campaign.enhanced_brief || campaign.brief}
                      </CardDescription>
                    </div>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => enhanceBriefMutation.mutate(campaign.id)}
                        disabled={enhanceBriefMutation.isPending}
                      >
                        <Sparkles className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteCampaignMutation.mutate(campaign.id)}
                      >
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <IndianRupee className="h-4 w-4 mr-2" />
                      {campaign.budget}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <UsersIcon className="h-4 w-4 mr-2" />
                      {campaign.audience}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      {new Date(campaign.created_at).toLocaleDateString()}
                    </div>
                    <div className="flex flex-wrap gap-1 mt-3">
                      {campaign.platforms?.map((platform: string) => (
                        <span
                          key={platform}
                          className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                        >
                          {platform}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <Button variant="outline" className="w-full" 
                    onClick={() => handleAISearch({campaignId: campaign.id})}
                    disabled={aiSearchMutation.isPending}
                    >
                      <Target className="mr-2 h-4 w-4" />
                      Find Creators
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-0 shadow-md">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <Target className="h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No campaigns yet</h3>
              <p className="text-gray-600 mb-6 text-center max-w-md">
                Create your first influencer marketing campaign to start connecting with creators and driving results.
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Campaign
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default CampaignsPage;
