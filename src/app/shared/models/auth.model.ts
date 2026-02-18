/**
 * Enums e interfaces de autenticacao.
 *
 * Paralelo Spring: equivale ao LoginRequest/LoginResponse e ao enum Role
 * que existem em security/dto/ no backend.
 *
 * No TypeScript, enums com valores string sao a forma segura de
 * representar conjuntos fixos de valores (como enums Java).
 */

export enum Role {
  ADMIN = 'ADMIN',
  USER = 'USER',
}

/** Corpo do POST /api/auth/login */
export interface LoginRequest {
  email: string;
  password: string;
}

/** Corpo do POST /api/auth/register */
export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
}

/** Corpo do POST /api/auth/create-admin */
export interface CreateAdminRequest {
  name: string;
  email: string;
  password: string;
  masterKey: string;
}

/** Resposta do login/register. */
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: number;
    name: string;
    email: string;
    createdAt?: string;
  };
}
