import { gql } from 'apollo-angular';

/**
 * GraphQL Operations — Category
 *
 * Categorias permitem ao usuario organizar transacoes
 * (ex: "Alimentacao", "Transporte", "Salario").
 *
 * Categorias sao por usuario — cada um cria as suas.
 * Transacoes podem ser categorizadas manualmente ou
 * via a mutation `categorizeTransaction`.
 */

// ── Queries ──────────────────────────────────────────────────────────

export const LIST_CATEGORIES_BY_USER = gql`
  query ListCategoriesByUser($userId: ID!) {
    listCategoriesByUser(userId: $userId) {
      id
      name
      userId
    }
  }
`;

export const FIND_CATEGORY_BY_ID = gql`
  query FindCategoryById($id: ID!) {
    findCategoryById(id: $id) {
      id
      name
      userId
    }
  }
`;

// ── Mutations ────────────────────────────────────────────────────────

export const CREATE_CATEGORY = gql`
  mutation CreateCategory($input: CategoryInput!) {
    createCategory(input: $input) {
      id
      name
      userId
    }
  }
`;

export const UPDATE_CATEGORY = gql`
  mutation UpdateCategory($id: ID!, $input: CategoryInput!) {
    updateCategory(id: $id, input: $input) {
      id
      name
      userId
    }
  }
`;

export const DELETE_CATEGORY = gql`
  mutation DeleteCategory($id: ID!) {
    deleteCategory(id: $id) {
      id
      name
      userId
    }
  }
`;
