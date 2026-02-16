import { Injectable, inject, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { StorageService } from './storage.service';
import {
  User,
  Role,
  LoginRequest,
  RegisterRequest,
  CreateAdminRequest,
  AuthResponse,
} from '../../shared/models';

/**
 * AuthService — gerencia autenticacao JWT.
 *
 * Fluxo completo:
 * 1. Usuario preenche form de login → LoginComponent chama authService.login()
 * 2. login() faz POST /api/auth/login → backend valida e retorna JWT + dados do user
 * 3. Armazenamos o token no localStorage (via StorageService)
 * 4. Atualizamos o signal currentUser (reativo — header atualiza automaticamente)
 * 5. Navegamos para /dashboard
 *
 * Paralelo Spring:
 * - Este service e como o AuthenticationService do backend
 * - O signal currentUser e como o SecurityContextHolder.getContext()
 * - O token JWT e o mesmo que o backend gera via JwtService
 *
 * Por que Observable (RxJS) e nao Promise (async/await)?
 * Angular's HttpClient retorna Observable por padrao. Observables sao mais
 * poderosos que Promises: podem ser cancelados, combinados (switchMap, merge),
 * e suportam operadores como tap, catchError, retry. No Angular, e o padrao.
 */
@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private storage = inject(StorageService);

  private readonly AUTH_URL = `${environment.apiUrl}/api/auth`;

  /**
   * Signal reativo com o usuario atual.
   * Qualquer template que chama currentUser() sera re-renderizado
   * automaticamente quando o valor mudar. Sem subscribe, sem unsubscribe.
   */
  currentUser = signal<User | null>(null);

  /**
   * Computed signal — derivado de currentUser.
   * Recalcula automaticamente quando currentUser muda.
   * Como uma @Formula do Hibernate, mas reativa.
   */
  isAdmin = computed(() => this.currentUser()?.role === Role.ADMIN);

  constructor() {
    this.loadUserFromStorage();
  }

  /**
   * Login via REST.
   *
   * O operador pipe() encadeia transformacoes no Observable:
   * - tap(): efeito colateral (armazenar dados) sem alterar o valor
   * - catchError(): captura erros e permite re-lancar ou tratar
   *
   * Paralelo Spring: seria como chamar authenticationManager.authenticate()
   */
  login(request: LoginRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.AUTH_URL}/login`, request).pipe(
      tap((response) => {
        this.storeAuthData(response);
        this.setCurrentUser(response);
        this.router.navigate(['/dashboard']);
      }),
      catchError((error) => {
        console.error('Login error:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Registro de usuario via REST.
   * Cria usuario com Role.USER e faz auto-login.
   */
  register(request: RegisterRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.AUTH_URL}/register`, request)
      .pipe(
        tap((response) => {
          this.storeAuthData(response);
          this.setCurrentUser(response);
          this.router.navigate(['/dashboard']);
        }),
        catchError((error) => {
          console.error('Register error:', error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Criacao de admin via REST.
   * Mesmo fluxo do login, mas com o campo masterKey adicional.
   */
  createAdmin(request: CreateAdminRequest): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${this.AUTH_URL}/create-admin`, request)
      .pipe(
        tap((response) => {
          this.storeAuthData(response);
          this.setCurrentUser(response);
          this.router.navigate(['/dashboard']);
        }),
        catchError((error) => {
          console.error('Create admin error:', error);
          return throwError(() => error);
        })
      );
  }

  /**
   * Logout — limpa tudo e redireciona.
   * Simples e direto: nao precisa chamar o backend
   * (JWT e stateless, basta "esquecer" o token).
   */
  logout(): void {
    this.storage.clear();
    this.currentUser.set(null);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return this.storage.hasToken();
  }

  private storeAuthData(response: AuthResponse): void {
    this.storage.setToken(response.token);
    this.storage.setUserId(response.userId);
    this.storage.setUserEmail(response.email);
    this.storage.setUserName(response.name);
    this.storage.setUserRole(response.role);
  }

  private setCurrentUser(response: AuthResponse): void {
    this.currentUser.set({
      id: response.userId,
      name: response.name,
      email: response.email,
      role: response.role,
    });
  }

  /**
   * Reconstroi o usuario a partir do localStorage.
   * Chamado no constructor — se o usuario recarregar a pagina,
   * o signal e restaurado sem precisar de novo login.
   */
  private loadUserFromStorage(): void {
    if (!this.storage.hasToken()) return;

    const userId = this.storage.getUserId();
    const email = this.storage.getUserEmail();
    const name = this.storage.getUserName();
    const role = this.storage.getUserRole();

    if (userId && email && name && role) {
      this.currentUser.set({
        id: userId,
        name,
        email,
        role: role as Role,
      });
    }
  }
}
