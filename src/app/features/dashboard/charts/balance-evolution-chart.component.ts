import { Component, input, computed } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartOptions } from 'chart.js';
import { TranslatePipe } from '@ngx-translate/core';

import { TransactionDTO } from '../../../shared/models';

@Component({
  selector: 'app-balance-evolution-chart',
  standalone: true,
  imports: [BaseChartDirective, TranslatePipe],
  template: `
    <div class="chart-container">
      <h3>{{ 'dashboard.balance_evolution' | translate }}</h3>
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
export class BalanceEvolutionChartComponent {
  transactions = input<TransactionDTO[]>([]);

  private evolution = computed(() => {
    const dateMap = new Map<string, number>();

    this.transactions().forEach((tx) => {
      const date = tx.transactionDate;
      const amount = parseFloat(tx.amount);
      dateMap.set(date, (dateMap.get(date) || 0) + (tx.type === 'INFLOW' ? amount : -amount));
    });

    const labels: string[] = [];
    const data: number[] = [];
    let cumulative = 0;

    Array.from(dateMap.entries())
      .sort((a, b) => a[0].localeCompare(b[0]))
      .forEach(([date, net]) => {
        cumulative += net;
        labels.push(date);
        data.push(parseFloat(cumulative.toFixed(2)));
      });

    return { labels, data };
  });

  chartLabels = computed(() => this.evolution().labels);

  chartData = computed(() => [{
    label: 'Saldo acumulado',
    data: this.evolution().data,
    borderColor: 'rgba(31, 111, 235, 1)',
    backgroundColor: 'rgba(31, 111, 235, 0.1)',
    fill: true,
    tension: 0.3,
    borderWidth: 2,
    pointRadius: 2,
  }]);

  chartOptions: ChartOptions<'line'> = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: {
      y: { beginAtZero: false },
      x: { ticks: { maxTicksLimit: 10, maxRotation: 45 } },
    },
  };
}
