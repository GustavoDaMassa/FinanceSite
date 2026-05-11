import { Component, inject, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialog } from '@angular/material/dialog';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Apollo } from 'apollo-angular';

import { AuthService } from '../../core/services/auth.service';
import { NotificationService } from '../../core/services/notification.service';
import { StorageService } from '../../core/services/storage.service';
import { DeleteAccountDialogComponent } from '../../shared/components/delete-account-dialog/delete-account-dialog.component';
import { UPDATE_USER, CHANGE_EMAIL, CHANGE_PASSWORD, DELETE_ACCOUNT } from '../../shared/graphql/user.operations';

const passwordsMatchValidator: ValidatorFn = (group: AbstractControl): ValidationErrors | null => {
  const newPassword = group.get('newPassword')?.value;
  const confirmPassword = group.get('confirmPassword')?.value;
  return newPassword && confirmPassword && newPassword !== confirmPassword
    ? { passwordsMismatch: true }
    : null;
};

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatDividerModule,
    TranslatePipe,
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly apollo = inject(Apollo);
  private readonly notification = inject(NotificationService);
  private readonly storage = inject(StorageService);
  private readonly dialog = inject(MatDialog);
  private readonly translate = inject(TranslateService);
  readonly router = inject(Router);

  readonly loadingName = signal(false);
  readonly loadingEmail = signal(false);
  readonly loadingPassword = signal(false);
  readonly loadingDelete = signal(false);

  readonly hideCurrentPasswordEmail = signal(true);
  readonly hideCurrentPasswordPass = signal(true);
  readonly hideNewPassword = signal(true);
  readonly hideConfirmPassword = signal(true);

  readonly nameForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
  });

  readonly emailForm = this.fb.nonNullable.group({
    currentPassword: ['', Validators.required],
    newEmail: ['', [Validators.required, Validators.email]],
  });

  readonly passwordForm = this.fb.nonNullable.group(
    {
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', Validators.required],
    },
    { validators: passwordsMatchValidator }
  );

  ngOnInit(): void {
    const user = this.authService.currentUser();
    if (user) {
      this.nameForm.patchValue({ name: user.name });
      this.emailForm.patchValue({ newEmail: user.email });
    }
  }

  get currentEmail(): string {
    return this.authService.currentUser()?.email ?? '';
  }

  onSaveName(): void {
    if (this.nameForm.invalid) return;

    this.loadingName.set(true);
    const { name } = this.nameForm.getRawValue();
    const user = this.authService.currentUser();
    if (!user) return;

    this.apollo
      .mutate({
        mutation: UPDATE_USER,
        variables: {
          id: String(user.id),
          input: { name, email: this.currentEmail, password: '' },
        },
      })
      .subscribe({
        next: () => {
          this.authService.currentUser.update((u) => (u ? { ...u, name } : u));
          this.storage.setUserName(name);
          this.notification.success(this.translate.instant('profile.updated'));
          this.loadingName.set(false);
        },
        error: () => this.loadingName.set(false),
      });
  }

  onChangeEmail(): void {
    if (this.emailForm.invalid) return;

    this.loadingEmail.set(true);
    const { currentPassword, newEmail } = this.emailForm.getRawValue();
    const user = this.authService.currentUser();
    if (!user) return;

    this.apollo
      .mutate({
        mutation: CHANGE_EMAIL,
        variables: { id: String(user.id), input: { currentPassword, newEmail } },
      })
      .subscribe({
        next: () => {
          this.authService.currentUser.update((u) => (u ? { ...u, email: newEmail } : u));
          this.emailForm.patchValue({ currentPassword: '' });
          this.notification.success(this.translate.instant('profile.email_updated'));
          this.loadingEmail.set(false);
        },
        error: (err: any) => {
          const msg = err.graphQLErrors?.[0]?.message;
          this.notification.error(msg || this.translate.instant('errors.unexpected'));
          this.loadingEmail.set(false);
        },
      });
  }

  onChangePassword(): void {
    if (this.passwordForm.invalid) return;

    this.loadingPassword.set(true);
    const { currentPassword, newPassword } = this.passwordForm.getRawValue();
    const user = this.authService.currentUser();
    if (!user) return;

    this.apollo
      .mutate({
        mutation: CHANGE_PASSWORD,
        variables: { id: String(user.id), input: { currentPassword, newPassword } },
      })
      .subscribe({
        next: () => {
          this.passwordForm.reset();
          this.notification.success(this.translate.instant('profile.password_updated'));
          this.loadingPassword.set(false);
        },
        error: (err: any) => {
          const msg = err.graphQLErrors?.[0]?.message;
          this.notification.error(msg || this.translate.instant('errors.unexpected'));
          this.loadingPassword.set(false);
        },
      });
  }

  onDeleteAccount(): void {
    const dialogRef = this.dialog.open(DeleteAccountDialogComponent, { width: '420px' });

    dialogRef.afterClosed().subscribe((password: string | null) => {
      if (!password) return;

      this.loadingDelete.set(true);
      const user = this.authService.currentUser();
      if (!user) return;

      this.apollo
        .mutate({
          mutation: DELETE_ACCOUNT,
          variables: { id: String(user.id), currentPassword: password },
        })
        .subscribe({
          next: () => this.authService.logout(),
          error: (err: any) => {
            const msg = err.graphQLErrors?.[0]?.message;
            this.notification.error(msg || this.translate.instant('errors.unexpected'));
            this.loadingDelete.set(false);
          },
        });
    });
  }
}
