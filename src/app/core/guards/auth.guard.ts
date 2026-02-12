import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Auth Guard — protege rotas que exigem autenticacao.
 *
 * Paralelo Spring: equivale ao .requestMatchers("/api/**").authenticated()
 * no SecurityFilterChain. Se o usuario nao tem token, redireciona para login.
 *
 * CanActivateFn e o formato funcional (Angular 16+).
 * O parametro `state` contem a URL que o usuario tentou acessar,
 * que salvamos como queryParam para redirecionar apos o login.
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  // Salva a URL original para redirecionar apos login
  router.navigate(['/login'], {
    queryParams: { returnUrl: state.url },
  });
  return false;
};
