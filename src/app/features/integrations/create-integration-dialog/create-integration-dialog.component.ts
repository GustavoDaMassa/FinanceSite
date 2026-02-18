import { Component, inject, signal, ViewChild } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatStepper, MatStepperModule } from '@angular/material/stepper';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { PluggyConnect } from 'pluggy-connect-sdk';

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
    MatDialogModule,
    MatStepperModule,
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
  private readonly integrationsService = inject(IntegrationsService);
  private readonly accountsService = inject(AccountsService);
  private readonly notification = inject(NotificationService);
  private readonly translate = inject(TranslateService);
  readonly dialogRef = inject(MatDialogRef<CreateIntegrationDialogComponent>);

  @ViewChild('stepper') stepper!: MatStepper;

  readonly loading = signal(false);
  readonly linking = signal(false);
  readonly connectingBank = signal(false);
  readonly connectToken = signal<string | null>(null);
  readonly itemId = signal<string | null>(null);
  readonly integration = signal<FinancialIntegrationDTO | null>(null);
  readonly pluggyAccounts = signal<PluggyAccountDTO[]>([]);
  readonly selectedAccounts = signal<Set<string>>(new Set());

  constructor() {
    this.fetchConnectToken();
  }

  private fetchConnectToken(): void {
    this.loading.set(true);
    this.integrationsService.createConnectToken().subscribe({
      next: (token) => {
        this.connectToken.set(token);
        this.loading.set(false);
      },
      error: () => {
        this.loading.set(false);
        this.notification.success(
          this.translate.instant('integrations.connect_error')
        );
      },
    });
  }

  openPluggyWidget(): void {
    const token = this.connectToken();
    if (!token) return;

    this.connectingBank.set(true);

    const pluggyConnect = new PluggyConnect({
      connectToken: token,
      onSuccess: (itemData) => {
        this.itemId.set(itemData.item.id);
        this.connectingBank.set(false);
        this.notification.success(
          this.translate.instant('integrations.connect_success')
        );
        this.createIntegrationWithItemId(itemData.item.id);
      },
      onError: () => {
        this.connectingBank.set(false);
        this.notification.success(
          this.translate.instant('integrations.connect_error')
        );
      },
    });

    pluggyConnect.init();
  }

  private createIntegrationWithItemId(itemId: string): void {
    this.loading.set(true);

    this.integrationsService.create(itemId).subscribe({
      next: (integration) => {
        this.integration.set(integration);
        this.loading.set(false);
        this.loadPluggyAccounts(integration.id);
        this.stepper.next();
      },
      error: () => this.loading.set(false),
    });
  }

  private loadPluggyAccounts(integrationId: string): void {
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
