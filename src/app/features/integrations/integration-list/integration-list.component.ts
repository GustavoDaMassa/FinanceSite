import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { PluggyConnect } from 'pluggy-connect-sdk';

import { NotificationService } from '../../../core/services/notification.service';
import { IntegrationsService } from '../integrations.service';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import {
  ConfirmDialogComponent,
  ConfirmDialogData,
} from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { CreateIntegrationDialogComponent } from '../create-integration-dialog/create-integration-dialog.component';
import { FinancialIntegrationDTO } from '../../../shared/models';

/**
 * IntegrationListComponent — lista integracoes financeiras.
 *
 * Exibe integracoes ativas com agregador, status e datas.
 * Permite criar, reconectar e deletar integracoes.
 */
@Component({
  selector: 'app-integration-list',
  standalone: true,
  imports: [
    DatePipe,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    TranslatePipe,
    LoadingSpinnerComponent,
  ],
  templateUrl: './integration-list.component.html',
  styleUrl: './integration-list.component.scss',
})
export class IntegrationListComponent implements OnInit, OnDestroy {
  private readonly integrationsService = inject(IntegrationsService);
  private readonly notification = inject(NotificationService);
  private readonly translate = inject(TranslateService);
  private readonly dialog = inject(MatDialog);

  readonly integrations = signal<FinancialIntegrationDTO[]>([]);
  readonly loading = signal(true);
  readonly reconnecting = signal<string | null>(null);

  private linkedSub?: Subscription;

  ngOnInit(): void {
    this.loadIntegrations();
    this.linkedSub = this.integrationsService.integrationLinked$.subscribe(() => {
      this.loadIntegrations();
    });
  }

  ngOnDestroy(): void {
    this.linkedSub?.unsubscribe();
  }

  isOutdated(integration: FinancialIntegrationDTO): boolean {
    if (integration.status === 'OUTDATED' || integration.status === 'LOGIN_ERROR') return true;
    if (integration.expiresAt && new Date(integration.expiresAt) < new Date()) return true;
    return false;
  }

  openCreateDialog(): void {
    const dialogRef = this.dialog.open(CreateIntegrationDialogComponent, {
      width: '600px',
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((created) => {
      if (created) {
        this.loadIntegrations();
      }
    });
  }

  reconnect(integration: FinancialIntegrationDTO): void {
    this.reconnecting.set(integration.id);
    this.integrationsService.createConnectTokenForItem(integration.linkId).subscribe({
      next: (token) => {
        const pluggyConnect = new PluggyConnect({
          connectToken: token,
          updateItem: integration.linkId,
          includeSandbox: true,
          onSuccess: () => {
            this.integrationsService.reconnect(integration.id).subscribe({
              next: (updated) => {
                this.integrations.update((list) =>
                  list.map((i) => (i.id === updated.id ? updated : i))
                );
                this.reconnecting.set(null);
                this.notification.success(
                  this.translate.instant('integrations.reconnect_success')
                );
                this.integrationsService.syncTransactions(integration.id).subscribe();
              },
              error: () => {
                this.reconnecting.set(null);
                this.notification.error(
                  this.translate.instant('integrations.connect_error')
                );
              },
            });
          },
          onError: () => {
            this.reconnecting.set(null);
            this.notification.error(
              this.translate.instant('integrations.connect_error')
            );
          },
          onClose: () => {
            this.reconnecting.set(null);
          },
        });

        pluggyConnect.init().catch(() => {
          this.reconnecting.set(null);
          this.notification.error(
            this.translate.instant('integrations.connect_error')
          );
        });
      },
      error: () => {
        this.reconnecting.set(null);
        this.notification.error(
          this.translate.instant('integrations.connect_error')
        );
      },
    });
  }

  confirmDelete(integration: FinancialIntegrationDTO): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: this.translate.instant('integrations.delete_title'),
        message: this.translate.instant('integrations.delete_message'),
      } as ConfirmDialogData,
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.integrationsService.delete(integration.id).subscribe({
          next: () => {
            this.integrations.update((list) =>
              list.filter((i) => i.id !== integration.id)
            );
            this.notification.success(this.translate.instant('common.deleted'));
          },
        });
      }
    });
  }

  private loadIntegrations(): void {
    this.loading.set(true);
    this.integrationsService.list().subscribe({
      next: (integrations) => {
        this.integrations.set(integrations);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }
}
