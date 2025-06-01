
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { apiService } from '@/services/api';
import {
  Target,
  Users,
  MessageSquare,
  HandshakeIcon,
  TrendingUp,
  ArrowRight,
  Plus
} from 'lucide-react';

const DashboardPage = () => {
  const navigate = useNavigate();

  const { data: campaigns } = useQuery({
    queryKey: ['campaigns'],
    queryFn: () => apiService.getCampaigns(),
  });

  const { data: deals } = useQuery({
    queryKey: ['deals'],
    queryFn: () => apiService.getDeals(),
  });

  const stats = [
    {
      title: 'Active Campaigns',
      value: campaigns?.campaigns?.length || 0,
      icon: Target,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Total Creators',
      value: '112',
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Deals Closed',
      value: deals?.deals?.length || 0,
      icon: HandshakeIcon,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

  const quickActions = [
    {
      title: 'Create Campaign',
      description: 'Start a new influencer marketing campaign',
      icon: Plus,
      action: () => navigate('/campaigns'),
      color: 'bg-blue-600'
    },
    {
      title: 'Find Creators',
      description: 'Discover and connect with influencers',
      icon: Users,
      action: () => navigate('/creators'),
      color: 'bg-green-600'
    },
    {
      title: 'View Reports',
      description: 'Analyze campaign performance',
      icon: TrendingUp,
      action: () => navigate('/reports'),
      color: 'bg-purple-600'
    }
  ];

  return (
    <Layout>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your campaigns.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Get started with common tasks</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {quickActions.map((action, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={action.action}
                  >
                    <div className="flex items-center">
                      <div className={`p-2 rounded-lg ${action.color} text-white mr-4`}>
                        <action.icon className="h-4 w-4" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{action.title}</h3>
                        <p className="text-sm text-gray-600">{action.description}</p>
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-400" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest campaign updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div className="flex items-center">
                    <div className="h-2 w-2 bg-green-500 rounded-full mr-3"></div>
                    <div>
                      <p className="text-sm font-medium">Campaign launched</p>
                      <p className="text-xs text-gray-500">Summer Season Sale 2025</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">2h ago</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div className="flex items-center">
                    <div className="h-2 w-2 bg-blue-500 rounded-full mr-3"></div>
                    <div>
                      <p className="text-sm font-medium">New creator response</p>
                      <p className="text-xs text-gray-500">@rachit_dani</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">5h ago</span>
                </div>
                <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div className="flex items-center">
                    <div className="h-2 w-2 bg-purple-500 rounded-full mr-3"></div>
                    <div>
                      <p className="text-sm font-medium">Deal finalized</p>
                      <p className="text-xs text-gray-500">Summer Fitness Promo</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">1d ago</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Campaigns */}
        <Card className="border-0 shadow-md">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Recent Campaigns</CardTitle>
              <CardDescription>Your latest influencer marketing campaigns</CardDescription>
            </div>
            <Button variant="outline" onClick={() => navigate('/campaigns')}>
              View All
            </Button>
          </CardHeader>
          <CardContent>
            {campaigns?.campaigns?.length > 0 ? (
              <div className="space-y-4">
                {campaigns.campaigns.slice(0, 3).map((campaign: any) => (
                  <div key={campaign.id} className="flex items-center justify-between p-4 rounded-lg border border-gray-200">
                    <div>
                      <h3 className="font-medium text-gray-900">{campaign.title}</h3>
                      <p className="text-sm text-gray-600">{campaign.audience}</p>
                      <p className="text-xs text-gray-500">Budget: {campaign.budget}</p>
                    </div>
                    <div className="text-right">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        Active
                      </span>
                      <p className="text-xs text-gray-500 mt-1">
                        {campaign.platforms?.join(', ') || 'All platforms'}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No campaigns yet</h3>
                <p className="text-gray-600 mb-4">Create your first campaign to get started</p>
                <Button onClick={() => navigate('/campaigns')}>
                  Create Campaign
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default DashboardPage;
