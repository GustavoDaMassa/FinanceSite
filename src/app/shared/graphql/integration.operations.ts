import { gql } from 'apollo-angular';

/**
 * GraphQL Operations — Financial Integration
 *
 * Integracoes financeiras conectam o FinanceSite a agregadores bancarios
 * (Pluggy, Belvo) para importar transacoes automaticamente.
 *
 * Fluxo:
 * 1. Usuario cria integracao via createFinancialIntegration (passa itemId do Pluggy)
 * 2. Backend registra a integracao e configura webhooks
 * 3. accountsFromPluggy lista contas disponiveis no Pluggy para vincular
 * 4. linkAccount (em account.operations) vincula conta Pluggy → conta local
 * 5. Transacoes sao importadas automaticamente via webhooks
 *
 * Nota: listFinancialIntegrationsByUser NAO recebe userId — o backend
 * usa o @AuthenticationPrincipal para identificar o usuario logado.
 */

// ── Queries ──────────────────────────────────────────────────────────

export const LIST_FINANCIAL_INTEGRATIONS_BY_USER = gql`
  query ListFinancialIntegrationsByUser {
    listFinancialIntegrationsByUser {
      id
      aggregator
      linkId
      status
      createdAt
      expiresAt
      userId
    }
  }
`;

export const FIND_FINANCIAL_INTEGRATION_BY_ID = gql`
  query FindFinancialIntegrationById($id: ID!) {
    findFinancialIntegrationById(id: $id) {
      id
      aggregator
      linkId
      status
      createdAt
      expiresAt
      userId
    }
  }
`;

export const LIST_ACCOUNTS_BY_INTEGRATION = gql`
  query ListAccountsByIntegration($id: ID!) {
    listAccountsByIntegration(id: $id) {
      id
      accountName
      institution
      type
      balance
      userId
      IntegrationId
    }
  }
`;

/**
 * accountsFromPluggy — busca contas do Pluggy (agregador externo).
 * Retorna PluggyAccountDTO com dados crus do Pluggy, ANTES de vincular.
 * O usuario escolhe quais contas vincular ao FinanceSite.
 */
export const ACCOUNTS_FROM_PLUGGY = gql`
  query AccountsFromPluggy($integrationId: ID!) {
    accountsFromPluggy(integrationId: $integrationId) {
      id
      name
      type
      balance
      currency
    }
  }
`;

export const CREATE_CONNECT_TOKEN = gql`
  query CreateConnectToken {
    createConnectToken {
      accessToken
    }
  }
`;

export const CREATE_CONNECT_TOKEN_FOR_ITEM = gql`
  query CreateConnectTokenForItem($itemId: ID!) {
    createConnectTokenForItem(itemId: $itemId) {
      accessToken
    }
  }
`;

// ── Mutations ────────────────────────────────────────────────────────

export const CREATE_FINANCIAL_INTEGRATION = gql`
  mutation CreateFinancialIntegration($itemId: String!) {
    createFinancialIntegration(itemId: $itemId) {
      id
      aggregator
      linkId
      status
      createdAt
      expiresAt
      userId
    }
  }
`;

export const UPDATE_FINANCIAL_INTEGRATION = gql`
  mutation UpdateFinancialIntegration($id: ID!, $financialIntegration: FinancialIntegrationInput!) {
    updateFinancialIntegration(id: $id, financialIntegration: $financialIntegration) {
      id
      aggregator
      linkId
      status
      createdAt
      expiresAt
      userId
    }
  }
`;

export const SYNC_INTEGRATION_TRANSACTIONS = gql`
  mutation SyncIntegrationTransactions($integrationId: ID!) {
    syncIntegrationTransactions(integrationId: $integrationId)
  }
`;

export const RECONNECT_INTEGRATION = gql`
  mutation ReconnectIntegration($integrationId: ID!) {
    reconnectIntegration(integrationId: $integrationId) {
      id
      aggregator
      linkId
      status
      createdAt
      expiresAt
      userId
    }
  }
`;

export const DELETE_FINANCIAL_INTEGRATION = gql`
  mutation DeleteFinancialIntegration($id: ID!) {
    deleteFinancialIntegration(id: $id) {
      id
      aggregator
      linkId
      status
      createdAt
      expiresAt
      userId
    }
  }
`;
