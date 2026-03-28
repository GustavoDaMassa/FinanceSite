import { Component, inject, signal, OnInit, ElementRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { AccountsService } from '../../accounts/accounts.service';
import { TransactionImportService } from './transaction-import.service';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import { AccountDTO, ImportResultDTO } from '../../../shared/models';

@Component({
  selector: 'app-transaction-import',
  standalone: true,
  imports: [
    CurrencyPipe,
    DatePipe,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    TranslatePipe,
    LoadingSpinnerComponent,
  ],
  templateUrl: './transaction-import.component.html',
  styleUrl: './transaction-import.component.scss',
})
export class TransactionImportComponent implements OnInit {
  @ViewChild('fileInput') fileInputRef!: ElementRef<HTMLInputElement>;

  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly accountsService = inject(AccountsService);
  private readonly importService = inject(TransactionImportService);
  private readonly notification = inject(NotificationService);
  private readonly translate = inject(TranslateService);

  readonly accounts = signal<AccountDTO[]>([]);
  readonly loading = signal(false);
  readonly result = signal<ImportResultDTO | null>(null);
  readonly selectedFile = signal<File | null>(null);

  readonly form = this.fb.group({
    accountId: ['', Validators.required],
  });

  ngOnInit(): void {
    const user = this.authService.currentUser();
    if (!user) return;

    this.accountsService.listByUser(String(user.id)).subscribe({
      next: (accounts) => this.accounts.set(accounts),
    });
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.selectedFile.set(input.files?.[0] ?? null);
  }

  triggerFileInput(): void {
    this.fileInputRef.nativeElement.click();
  }

  onSubmit(): void {
    if (this.form.invalid || !this.selectedFile()) return;

    const accountId = this.form.getRawValue().accountId!;
    const file = this.selectedFile()!;

    this.loading.set(true);
    this.result.set(null);

    this.importService.import(file, accountId).subscribe({
      next: (result) => {
        this.result.set(result);
        this.loading.set(false);
        this.notification.success(
          this.translate.instant('import.success', { imported: result.imported })
        );
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/transactions']);
  }

  getTypeClass(type: string): string {
    return type === 'INFLOW' ? 'text-inflow' : 'text-outflow';
  }
}
