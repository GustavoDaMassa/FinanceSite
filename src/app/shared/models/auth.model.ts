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

/**
 * Resposta do login/create-admin.
 * O backend retorna TUDO que precisamos do usuario aqui,
 * entao nao precisamos de uma chamada separada para buscar o user.
 */
export interface AuthResponse {
  token: string;
  type: string;
  userId: number;
  email: string;
  name: string;
  role: Role;
}
