import { TransactionDTO } from './transaction.model';

export interface ImportResultDTO {
  total: number;
  imported: number;
  skipped: number;
  transactions: TransactionDTO[];
}
