import { Component, inject, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
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
import {
  ConfirmDialogComponent,
  ConfirmDialogData,
} from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { UPDATE_USER, DELETE_USER } from '../../shared/graphql/user.operations';

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

  readonly loadingUpdate = signal(false);
  readonly loadingDelete = signal(false);
  readonly hidePassword = signal(true);

  readonly profileForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    newPassword: [''],
  });

  ngOnInit(): void {
    const user = this.authService.currentUser();
    if (user) {
      this.profileForm.patchValue({ name: user.name });
    }
  }

  get currentEmail(): string {
    return this.authService.currentUser()?.email ?? '';
  }

  onSubmit(): void {
    if (this.profileForm.invalid) return;

    this.loadingUpdate.set(true);
    const { name, newPassword } = this.profileForm.getRawValue();
    const user = this.authService.currentUser();
    if (!user) return;

    this.apollo
      .mutate({
        mutation: UPDATE_USER,
        variables: {
          id: String(user.id),
          input: {
            name,
            email: this.currentEmail,
            password: newPassword ?? '',
          },
        },
      })
      .subscribe({
        next: () => {
          this.authService.currentUser.update((u) => (u ? { ...u, name } : u));
          this.storage.setUserName(name);
          this.notification.success(
            this.translate.instant('profile.updated')
          );
          this.loadingUpdate.set(false);
        },
        error: () => this.loadingUpdate.set(false),
      });
  }

  onDeleteAccount(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: this.translate.instant('profile.delete_title'),
        message: this.translate.instant('profile.delete_message'),
      } as ConfirmDialogData,
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (!confirmed) return;

      this.loadingDelete.set(true);
      const user = this.authService.currentUser();
      if (!user) return;

      this.apollo
        .mutate({ mutation: DELETE_USER, variables: { id: String(user.id) } })
        .subscribe({
          next: () => {
            this.authService.logout();
          },
          error: () => this.loadingDelete.set(false),
        });
    });
  }
}
