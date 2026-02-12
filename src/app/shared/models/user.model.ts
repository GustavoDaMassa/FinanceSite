import { Role } from './auth.model';

/**
 * User — representa o usuario logado no frontend.
 * Diferente do UserDTO do GraphQL porque inclui role (que vem do login REST).
 */
export interface User {
  id: number;
  name: string;
  email: string;
  role?: Role;
}

/** Tipo retornado pelas queries GraphQL de User */
export interface UserDTO {
  id: string;
  name: string;
  email: string;
}

/** Input para mutations createUser/updateUser */
export interface UserInput {
  name: string;
  email: string;
  password: string;
}
