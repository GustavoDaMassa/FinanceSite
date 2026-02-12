import { gql } from 'apollo-angular';

/**
 * GraphQL Operations — Transaction
 *
 * O maior arquivo de operacoes — transacoes sao o core do sistema financeiro.
 *
 * O backend oferece varias formas de listar transacoes:
 * - Por usuario (todas as contas)
 * - Por conta
 * - Por periodo (DateRangeInput)
 * - Por tipo (INFLOW/OUTFLOW)
 * - Por filtro (categoryIds)
 * - Nao categorizadas
 * - Versoes paginadas (retornam TransactionPageDTO com PageInfo)
 *
 * Todas as listagens retornam `TransactionListWithBalanceDTO` ou
 * `TransactionPageDTO`, que incluem o saldo calculado pelo backend.
 *
 * Paralelo Spring: cada query aqui corresponde a um @QueryMapping
 * no TransactionResolver, que por sua vez chama o TransactionService.
 */

// ── Fragments ────────────────────────────────────────────────────────

const TRANSACTION_FIELDS = gql`
  fragment TransactionFields on TransactionDTO {
    id
    amount
    type
    description
    source
    destination
    transactionDate
    accountId
    categoryId
  }
`;

const PAGE_INFO_FIELDS = gql`
  fragment PageInfoFields on PageInfo {
    currentPage
    pageSize
    totalElements
    totalPages
    hasNext
    hasPrevious
  }
`;

// ── Query — Buscar por ID ────────────────────────────────────────────

export const FIND_TRANSACTION_BY_ID = gql`
  query FindTransactionById($id: ID!) {
    findTransactionById(id: $id) {
      ...TransactionFields
    }
  }
  ${TRANSACTION_FIELDS}
`;

// ── Queries — Listagens simples ──────────────────────────────────────

export const LIST_USER_TRANSACTIONS = gql`
  query ListUserTransactions($userId: ID!) {
    listUserTransactions(userId: $userId) {
      balance
      transactions {
        ...TransactionFields
      }
    }
  }
  ${TRANSACTION_FIELDS}
`;

export const LIST_ACCOUNT_TRANSACTIONS = gql`
  query ListAccountTransactions($accountId: ID!) {
    listAccountTransactions(accountId: $accountId) {
      balance
      transactions {
        ...TransactionFields
      }
    }
  }
  ${TRANSACTION_FIELDS}
`;

export const LIST_TRANSACTIONS_BY_PERIOD = gql`
  query ListTransactionsByPeriod($accountId: ID!, $range: DateRangeInput!) {
    listTransactionsByPeriod(accountId: $accountId, range: $range) {
      balance
      transactions {
        ...TransactionFields
      }
    }
  }
  ${TRANSACTION_FIELDS}
`;

export const LIST_TRANSACTIONS_BY_TYPE = gql`
  query ListTransactionsByType($accountId: ID!, $type: TransactionType!) {
    listTransactionsByType(accountId: $accountId, type: $type) {
      balance
      transactions {
        ...TransactionFields
      }
    }
  }
  ${TRANSACTION_FIELDS}
`;

export const LIST_TRANSACTIONS_BY_FILTER = gql`
  query ListTransactionsByFilter($accountId: ID!, $filter: TransactionFilterInput!) {
    listTransactionsByFilter(accountId: $accountId, filter: $filter) {
      balance
      transactions {
        ...TransactionFields
      }
    }
  }
  ${TRANSACTION_FIELDS}
`;

export const LIST_UNCATEGORIZED_TRANSACTIONS = gql`
  query ListUncategorizedTransactions($accountId: ID!) {
    listUncategorizedTransactions(accountId: $accountId) {
      ...TransactionFields
    }
  }
  ${TRANSACTION_FIELDS}
`;

// ── Queries — Paginadas ──────────────────────────────────────────────

/**
 * Queries paginadas retornam TransactionPageDTO com PageInfo.
 * PageInfo contem metadados de paginacao (pagina atual, total, etc.)
 * que usamos para montar controles de navegacao no frontend.
 *
 * PaginationInput e opcional — se nao informado, usa page=0, size=20.
 */

export const LIST_ACCOUNT_TRANSACTIONS_PAGINATED = gql`
  query ListAccountTransactionsPaginated($accountId: ID!, $pagination: PaginationInput) {
    listAccountTransactionsPaginated(accountId: $accountId, pagination: $pagination) {
      balance
      transactions {
        ...TransactionFields
      }
      pageInfo {
        ...PageInfoFields
      }
    }
  }
  ${TRANSACTION_FIELDS}
  ${PAGE_INFO_FIELDS}
`;

export const LIST_TRANSACTIONS_BY_PERIOD_PAGINATED = gql`
  query ListTransactionsByPeriodPaginated(
    $accountId: ID!
    $range: DateRangeInput!
    $pagination: PaginationInput
  ) {
    listTransactionsByPeriodPaginated(
      accountId: $accountId
      range: $range
      pagination: $pagination
    ) {
      balance
      transactions {
        ...TransactionFields
      }
      pageInfo {
        ...PageInfoFields
      }
    }
  }
  ${TRANSACTION_FIELDS}
  ${PAGE_INFO_FIELDS}
`;

export const LIST_TRANSACTIONS_BY_TYPE_PAGINATED = gql`
  query ListTransactionsByTypePaginated(
    $accountId: ID!
    $type: TransactionType!
    $pagination: PaginationInput
  ) {
    listTransactionsByTypePaginated(
      accountId: $accountId
      type: $type
      pagination: $pagination
    ) {
      balance
      transactions {
        ...TransactionFields
      }
      pageInfo {
        ...PageInfoFields
      }
    }
  }
  ${TRANSACTION_FIELDS}
  ${PAGE_INFO_FIELDS}
`;

// ── Mutations ────────────────────────────────────────────────────────

export const CREATE_TRANSACTION = gql`
  mutation CreateTransaction($input: TransactionInput!) {
    createTransaction(input: $input) {
      ...TransactionFields
    }
  }
  ${TRANSACTION_FIELDS}
`;

export const UPDATE_TRANSACTION = gql`
  mutation UpdateTransaction($id: ID!, $input: TransactionInput!) {
    updateTransaction(id: $id, input: $input) {
      ...TransactionFields
    }
  }
  ${TRANSACTION_FIELDS}
`;

/**
 * categorizeTransaction — associa uma categoria a uma transacao.
 * categoryId pode ser null para "descategorizar".
 */
export const CATEGORIZE_TRANSACTION = gql`
  mutation CategorizeTransaction($id: ID!, $categoryId: ID) {
    categorizeTransaction(id: $id, categoryId: $categoryId) {
      ...TransactionFields
    }
  }
  ${TRANSACTION_FIELDS}
`;

export const DELETE_TRANSACTION = gql`
  mutation DeleteTransaction($id: ID!) {
    deleteTransaction(id: $id) {
      ...TransactionFields
    }
  }
  ${TRANSACTION_FIELDS}
`;
