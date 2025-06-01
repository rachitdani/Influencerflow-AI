
import { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { 
  HandshakeIcon, 
  Plus, 
  FileText, 
  Download, 
  DollarSign, 
  Calendar, 
  Package,
  CheckCircle,
  Clock,
  IndianRupee
} from 'lucide-react';

const DealsPage = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    campaign_id: '',
    creator_id: '',
    final_rate: '',
    deliverables: '',
    platform: '',
    timeline: ''
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: dealsData, isLoading } = useQuery({
    queryKey: ['deals'],
    queryFn: () => apiService.getDeals(),
  });

  const { data: campaignsData } = useQuery({
    queryKey: ['campaigns'],
    queryFn: () => apiService.getCampaigns(),
  });

  const { data: creatorsData } = useQuery({
    queryKey: ['creators'],
    queryFn: () => apiService.getCreators(),
  });

  const createDealMutation = useMutation({
    mutationFn: (dealData: any) => apiService.createDeal(dealData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['deals'] });
      setIsCreateDialogOpen(false);
      setFormData({
        campaign_id: '',
        creator_id: '',
        final_rate: '',
        deliverables: '',
        platform: '',
        timeline: ''
      });
      toast({
        title: "Deal created successfully!",
        description: "Your deal has been finalized and is ready for contract generation.",
      });
    },
    onError: () => {
      toast({
        title: "Error creating deal",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const generateContractMutation = useMutation({
    mutationFn: (dealId: string) => apiService.generateContract(dealId),
    onSuccess: (data) => {
      toast({
        title: "Contract generated successfully!",
        description: "Your contract is ready for download.",
      });
      // Auto-download the contract
      window.open(data.pdf_url, '_blank');
    },
    onError: () => {
      toast({
        title: "Error generating contract",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createDealMutation.mutate(formData);
  };

  const handleGenerateContract = (dealId: string) => {
    generateContractMutation.mutate(dealId);
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'finalized':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-blue-100 text-blue-800';
    }
  };

  return (
    <Layout>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Deals & Contracts</h1>
            <p className="text-gray-600">Manage finalized deals and generate contracts</p>
          </div>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                New Deal
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Finalize Deal</DialogTitle>
                <DialogDescription>
                  Create a new deal with finalized terms and conditions
                </DialogDescription>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="campaign">Campaign</Label>
                    <Select 
                      value={formData.campaign_id} 
                      onValueChange={(value) => setFormData({ ...formData, campaign_id: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select campaign" />
                      </SelectTrigger>
                      <SelectContent>
                        {campaignsData?.campaigns?.map((campaign: any) => (
                          <SelectItem key={campaign.id} value={campaign.id}>
                            {campaign.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="creator">Creator</Label>
                    <Select 
                      value={formData.creator_id} 
                      onValueChange={(value) => setFormData({ ...formData, creator_id: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select creator" />
                      </SelectTrigger>
                      <SelectContent>
                        {creatorsData?.map((creator: any) => (
                          <SelectItem key={creator.id} value={creator.id}>
                            {creator.name} (@{creator.handle})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="rate">Final Rate (INR)</Label>
                    <Input
                      id="rate"
                      value={formData.final_rate}
                      onChange={(e) => setFormData({ ...formData, final_rate: e.target.value })}
                      placeholder="₹25,000"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="platform">Platform</Label>
                    <Select 
                      value={formData.platform} 
                      onValueChange={(value) => setFormData({ ...formData, platform: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select platform" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Instagram">Instagram</SelectItem>
                        <SelectItem value="TikTok">TikTok</SelectItem>
                        <SelectItem value="YouTube">YouTube</SelectItem>
                        <SelectItem value="Twitter">Twitter</SelectItem>
                        <SelectItem value="LinkedIn">LinkedIn</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="deliverables">Deliverables</Label>
                  <Textarea
                    id="deliverables"
                    value={formData.deliverables}
                    onChange={(e) => setFormData({ ...formData, deliverables: e.target.value })}
                    placeholder="1 main post, 3 story posts, 1 reel with 2 rounds of revisions"
                    rows={3}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timeline">Timeline</Label>
                  <Input
                    id="timeline"
                    value={formData.timeline}
                    onChange={(e) => setFormData({ ...formData, timeline: e.target.value })}
                    placeholder="Content delivery within 2 weeks"
                    required
                  />
                </div>

                <DialogFooter>
                  <Button 
                    type="submit" 
                    disabled={createDealMutation.isPending}
                    className="w-full md:w-auto"
                  >
                    {createDealMutation.isPending ? 'Creating...' : 'Finalize Deal'}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Deals</p>
                  <p className="text-3xl font-bold text-gray-900">{dealsData?.deals?.length || 0}</p>
                </div>
                <HandshakeIcon className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Value</p>
                  <p className="text-3xl font-bold text-gray-900">₹2.5L</p>
                </div>
                <IndianRupee className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Active Deals</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {dealsData?.deals?.filter((deal: any) => deal.status === 'finalized').length || 0}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Pending</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {dealsData?.deals?.filter((deal: any) => deal.status === 'pending').length || 0}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Deals List */}
        {isLoading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <Card key={i} className="border-0 shadow-md">
                <CardContent className="p-6">
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                    <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : dealsData?.deals?.length > 0 ? (
          <div className="space-y-6">
            {dealsData.deals.map((deal: any) => (
              <Card key={deal.id} className="border-0 shadow-md hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl mb-2">Deal #{deal.id.slice(-6)}</CardTitle>
                      <CardDescription>
                        Created on {new Date(deal.created_at).toLocaleDateString()}
                      </CardDescription>
                    </div>
                    <Badge className={getStatusColor(deal.status)}>
                      {deal.status}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    <div className="flex items-center">
                      <IndianRupee className="h-5 w-5 text-green-600 mr-2" />
                      <div>
                        <p className="text-sm text-gray-600">Rate</p>
                        <p className="font-semibold">{deal.rate}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Package className="h-5 w-5 text-blue-600 mr-2" />
                      <div>
                        <p className="text-sm text-gray-600">Platform</p>
                        <p className="font-semibold">{deal.platform}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-5 w-5 text-purple-600 mr-2" />
                      <div>
                        <p className="text-sm text-gray-600">Timeline</p>
                        <p className="font-semibold">{deal.timeline}</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <HandshakeIcon className="h-5 w-5 text-orange-600 mr-2" />
                      <div>
                        <p className="text-sm text-gray-600">Campaign</p>
                        <p className="font-semibold">#{deal.campaign_id.slice(-6)}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-2">Deliverables</h4>
                    <p className="text-gray-600 bg-gray-50 p-3 rounded-lg">{deal.deliverables}</p>
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Button
                      onClick={() => handleGenerateContract(deal.id)}
                      disabled={generateContractMutation.isPending}
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      {generateContractMutation.isPending ? 'Generating...' : 'Generate Contract'}
                    </Button>
                    <Button variant="outline">
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                    <Button variant="outline">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-0 shadow-md">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <HandshakeIcon className="h-16 w-16 text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No deals yet</h3>
              <p className="text-gray-600 mb-6 text-center max-w-md">
                Create your first deal to start managing contracts and finalizing collaborations with creators.
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Deal
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
};

export default DealsPage;
