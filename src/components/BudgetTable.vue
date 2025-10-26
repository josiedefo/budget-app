<template>
  <div class="budget-table-container">
    <div class="table-scroll">
      <table class="budget-table">
        <thead>
          <tr class="main-header">
            <th class="category-header" rowspan="2">Category</th>
            <th v-for="month in months" :key="month" class="month-header" colspan="2">{{ month }}</th>
            <th class="total-header" colspan="3">Totals</th>
          </tr>
          <tr class="sub-header">
            <template v-for="month in months" :key="`${month}-sub`">
              <th class="sub-month-header planned-header">Plan</th>
              <th class="sub-month-header actual-header">Actual</th>
            </template>
            <th class="sub-total-header planned-header">Plan</th>
            <th class="sub-total-header actual-header">Actual</th>
            <th class="sub-total-header variance-header">Var</th>
          </tr>
        </thead>
        
        <tbody>
          <!-- Income Section -->
          <tr class="section-header">
            <td :colspan="26" class="section-title income-section">INCOME</td>
          </tr>
          <tr v-for="(values, item) in budgetData.income" :key="`income-${item}`" class="budget-row income-row">
            <td class="item-name">{{ item }}</td>
            <template v-for="month in months" :key="`${item}-${month}`">
              <td class="amount-cell planned-cell">
                <input
                  type="number"
                  :value="values[month].planned"
                  @input="updateValue('income', item, month, 'planned', $event.target.value)"
                  class="amount-input planned-input income-input"
                  step="0.01"
                />
              </td>
              <td class="amount-cell actual-cell">
                <input
                  type="number"
                  :value="values[month].actual"
                  @input="updateValue('income', item, month, 'actual', $event.target.value)"
                  class="amount-input actual-input income-input"
                  step="0.01"
                />
              </td>
            </template>
            <td class="total-cell planned-total income-total">{{ formatCurrency(calculateRowTotal(values, 'planned')) }}</td>
            <td class="total-cell actual-total income-total">{{ formatCurrency(calculateRowTotal(values, 'actual')) }}</td>
            <td class="total-cell variance-cell" :class="getVarianceClass(calculateRowVariance(values))">
              {{ formatCurrency(calculateRowVariance(values)) }}
            </td>
          </tr>
          <tr class="total-row income-total-row">
            <td class="total-label">Total Income</td>
            <template v-for="month in months" :key="`income-total-${month}`">
              <td class="total-amount planned-total income-total">
                {{ formatCurrency(calculateMonthlyTotal('income', month, 'planned')) }}
              </td>
              <td class="total-amount actual-total income-total">
                {{ formatCurrency(calculateMonthlyTotal('income', month, 'actual')) }}
              </td>
            </template>
            <td class="grand-total planned-total income-total">{{ formatCurrency(calculateCategoryTotal('income', 'planned')) }}</td>
            <td class="grand-total actual-total income-total">{{ formatCurrency(calculateCategoryTotal('income', 'actual')) }}</td>
            <td class="grand-total variance-cell" :class="getVarianceClass(calculateCategoryVariance('income'))">
              {{ formatCurrency(calculateCategoryVariance('income')) }}
            </td>
          </tr>
          
          <!-- Expenses Section -->
          <tr class="section-header">
            <td :colspan="26" class="section-title expense-section">EXPENSES</td>
          </tr>
          <tr v-for="(values, item) in budgetData.expenses" :key="`expense-${item}`" class="budget-row expense-row">
            <td class="item-name">{{ item }}</td>
            <template v-for="month in months" :key="`${item}-${month}`">
              <td class="amount-cell planned-cell">
                <input
                  type="number"
                  :value="values[month].planned"
                  @input="updateValue('expenses', item, month, 'planned', $event.target.value)"
                  class="amount-input planned-input expense-input"
                  step="0.01"
                />
              </td>
              <td class="amount-cell actual-cell">
                <input
                  type="number"
                  :value="values[month].actual"
                  @input="updateValue('expenses', item, month, 'actual', $event.target.value)"
                  class="amount-input actual-input expense-input"
                  step="0.01"
                />
              </td>
            </template>
            <td class="total-cell planned-total expense-total">{{ formatCurrency(calculateRowTotal(values, 'planned')) }}</td>
            <td class="total-cell actual-total expense-total">{{ formatCurrency(calculateRowTotal(values, 'actual')) }}</td>
            <td class="total-cell variance-cell" :class="getVarianceClass(calculateRowVariance(values))">
              {{ formatCurrency(calculateRowVariance(values)) }}
            </td>
          </tr>
          <tr class="total-row expense-total-row">
            <td class="total-label">Total Expenses</td>
            <template v-for="month in months" :key="`expense-total-${month}`">
              <td class="total-amount planned-total expense-total">
                {{ formatCurrency(calculateMonthlyTotal('expenses', month, 'planned')) }}
              </td>
              <td class="total-amount actual-total expense-total">
                {{ formatCurrency(calculateMonthlyTotal('expenses', month, 'actual')) }}
              </td>
            </template>
            <td class="grand-total planned-total expense-total">{{ formatCurrency(calculateCategoryTotal('expenses', 'planned')) }}</td>
            <td class="grand-total actual-total expense-total">{{ formatCurrency(calculateCategoryTotal('expenses', 'actual')) }}</td>
            <td class="grand-total variance-cell" :class="getVarianceClass(calculateCategoryVariance('expenses'))">
              {{ formatCurrency(calculateCategoryVariance('expenses')) }}
            </td>
          </tr>
          
          <!-- Net Income Section -->
          <tr class="net-income-row">
            <td class="total-label net-label">Net Income</td>
            <template v-for="month in months" :key="`net-${month}`">
              <td class="net-amount planned-net" :class="getNetClass(calculateNetIncome(month, 'planned'))">
                {{ formatCurrency(calculateNetIncome(month, 'planned')) }}
              </td>
              <td class="net-amount actual-net" :class="getNetClass(calculateNetIncome(month, 'actual'))">
                {{ formatCurrency(calculateNetIncome(month, 'actual')) }}
              </td>
            </template>
            <td class="grand-total planned-net" :class="getNetClass(calculateTotalNet('planned'))">{{ formatCurrency(calculateTotalNet('planned')) }}</td>
            <td class="grand-total actual-net" :class="getNetClass(calculateTotalNet('actual'))">{{ formatCurrency(calculateTotalNet('actual')) }}</td>
            <td class="grand-total variance-cell" :class="getVarianceClass(calculateNetVariance())">
              {{ formatCurrency(calculateNetVariance()) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  budgetData: {
    type: Object,
    required: true
  },
  months: {
    type: Array,
    required: true
  }
})

const emit = defineEmits(['update-budget'])

const updateValue = (category, item, month, type, value) => {
  emit('update-budget', category, item, month, type, value)
}

const calculateRowTotal = (values, type) => {
  return Object.values(values).reduce((sum, value) => sum + (parseFloat(value[type]) || 0), 0)
}

const calculateRowVariance = (values) => {
  const planned = calculateRowTotal(values, 'planned')
  const actual = calculateRowTotal(values, 'actual')
  return actual - planned
}

const calculateMonthlyTotal = (category, month, type) => {
  return Object.values(props.budgetData[category]).reduce((sum, item) => {
    return sum + (parseFloat(item[month][type]) || 0)
  }, 0)
}

const calculateCategoryTotal = (category, type) => {
  return Object.values(props.budgetData[category]).reduce((sum, item) => {
    return sum + calculateRowTotal(item, type)
  }, 0)
}

const calculateCategoryVariance = (category) => {
  const planned = calculateCategoryTotal(category, 'planned')
  const actual = calculateCategoryTotal(category, 'actual')
  return actual - planned
}

const calculateNetIncome = (month, type) => {
  const income = calculateMonthlyTotal('income', month, type)
  const expenses = calculateMonthlyTotal('expenses', month, type)
  return income - expenses
}

const calculateTotalNet = (type) => {
  const totalIncome = calculateCategoryTotal('income', type)
  const totalExpenses = calculateCategoryTotal('expenses', type)
  return totalIncome - totalExpenses
}

const calculateNetVariance = () => {
  const plannedNet = calculateTotalNet('planned')
  const actualNet = calculateTotalNet('actual')
  return actualNet - plannedNet
}

const getNetClass = (value) => {
  return value >= 0 ? 'positive' : 'negative'
}

const getVarianceClass = (variance) => {
  if (variance > 0) return 'variance-positive'
  if (variance < 0) return 'variance-negative'
  return 'variance-neutral'
}

const formatCurrency = (value) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(value)
}
</script>

<style scoped>
.budget-table-container {
  width: 100%;
  overflow-x: auto;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.table-scroll {
  min-width: 100%;
}

.budget-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  font-size: 12px;
}

.budget-table th,
.budget-table td {
  padding: 6px 8px;
  border: 1px solid #e2e8f0;
  text-align: center;
}

.category-header {
  background: #f8fafc;
  font-weight: 600;
  color: #2d3748;
  position: sticky;
  left: 0;
  z-index: 12;
  text-align: left;
  min-width: 140px;
}

.month-header,
.total-header {
  background: #f8fafc;
  font-weight: 600;
  color: #2d3748;
  position: sticky;
  top: 0;
  z-index: 10;
}

.sub-header th {
  background: #edf2f7;
  font-weight: 500;
  font-size: 11px;
  position: sticky;
  top: 32px;
  z-index: 10;
  min-width: 80px;
}

.planned-header {
  background: #bee3f8 !important;
  color: #2b6cb0;
}

.actual-header {
  background: #c6f6d5 !important;
  color: #2f855a;
}

.variance-header {
  background: #fed7d7 !important;
  color: #c53030;
}

.section-header {
  background: #2d3748;
}

.section-title {
  color: white;
  font-weight: bold;
  text-align: center;
  padding: 12px;
  font-size: 14px;
}

.income-section {
  background: #38a169;
}

.expense-section {
  background: #e53e3e;
}

.budget-row {
  transition: background-color 0.2s;
}

.budget-row:hover {
  background-color: #f7fafc;
}

.item-name {
  font-weight: 500;
  position: sticky;
  left: 0;
  background: white;
  z-index: 5;
  text-align: left;
  padding-left: 12px;
}

.budget-row:hover .item-name {
  background-color: #f7fafc;
}

.amount-cell {
  min-width: 80px;
}

.amount-input {
  width: 100%;
  padding: 3px 6px;
  border: 1px solid #cbd5e0;
  border-radius: 3px;
  text-align: right;
  font-size: 12px;
}

.amount-input:focus {
  outline: none;
  box-shadow: 0 0 0 2px rgba(66, 153, 225, 0.2);
}

.planned-input {
  border-color: #3182ce;
  background-color: #f7fafc;
}

.planned-input:focus {
  border-color: #2b6cb0;
  box-shadow: 0 0 0 2px rgba(43, 108, 176, 0.2);
}

.actual-input {
  border-color: #38a169;
  background-color: #f0fff4;
}

.actual-input:focus {
  border-color: #2f855a;
  box-shadow: 0 0 0 2px rgba(47, 133, 90, 0.2);
}

.income-input:focus {
  border-color: #38a169;
}

.expense-input:focus {
  border-color: #e53e3e;
}

.total-cell,
.total-amount,
.grand-total {
  font-weight: 600;
  font-size: 11px;
}

.total-row {
  background: #f8fafc;
  border-top: 2px solid #2d3748;
}

.total-label {
  font-weight: 600;
  position: sticky;
  left: 0;
  background: #f8fafc;
  z-index: 5;
  text-align: left;
  padding-left: 12px;
}

.planned-total {
  background-color: #ebf8ff;
  color: #2b6cb0;
}

.actual-total {
  background-color: #f0fff4;
  color: #2f855a;
}

.income-total {
  font-weight: 600;
}

.expense-total {
  font-weight: 600;
}

.variance-cell {
  font-weight: 600;
  font-size: 11px;
}

.variance-positive {
  background-color: #f0fff4;
  color: #2f855a;
}

.variance-negative {
  background-color: #fff5f5;
  color: #c53030;
}

.variance-neutral {
  background-color: #f7fafc;
  color: #4a5568;
}

.net-income-row {
  background: #2d3748;
  border-top: 3px solid #1a202c;
}

.net-label {
  color: white;
  font-weight: bold;
  background: #2d3748;
}

.net-amount,
.net-total {
  font-weight: bold;
  font-size: 12px;
}

.planned-net {
  background-color: #2d3748;
}

.actual-net {
  background-color: #2d3748;
}

.positive {
  color: #38a169;
}

.negative {
  color: #e53e3e;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .budget-table {
    font-size: 10px;
  }
  
  .amount-input {
    font-size: 10px;
    padding: 2px 4px;
  }
  
  .sub-header th {
    font-size: 9px;
    min-width: 60px;
  }
  
  .category-header {
    min-width: 120px;
  }
}
</style>