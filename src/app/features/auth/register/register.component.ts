import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslatePipe } from '@ngx-translate/core';

import { AuthService } from '../../../core/services/auth.service';

/**
 * RegisterComponent — tela de criacao de usuario admin.
 *
 * No FinanceSite, o registro cria um ADMIN (usuario com poderes totais).
 * O endpoint POST /api/auth/create-admin exige uma masterKey para seguranca.
 *
 * Diferente do login, aqui usamos 4 campos:
 * - name: nome do usuario
 * - email: email (validado como formato email)
 * - password: senha (minimo 6 caracteres)
 * - masterKey: chave secreta configurada no backend (ADMIN_MASTER_KEY)
 *
 * Apos registro bem-sucedido, redireciona para /login (usuario precisa logar).
 */
@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    RouterLink,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    TranslatePipe,
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly loading = signal(false);
  readonly hidePassword = signal(true);

  readonly registerForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    masterKey: ['', [Validators.required]],
  });

  onSubmit(): void {
    if (this.registerForm.invalid) return;

    this.loading.set(true);
    const { name, email, password, masterKey } = this.registerForm.getRawValue();

    this.authService.createAdmin({ name, email, password, masterKey }).subscribe({
      next: () => {
        this.router.navigate(['/login']);
      },
      error: () => {
        this.loading.set(false);
      },
    });
  }
}
