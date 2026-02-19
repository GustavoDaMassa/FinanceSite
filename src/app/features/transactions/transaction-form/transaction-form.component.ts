import { Component, inject, signal, OnInit } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { TransactionsService } from '../transactions.service';
import { AccountsService } from '../../accounts/accounts.service';
import { CategoriesService } from '../../categories/categories.service';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import {
  ConfirmDialogComponent,
  ConfirmDialogData,
} from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { AccountDTO, CategoryDTO, TransactionType } from '../../../shared/models';

/**
 * TransactionFormComponent — formulario de criacao/edicao de transacao.
 *
 * Reutilizado para duas rotas:
 * - /transactions/new → cria nova transacao
 * - /transactions/:id/edit → edita transacao existente
 *
 * O id vem do ActivatedRoute.snapshot.params. Se existir, carrega
 * os dados da transacao para preencher o formulario (modo edicao).
 */
@Component({
  selector: 'app-transaction-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule,
    MatProgressSpinnerModule,
    TranslatePipe,
    LoadingSpinnerComponent,
  ],
  templateUrl: './transaction-form.component.html',
  styleUrl: './transaction-form.component.scss',
})
export class TransactionFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly authService = inject(AuthService);
  private readonly transactionsService = inject(TransactionsService);
  private readonly accountsService = inject(AccountsService);
  private readonly categoriesService = inject(CategoriesService);
  private readonly notification = inject(NotificationService);
  private readonly translate = inject(TranslateService);
  private readonly dialog = inject(MatDialog);

  readonly today = new Date().toISOString().split('T')[0];
  readonly loading = signal(false);
  readonly loadingData = signal(false);
  readonly isEditMode = signal(false);
  readonly accounts = signal<AccountDTO[]>([]);
  readonly categories = signal<CategoryDTO[]>([]);
  private transactionId = '';

  readonly transactionForm = this.fb.nonNullable.group({
    amount: ['', [Validators.required]],
    type: ['OUTFLOW', [Validators.required]],
    description: [''],
    source: [''],
    destination: [''],
    transactionDate: ['', [Validators.required]],
    accountId: ['', [Validators.required]],
    categoryId: [''],
  });

  readonly selectedType = toSignal(
    this.transactionForm.controls.type.valueChanges,
    { initialValue: 'OUTFLOW' }
  );

  ngOnInit(): void {
    const user = this.authService.currentUser();
    if (!user) return;

    this.accountsService.listByUser(String(user.id)).subscribe({
      next: (accounts) => this.accounts.set(accounts),
    });

    this.categoriesService.listByUser(String(user.id)).subscribe({
      next: (categories) => this.categories.set(categories),
    });

    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEditMode.set(true);
      this.transactionId = id;
      this.loadingData.set(true);

      this.transactionsService.findById(id).subscribe({
        next: (tx) => {
          this.transactionForm.patchValue({
            amount: tx.amount,
            type: tx.type,
            description: tx.description || '',
            source: tx.source || '',
            destination: tx.destination || '',
            transactionDate: tx.transactionDate,
            accountId: tx.accountId,
            categoryId: tx.categoryId || '',
          });
          this.loadingData.set(false);
        },
        error: () => this.loadingData.set(false),
      });
    }
  }

  onSubmit(): void {
    if (this.transactionForm.invalid) return;

    this.loading.set(true);
    const formValue = this.transactionForm.getRawValue();

    const input = {
      ...formValue,
      amount: String(formValue.amount),
      type: formValue.type as TransactionType,
      categoryId: formValue.categoryId || undefined,
    };

    const operation = this.isEditMode()
      ? this.transactionsService.update(this.transactionId, input)
      : this.transactionsService.create(input);

    operation.subscribe({
      next: (result) => {
        if (!result) {
          this.loading.set(false);
          return;
        }
        this.notification.success(
          this.translate.instant(
            this.isEditMode() ? 'transactions.updated' : 'transactions.created'
          )
        );
        this.router.navigate(['/transactions']);
      },
      error: () => this.loading.set(false),
    });
  }

  onDelete(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: this.translate.instant('transactions.delete_title'),
        message: this.translate.instant('transactions.delete_message'),
      } as ConfirmDialogData,
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (!confirmed) return;
      this.loading.set(true);
      this.transactionsService.delete(this.transactionId).subscribe({
        next: () => {
          this.notification.success(this.translate.instant('common.deleted'));
          this.router.navigate(['/transactions']);
        },
        error: () => this.loading.set(false),
      });
    });
  }
}
