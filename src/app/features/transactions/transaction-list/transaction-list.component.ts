import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { TransactionsService } from '../transactions.service';
import { AccountsService } from '../../accounts/accounts.service';
import { CategoriesService } from '../../categories/categories.service';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import {
  TransactionDTO,
  AccountDTO,
  CategoryDTO,
  TransactionFilterInput,
  PaginationInput,
} from '../../../shared/models';

@Component({
  selector: 'app-transaction-list',
  standalone: true,
  imports: [
    RouterLink,
    CurrencyPipe,
    DatePipe,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    MatExpansionModule,
    MatPaginatorModule,
    TranslatePipe,
    LoadingSpinnerComponent,
  ],
  templateUrl: './transaction-list.component.html',
  styleUrl: './transaction-list.component.scss',
})
export class TransactionListComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly transactionsService = inject(TransactionsService);
  private readonly accountsService = inject(AccountsService);
  private readonly categoriesService = inject(CategoriesService);
  private readonly notification = inject(NotificationService);
  private readonly translate = inject(TranslateService);
  private readonly route = inject(ActivatedRoute);

  readonly transactions = signal<TransactionDTO[]>([]);
  readonly accounts = signal<AccountDTO[]>([]);
  readonly categories = signal<CategoryDTO[]>([]);
  readonly balance = signal('0');
  readonly loading = signal(true);
  readonly selectedAccountId = signal<string>('');

  // Pagination
  readonly pageIndex = signal(0);
  readonly pageSize = signal(20);
  readonly totalElements = signal(0);

  // Filters
  readonly filterForm = this.fb.group({
    startDate: [''],
    endDate: [''],
    type: [''],
    categoryIds: [[] as string[]],
  });

  private filtersActive = false;

  ngOnInit(): void {
    const user = this.authService.currentUser();
    if (!user) return;

    // Check for accountId in query parameters
    const queryAccountId = this.route.snapshot.queryParamMap.get('accountId');
    if (queryAccountId) {
      this.selectedAccountId.set(queryAccountId);
    }

    this.accountsService.listByUser(String(user.id)).subscribe({
      next: (accounts) => this.accounts.set(accounts),
    });

    this.categoriesService.listByUser(String(user.id)).subscribe({
      next: (categories) => this.categories.set(categories),
    });

    this.loadPaginated();
  }

  // ── Account filter ────────────────────────────────────────────

  onAccountFilter(accountId: string): void {
    this.selectedAccountId.set(accountId);
    this.pageIndex.set(0);
    this.filtersActive = false;
    this.filterForm.reset();
    this.loadPaginated();
  }

  // ── Pagination ────────────────────────────────────────────────

  loadPaginated(): void {
    const accountId = this.selectedAccountId() || undefined;
    const pagination: PaginationInput = {
      page: this.pageIndex(),
      size: this.pageSize(),
    };

    this.loading.set(true);

    this.transactionsService.listByAccountPaginated(pagination, accountId).subscribe({
      next: (data) => {
        this.transactions.set(data.transactions);
        this.balance.set(data.balance);
        this.totalElements.set(data.pageInfo.totalElements);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);

    if (this.filtersActive) {
      this.applyFilters();
    } else {
      this.loadPaginated();
    }
  }

  // ── Advanced Filters ──────────────────────────────────────────

  applyFilters(): void {
    const accountId = this.selectedAccountId() || undefined;
    const { startDate, endDate, type, categoryIds } = this.filterForm.getRawValue();

    this.loading.set(true);
    this.filtersActive = true;

    const hasDateRange = startDate && endDate;
    const hasType = type && type !== '';
    const hasCategoryFilter = categoryIds && categoryIds.length > 0;

    const pagination: PaginationInput = {
      page: this.pageIndex(),
      size: this.pageSize(),
    };

    if (hasCategoryFilter) {
      const filter: TransactionFilterInput = { categoryIds: categoryIds! };
      this.transactionsService.listByFilter(filter, accountId).subscribe({
        next: (data) => {
          let transactions = data.transactions;
          if (hasDateRange) {
            transactions = transactions.filter((tx) => {
              const txDate = new Date(tx.transactionDate);
              return txDate >= new Date(startDate!) && txDate <= new Date(endDate!);
            });
          }
          if (hasType) {
            transactions = transactions.filter((tx) => tx.type === type);
          }
          this.transactions.set(transactions);
          this.balance.set(this.calculateBalance(transactions));
          this.totalElements.set(transactions.length);
          this.loading.set(false);
        },
        error: () => this.loading.set(false),
      });
    } else if (hasDateRange && hasType) {
      this.transactionsService
        .listByPeriodPaginated(
          { startDate: startDate!, endDate: endDate! },
          pagination,
          accountId
        )
        .subscribe({
          next: (data) => {
            const transactions = data.transactions.filter((tx) => tx.type === type);
            this.transactions.set(transactions);
            this.balance.set(data.balance);
            this.totalElements.set(data.pageInfo.totalElements);
            this.loading.set(false);
          },
          error: () => this.loading.set(false),
        });
    } else if (hasDateRange) {
      this.transactionsService
        .listByPeriodPaginated(
          { startDate: startDate!, endDate: endDate! },
          pagination,
          accountId
        )
        .subscribe({
          next: (data) => {
            this.transactions.set(data.transactions);
            this.balance.set(data.balance);
            this.totalElements.set(data.pageInfo.totalElements);
            this.loading.set(false);
          },
          error: () => this.loading.set(false),
        });
    } else if (hasType) {
      this.transactionsService
        .listByTypePaginated(type!, pagination, accountId)
        .subscribe({
          next: (data) => {
            this.transactions.set(data.transactions);
            this.balance.set(data.balance);
            this.totalElements.set(data.pageInfo.totalElements);
            this.loading.set(false);
          },
          error: () => this.loading.set(false),
        });
    } else {
      this.filtersActive = false;
      this.loadPaginated();
    }
  }

  clearFilters(): void {
    this.filterForm.reset();
    this.filtersActive = false;
    this.pageIndex.set(0);
    this.loadPaginated();
  }

  // ── Categorization ────────────────────────────────────────────

  onCategorize(transactionId: string, categoryId: string): void {
    const catId = categoryId || null;
    this.transactionsService.categorize(transactionId, catId).subscribe({
      next: (updated) => {
        this.transactions.update((list) =>
          list.map((tx) => (tx.id === updated.id ? updated : tx))
        );
        this.notification.success(
          this.translate.instant('transactions.categorized')
        );
      },
    });
  }

  getCategoryName(categoryId?: string): string {
    if (!categoryId) return this.translate.instant('transactions.uncategorized');
    const category = this.categories().find((c) => c.id === categoryId);
    return category?.name || this.translate.instant('transactions.uncategorized');
  }

  // ── Helpers ───────────────────────────────────────────────────

  getTypeClass(type: string): string {
    return type === 'INFLOW' ? 'text-inflow' : 'text-outflow';
  }

  truncate(text: string, limit = 50): string {
    return text.length > limit ? text.slice(0, limit) + '…' : text;
  }

  getBalanceClass(balance: string): string {
    const value = parseFloat(balance);
    if (value > 0) return 'text-inflow';
    if (value < 0) return 'text-outflow';
    return '';
  }

  private calculateBalance(transactions: TransactionDTO[]): string {
    const balance = transactions.reduce((acc, tx) => {
      const amount = parseFloat(tx.amount);
      return tx.type === 'INFLOW' ? acc + amount : acc - amount;
    }, 0);
    return balance.toFixed(2);
  }
}
