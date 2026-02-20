import { Component, inject, signal, ViewChild, AfterViewInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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

export interface CreateIntegrationDialogData {
  integration: FinancialIntegrationDTO;
  pluggyAccounts: PluggyAccountDTO[];
}

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
export class CreateIntegrationDialogComponent implements AfterViewInit {
  private readonly integrationsService = inject(IntegrationsService);
  private readonly accountsService = inject(AccountsService);
  private readonly notification = inject(NotificationService);
  private readonly translate = inject(TranslateService);
  private readonly matDialog = inject(MatDialog);
  readonly dialogRef = inject(MatDialogRef<CreateIntegrationDialogComponent>);

  // Data injected when reopening at step 2 after Pluggy success
  private readonly dialogData = inject<CreateIntegrationDialogData | null>(MAT_DIALOG_DATA, {
    optional: true,
  });

  @ViewChild('stepper') stepper!: MatStepper;

  readonly loading = signal(false);
  readonly linking = signal(false);
  readonly connectToken = signal<string | null>(null);
  readonly itemId = signal<string | null>(null);
  readonly integration = signal<FinancialIntegrationDTO | null>(null);
  readonly pluggyAccounts = signal<PluggyAccountDTO[]>([]);
  readonly selectedAccounts = signal<Set<string>>(new Set());

  // Step 2 mode: opened with existing integration data
  readonly isStep2 = !!this.dialogData?.integration;

  constructor() {
    if (this.isStep2) {
      this.integration.set(this.dialogData!.integration);
      this.pluggyAccounts.set(this.dialogData!.pluggyAccounts);
      this.itemId.set(this.dialogData!.integration.linkId);
    } else {
      this.fetchConnectToken();
    }
  }

  ngAfterViewInit(): void {
    if (this.isStep2) {
      // Navigate stepper to step 2 after view is ready
      setTimeout(() => this.stepper.next(), 0);
    }
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
        this.notification.error(this.translate.instant('integrations.connect_error'));
      },
    });
  }

  openPluggyWidget(): void {
    const token = this.connectToken();
    if (!token) return;

    // Close this dialog first so Pluggy widget renders without z-index conflict
    this.dialogRef.close();

    const pluggyConnect = new PluggyConnect({
      connectToken: token,
      includeSandbox: true,
      onSuccess: (itemData) => {
        this.notification.success(this.translate.instant('integrations.connect_success'));
        this.integrationsService.create(itemData.item.id).subscribe({
          next: (integration) => {
            this.integrationsService.accountsFromPluggy(integration.id).subscribe({
              next: (accounts) => {
                // Reopen dialog at step 2 with integration data
                this.matDialog.open(CreateIntegrationDialogComponent, {
                  width: '600px',
                  disableClose: true,
                  data: { integration, pluggyAccounts: accounts } as CreateIntegrationDialogData,
                });
              },
              error: () => {
                this.notification.error(this.translate.instant('integrations.connect_error'));
              },
            });
          },
          error: () => {
            this.notification.error(this.translate.instant('integrations.connect_error'));
          },
        });
      },
      onError: () => {
        this.notification.error(this.translate.instant('integrations.connect_error'));
      },
      onClose: () => {},
    });

    pluggyConnect.init().catch(() => {
      this.notification.error(this.translate.instant('integrations.connect_error'));
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
            this.notification.success(this.translate.instant('integrations.created'));
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
