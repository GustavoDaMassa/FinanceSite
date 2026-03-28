import { Component, input, computed } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartOptions } from 'chart.js';
import { TranslatePipe } from '@ngx-translate/core';

import { TransactionDTO } from '../../../shared/models';

@Component({
  selector: 'app-transactions-by-date-chart',
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
export class TransactionsByDateChartComponent {
  transactions = input<TransactionDTO[]>([]);

  chartLabels = computed(() => {
    const months = new Set<string>();
    this.transactions().forEach((tx) => {
      months.add(this.toMonthKey(tx.transactionDate));
    });
    return Array.from(months).sort().map((key) => this.formatMonthLabel(key));
  });

  chartData = computed(() => {
    const monthKeys = Array.from(
      new Set(this.transactions().map((tx) => this.toMonthKey(tx.transactionDate)))
    ).sort();

    const inflow = new Map<string, number>();
    const outflow = new Map<string, number>();
    monthKeys.forEach((k) => { inflow.set(k, 0); outflow.set(k, 0); });

    this.transactions().forEach((tx) => {
      const key = this.toMonthKey(tx.transactionDate);
      const amount = parseFloat(tx.amount);
      if (tx.type === 'INFLOW') {
        inflow.set(key, (inflow.get(key) || 0) + amount);
      } else {
        outflow.set(key, (outflow.get(key) || 0) + amount);
      }
    });

    return [
      {
        label: 'Receitas',
        data: monthKeys.map((k) => inflow.get(k) || 0),
        backgroundColor: 'rgba(46, 160, 67, 0.8)',
        borderColor: 'rgba(46, 160, 67, 1)',
        borderWidth: 1,
      },
      {
        label: 'Despesas',
        data: monthKeys.map((k) => outflow.get(k) || 0),
        backgroundColor: 'rgba(207, 34, 46, 0.8)',
        borderColor: 'rgba(207, 34, 46, 1)',
        borderWidth: 1,
      },
    ];
  });

  chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  private toMonthKey(dateStr: string): string {
    const d = new Date(dateStr + 'T00:00:00');
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  }

  private formatMonthLabel(key: string): string {
    const [year, month] = key.split('-');
    const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
                    'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    return `${months[parseInt(month) - 1]}/${year.slice(2)}`;
  }
}
