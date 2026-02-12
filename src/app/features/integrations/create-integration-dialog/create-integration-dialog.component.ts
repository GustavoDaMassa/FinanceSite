import { Component, inject, signal } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { IntegrationsService } from '../integrations.service';
import { AccountsService } from '../../accounts/accounts.service';
import { NotificationService } from '../../../core/services/notification.service';
import {
  FinancialIntegrationDTO,
  PluggyAccountDTO,
  LinkAccountInput,
} from '../../../shared/models';

@Component({
  selector: 'app-create-integration-dialog',
  standalone: true,
  imports: [
    CurrencyPipe,
    ReactiveFormsModule,
    MatDialogModule,
    MatStepperModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatCardModule,
    TranslatePipe,
  ],
  templateUrl: './create-integration-dialog.component.html',
  styleUrl: './create-integration-dialog.component.scss',
})
export class CreateIntegrationDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly integrationsService = inject(IntegrationsService);
  private readonly accountsService = inject(AccountsService);
  private readonly notification = inject(NotificationService);
  private readonly translate = inject(TranslateService);
  readonly dialogRef = inject(MatDialogRef<CreateIntegrationDialogComponent>);

  readonly loading = signal(false);
  readonly linking = signal(false);
  readonly integration = signal<FinancialIntegrationDTO | null>(null);
  readonly pluggyAccounts = signal<PluggyAccountDTO[]>([]);
  readonly selectedAccounts = signal<Set<string>>(new Set());

  readonly itemIdForm = this.fb.nonNullable.group({
    itemId: ['', [Validators.required]],
  });

  createIntegration(): void {
    if (this.itemIdForm.invalid) return;

    this.loading.set(true);
    const { itemId } = this.itemIdForm.getRawValue();

    this.integrationsService.create(itemId).subscribe({
      next: (integration) => {
        this.integration.set(integration);
        this.loading.set(false);
        this.loadPluggyAccounts(integration.id);
      },
      error: () => this.loading.set(false),
    });
  }

  loadPluggyAccounts(integrationId: string): void {
    this.loading.set(true);
    this.integrationsService.accountsFromPluggy(integrationId).subscribe({
      next: (accounts) => {
        this.pluggyAccounts.set(accounts);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  toggleAccount(accountId: string): void {
    this.selectedAccounts.update((set) => {
      const newSet = new Set(set);
      if (newSet.has(accountId)) {
        newSet.delete(accountId);
      } else {
        newSet.add(accountId);
      }
      return newSet;
    });
  }

  isSelected(accountId: string): boolean {
    return this.selectedAccounts().has(accountId);
  }

  linkSelectedAccounts(): void {
    const integrationId = this.integration()?.id;
    if (!integrationId) return;

    const selected = this.pluggyAccounts().filter(
      (a) => a.id && this.selectedAccounts().has(a.id)
    );

    if (selected.length === 0) return;

    this.linking.set(true);
    let completed = 0;

    selected.forEach((account) => {
      const input: LinkAccountInput = {
        integrationId,
        pluggyAccountId: account.id!,
        name: account.name || 'Conta Pluggy',
        type: account.type || 'CHECKING',
      };

      this.accountsService.linkAccount(input).subscribe({
        next: () => {
          completed++;
          if (completed === selected.length) {
            this.linking.set(false);
            this.notification.success(
              this.translate.instant('integrations.created')
            );
            this.dialogRef.close(true);
          }
        },
        error: () => {
          completed++;
          if (completed === selected.length) {
            this.linking.set(false);
          }
        },
      });
    });
  }
}
