import { gql } from 'apollo-angular';

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
  query ListUserTransactions {
    listUserTransactions {
      balance
      transactions {
        ...TransactionFields
      }
    }
  }
  ${TRANSACTION_FIELDS}
`;

export const LIST_ACCOUNT_TRANSACTIONS = gql`
  query ListAccountTransactions($accountId: ID) {
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
  query ListTransactionsByPeriod($accountId: ID, $range: DateRangeInput!) {
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
  query ListTransactionsByType($accountId: ID, $type: TransactionType!) {
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
  query ListTransactionsByFilter($accountId: ID, $filter: TransactionFilterInput!) {
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
  query ListUncategorizedTransactions($accountId: ID) {
    listUncategorizedTransactions(accountId: $accountId) {
      ...TransactionFields
    }
  }
  ${TRANSACTION_FIELDS}
`;

// ── Queries — Paginadas ──────────────────────────────────────────────

export const LIST_ACCOUNT_TRANSACTIONS_PAGINATED = gql`
  query ListAccountTransactionsPaginated($accountId: ID, $pagination: PaginationInput) {
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
    $accountId: ID
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
    $accountId: ID
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
