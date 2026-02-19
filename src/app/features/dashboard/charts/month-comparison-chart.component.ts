import { Component, input, computed } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartOptions } from 'chart.js';
import { TranslatePipe } from '@ngx-translate/core';

import { TransactionDTO } from '../../../shared/models';

@Component({
  selector: 'app-month-comparison-chart',
  standalone: true,
  imports: [BaseChartDirective, TranslatePipe],
  template: `
    <div class="chart-container">
      <h3>{{ 'dashboard.month_comparison' | translate }}</h3>
      @if (hasData()) {
        <canvas baseChart
          [datasets]="chartData()"
          [labels]="chartLabels"
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
export class MonthComparisonChartComponent {
  transactions = input<TransactionDTO[]>([]);

  readonly chartLabels = ['Entradas', 'Saídas'];

  private comparison = computed(() => {
    const now = new Date();
    const currentKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const prevKey = `${prev.getFullYear()}-${String(prev.getMonth() + 1).padStart(2, '0')}`;

    let curInflow = 0, curOutflow = 0, prevInflow = 0, prevOutflow = 0;

    this.transactions().forEach((tx) => {
      const d = new Date(tx.transactionDate);
      const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
      const amount = parseFloat(tx.amount);

      if (key === currentKey) {
        if (tx.type === 'INFLOW') curInflow += amount;
        else curOutflow += amount;
      } else if (key === prevKey) {
        if (tx.type === 'INFLOW') prevInflow += amount;
        else prevOutflow += amount;
      }
    });

    return { curInflow, curOutflow, prevInflow, prevOutflow, currentKey, prevKey };
  });

  hasData = computed(() => {
    const c = this.comparison();
    return c.curInflow > 0 || c.curOutflow > 0 || c.prevInflow > 0 || c.prevOutflow > 0;
  });

  chartData = computed(() => {
    const c = this.comparison();
    return [
      {
        label: c.prevKey,
        data: [c.prevInflow, c.prevOutflow],
        backgroundColor: ['rgba(35, 134, 54, 0.4)', 'rgba(207, 34, 46, 0.4)'],
      },
      {
        label: c.currentKey,
        data: [c.curInflow, c.curOutflow],
        backgroundColor: ['rgba(35, 134, 54, 0.85)', 'rgba(207, 34, 46, 0.85)'],
      },
    ];
  });

  chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: { legend: { position: 'bottom' } },
    scales: { y: { beginAtZero: true } },
  };
}
