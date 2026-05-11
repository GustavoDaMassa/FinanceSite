import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-delete-account-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    TranslatePipe,
  ],
  template: `
    <h2 mat-dialog-title>{{ 'profile.delete_title' | translate }}</h2>
    <mat-dialog-content>
      <p class="message">{{ 'profile.delete_message' | translate }}</p>
      <mat-form-field appearance="outline" class="full-width">
        <mat-label>{{ 'profile.delete_password_label' | translate }}</mat-label>
        <input matInput [type]="hidePassword ? 'password' : 'text'" [formControl]="passwordControl" />
        <mat-icon matPrefix>lock</mat-icon>
        <button mat-icon-button matSuffix type="button" (click)="hidePassword = !hidePassword">
          <mat-icon>{{ hidePassword ? 'visibility_off' : 'visibility' }}</mat-icon>
        </button>
        @if (passwordControl.hasError('required')) {
          <mat-error>{{ 'validation.required' | translate }}</mat-error>
        }
      </mat-form-field>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close(null)">
        {{ 'common.cancel' | translate }}
      </button>
      <button
        mat-flat-button
        color="warn"
        [disabled]="passwordControl.invalid"
        (click)="confirm()"
      >
        {{ 'common.confirm' | translate }}
      </button>
    </mat-dialog-actions>
  `,
  styles: `
    .message {
      color: var(--color-text-secondary);
      font-size: var(--font-sm);
      margin-bottom: var(--spacing-md);
    }
    .full-width { width: 100%; }
    mat-dialog-content { padding-top: var(--spacing-sm) !important; }
  `,
})
export class DeleteAccountDialogComponent {
  readonly dialogRef = inject(MatDialogRef<DeleteAccountDialogComponent>);
  private readonly fb = inject(FormBuilder);

  readonly passwordControl = this.fb.nonNullable.control('', Validators.required);
  hidePassword = true;

  confirm(): void {
    if (this.passwordControl.invalid) return;
    this.dialogRef.close(this.passwordControl.value);
  }
}
