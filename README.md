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

### Option 1: Quick Start with Docker (Recommended)

1. **Prerequisites**: Make sure Docker is installed and running

2. **Start the full stack**:
```bash
# Start PostgreSQL database
docker-compose -f docker-compose.dev.yml up -d postgres

# Install backend dependencies
cd backend && npm install && cd ..

# Install frontend dependencies  
npm install

# Start backend API (in one terminal)
cd backend && npm run dev

# Start frontend (in another terminal)
npm run dev
```

3. **Access the application**:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001
   - Database: PostgreSQL on localhost:5432

### Option 2: Frontend Only (Local Data)

If you want to run just the frontend with local data:

1. **Install dependencies**:
```bash
npm install
```

2. **Start development server**:
```bash
npm run dev
```

3. **Open browser**: Navigate to http://localhost:5173

> **Note**: This mode uses hardcoded sample data and changes won't persist.

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

### Frontend
- **Vue 3** with Composition API
- **Vite** for development and build tooling
- **CSS3** with scoped styles, sticky headers, and responsive design

### Backend (New!)
- **Node.js** with Express.js REST API
- **PostgreSQL** database with Docker
- **Database Features**:
  - Persistent data storage
  - Automatic timestamps
  - Data integrity constraints
  - Sample data initialization

### Architecture
- **Frontend**: Vue.js SPA consuming REST API
- **Backend**: Express.js API server
- **Database**: PostgreSQL with proper schema design
- **Development**: Docker for consistent database environment

## API Endpoints

The backend provides these REST endpoints:

- `GET /api/health` - Health check
- `GET /api/budget` - Get all budget data
- `PUT /api/budget/:category/:itemName/:month` - Update budget amount
- `POST /api/budget/items` - Create new budget item
- `DELETE /api/budget/items/:category/:itemName` - Delete budget item
- `GET /api/budget/summary` - Get budget summary statistics

## Database Schema

The PostgreSQL database includes:

- **users** - User accounts (ready for multi-user support)
- **budget_items** - Budget categories and item names
- **budget_amounts** - Monthly planned and actual amounts
- **Enums** - Budget categories and month names for data integrity