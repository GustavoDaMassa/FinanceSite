import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * NoAuth Guard — impede usuarios logados de acessar paginas publicas.
 *
 * Ex: se o usuario ja esta logado e tenta ir para /login,
 * redireciona para /dashboard. Nao faz sentido ver a tela de login
 * se ja esta autenticado.
 *
 * Paralelo Spring: nao tem equivalente direto, mas seria como um filtro
 * que redireciona /login para /home se ja esta autenticado.
 */
export const noAuthGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    return true;
  }

  router.navigate(['/dashboard']);
  return false;
};
