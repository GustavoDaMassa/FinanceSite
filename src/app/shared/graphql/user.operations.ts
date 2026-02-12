import { gql } from 'apollo-angular';

/**
 * GraphQL Operations — User
 *
 * Cada constante aqui e uma operacao GraphQL (query ou mutation)
 * definida com o template literal `gql`. O Apollo Client usa essas
 * definicoes para:
 * 1. Enviar a query correta ao backend via HTTP POST
 * 2. Tipar a resposta automaticamente (quando usamos generics)
 * 3. Cachear resultados no InMemoryCache
 *
 * Paralelo Spring: no backend, os resolvers (@QueryMapping/@MutationMapping)
 * recebem exatamente essas operacoes. O nome da query/mutation DEVE
 * coincidir com o nome do metodo no resolver.
 *
 * Convencao de nomes:
 * - SCREAMING_SNAKE_CASE (constante) para o nome da variavel
 * - camelCase para o nome da operacao GraphQL (igual ao resolver)
 */

// ── Queries ──────────────────────────────────────────────────────────

export const LIST_USERS = gql`
  query ListUsers {
    listUsers {
      id
      name
      email
    }
  }
`;

export const FIND_USER_BY_EMAIL = gql`
  query FindUserByEmail($email: String!) {
    findUserByEmail(email: $email) {
      id
      name
      email
    }
  }
`;

// ── Mutations ────────────────────────────────────────────────────────

export const CREATE_USER = gql`
  mutation CreateUser($input: UserInput!) {
    createUser(input: $input) {
      id
      name
      email
    }
  }
`;

export const UPDATE_USER = gql`
  mutation UpdateUser($id: ID!, $input: UserInput!) {
    updateUser(id: $id, input: $input) {
      id
      name
      email
    }
  }
`;

export const DELETE_USER = gql`
  mutation DeleteUser($id: ID!) {
    deleteUser(id: $id) {
      id
      name
      email
    }
  }
`;
