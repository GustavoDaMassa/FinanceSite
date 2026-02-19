import { Component, input, computed } from '@angular/core';
import { BaseChartDirective } from 'ng2-charts';
import { ChartOptions } from 'chart.js';
import { TranslatePipe } from '@ngx-translate/core';

import { TransactionDTO, CategoryDTO } from '../../../shared/models';

@Component({
  selector: 'app-expense-by-category-chart',
  standalone: true,
  imports: [BaseChartDirective, TranslatePipe],
  template: `
    <div class="chart-container">
      <h3>{{ 'dashboard.expense_by_category' | translate }}</h3>
      @if (chartLabels().length > 0) {
        <canvas baseChart
          [datasets]="chartData()"
          [labels]="chartLabels()"
          [type]="'doughnut'"
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
export class ExpenseByCategoryChartComponent {
  transactions = input<TransactionDTO[]>([]);
  categories = input<CategoryDTO[]>([]);

  private readonly COLORS = [
    '#238636', '#1f6feb', '#cf222e', '#9a6700', '#8b949e',
    '#6e40c9', '#0969da', '#bf8700', '#57606a', '#da3633',
    '#3fb950', '#2ea043', '#58a6ff', '#1f6feb', '#ff7b72',
    '#f85149', '#ffa657', '#d29922', '#d2a8ff', '#bc8cff',
    '#a371f7', '#79c0ff', '#56d364', '#fa7970', '#e3b341'
  ];

  chartLabels = computed(() => {
    const map = this.buildCategoryMap();
    return Array.from(map.keys());
  });

  chartData = computed(() => {
    const map = this.buildCategoryMap();
    const data = Array.from(map.values());
    const backgroundColor = data.map((_, i) => this.COLORS[i % this.COLORS.length]);
    return [{
      data,
      backgroundColor,
    }];
  });

  chartOptions: ChartOptions<'doughnut'> = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' },
    },
  };

  private buildCategoryMap(): Map<string, number> {
    const expenses = this.transactions().filter((tx) => tx.type === 'OUTFLOW');
    const map = new Map<string, number>();

    expenses.forEach((tx) => {
      const catName = this.getCategoryName(tx.categoryId);
      map.set(catName, (map.get(catName) || 0) + parseFloat(tx.amount));
    });

    return map;
  }

  private getCategoryName(categoryId?: string): string {
    if (!categoryId) return 'Sem categoria';
    return this.categories().find((c) => c.id === categoryId)?.name || 'Sem categoria';
  }
}
