import { gql } from 'apollo-angular';

/**
 * GraphQL Operations — Account
 *
 * Contas bancarias sao o recurso central do FinanceSite.
 * Cada conta pertence a um usuario e pode ter transacoes associadas.
 *
 * Nota sobre `balance`: vem como String do backend (BigDecimal serializado)
 * para evitar perda de precisao com numeros flutuantes. No frontend,
 * convertemos para number apenas na hora de exibir.
 *
 * `linkAccount` e uma mutation especial — vincula uma conta do Pluggy
 * (agregador bancario) a uma integracao existente.
 */

// ── Fragments ────────────────────────────────────────────────────────

/**
 * Fragment — pedaco reutilizavel de uma query.
 * Evita repetir os mesmos campos em todas as operacoes.
 * Paralelo Spring: como um DTO projection — define quais campos retornar.
 */
const ACCOUNT_FIELDS = gql`
  fragment AccountFields on AccountDTO {
    id
    accountName
    institution
    type
    balance
    userId
    integrationId
  }
`;

// ── Queries ──────────────────────────────────────────────────────────

export const LIST_ACCOUNTS_BY_USER = gql`
  query ListAccountsByUser($userId: ID!) {
    listAccountsByUser(userId: $userId) {
      ...AccountFields
    }
  }
  ${ACCOUNT_FIELDS}
`;

export const FIND_ACCOUNT_BY_ID = gql`
  query FindAccountById($id: ID!) {
    findAccountById(id: $id) {
      ...AccountFields
    }
  }
  ${ACCOUNT_FIELDS}
`;

// ── Mutations ────────────────────────────────────────────────────────

export const CREATE_ACCOUNT = gql`
  mutation CreateAccount($account: AccountInput!) {
    createAccount(account: $account) {
      ...AccountFields
    }
  }
  ${ACCOUNT_FIELDS}
`;

export const UPDATE_ACCOUNT = gql`
  mutation UpdateAccount($id: ID!, $account: AccountInput!) {
    updateAccount(id: $id, account: $account) {
      ...AccountFields
    }
  }
  ${ACCOUNT_FIELDS}
`;

export const DELETE_ACCOUNT = gql`
  mutation DeleteAccount($id: ID!) {
    deleteAccount(id: $id) {
      ...AccountFields
    }
  }
  ${ACCOUNT_FIELDS}
`;

export const LINK_ACCOUNT = gql`
  mutation LinkAccount($input: LinkAccountInput!) {
    linkAccount(input: $input) {
      ...AccountFields
    }
  }
  ${ACCOUNT_FIELDS}
`;
