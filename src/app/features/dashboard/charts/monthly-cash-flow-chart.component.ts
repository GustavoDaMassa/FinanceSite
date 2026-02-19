import { Component, input, computed } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartOptions } from 'chart.js';
import { TranslatePipe } from '@ngx-translate/core';

import { TransactionDTO } from '../../../shared/models';

@Component({
  selector: 'app-monthly-cash-flow-chart',
  standalone: true,
  imports: [BaseChartDirective, TranslatePipe],
  template: `
    <div class="chart-container">
      <h3>{{ 'dashboard.monthly_cash_flow' | translate }}</h3>
      @if (chartLabels().length > 0) {
        <canvas baseChart
          [datasets]="chartData()"
          [labels]="chartLabels()"
          [type]="'line'"
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
export class MonthlyCashFlowChartComponent {
  transactions = input<TransactionDTO[]>([]);

  chartLabels = computed(() => {
    const months = new Set<string>();
    this.transactions().forEach((tx) => {
      const d = new Date(tx.transactionDate);
      months.add(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
    });
    return Array.from(months).sort();
  });

  chartData = computed(() => {
    const labels = this.chartLabels();
    const netByMonth = new Map<string, number>();
    labels.forEach((m) => netByMonth.set(m, 0));

    this.transactions().forEach((tx) => {
      const d = new Date(tx.transactionDate);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const amount = parseFloat(tx.amount);
      netByMonth.set(key, (netByMonth.get(key) || 0) + (tx.type === 'INFLOW' ? amount : -amount));
    });

    const data = labels.map((m) => netByMonth.get(m) || 0);
    const pointBackgroundColor = data.map((v) =>
      v >= 0 ? 'rgba(35, 134, 54, 1)' : 'rgba(207, 34, 46, 1)'
    );

    return [{
      label: 'Fluxo líquido',
      data,
      borderColor: 'rgba(31, 111, 235, 1)',
      backgroundColor: 'rgba(31, 111, 235, 0.1)',
      pointBackgroundColor,
      fill: true,
      tension: 0.3,
      borderWidth: 2,
    }];
  });

  chartOptions: ChartOptions<'line'> = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: false } },
  };
}
