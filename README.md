# Finance Manager Frontend

> A modern, responsive, and feature-rich personal finance management dashboard built with Angular 21 and GraphQL.

[![Portuguese](https://img.shields.io/badge/lang-pt--br-green.svg)](LEIA-ME.md)

---

## 🚀 Motivation

Managing personal finances effectively is a cornerstone of financial freedom. Many existing tools are either too complex or lack the flexibility to integrate with modern banking systems. This project was born from the need for a **unified, secure, and visually intuitive platform** to track income, expenses, and account balances in real-time.

## 💡 Solution & Objectives

The **Finance Manager Frontend** provides a seamless user experience for:
- **Centralizing financial data**: Bringing multiple accounts and categories into one view.
- **Visual Intelligence**: Transforming raw transaction data into actionable insights through dynamic charts.
- **Automation**: Integrating with external banking APIs (via Pluggy) to reduce manual entry.
- **Security**: Ensuring data privacy through robust authentication and route protection.

## ✨ Key Features

- **📊 Comprehensive Dashboard**: 
  - Income vs. Expense analysis.
  - Monthly cash flow and balance evolution.
  - Spending distribution by category.
  - Weekly transaction patterns.
- **💳 Account Management**: Track multiple bank accounts, credit cards, and cash balances.
- **📝 Transaction Tracking**: Easy-to-use forms for manual entry of income and expenses with category assignment.
- **🏷️ Category Organization**: Custom categories to better understand where your money goes.
- **🔌 Bank Integrations**: Connect directly to your financial institutions using the **Pluggy SDK**.
- **🌍 Internationalization**: Full support for English (US) and Portuguese (BR).
- **🌓 Theme Support**: Light and dark mode compatibility (via Angular Material).

## 🛠️ Tech Stack

- **Framework**: [Angular 21](https://angular.dev/) (latest features, Standalone components).
- **State & Data**: [Apollo Client](https://www.apollographql.com/docs/angular/) + [GraphQL](https://graphql.org/).
- **UI Components**: [Angular Material](https://material.angular.io/).
- **Charts**: [Chart.js](https://www.chartjs.org/) with [ng2-charts](https://valor-software.com/ng2-charts/).
- **Integrations**: [Pluggy Connect SDK](https://docs.pluggy.ai/).
- **I18n**: [ngx-translate](http://www.ngx-translate.com/).
- **Styling**: SCSS (Mobile-first responsive design).

## 🏗️ Architecture & Best Practices

The project follows a modular and scalable structure:
- **Core**: Singleton services, guards, and interceptors (App-wide logic).
- **Shared**: Reusable UI components, models, and GraphQL operation definitions.
- **Features**: Lazy-loaded modules for specific domains (Auth, Accounts, Dashboard, etc.).

### Adopted Practices:
- **Lazy Loading**: Route-based code splitting for faster initial load times.
- **Strict Typing**: Full TypeScript implementation for better maintainability.
- **GraphQL**: Optimized data fetching to avoid over-fetching/under-fetching.
- **Guards & Interceptors**: Centralized security and error handling logic.

## ⚙️ Installation & Setup

### Prerequisites
- [Node.js](https://nodejs.org/) (v20+ recommended)
- [npm](https://www.npmjs.com/)

### Steps
1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd finance-frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment**:
   Update `src/environments/environment.ts` with your backend API URL.

4. **Start Development Server**:
   ```bash
   npm start
   ```
   Navigate to `http://localhost:4200/`.

## 📈 Expected Results

Users can expect a significant reduction in time spent on manual tracking and a clearer understanding of their financial health. The visual feedback loop helps in identifying unnecessary expenses and planning for future savings goals.

## 📸 Screenshots

*(User: Add your screenshots here to showcase the UI)*

- **Dashboard**: `![Dashboard Screenshot](path/to/image)`
- **Transactions**: `![Transactions Screenshot](path/to/image)`
- **Mobile View**: `![Mobile Screenshot](path/to/image)`

---

## 📄 Reference
This documentation is also available in Portuguese: **[LEIA-ME.md](LEIA-ME.md)**
