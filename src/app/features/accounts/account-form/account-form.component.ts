import { Component, inject, signal, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { AccountsService } from '../accounts.service';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';

/**
 * AccountFormComponent — formulario de criacao/edicao de conta.
 *
 * Reutilizado para duas rotas:
 * - /accounts/new → cria nova conta
 * - /accounts/:id/edit → edita conta existente
 *
 * O id vem do ActivatedRoute.snapshot.params. Se existir, carrega
 * os dados da conta para preencher o formulario (modo edicao).
 */
@Component({
  selector: 'app-account-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    TranslatePipe,
    LoadingSpinnerComponent,
  ],
  templateUrl: './account-form.component.html',
  styleUrl: './account-form.component.scss',
})
export class AccountFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly authService = inject(AuthService);
  private readonly accountsService = inject(AccountsService);
  private readonly notification = inject(NotificationService);
  private readonly translate = inject(TranslateService);

  readonly loading = signal(false);
  readonly loadingData = signal(false);
  readonly isEditMode = signal(false);
  private accountId = '';

  readonly accountForm = this.fb.nonNullable.group({
    accountName: ['', [Validators.required]],
    institution: ['', [Validators.required]],
    description: [''],
  });

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.isEditMode.set(true);
      this.accountId = id;
      this.loadingData.set(true);

      this.accountsService.findById(id).subscribe({
        next: (account) => {
          this.accountForm.patchValue({
            accountName: account.accountName,
            institution: account.institution,
            description: account.description ?? '',
          });
          this.loadingData.set(false);
        },
        error: () => this.loadingData.set(false),
      });
    }
  }

  onSubmit(): void {
    if (this.accountForm.invalid) return;

    this.loading.set(true);
    const user = this.authService.currentUser();
    if (!user) return;

    const formValue = this.accountForm.getRawValue();
    const input = { ...formValue, userId: String(user.id) };

    const operation = this.isEditMode()
      ? this.accountsService.update(this.accountId, input)
      : this.accountsService.create(input);

    operation.subscribe({
      next: () => {
        this.notification.success(
          this.translate.instant(
            this.isEditMode() ? 'common.updated' : 'common.created'
          )
        );
        this.router.navigate(['/accounts']);
      },
      error: () => this.loading.set(false),
    });
  }
}
