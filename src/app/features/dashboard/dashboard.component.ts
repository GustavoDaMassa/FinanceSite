import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';

import { AuthService } from '../../core/services/auth.service';
import { DashboardService } from './dashboard.service';
import { CategoriesService } from '../categories/categories.service';
import { LoadingSpinnerComponent } from '../../shared/components/loading-spinner/loading-spinner.component';
import { ExpenseByCategoryChartComponent } from './charts/expense-by-category-chart.component';
import { IncomeExpenseChartComponent } from './charts/income-expense-chart.component';
import { BalanceByAccountChartComponent } from './charts/balance-by-account-chart.component';
import { MonthlyCashFlowChartComponent } from './charts/monthly-cash-flow-chart.component';
import { BalanceEvolutionChartComponent } from './charts/balance-evolution-chart.component';
import { IncomeByCategoryChartComponent } from './charts/income-by-category-chart.component';
import { TransactionsByWeekdayChartComponent } from './charts/transactions-by-weekday-chart.component';
import { DailyAvgSpendingChartComponent } from './charts/daily-avg-spending-chart.component';
import { MonthComparisonChartComponent } from './charts/month-comparison-chart.component';
import { InflowOutflowRatioChartComponent } from './charts/inflow-outflow-ratio-chart.component';
import { AccountDTO, TransactionDTO, CategoryDTO } from '../../shared/models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    RouterLink,
    CurrencyPipe,
    DatePipe,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    TranslatePipe,
    LoadingSpinnerComponent,
    ExpenseByCategoryChartComponent,
    IncomeExpenseChartComponent,
    BalanceByAccountChartComponent,
    MonthlyCashFlowChartComponent,
    BalanceEvolutionChartComponent,
    IncomeByCategoryChartComponent,
    TransactionsByWeekdayChartComponent,
    DailyAvgSpendingChartComponent,
    MonthComparisonChartComponent,
    InflowOutflowRatioChartComponent,
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly dashboardService = inject(DashboardService);
  private readonly categoriesService = inject(CategoriesService);

  readonly userName = signal('');
  readonly accounts = signal<AccountDTO[]>([]);
  readonly recentTransactions = signal<TransactionDTO[]>([]);
  readonly allTransactions = signal<TransactionDTO[]>([]);
  readonly categories = signal<CategoryDTO[]>([]);
  readonly totalBalance = signal('0');
  readonly loading = signal(true);

  ngOnInit(): void {
    const user = this.authService.currentUser();
    if (!user) return;

    this.userName.set(user.name);

    this.dashboardService.getAccounts(String(user.id)).subscribe({
      next: (accounts) => {
        this.accounts.set(accounts);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });

    this.dashboardService.getTransactionsWithBalance().subscribe({
      next: (data) => {
        const sorted = [...data.transactions].sort((a, b) =>
          b.transactionDate.localeCompare(a.transactionDate)
        );
        this.totalBalance.set(data.balance);
        this.allTransactions.set(data.transactions);
        this.recentTransactions.set(sorted.slice(0, 5));
      },
    });

    this.categoriesService.listByUser(String(user.id)).subscribe({
      next: (categories) => this.categories.set(categories),
    });
  }

  getBalanceClass(balance: string): string {
    const value = parseFloat(balance);
    if (value > 0) return 'text-inflow';
    if (value < 0) return 'text-outflow';
    return '';
  }

  getTypeClass(type: string): string {
    return type === 'INFLOW' ? 'text-inflow' : 'text-outflow';
  }

  truncate(text: string, limit = 50): string {
    return text.length > limit ? text.slice(0, limit) + '…' : text;
  }
}
