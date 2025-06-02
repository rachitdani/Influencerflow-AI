
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
  }

  // Health check
  async healthCheck() {
    return this.request('/health');
  }

  // Campaign endpoints
  async createCampaign(campaignData: any) {
    return this.request('/campaigns', {
      method: 'POST',
      body: JSON.stringify(campaignData),
    });
  }

  async getCampaigns() {
    return this.request('/campaigns');
  }

  async getCampaign(campaignId: string) {
    return this.request(`/campaigns/${campaignId}`);
  }

  async enhanceCampaignBrief(campaignId: string) {
    return this.request(`/campaigns/${campaignId}/enhance-brief`, {
      method: 'POST',
    });
  }

  async deleteCampaign(campaignId: string) {
    return this.request(`/campaigns/${campaignId}`, {
      method: 'DELETE',
    });
  }

  // Creator endpoints
  async getCreators(filters?: { category?: string; platform?: string }) {
    const params = new URLSearchParams();
    if (filters?.category) params.append('category', filters.category);
    if (filters?.platform) params.append('platform', filters.platform);
    
    const query = params.toString() ? `?${params}` : '';
    return this.request(`/creators${query}`);
  }

  async createCreator(creatorData: any) {
    return this.request('/creators', {
      method: 'POST',
      body: JSON.stringify(creatorData),
    });
  }

  async deleteCreator(creatorId: string) {
    return this.request(`/creators/${creatorId}`, {
      method: 'DELETE',
    });
  }

  async searchCreators(query: string, campaignId: string) {
    return this.request('/creators/search', {
      method: 'POST',
      body: JSON.stringify({ query, campaign_id: campaignId }),
    });
  }

  // Outreach endpoints
  async generateOutreach(campaignId: string, creatorId: string) {
    return this.request('/outreach', {
      method: 'POST',
      body: JSON.stringify({ campaign_id: campaignId, creator_id: creatorId }),
    });
  }

  async getOutreach(campaignId: string, creatorId: string) {
    return this.request(`/outreach/${campaignId}/${creatorId}`);
  }

  async getCampaignOutreach(campaignId: string) {
    return this.request(`/outreach/campaign/${campaignId}`);
  }

  async generateBatchOutreach(campaignId: string, creatorIds: string[]) {
    return this.request(`/outreach/batch?campaign_id=${campaignId}`, {
      method: 'POST',
      body: JSON.stringify(creatorIds),
    });
  }

  // Deal endpoints
  async createDeal(dealData: any) {
    return this.request('/deals', {
      method: 'POST',
      body: JSON.stringify(dealData),
    });
  }

  async getDeals() {
    return this.request('/deals');
  }

  async getDeal(dealId: string) {
    return this.request(`/deals/${dealId}`);
  }

  async deleteDeal(dealId: string) {
    return this.request(`/deals/${dealId}`, {
      method: 'DELETE',
    });
  }

  // Contract endpoints
  async generateContract(dealId: string) {
    return this.request('/contracts/generate', {
      method: 'POST',
      body: JSON.stringify({ deal_id: dealId }),
    });
  }

  getContractDownloadUrl(dealId: string) {
    return `${API_BASE_URL}/contracts/download/${dealId}.pdf`;
  }

  // Negotiation endpoints
  async generateNegotiationResponse(messageData: any) {
    return this.request('/negotiations/respond', {
      method: 'POST',
      body: JSON.stringify(messageData),
    });
  }

  async getNegotiationHistory(campaignId: string, creatorId: string) {
    return this.request(`/negotiations/${campaignId}/${creatorId}`);
  }

  async transcribeAudio(audioFile: File) {
    const formData = new FormData();
    formData.append('audio_file', audioFile);
    
    return fetch(`${API_BASE_URL}/negotiations/transcribe`, {
      method: 'POST',
      body: formData,
    }).then(res => res.json());
  }
}

export const apiService = new ApiService();
