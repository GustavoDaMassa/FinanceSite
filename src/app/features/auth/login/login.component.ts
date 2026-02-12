import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
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
 * LoginComponent — tela de login.
 *
 * Fluxo completo:
 * 1. Usuario preenche email + senha
 * 2. Clica "Entrar" → chama authService.login()
 * 3. AuthService faz POST /api/auth/login → recebe JWT
 * 4. Token e salvo no localStorage → signal currentUser atualizado
 * 5. Redireciona para returnUrl (se veio de uma rota protegida) ou /dashboard
 *
 * Conceitos:
 * - ReactiveFormsModule: formularios reativos do Angular. Cada campo
 *   e um FormControl com validadores. FormBuilder e um helper para criar.
 *   Paralelo Spring: como o @Valid nos DTOs — validacao declarativa.
 *
 * - signal(false) para loading: enquanto o POST esta em andamento,
 *   mostra spinner no botao. Signals substituem variaveis simples
 *   com reatividade — o template atualiza automaticamente.
 *
 * - ActivatedRoute.queryParams: le parametros da URL. O authGuard
 *   salva a URL original em ?returnUrl= quando redireciona para /login.
 */
@Component({
  selector: 'app-login',
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
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  /** Estado local via signals — reativo e simples */
  readonly loading = signal(false);
  readonly hidePassword = signal(true);

  /**
   * FormGroup reativo — define campos + validadores.
   * nonNullable: true → campos nunca sao null (TypeScript strict).
   *
   * Validators.required → campo obrigatorio
   * Validators.email → formato de email valido
   */
  readonly loginForm = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  onSubmit(): void {
    if (this.loginForm.invalid) return;

    this.loading.set(true);
    const { email, password } = this.loginForm.getRawValue();

    this.authService.login({ email, password }).subscribe({
      next: () => {
        // Redireciona para returnUrl (se existir) ou /dashboard
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
        this.router.navigateByUrl(returnUrl);
      },
      error: () => {
        // Erro ja tratado pelo errorInterceptor (mostra snackbar)
        this.loading.set(false);
      },
    });
  }
}
