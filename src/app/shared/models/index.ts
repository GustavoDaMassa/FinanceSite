/**
 * Barrel export — re-exporta todos os models de um unico ponto.
 *
 * Isso permite importar assim:
 *   import { User, AccountDTO, TransactionType } from '../../shared/models';
 *
 * Em vez de importar de cada arquivo individual.
 * Mesmo conceito de um package-info.java ou modulo index.
 */
export * from './auth.model';
export * from './user.model';
export * from './account.model';
export * from './category.model';
export * from './transaction.model';
export * from './integration.model';
