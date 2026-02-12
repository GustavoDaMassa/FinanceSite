import { Injectable } from '@angular/core';

/**
 * StorageService — abstrai o acesso ao localStorage.
 *
 * Por que nao usar localStorage direto nos componentes?
 * 1. Centralizacao: se mudarmos para sessionStorage ou cookies, so muda aqui
 * 2. Tipagem: metodos tipados em vez de getItem/setItem generico
 * 3. Testabilidade: facil de mockar em testes (injetar um fake)
 *
 * Paralelo Spring: seria como um @Repository que abstrai o acesso a dados,
 * mas aqui o "banco" e o localStorage do navegador.
 */
@Injectable({ providedIn: 'root' })
export class StorageService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_ID_KEY = 'user_id';
  private readonly USER_EMAIL_KEY = 'user_email';
  private readonly USER_NAME_KEY = 'user_name';
  private readonly USER_ROLE_KEY = 'user_role';

  // --- Token ---
  setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  hasToken(): boolean {
    return !!this.getToken();
  }

  // --- User ID ---
  setUserId(id: number): void {
    localStorage.setItem(this.USER_ID_KEY, id.toString());
  }

  getUserId(): number | null {
    const id = localStorage.getItem(this.USER_ID_KEY);
    return id ? parseInt(id, 10) : null;
  }

  // --- User Email ---
  setUserEmail(email: string): void {
    localStorage.setItem(this.USER_EMAIL_KEY, email);
  }

  getUserEmail(): string | null {
    return localStorage.getItem(this.USER_EMAIL_KEY);
  }

  // --- User Name ---
  setUserName(name: string): void {
    localStorage.setItem(this.USER_NAME_KEY, name);
  }

  getUserName(): string | null {
    return localStorage.getItem(this.USER_NAME_KEY);
  }

  // --- User Role ---
  setUserRole(role: string): void {
    localStorage.setItem(this.USER_ROLE_KEY, role);
  }

  getUserRole(): string | null {
    return localStorage.getItem(this.USER_ROLE_KEY);
  }

  // --- Clear ---
  /**
   * Limpa APENAS os dados de autenticacao.
   * Nao limpa tema e idioma (sao preferencias do usuario).
   */
  clear(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_ID_KEY);
    localStorage.removeItem(this.USER_EMAIL_KEY);
    localStorage.removeItem(this.USER_NAME_KEY);
    localStorage.removeItem(this.USER_ROLE_KEY);
  }
}
