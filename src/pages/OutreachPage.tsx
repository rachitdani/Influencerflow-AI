
import { useState } from 'react';
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiService } from '@/services/api';
import { useToast } from '@/hooks/use-toast';
import { 
  MessageSquare, 
  Send, 
  Volume2, 
  Copy, 
  Eye, 
  Sparkles,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

const OutreachPage = () => {
  const [selectedCampaign, setSelectedCampaign] = useState('');
  const [selectedCreator, setSelectedCreator] = useState('');
  const [generatedOutreach, setGeneratedOutreach] = useState<any>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: campaignsData } = useQuery({
    queryKey: ['campaigns'],
    queryFn: () => apiService.getCampaigns(),
  });

  const { data: creatorsData } = useQuery({
    queryKey: ['creators'],
    queryFn: () => apiService.getCreators(),
  });

  const { data: outreachData } = useQuery({
    queryKey: ['outreach', selectedCampaign],
    queryFn: () => selectedCampaign ? apiService.getCampaignOutreach(selectedCampaign) : null,
    enabled: !!selectedCampaign,
  });

  const generateOutreachMutation = useMutation({
    mutationFn: ({ campaignId, creatorId }: { campaignId: string, creatorId: string }) =>
      apiService.generateOutreach(campaignId, creatorId),
    onSuccess: (data) => {
      setGeneratedOutreach(data);
      queryClient.invalidateQueries({ queryKey: ['outreach'] });
      toast({
        title: "Outreach generated successfully!",
        description: "Your personalized email and voice message are ready.",
      });
    },
    onError: () => {
      toast({
        title: "Failed to generate outreach",
        description: "Please try again later.",
        variant: "destructive",
      });
    },
  });

  const handleGenerateOutreach = () => {
    if (!selectedCampaign || !selectedCreator) {
      toast({
        title: "Missing selection",
        description: "Please select both a campaign and creator.",
        variant: "destructive",
      });
      return;
    }

    generateOutreachMutation.mutate({
      campaignId: selectedCampaign,
      creatorId: selectedCreator
    });
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Email content has been copied to your clipboard.",
    });
  };

  const selectedCampaignData = campaignsData?.campaigns?.find(
    (c: any) => c.id === selectedCampaign
  );

  const selectedCreatorData = creatorsData?.find(
    (c: any) => c.id === selectedCreator
  );

  return (
    <Layout>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Outreach Management</h1>
          <p className="text-gray-600">Generate and manage AI-powered outreach to influencers</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Generation Panel */}
          <div className="lg:col-span-1">
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Sparkles className="mr-2 h-5 w-5 text-purple-600" />
                  Generate Outreach
                </CardTitle>
                <CardDescription>
                  Create personalized emails and voice messages
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Campaign</label>
                  <Select value={selectedCampaign} onValueChange={setSelectedCampaign}>
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

                <div>
                  <label className="text-sm font-medium mb-2 block">Creator</label>
                  <Select value={selectedCreator} onValueChange={setSelectedCreator}>
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

                {selectedCampaignData && selectedCreatorData && (
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-medium text-blue-900 mb-2">Preview</h4>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-blue-700">Campaign:</span> {selectedCampaignData.title}
                      </div>
                      <div>
                        <span className="text-blue-700">Creator:</span> {selectedCreatorData.name}
                      </div>
                      <div>
                        <span className="text-blue-700">Platform:</span> {selectedCreatorData.platform}
                      </div>
                      <div>
                        <span className="text-blue-700">Followers:</span> {selectedCreatorData.followers}
                      </div>
                    </div>
                  </div>
                )}

                <Button 
                  onClick={handleGenerateOutreach}
                  disabled={!selectedCampaign || !selectedCreator || generateOutreachMutation.isPending}
                  className="w-full"
                >
                  {generateOutreachMutation.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Generate Outreach
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Recent Outreach */}
            <Card className="border-0 shadow-md mt-6">
              <CardHeader>
                <CardTitle>Recent Outreach</CardTitle>
                <CardDescription>Your latest outreach messages</CardDescription>
              </CardHeader>
              <CardContent>
                {outreachData?.outreach?.length > 0 ? (
                  <div className="space-y-3">
                    {outreachData.outreach.slice(0, 5).map((outreach: any) => (
                      <div key={outreach.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="text-sm font-medium">Campaign #{outreach.campaign_id.slice(-6)}</span>
                            <Badge variant="outline" className="text-xs">Sent</Badge>
                          </div>
                          <p className="text-xs text-gray-500">
                            {new Date(outreach.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <Button variant="ghost" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">No outreach generated yet</p>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Generated Content */}
          <div className="lg:col-span-2">
            {generatedOutreach ? (
              <div className="space-y-6">
                {/* Email Content */}
                <Card className="border-0 shadow-md">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <div className="flex items-center">
                        <MessageSquare className="mr-2 h-5 w-5 text-blue-600" />
                        Email Content
                      </div>
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => copyToClipboard(generatedOutreach.email_content)}
                      >
                        <Copy className="mr-2 h-4 w-4" />
                        Copy
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <pre className="whitespace-pre-wrap text-sm font-mono">
                        {generatedOutreach.email_content}
                      </pre>
                    </div>
                  </CardContent>
                </Card>

                {/* Voice Message */}
                <Card className="border-0 shadow-md">
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Volume2 className="mr-2 h-5 w-5 text-green-600" />
                      Voice Message
                    </CardTitle>
                    <CardDescription>
                      AI-generated voice message for personal touch
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-center p-8 bg-green-50 rounded-lg">
                      <div className="text-center">
                        <Volume2 className="h-12 w-12 text-green-600 mx-auto mb-4" />
                        <p className="text-green-700 font-medium mb-4">Voice message generated</p>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm">
                            <Volume2 className="mr-2 h-4 w-4" />
                            Play
                          </Button>
                          <Button variant="outline" size="sm">
                            Download
                          </Button>
                        </div>
                        <p className="text-xs text-green-600 mt-2">
                          Audio URL: {generatedOutreach.audio_url}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Actions */}
                <Card className="border-0 shadow-md">
                  <CardHeader>
                    <CardTitle>Next Steps</CardTitle>
                    <CardDescription>
                      Send your outreach and track responses
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-4">
                      <Button>
                        <Send className="mr-2 h-4 w-4" />
                        Send Email
                      </Button>
                      <Button variant="outline">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Schedule Follow-up
                      </Button>
                      <Button variant="outline">
                        <Eye className="mr-2 h-4 w-4" />
                        Preview in Email Client
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ) : (
              <Card className="border-0 shadow-md">
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <MessageSquare className="h-16 w-16 text-gray-400 mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Generate Your First Outreach</h3>
                  <p className="text-gray-600 mb-6 text-center max-w-md">
                    Select a campaign and creator to generate personalized outreach content with AI.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-lg">
                    <div className="text-center p-4 bg-blue-50 rounded-lg">
                      <MessageSquare className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                      <p className="text-sm font-medium text-blue-900">Personalized Emails</p>
                    </div>
                    <div className="text-center p-4 bg-green-50 rounded-lg">
                      <Volume2 className="h-8 w-8 text-green-600 mx-auto mb-2" />
                      <p className="text-sm font-medium text-green-900">Voice Messages</p>
                    </div>
                    <div className="text-center p-4 bg-purple-50 rounded-lg">
                      <Sparkles className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                      <p className="text-sm font-medium text-purple-900">AI-Powered</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default OutreachPage;
