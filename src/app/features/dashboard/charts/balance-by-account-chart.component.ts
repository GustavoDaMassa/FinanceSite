import { Component, input, computed } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartOptions } from 'chart.js';
import { TranslatePipe } from '@ngx-translate/core';

import { AccountDTO } from '../../../shared/models';

@Component({
  selector: 'app-balance-by-account-chart',
  standalone: true,
  imports: [BaseChartDirective, TranslatePipe],
  template: `
    <div class="chart-container">
      <h3>{{ 'dashboard.balance_by_account' | translate }}</h3>
      @if (chartLabels().length > 0) {
        <canvas baseChart
          [datasets]="chartData()"
          [labels]="chartLabels()"
          [type]="'bar'"
          [options]="chartOptions">
        </canvas>
      } @else {
        <p class="no-data">{{ 'dashboard.no_data' | translate }}</p>
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
export class BalanceByAccountChartComponent {
  accounts = input<AccountDTO[]>([]);

  chartLabels = computed(() => this.accounts().map((a) => a.accountName));

  chartData = computed(() => {
    const data = this.accounts().map((a) => parseFloat(a.balance));
    const backgroundColor = data.map((v) =>
      v >= 0 ? 'rgba(35, 134, 54, 0.7)' : 'rgba(207, 34, 46, 0.7)'
    );
    const borderColor = data.map((v) =>
      v >= 0 ? 'rgba(35, 134, 54, 1)' : 'rgba(207, 34, 46, 1)'
    );
    return [{ label: 'Saldo', data, backgroundColor, borderColor, borderWidth: 1 }];
  });

  chartOptions: ChartOptions<'bar'> = {
    responsive: true,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true } },
  };
}
