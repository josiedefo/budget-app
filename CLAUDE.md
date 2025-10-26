# Budget App

A Vue.js application for tracking planned vs actual monthly budgets with comprehensive variance analysis.

## Description

This is a professional budget tracking application that allows users to:
- Plan monthly budgets for income and expenses
- Track actual amounts against planned budgets
- View real-time variance analysis with color coding
- Monitor net income performance across the year

## Commands

- **dev**: `npm run dev` - Start development server (typically runs on localhost:5173 or 5174)
- **build**: `npm run build` - Build for production
- **preview**: `npm run preview` - Preview production build locally

## Project Structure

```
budget-app/
├── src/
│   ├── components/
│   │   └── BudgetTable.vue       # Main budget table component
│   ├── App.vue                   # Root component with data structure
│   ├── main.js                   # Application entry point
│   └── style.css                 # Global styles
├── public/                       # Static assets
├── package.json                  # Dependencies and scripts
├── vite.config.js               # Vite configuration
└── README.md                    # Project documentation
```

## Key Features

### Data Structure
- Budget data organized by categories (income/expenses)
- Each item has planned and actual values for all 12 months
- Reactive data updates for real-time calculations

### Components
- **BudgetTable.vue**: Main table component with:
  - Dual-column headers (Planned/Actual)
  - Sticky positioning for navigation
  - Variance calculations and color coding
  - Responsive design for mobile/desktop

### Styling
- Color-coded inputs: Blue (planned), Green (actual)
- Variance indicators: Green (favorable), Red (unfavorable)
- Professional table layout with hover effects
- Mobile-responsive with horizontal scrolling

## Development Notes

### Technology Stack
- **Vue 3** with Composition API
- **Vite** for build tooling and hot module replacement
- **CSS3** with scoped styles and responsive design
- **JavaScript ES6+** with reactive data management

### Data Flow
1. App.vue holds the main budget data structure
2. BudgetTable.vue receives data via props
3. User interactions emit events back to parent
4. Calculations happen in real-time using computed properties

### Key Functions
- `updateBudgetItem()`: Handles user input updates
- `calculateRowTotal()`: Sums planned/actual for each budget item
- `calculateMonthlyTotal()`: Sums category totals per month
- `calculateVariance()`: Computes actual vs planned differences

## Sample Data

The app includes realistic sample data with:
- Salary and freelance income with minor variations
- Common expense categories (rent, utilities, groceries, etc.)
- Realistic variance patterns showing budget performance

## Git Repository

- **GitHub**: https://github.com/josiedefo/budget-app
- **Branch**: master
- **Latest Commit**: Initial implementation with planned vs actual tracking

## Future Enhancements

Potential features to consider:
- Export to CSV/Excel functionality
- Budget categories customization
- Historical data tracking across years
- Goal setting and progress tracking
- Mobile app version
- Data persistence (local storage or backend integration)

## Troubleshooting

### Common Issues
- **Port conflicts**: If localhost:5173 is busy, Vite automatically uses 5174
- **Hot reload issues**: Restart dev server if changes aren't reflected
- **Styling issues**: Check scoped CSS and Vue component structure

### Performance
- Large datasets: Consider virtualization for 100+ budget items
- Mobile performance: Already optimized with responsive design
- Calculation speed: Uses efficient reduce functions for real-time updates