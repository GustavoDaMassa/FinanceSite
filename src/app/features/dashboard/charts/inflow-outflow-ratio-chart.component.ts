import { Component, input, computed } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartOptions } from 'chart.js';
import { TranslatePipe } from '@ngx-translate/core';

import { TransactionDTO } from '../../../shared/models';

@Component({
  selector: 'app-inflow-outflow-ratio-chart',
  standalone: true,
  imports: [BaseChartDirective, TranslatePipe],
  template: `
    <div class="chart-container">
      <h3>{{ 'dashboard.inflow_outflow_ratio' | translate }}</h3>
      @if (hasData()) {
        <canvas baseChart
          [datasets]="chartData()"
          [labels]="chartLabels"
          [type]="'doughnut'"
          [options]="chartOptions">
        </canvas>
        <p class="ratio-label" [class]="ratioClass()">{{ ratioText() }}</p>
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
      canvas { max-height: 260px; }
      .no-data {
        text-align: center;
        color: var(--color-text-secondary);
        padding: var(--spacing-xl);
      }
      .ratio-label {
        text-align: center;
        margin: var(--spacing-sm) 0 0;
        font-size: var(--font-sm);
        font-weight: 600;
      }
    }
  `,
})
export class InflowOutflowRatioChartComponent {
  transactions = input<TransactionDTO[]>([]);

  readonly chartLabels = ['Entradas', 'Saídas'];

  private totals = computed(() => {
    let inflow = 0, outflow = 0;
    this.transactions().forEach((tx) => {
      if (tx.type === 'INFLOW') inflow += parseFloat(tx.amount);
      else outflow += parseFloat(tx.amount);
    });
    return { inflow, outflow };
  });

  hasData = computed(() => {
    const { inflow, outflow } = this.totals();
    return inflow > 0 || outflow > 0;
  });

  chartData = computed(() => [{
    data: [this.totals().inflow, this.totals().outflow],
    backgroundColor: ['rgba(35, 134, 54, 0.8)', 'rgba(207, 34, 46, 0.8)'],
    borderColor: ['rgba(35, 134, 54, 1)', 'rgba(207, 34, 46, 1)'],
    borderWidth: 1,
  }]);

  ratioText = computed(() => {
    const { inflow, outflow } = this.totals();
    const total = inflow + outflow;
    if (total === 0) return '';
    const pct = ((inflow / total) * 100).toFixed(1);
    return `${pct}% entradas · ${(100 - parseFloat(pct)).toFixed(1)}% saídas`;
  });

  ratioClass = computed(() => {
    const { inflow, outflow } = this.totals();
    return inflow >= outflow ? 'text-inflow' : 'text-outflow';
  });

  chartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    plugins: { legend: { position: 'bottom' } },
    cutout: '65%',
  };
}
