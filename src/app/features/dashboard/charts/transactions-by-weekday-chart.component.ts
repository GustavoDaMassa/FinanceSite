import { Component, input, computed } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartOptions } from 'chart.js';
import { TranslatePipe } from '@ngx-translate/core';

import { TransactionDTO } from '../../../shared/models';

const WEEKDAYS = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

@Component({
  selector: 'app-transactions-by-weekday-chart',
  standalone: true,
  imports: [BaseChartDirective, TranslatePipe],
  template: `
    <div class="chart-container">
      <h3>{{ 'dashboard.transactions_by_weekday' | translate }}</h3>
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
export class TransactionsByWeekdayChartComponent {
  transactions = input<TransactionDTO[]>([]);

  readonly chartLabels = WEEKDAYS;

  hasData = computed(() => this.transactions().some((tx) => tx.type === 'OUTFLOW'));

  chartData = computed(() => {
    const totals = new Array(7).fill(0);

    this.transactions()
      .filter((tx) => tx.type === 'OUTFLOW')
      .forEach((tx) => {
        const day = new Date(tx.transactionDate).getDay();
        totals[day] += parseFloat(tx.amount);
      });

    const backgroundColor = [
      'rgba(107, 76, 201, 0.7)',
      'rgba(31, 111, 235, 0.7)',
      'rgba(31, 111, 235, 0.7)',
      'rgba(31, 111, 235, 0.7)',
      'rgba(31, 111, 235, 0.7)',
      'rgba(31, 111, 235, 0.7)',
      'rgba(107, 76, 201, 0.7)',
    ];

    return [{ label: 'Total gasto', data: totals, backgroundColor }];
  });

  chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true } },
  };
}
