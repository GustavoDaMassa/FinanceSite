import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { noAuthGuard } from './core/guards/no-auth.guard';

/**
 * Rotas da aplicacao — mapeamento URL → Component.
 *
 * Paralelo Spring:
 * - Cada rota e como um @GetMapping no controller
 * - canActivate = @PreAuthorize — roda ANTES de carregar o componente
 * - loadComponent = lazy loading — componente so e baixado sob demanda
 *
 * Guards:
 * - authGuard: requer autenticacao (redireciona para /login se nao logado)
 * - noAuthGuard: impede acesso se JA logado (redireciona para /dashboard)
 *
 * Lazy Loading com loadComponent:
 * Em vez de importar o componente no topo do arquivo (que incluiria
 * no bundle inicial), usamos import() dinamico. O Angular cria um
 * "chunk" separado para cada rota, reduzindo o tamanho do bundle inicial.
 *
 * A rota wildcard '**' no final captura URLs invalidas.
 */
export const routes: Routes = [
  // ── Rotas publicas (so para NAO autenticados) ─────────────────

  {
    path: 'login',
    canActivate: [noAuthGuard],
    loadComponent: () =>
      import('./features/auth/login/login.component').then(
        (m) => m.LoginComponent
      ),
  },
  {
    path: 'register',
    canActivate: [noAuthGuard],
    loadComponent: () =>
      import('./features/auth/register/register.component').then(
        (m) => m.RegisterComponent
      ),
  },

  // ── Rotas protegidas (requerem autenticacao) ──────────────────

  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/dashboard/dashboard.component').then(
        (m) => m.DashboardComponent
      ),
  },

  // Accounts
  {
    path: 'accounts',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/accounts/account-list/account-list.component').then(
        (m) => m.AccountListComponent
      ),
  },
  {
    path: 'accounts/new',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/accounts/account-form/account-form.component').then(
        (m) => m.AccountFormComponent
      ),
  },
  {
    path: 'accounts/:id/edit',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./features/accounts/account-form/account-form.component').then(
        (m) => m.AccountFormComponent
      ),
  },

  // Transactions
  {
    path: 'transactions',
    canActivate: [authGuard],
    loadComponent: () =>
      import(
        './features/transactions/transaction-list/transaction-list.component'
      ).then((m) => m.TransactionListComponent),
  },
  {
    path: 'transactions/new',
    canActivate: [authGuard],
    loadComponent: () =>
      import(
        './features/transactions/transaction-form/transaction-form.component'
      ).then((m) => m.TransactionFormComponent),
  },
  {
    path: 'transactions/:id/edit',
    canActivate: [authGuard],
    loadComponent: () =>
      import(
        './features/transactions/transaction-form/transaction-form.component'
      ).then((m) => m.TransactionFormComponent),
  },

  // Categories
  {
    path: 'categories',
    canActivate: [authGuard],
    loadComponent: () =>
      import(
        './features/categories/category-list/category-list.component'
      ).then((m) => m.CategoryListComponent),
  },

  // Integrations
  {
    path: 'integrations',
    canActivate: [authGuard],
    loadComponent: () =>
      import(
        './features/integrations/integration-list/integration-list.component'
      ).then((m) => m.IntegrationListComponent),
  },

  // ── Redirects ─────────────────────────────────────────────────

  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', redirectTo: 'login' },
];
