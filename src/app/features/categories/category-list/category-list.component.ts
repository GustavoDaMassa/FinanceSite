import { Component, inject, signal, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialog } from '@angular/material/dialog';
import { MatChipsModule } from '@angular/material/chips';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { AuthService } from '../../../core/services/auth.service';
import { NotificationService } from '../../../core/services/notification.service';
import { CategoriesService } from '../categories.service';
import { LoadingSpinnerComponent } from '../../../shared/components/loading-spinner/loading-spinner.component';
import {
  ConfirmDialogComponent,
  ConfirmDialogData,
} from '../../../shared/components/confirm-dialog/confirm-dialog.component';
import { CategoryDTO } from '../../../shared/models';

/**
 * CategoryListComponent — lista e gerencia categorias inline.
 *
 * Diferente de contas/transacoes, categorias sao simples (so nome).
 * Entao criacao e edicao sao feitas inline (sem navegar para outra rota).
 */
@Component({
  selector: 'app-category-list',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipsModule,
    TranslatePipe,
    LoadingSpinnerComponent,
  ],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.scss',
})
export class CategoryListComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly categoriesService = inject(CategoriesService);
  private readonly notification = inject(NotificationService);
  private readonly translate = inject(TranslateService);
  private readonly dialog = inject(MatDialog);

  readonly categories = signal<CategoryDTO[]>([]);
  readonly loading = signal(true);
  readonly showForm = signal(false);
  readonly saving = signal(false);

  // Edit state
  readonly editingCategoryId = signal<string | null>(null);
  readonly editSaving = signal(false);

  readonly categoryForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
  });

  readonly editForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
  });

  ngOnInit(): void {
    const user = this.authService.currentUser();
    if (!user) return;

    this.categoriesService.listByUser(String(user.id)).subscribe({
      next: (categories) => {
        this.categories.set(categories);
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  toggleForm(): void {
    this.showForm.update((v) => !v);
    this.categoryForm.reset();
    this.editingCategoryId.set(null);
  }

  onSubmit(): void {
    if (this.categoryForm.invalid) return;

    const user = this.authService.currentUser();
    if (!user) return;

    this.saving.set(true);
    const { name } = this.categoryForm.getRawValue();

    this.categoriesService.create({ name, userId: String(user.id) }).subscribe({
      next: (created) => {
        this.categories.update((list) => [...list, created]);
        this.categoryForm.reset();
        this.showForm.set(false);
        this.saving.set(false);
        this.notification.success(this.translate.instant('common.created'));
      },
      error: () => this.saving.set(false),
    });
  }

  // ── Edit inline ───────────────────────────────────────────────

  startEdit(category: CategoryDTO): void {
    this.editingCategoryId.set(category.id);
    this.editForm.patchValue({ name: category.name });
    this.showForm.set(false);
  }

  cancelEdit(): void {
    this.editingCategoryId.set(null);
    this.editForm.reset();
  }

  onEditSubmit(): void {
    if (this.editForm.invalid) return;

    const user = this.authService.currentUser();
    if (!user) return;

    const categoryId = this.editingCategoryId();
    if (!categoryId) return;

    this.editSaving.set(true);
    const { name } = this.editForm.getRawValue();

    this.categoriesService.update(categoryId, { name, userId: String(user.id) }).subscribe({
      next: (updated) => {
        this.categories.update((list) =>
          list.map((c) => (c.id === categoryId ? updated : c))
        );
        this.editingCategoryId.set(null);
        this.editSaving.set(false);
        this.notification.success(this.translate.instant('common.updated'));
      },
      error: () => this.editSaving.set(false),
    });
  }

  // ── Delete ────────────────────────────────────────────────────

  confirmDelete(category: CategoryDTO): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: this.translate.instant('categories.delete_title'),
        message: this.translate.instant('categories.delete_message', {
          name: category.name,
        }),
      } as ConfirmDialogData,
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.categoriesService.delete(category.id).subscribe({
          next: () => {
            this.categories.update((list) =>
              list.filter((c) => c.id !== category.id)
            );
            this.notification.success(this.translate.instant('common.deleted'));
          },
        });
      }
    });
  }
}
