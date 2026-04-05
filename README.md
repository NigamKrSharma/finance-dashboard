# FinTrack — Finance Dashboard

A clean, interactive personal finance dashboard built with React, CSS Modules, and Chart.js.

---

## Setup Instructions

### Prerequisites
- Node.js v16 or higher
- npm v7 or higher

### Run Locally

```bash
# 1. Clone / unzip the project
cd finance-dashboard

# 2. Install dependencies
npm install

# 3. Start the dev server
npm start
```

The app will open at `http://localhost:3000`.

### Build for Production

```bash
npm run build
```

---

## Project Structure

```
src/
├── components/
│   ├── Sidebar/               # Navigation sidebar + role switcher
│   │   ├── Sidebar.js
│   │   └── Sidebar.module.css
│   ├── TopBar/                # Top header with page title
│   │   ├── TopBar.js
│   │   └── TopBar.module.css
│   ├── SummaryCards/          # Balance, Income, Expense, Savings Rate cards
│   │   ├── SummaryCards.js
│   │   └── SummaryCards.module.css
│   ├── Charts/                # All Chart.js visualizations
│   │   ├── BalanceTrendChart.js      # Line chart — cumulative balance
│   │   ├── SpendingCategoryChart.js  # Doughnut chart — category breakdown
│   │   ├── MonthlyCompareChart.js    # Bar chart — income vs expense
│   │   └── Charts.module.css
│   ├── Dashboard/             # Main overview page
│   │   ├── DashboardPage.js
│   │   └── Dashboard.module.css
│   ├── Transactions/          # Transactions page with table + filters
│   │   ├── TransactionsPage.js
│   │   ├── TransactionFilters.js
│   │   ├── TransactionTable.js
│   │   └── Transactions.module.css
│   ├── Insights/              # Insights page with stats + progress bars
│   │   ├── InsightsPage.js
│   │   └── Insights.module.css
│   └── Modal/                 # Add/Edit transaction modal
│       ├── AddEditModal.js
│       └── Modal.module.css
├── context/
│   └── AppContext.js          # Global state using React Context API
├── data/
│   └── transactions.js        # Mock transaction data + category colors
├── hooks/
│   └── useFilteredTransactions.js   # Custom hook for filter + sort logic
├── utils/
│   └── helpers.js             # Utility functions (format, calc, etc.)
├── App.js                     # Root component, layout + page routing
├── App.module.css
├── index.css                  # Global CSS variables and resets
└── index.js                   # React entry point
```

---

## Features

### Dashboard Overview
- 4 summary cards: Total Balance, Total Income, Total Expenses, Savings Rate
- Line chart: cumulative balance trend over months
- Doughnut chart: spending breakdown by category
- Bar chart: monthly income vs expenses comparison

### Transactions Page
- Full transaction table with date, description, category, type, amount
- Search by description or category
- Filter by type (income / expense) and by category
- Sortable columns (date, category, type, amount)
- Export filtered transactions as CSV

### Role-Based UI
Switch roles from the sidebar dropdown:
- **Viewer** — read-only, no edit/add/delete controls visible
- **Admin** — Edit and Delete buttons appear per row; Add Transaction button unlocked

### Insights Page
- 6 KPI cards: top category, savings rate, best/worst month, biggest expense, avg monthly expense
- Category spending with animated progress bars
- Written observations auto-generated from the data

### State Management
- React Context API (`AppContext.js`) manages: transactions, active role, filters, sort, sidebar state
- `useFilteredTransactions` custom hook keeps filter + sort logic out of components
- All state persists to `localStorage` automatically

### Optional Enhancements Included
- Dark mode (always on — full dark theme with CSS variables)
- localStorage persistence (transactions + role survive page refresh)
- CSV export for filtered transactions
- Animations on modal open (slide-up + fade-in)
- Responsive layout — works on mobile, tablet, and desktop
- Empty state handling on table and insights page
- Reset button to restore original mock data

---

## Design Decisions

- **CSS Modules** — each component has its own `.module.css` file to avoid class name collisions and keep styles co-located
- **Chart.js auto** — uses `chart.js/auto` import so you don't need to register every component manually
- **No external state library** — React Context + `useState` is sufficient for this scale; no need to add Redux overhead
- **Fresher-style code** — explicit variable names, comments explaining "why", simple logic over clever abstractions
