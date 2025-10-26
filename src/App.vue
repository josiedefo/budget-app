<template>
  <div class="budget-app">
    <header class="app-header">
      <h1>2025 Budget Tracker</h1>
    </header>
    
    <main class="app-main">
      <BudgetTable
        :budget-data="budgetData"
        :months="months"
        @update-budget="updateBudgetItem"
      />
    </main>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'
import BudgetTable from './components/BudgetTable.vue'

const months = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
]

const budgetData = reactive({
  income: {
    'Salary': { 
      Jan: { planned: 5000, actual: 4800 }, Feb: { planned: 5000, actual: 5000 }, Mar: { planned: 5000, actual: 5100 }, 
      Apr: { planned: 5000, actual: 5000 }, May: { planned: 5000, actual: 4900 }, Jun: { planned: 5000, actual: 5000 }, 
      Jul: { planned: 5000, actual: 5200 }, Aug: { planned: 5000, actual: 5000 }, Sep: { planned: 5000, actual: 4950 }, 
      Oct: { planned: 5000, actual: 5000 }, Nov: { planned: 5000, actual: 5000 }, Dec: { planned: 5000, actual: 5000 }
    },
    'Freelance': { 
      Jan: { planned: 500, actual: 600 }, Feb: { planned: 500, actual: 400 }, Mar: { planned: 500, actual: 550 }, 
      Apr: { planned: 500, actual: 500 }, May: { planned: 500, actual: 300 }, Jun: { planned: 500, actual: 700 }, 
      Jul: { planned: 500, actual: 500 }, Aug: { planned: 500, actual: 450 }, Sep: { planned: 500, actual: 500 }, 
      Oct: { planned: 500, actual: 500 }, Nov: { planned: 500, actual: 500 }, Dec: { planned: 500, actual: 500 }
    },
    'Other Income': { 
      Jan: { planned: 0, actual: 100 }, Feb: { planned: 0, actual: 0 }, Mar: { planned: 0, actual: 50 }, 
      Apr: { planned: 0, actual: 0 }, May: { planned: 0, actual: 0 }, Jun: { planned: 0, actual: 0 }, 
      Jul: { planned: 0, actual: 0 }, Aug: { planned: 0, actual: 0 }, Sep: { planned: 0, actual: 0 }, 
      Oct: { planned: 0, actual: 0 }, Nov: { planned: 0, actual: 0 }, Dec: { planned: 0, actual: 0 }
    }
  },
  expenses: {
    'Rent/Mortgage': { 
      Jan: { planned: 1200, actual: 1200 }, Feb: { planned: 1200, actual: 1200 }, Mar: { planned: 1200, actual: 1200 }, 
      Apr: { planned: 1200, actual: 1200 }, May: { planned: 1200, actual: 1200 }, Jun: { planned: 1200, actual: 1200 }, 
      Jul: { planned: 1200, actual: 1200 }, Aug: { planned: 1200, actual: 1200 }, Sep: { planned: 1200, actual: 1200 }, 
      Oct: { planned: 1200, actual: 1200 }, Nov: { planned: 1200, actual: 1200 }, Dec: { planned: 1200, actual: 1200 }
    },
    'Utilities': { 
      Jan: { planned: 150, actual: 180 }, Feb: { planned: 150, actual: 140 }, Mar: { planned: 150, actual: 160 }, 
      Apr: { planned: 150, actual: 145 }, May: { planned: 150, actual: 130 }, Jun: { planned: 150, actual: 170 }, 
      Jul: { planned: 150, actual: 190 }, Aug: { planned: 150, actual: 185 }, Sep: { planned: 150, actual: 155 }, 
      Oct: { planned: 150, actual: 150 }, Nov: { planned: 150, actual: 150 }, Dec: { planned: 150, actual: 150 }
    },
    'Groceries': { 
      Jan: { planned: 400, actual: 450 }, Feb: { planned: 400, actual: 380 }, Mar: { planned: 400, actual: 420 }, 
      Apr: { planned: 400, actual: 390 }, May: { planned: 400, actual: 410 }, Jun: { planned: 400, actual: 430 }, 
      Jul: { planned: 400, actual: 440 }, Aug: { planned: 400, actual: 400 }, Sep: { planned: 400, actual: 395 }, 
      Oct: { planned: 400, actual: 400 }, Nov: { planned: 400, actual: 400 }, Dec: { planned: 400, actual: 400 }
    },
    'Transportation': { 
      Jan: { planned: 200, actual: 220 }, Feb: { planned: 200, actual: 180 }, Mar: { planned: 200, actual: 210 }, 
      Apr: { planned: 200, actual: 195 }, May: { planned: 200, actual: 190 }, Jun: { planned: 200, actual: 250 }, 
      Jul: { planned: 200, actual: 230 }, Aug: { planned: 200, actual: 200 }, Sep: { planned: 200, actual: 185 }, 
      Oct: { planned: 200, actual: 200 }, Nov: { planned: 200, actual: 200 }, Dec: { planned: 200, actual: 200 }
    },
    'Entertainment': { 
      Jan: { planned: 300, actual: 280 }, Feb: { planned: 300, actual: 350 }, Mar: { planned: 300, actual: 320 }, 
      Apr: { planned: 300, actual: 290 }, May: { planned: 300, actual: 310 }, Jun: { planned: 300, actual: 400 }, 
      Jul: { planned: 300, actual: 380 }, Aug: { planned: 300, actual: 300 }, Sep: { planned: 300, actual: 275 }, 
      Oct: { planned: 300, actual: 300 }, Nov: { planned: 300, actual: 300 }, Dec: { planned: 300, actual: 300 }
    },
    'Healthcare': { 
      Jan: { planned: 100, actual: 150 }, Feb: { planned: 100, actual: 80 }, Mar: { planned: 100, actual: 120 }, 
      Apr: { planned: 100, actual: 90 }, May: { planned: 100, actual: 110 }, Jun: { planned: 100, actual: 95 }, 
      Jul: { planned: 100, actual: 105 }, Aug: { planned: 100, actual: 100 }, Sep: { planned: 100, actual: 85 }, 
      Oct: { planned: 100, actual: 100 }, Nov: { planned: 100, actual: 100 }, Dec: { planned: 100, actual: 100 }
    },
    'Insurance': { 
      Jan: { planned: 250, actual: 250 }, Feb: { planned: 250, actual: 250 }, Mar: { planned: 250, actual: 250 }, 
      Apr: { planned: 250, actual: 250 }, May: { planned: 250, actual: 250 }, Jun: { planned: 250, actual: 250 }, 
      Jul: { planned: 250, actual: 250 }, Aug: { planned: 250, actual: 250 }, Sep: { planned: 250, actual: 250 }, 
      Oct: { planned: 250, actual: 250 }, Nov: { planned: 250, actual: 250 }, Dec: { planned: 250, actual: 250 }
    },
    'Savings': { 
      Jan: { planned: 500, actual: 400 }, Feb: { planned: 500, actual: 500 }, Mar: { planned: 500, actual: 450 }, 
      Apr: { planned: 500, actual: 500 }, May: { planned: 500, actual: 480 }, Jun: { planned: 500, actual: 350 }, 
      Jul: { planned: 500, actual: 420 }, Aug: { planned: 500, actual: 500 }, Sep: { planned: 500, actual: 520 }, 
      Oct: { planned: 500, actual: 500 }, Nov: { planned: 500, actual: 500 }, Dec: { planned: 500, actual: 500 }
    },
    'Debt Payment': { 
      Jan: { planned: 300, actual: 300 }, Feb: { planned: 300, actual: 300 }, Mar: { planned: 300, actual: 300 }, 
      Apr: { planned: 300, actual: 300 }, May: { planned: 300, actual: 300 }, Jun: { planned: 300, actual: 300 }, 
      Jul: { planned: 300, actual: 300 }, Aug: { planned: 300, actual: 300 }, Sep: { planned: 300, actual: 300 }, 
      Oct: { planned: 300, actual: 300 }, Nov: { planned: 300, actual: 300 }, Dec: { planned: 300, actual: 300 }
    },
    'Miscellaneous': { 
      Jan: { planned: 200, actual: 240 }, Feb: { planned: 200, actual: 180 }, Mar: { planned: 200, actual: 220 }, 
      Apr: { planned: 200, actual: 195 }, May: { planned: 200, actual: 210 }, Jun: { planned: 200, actual: 250 }, 
      Jul: { planned: 200, actual: 230 }, Aug: { planned: 200, actual: 200 }, Sep: { planned: 200, actual: 190 }, 
      Oct: { planned: 200, actual: 200 }, Nov: { planned: 200, actual: 200 }, Dec: { planned: 200, actual: 200 }
    }
  }
})

const updateBudgetItem = (category, item, month, type, value) => {
  budgetData[category][item][month][type] = parseFloat(value) || 0
}
</script>

<style scoped>
.budget-app {
  width: 100%;
  max-width: none;
}

.app-header {
  margin-bottom: 2rem;
}

.app-header h1 {
  color: #2c3e50;
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.app-main {
  width: 100%;
}
</style>