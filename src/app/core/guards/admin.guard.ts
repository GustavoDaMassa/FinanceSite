import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * Admin Guard — protege rotas que exigem role ADMIN.
 *
 * Paralelo Spring: equivale ao .requestMatchers("/admin/**").hasRole("ADMIN")
 * no SecurityFilterChain, ou @PreAuthorize("hasRole('ADMIN')") nos resolvers.
 */
export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAdmin()) {
    return true;
  }

  router.navigate(['/dashboard']);
  return false;
};
