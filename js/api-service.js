// api-service.js - Cliente HTTP para Comunicar com o Backend Node.js (com Fallback Resiliente)

class ApiService {
  constructor() {
    this.BASE_URL = 'http://localhost:3000/api';
    this.useFallback = false;
  }

  async _fetch(endpoint, options = {}) {
    try {
      const response = await fetch(`${this.BASE_URL}${endpoint}`, {
        headers: { 'Content-Type': 'application/json' },
        ...options
      });
      
      if (!response.ok) {
        throw new Error(`HTTP Error ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (err) {
      console.warn(`[ApiService] Falha de comunicação com a API Node.js (${err.message}). Usando Fallback Local.`);
      this.useFallback = true;
      return null;
    }
  }

  // Obter Campanhas / Vaquinhas
  async getCampaigns(category = 'todos', search = '') {
    const query = new URLSearchParams();
    if (category && category !== 'todos') query.append('category', category);
    if (search && search.trim() !== '') query.append('search', search.trim());

    const result = await this._fetch(`/campaigns?${query.toString()}`);
    if (result && result.success) {
      return result.data;
    }
    // Fallback para DataService (localStorage)
    return window.dataService.getPontos(category, search);
  }

  // Obter detalhes da vaquinha
  async getCampaignById(id) {
    const result = await this._fetch(`/campaigns/${id}`);
    if (result && result.success) {
      return result.data;
    }
    return null;
  }

  // Criar nova vaquinha
  async createCampaign(campaignData) {
    const result = await this._fetch('/campaigns', {
      method: 'POST',
      body: JSON.stringify(campaignData)
    });

    if (result && result.success) {
      return result.data;
    }

    // Fallback LocalStorage
    return window.dataService.addPonto(campaignData);
  }

  // Fazer doação (Com PIX / Cartão)
  async createDonation(donationData) {
    const result = await this._fetch('/donations', {
      method: 'POST',
      body: JSON.stringify(donationData)
    });

    if (result && result.success) {
      return result.data;
    }

    // Fallback LocalStorage
    return window.dataService.contribuirMeta(
      donationData.campaign_id,
      donationData.amount || donationData.items_qty,
      donationData.donor_name
    );
  }
}

window.apiService = new ApiService();
