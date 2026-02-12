import { Component, input, computed } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartOptions } from 'chart.js';
import { TranslatePipe } from '@ngx-translate/core';

import { TransactionDTO } from '../../../shared/models';

@Component({
  selector: 'app-income-expense-chart',
  standalone: true,
  imports: [BaseChartDirective, TranslatePipe],
  template: `
    <div class="chart-container">
      <h3>{{ 'dashboard.income_vs_expense' | translate }}</h3>
      @if (chartLabels().length > 0) {
        <canvas baseChart
          [datasets]="chartData()"
          [labels]="chartLabels()"
          [type]="'bar'"
          [options]="chartOptions">
        </canvas>
      } @else {
        <p class="no-data">{{ 'dashboard.no_transactions' | translate }}</p>
      }
    </div>
  `,
  styles: `
    .chart-container {
      h3 {
        color: var(--color-text-primary);
        margin: 0 0 var(--spacing-md) 0;
        font-size: var(--font-md);
      }
      canvas { max-height: 300px; }
      .no-data {
        text-align: center;
        color: var(--color-text-secondary);
        padding: var(--spacing-xl);
      }
    }
  `,
})
export class IncomeExpenseChartComponent {
  transactions = input<TransactionDTO[]>([]);

  chartLabels = computed(() => {
    const months = new Set<string>();
    this.transactions().forEach((tx) => {
      const date = new Date(tx.transactionDate);
      months.add(`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`);
    });
    return Array.from(months).sort();
  });

  chartData = computed(() => {
    const labels = this.chartLabels();
    const incomeByMonth = new Map<string, number>();
    const expenseByMonth = new Map<string, number>();

    this.transactions().forEach((tx) => {
      const date = new Date(tx.transactionDate);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      if (tx.type === 'INFLOW') {
        incomeByMonth.set(key, (incomeByMonth.get(key) || 0) + parseFloat(tx.amount));
      } else {
        expenseByMonth.set(key, (expenseByMonth.get(key) || 0) + parseFloat(tx.amount));
      }
    });

    return [
      {
        label: 'Receitas',
        data: labels.map((m) => incomeByMonth.get(m) || 0),
        backgroundColor: 'rgba(35, 134, 54, 0.7)',
      },
      {
        label: 'Despesas',
        data: labels.map((m) => expenseByMonth.get(m) || 0),
        backgroundColor: 'rgba(207, 34, 46, 0.7)',
      },
    ];
  });

  chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: { legend: { position: 'bottom' } },
    scales: { y: { beginAtZero: true } },
  };
}
