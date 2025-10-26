# Budget App

A Vue.js application for tracking planned vs actual monthly budgets with comprehensive variance analysis, similar to professional Excel budget calculators.

## Features

- **Planned vs Actual Tracking**: Each month shows two columns side by side
  - **Planned** amounts (blue theme) for budget planning
  - **Actual** amounts (green theme) for real expenses/income
- **Comprehensive Calculations**: Automatic calculation of:
  - Monthly totals for planned and actual amounts
  - Annual totals for each category (planned vs actual)
  - Variance analysis (actual - planned) with color coding
  - Net income per month (planned and actual)
  - Total net income variance for the year
- **Visual Variance Indicators**: 
  - **Green**: Under budget / positive variance
  - **Red**: Over budget / negative variance
  - **Gray**: On budget / neutral variance
- **Professional Layout**: 
  - Sticky headers for easy navigation
  - Color-coded input fields (blue for planned, green for actual)
  - Hierarchical table structure with clear section divisions
- **Responsive Design**: Optimized for desktop and mobile viewing

## Budget Categories

### Income
- Salary
- Freelance
- Other Income

### Expenses
- Rent/Mortgage
- Utilities
- Groceries
- Transportation
- Entertainment
- Healthcare
- Insurance
- Savings
- Debt Payment
- Miscellaneous

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open your browser and navigate to the displayed URL (typically `http://localhost:5173`)

## Usage

1. **Editing Values**: 
   - **Planned amounts**: Click on blue-highlighted input fields to set your budget
   - **Actual amounts**: Click on green-highlighted input fields to record real expenses/income
2. **Navigation**: Use horizontal scroll to view all months
3. **Understanding the Layout**:
   - Each month has two columns: "Plan" and "Actual"
   - **Totals section** shows three columns: Plan, Actual, and Variance (Var)
   - **Variance** = Actual - Planned (positive means over budget for expenses, under budget for income)
4. **Color Coding**:
   - **Blue backgrounds**: Planned values and totals
   - **Green backgrounds**: Actual values and totals  
   - **Variance colors**: Green (favorable), Red (unfavorable), Gray (neutral)
5. **Net Income**: Shows planned vs actual net income with positive/negative indicators

## Build for Production

```bash
npm run build
```

## Technology Stack

- Vue 3 (Composition API)
- Vite
- CSS3 (with sticky headers and responsive design)