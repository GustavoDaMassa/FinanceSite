import { Component, inject, signal, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { AccountsService } from '../accounts.service';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import {
  ConfirmDialogComponent,
  ConfirmDialogData,
} from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { AccountDTO } from '../../../shared/models';

/**
 * AccountListComponent — lista todas as contas do usuario.
 *
 * Demonstra:
 * - OnInit para buscar dados
 * - MatDialog para confirmacao de exclusao
 * - refetchQueries no delete para atualizar a lista
 */
@Component({
  selector: 'app-account-list',
  standalone: true,
  imports: [
    RouterLink,
    CurrencyPipe,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    TranslatePipe,
    LoadingSpinnerComponent,
  ],
  templateUrl: './account-list.component.html',
  styleUrl: './account-list.component.scss',
})
export class AccountListComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly accountsService = inject(AccountsService);
  private readonly notification = inject(NotificationService);
  private readonly translate = inject(TranslateService);
  private readonly dialog = inject(MatDialog);

  readonly accounts = signal<AccountDTO[]>([]);
  readonly loading = signal(true);

  ngOnInit(): void {
    const user = this.authService.currentUser();
    if (!user) return;

    this.accountsService.listByUser(String(user.id)).subscribe({
      next: (accounts) => {
        this.accounts.set(accounts);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  confirmDelete(account: AccountDTO): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: this.translate.instant('accounts.delete_title'),
        message: this.translate.instant('accounts.delete_message', {
          name: account.accountName,
        }),
      } as ConfirmDialogData,
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.accountsService.delete(account.id).subscribe({
          next: () => {
            this.accounts.update((list) =>
              list.filter((a) => a.id !== account.id)
            );
            this.notification.success(
              this.translate.instant('common.deleted')
            );
          },
        });
      }
    });
  }

  getBalanceClass(balance: string): string {
    const value = parseFloat(balance);
    if (value > 0) return 'text-inflow';
    if (value < 0) return 'text-outflow';
    return '';
  }
}
