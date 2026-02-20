import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

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
 * Permite criar e deletar integracoes.
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
