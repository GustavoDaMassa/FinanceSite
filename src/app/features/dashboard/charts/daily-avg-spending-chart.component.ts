import { Component, input, computed } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartOptions } from 'chart.js';
import { TranslatePipe } from '@ngx-translate/core';

import { TransactionDTO } from '../../../shared/models';

@Component({
  selector: 'app-daily-avg-spending-chart',
  standalone: true,
  imports: [BaseChartDirective, TranslatePipe],
  template: `
    <div class="chart-container">
      <h3>{{ 'dashboard.daily_avg_spending' | translate }}</h3>
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
export class DailyAvgSpendingChartComponent {
  transactions = input<TransactionDTO[]>([]);

  private monthlyData = computed(() => {
    const totalByMonth = new Map<string, number>();
    const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();

    this.transactions()
      .filter((tx) => tx.type === 'OUTFLOW')
      .forEach((tx) => {
        const d = new Date(tx.transactionDate);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        totalByMonth.set(key, (totalByMonth.get(key) || 0) + parseFloat(tx.amount));
      });

    const labels: string[] = [];
    const data: number[] = [];

    Array.from(totalByMonth.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .forEach(([key, total]) => {
        const [year, month] = key.split('-').map(Number);
        const days = daysInMonth(year, month - 1);
        labels.push(key);
        data.push(parseFloat((total / days).toFixed(2)));
      });

    return { labels, data };
  });

  chartLabels = computed(() => this.monthlyData().labels);

  chartData = computed(() => [{
    label: 'Média diária (R$)',
    data: this.monthlyData().data,
    backgroundColor: 'rgba(207, 34, 46, 0.7)',
    borderColor: 'rgba(207, 34, 46, 1)',
    borderWidth: 1,
  }]);

  chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true } },
  };
}
