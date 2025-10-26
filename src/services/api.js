const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

async function apiRequest(endpoint, options = {}) {
  const url = `${API_BASE_URL}/api${endpoint}`;
  
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.error || `HTTP ${response.status}: ${response.statusText}`,
        response.status
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    
    // Network or other errors
    console.error('API request failed:', error);
    throw new ApiError('Network error or server unavailable', 0);
  }
}

export const budgetApi = {
  // Get all budget data
  async getBudgetData() {
    return apiRequest('/budget');
  },

  // Update budget amount (planned or actual)
  async updateAmount(category, itemName, month, type, value) {
    const body = type === 'planned' 
      ? { planned_amount: value }
      : { actual_amount: value };
      
    return apiRequest(`/budget/${category}/${encodeURIComponent(itemName)}/${month}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  },

  // Create new budget item
  async createItem(category, itemName) {
    return apiRequest('/budget/items', {
      method: 'POST',
      body: JSON.stringify({ category, item_name: itemName }),
    });
  },

  // Delete budget item
  async deleteItem(category, itemName) {
    return apiRequest(`/budget/items/${category}/${encodeURIComponent(itemName)}`, {
      method: 'DELETE',
    });
  },

  // Get budget summary
  async getSummary() {
    return apiRequest('/budget/summary');
  },

  // Health check
  async healthCheck() {
    return apiRequest('/health');
  }
};

export { ApiError };