<template>
  <div class="budget-app">
    <header class="app-header">
      <h1>2025 Budget Tracker</h1>
      <div class="status-indicators">
        <div class="connection-status" :class="connectionStatus">
          {{ connectionMessage }}
        </div>
        <div v-if="loading" class="loading">Loading...</div>
        <div v-if="error" class="error">{{ error }}</div>
      </div>
    </header>
    
    <main class="app-main">
      <BudgetTable
        v-if="!loading && budgetData"
        :budget-data="budgetData"
        :months="months"
        @update-budget="updateBudgetItem"
      />
      <div v-else-if="loading" class="loading-container">
        <div class="spinner"></div>
        <p>Loading your budget data...</p>
      </div>
      <div v-else-if="error" class="error-container">
        <h2>Unable to load budget data</h2>
        <p>{{ error }}</p>
        <button @click="loadBudgetData" class="retry-button">Retry</button>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import BudgetTable from './components/BudgetTable.vue'
import { budgetApi, ApiError } from './services/api.js'

const months = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
]

const budgetData = ref(null)
const loading = ref(true)
const error = ref(null)
const connectionStatus = ref('disconnected')

const connectionMessage = computed(() => {
  switch (connectionStatus.value) {
    case 'connected': return '🟢 Connected'
    case 'connecting': return '🟡 Connecting...'
    case 'error': return '🔴 Connection Error'
    default: return '🔴 Disconnected'
  }
})

// Load budget data from API
const loadBudgetData = async () => {
  try {
    loading.value = true
    error.value = null
    connectionStatus.value = 'connecting'
    
    // Check API health first
    await budgetApi.healthCheck()
    connectionStatus.value = 'connected'
    
    // Load budget data
    const data = await budgetApi.getBudgetData()
    budgetData.value = reactive(data)
    
  } catch (err) {
    console.error('Failed to load budget data:', err)
    connectionStatus.value = 'error'
    
    if (err instanceof ApiError) {
      if (err.status === 0) {
        error.value = 'Cannot connect to server. Please ensure the API is running.'
      } else {
        error.value = `Server error: ${err.message}`
      }
    } else {
      error.value = 'An unexpected error occurred while loading budget data.'
    }
  } finally {
    loading.value = false
  }
}

// Update budget item via API
const updateBudgetItem = async (category, item, month, type, value) => {
  try {
    const result = await budgetApi.updateAmount(category, item, month, type, value)
    
    // Update local state with server response
    if (budgetData.value && budgetData.value[category] && budgetData.value[category][item]) {
      budgetData.value[category][item][month] = {
        planned: result.planned,
        actual: result.actual
      }
    }
  } catch (err) {
    console.error('Failed to update budget item:', err)
    
    // Show error message and optionally revert the change
    if (err instanceof ApiError) {
      alert(`Failed to update: ${err.message}`)
    } else {
      alert('Failed to save changes. Please try again.')
    }
    
    // Reload data to ensure consistency
    await loadBudgetData()
  }
}

// Load data when component mounts
onMounted(() => {
  loadBudgetData()
})
</script>

<style scoped>
.budget-app {
  width: 100%;
  max-width: none;
}

.app-header {
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.app-header h1 {
  color: #2c3e50;
  font-size: 2.5rem;
  margin: 0;
}

.status-indicators {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.9rem;
}

.connection-status {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-weight: 500;
}

.connection-status.connected {
  background-color: #f0fff4;
  color: #2f855a;
  border: 1px solid #c6f6d5;
}

.connection-status.connecting {
  background-color: #fffbeb;
  color: #d69e2e;
  border: 1px solid #fed7aa;
}

.connection-status.error,
.connection-status.disconnected {
  background-color: #fff5f5;
  color: #c53030;
  border: 1px solid #fed7d7;
}

.loading, .error {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-weight: 500;
}

.loading {
  background-color: #ebf8ff;
  color: #2b6cb0;
  border: 1px solid #bee3f8;
}

.error {
  background-color: #fff5f5;
  color: #c53030;
  border: 1px solid #fed7d7;
}

.app-main {
  width: 100%;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #e2e8f0;
  border-top: 4px solid #3182ce;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
}

.error-container h2 {
  color: #c53030;
  margin-bottom: 1rem;
}

.error-container p {
  color: #4a5568;
  margin-bottom: 2rem;
  max-width: 400px;
}

.retry-button {
  background-color: #3182ce;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: background-color 0.2s;
}

.retry-button:hover {
  background-color: #2c5aa0;
}

.retry-button:active {
  transform: translateY(1px);
}

@media (max-width: 768px) {
  .app-header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .app-header h1 {
    font-size: 2rem;
  }
  
  .status-indicators {
    width: 100%;
    justify-content: space-between;
  }
}
</style>