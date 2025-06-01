
import Layout from '@/components/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery } from '@tanstack/react-query';
import { apiService } from '@/services/api';
import { 
  BarChart3, 
  TrendingUp, 
  DollarSign, 
  Users, 
  Target, 
  Download,
  Calendar,
  Zap
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

const ReportsPage = () => {
  const { data: campaignsData } = useQuery({
    queryKey: ['campaigns'],
    queryFn: () => apiService.getCampaigns(),
  });

  const { data: dealsData } = useQuery({
    queryKey: ['deals'],
    queryFn: () => apiService.getDeals(),
  });

  const { data: creatorsData } = useQuery({
    queryKey: ['creators'],
    queryFn: () => apiService.getCreators(),
  });

  // Mock data for charts
  const campaignPerformanceData = [
    { name: 'Jan', campaigns: 4, deals: 2, revenue: 85000 },
    { name: 'Feb', campaigns: 6, deals: 4, revenue: 120000 },
    { name: 'Mar', campaigns: 8, deals: 6, revenue: 180000 },
    { name: 'Apr', campaigns: 12, deals: 9, revenue: 250000 },
    { name: 'May', campaigns: 10, deals: 8, revenue: 220000 },
    { name: 'Jun', campaigns: 15, deals: 12, revenue: 300000 },
  ];

  const platformDistribution = [
    { name: 'Instagram', value: 45, color: '#E1306C' },
    { name: 'TikTok', value: 25, color: '#000000' },
    { name: 'YouTube', value: 20, color: '#FF0000' },
    { name: 'Twitter', value: 10, color: '#1DA1F2' },
  ];

  const topCreators = [
    { name: 'Sarah Johnson', platform: 'Instagram', deals: 8, revenue: 145000, engagement: '5.2%' },
    { name: 'Mike Chen', platform: 'YouTube', deals: 6, revenue: 180000, engagement: '4.8%' },
    { name: 'Emma Wilson', platform: 'TikTok', deals: 12, revenue: 95000, engagement: '7.1%' },
    { name: 'Alex Rivera', platform: 'Instagram', deals: 5, revenue: 125000, engagement: '6.3%' },
  ];

  const stats = [
    {
      title: 'Total Revenue',
      value: '₹12.5L',
      change: '+23%',
      icon: DollarSign,
      color: 'text-green-600',
      bgColor: 'bg-green-100'
    },
    {
      title: 'Active Campaigns',
      value: campaignsData?.campaigns?.length || 0,
      change: '+15%',
      icon: Target,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100'
    },
    {
      title: 'Creator Partners',
      value: creatorsData?.length || 0,
      change: '+34%',
      icon: Users,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100'
    },
    {
      title: 'Avg. Engagement',
      value: '5.8%',
      change: '+12%',
      icon: TrendingUp,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100'
    }
  ];

  return (
    <Layout>
      <div className="p-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics & Reports</h1>
            <p className="text-gray-600">Track performance and analyze your influencer marketing ROI</p>
          </div>
          <div className="flex space-x-4">
            <Select defaultValue="30days">
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">Last 7 days</SelectItem>
                <SelectItem value="30days">Last 30 days</SelectItem>
                <SelectItem value="90days">Last 90 days</SelectItem>
                <SelectItem value="1year">Last year</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="border-0 shadow-md">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    <div className="flex items-center mt-2">
                      <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                      <span className="text-sm text-green-600">{stat.change} from last month</span>
                    </div>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Campaign Performance Chart */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>Campaign Performance</CardTitle>
              <CardDescription>Monthly campaigns, deals, and revenue trends</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={campaignPerformanceData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="campaigns" fill="#3B82F6" />
                  <Bar dataKey="deals" fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* Platform Distribution */}
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle>Platform Distribution</CardTitle>
              <CardDescription>Campaign distribution across social platforms</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={platformDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, value }) => `${name}: ${value}%`}
                  >
                    {platformDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Revenue Trend */}
        <Card className="border-0 shadow-md mb-8">
          <CardHeader>
            <CardTitle>Revenue Trend</CardTitle>
            <CardDescription>Monthly revenue growth from influencer campaigns</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={campaignPerformanceData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`₹${(value as number).toLocaleString()}`, 'Revenue']} />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#8B5CF6" 
                  strokeWidth={3}
                  dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Top Performing Creators */}
        <Card className="border-0 shadow-md mb-8">
          <CardHeader>
            <CardTitle>Top Performing Creators</CardTitle>
            <CardDescription>Your highest performing creator partnerships</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {topCreators.map((creator, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium">
                        {creator.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{creator.name}</h3>
                      <p className="text-sm text-gray-600">{creator.platform}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-8 text-sm">
                    <div className="text-center">
                      <p className="font-medium text-gray-900">{creator.deals}</p>
                      <p className="text-gray-600">Deals</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-gray-900">₹{(creator.revenue / 1000).toFixed(0)}K</p>
                      <p className="text-gray-600">Revenue</p>
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-gray-900">{creator.engagement}</p>
                      <p className="text-gray-600">Engagement</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Campaign ROI Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Zap className="mr-2 h-5 w-5 text-yellow-600" />
                Campaign ROI
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-900 mb-2">4.2x</p>
                <p className="text-gray-600">Average return on investment</p>
                <div className="mt-4 p-3 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-700">
                    Your campaigns are performing 23% above industry average
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-blue-600" />
                Campaign Velocity
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-900 mb-2">12 days</p>
                <p className="text-gray-600">Average campaign duration</p>
                <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-700">
                    15% faster than previous quarter
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-md">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Target className="mr-2 h-5 w-5 text-purple-600" />
                Success Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <p className="text-3xl font-bold text-gray-900 mb-2">89%</p>
                <p className="text-gray-600">Campaign completion rate</p>
                <div className="mt-4 p-3 bg-purple-50 rounded-lg">
                  <p className="text-sm text-purple-700">
                    Excellent collaboration quality
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default ReportsPage;
