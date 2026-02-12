/**
 * Models de Transaction — o dominio mais complexo da aplicacao.
 *
 * Note que no GraphQL, IDs vem como string ('1', '2') porque o schema
 * define ID! como String. Valores monetarios tambem vem como string
 * ('100.00') para evitar problemas de ponto flutuante.
 */

export enum TransactionType {
  INFLOW = 'INFLOW',
  OUTFLOW = 'OUTFLOW',
}

/** Tipo retornado pelas queries GraphQL de Transaction */
export interface TransactionDTO {
  id: string;
  amount: string;
  type: TransactionType;
  description?: string;
  source?: string;
  destination?: string;
  transactionDate: string;
  accountId: string;
  categoryId?: string;
}

/** Input para mutations createTransaction/updateTransaction */
export interface TransactionInput {
  amount: string;
  type: TransactionType;
  description?: string;
  source?: string;
  destination?: string;
  transactionDate?: string;
  accountId: string;
  categoryId?: string;
}

/** Input para filtro por categorias */
export interface TransactionFilterInput {
  categoryIds?: string[];
}

/** Input para filtro por periodo */
export interface DateRangeInput {
  startDate: string;
  endDate: string;
}

/** Input para paginacao */
export interface PaginationInput {
  page?: number;
  size?: number;
}

/**
 * Retorno das queries de listagem — inclui o saldo calculado.
 * O backend calcula o balance somando INFLOW e subtraindo OUTFLOW.
 */
export interface TransactionListWithBalanceDTO {
  balance: string;
  transactions: TransactionDTO[];
}

/** Informacoes de paginacao */
export interface PageInfo {
  currentPage: number;
  pageSize: number;
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

/** Retorno das queries paginadas */
export interface TransactionPageDTO {
  transactions: TransactionDTO[];
  pageInfo: PageInfo;
  balance: string;
}
