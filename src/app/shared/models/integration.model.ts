import { AccountDTO } from './account.model';

export enum AggregatorType {
  BELVO = 'BELVO',
  PLUGGY = 'PLUGGY',
}

/** Tipo retornado pelas queries GraphQL de FinancialIntegration */
export interface FinancialIntegrationDTO {
  id: string;
  aggregator: AggregatorType;
  linkId: string;
  status?: string;
  createdAt: string;
  expiresAt?: string;
  userId: string;
  accounts?: AccountDTO[];
}

/** Input para mutation updateFinancialIntegration */
export interface FinancialIntegrationInput {
  aggregator: AggregatorType;
  linkId: string;
  userId: string;
}

/** Conta retornada pela API Pluggy (antes de vincular) */
export interface PluggyAccountDTO {
  id?: string;
  name?: string;
  type?: string;
  balance?: number;
  currency?: string;
}
