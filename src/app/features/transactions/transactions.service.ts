import { inject, Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { map, Observable } from 'rxjs';

import {
  TransactionDTO,
  TransactionInput,
  TransactionListWithBalanceDTO,
  TransactionPageDTO,
  DateRangeInput,
  TransactionFilterInput,
  PaginationInput,
} from '../../shared/models';
import {
  FIND_TRANSACTION_BY_ID,
  LIST_USER_TRANSACTIONS,
  LIST_ACCOUNT_TRANSACTIONS,
  LIST_TRANSACTIONS_BY_PERIOD,
  LIST_TRANSACTIONS_BY_TYPE,
  LIST_TRANSACTIONS_BY_FILTER,
  LIST_UNCATEGORIZED_TRANSACTIONS,
  LIST_ACCOUNT_TRANSACTIONS_PAGINATED,
  LIST_TRANSACTIONS_BY_PERIOD_PAGINATED,
  LIST_TRANSACTIONS_BY_TYPE_PAGINATED,
  CREATE_TRANSACTION,
  UPDATE_TRANSACTION,
  CATEGORIZE_TRANSACTION,
  DELETE_TRANSACTION,
} from '../../shared/graphql/transaction.operations';

/**
 * TransactionsService — operacoes de transacoes via Apollo.
 *
 * O service mais robusto — reflete a complexidade do TransactionResolver
 * no backend, com multiplas formas de listar transacoes (simples,
 * paginadas, por filtro, por periodo, etc.).
 */
@Injectable({ providedIn: 'root' })
export class TransactionsService {
  private readonly apollo = inject(Apollo);

  // ── Buscar por ID ──────────────────────────────────────────────

  findById(id: string): Observable<TransactionDTO> {
    return this.apollo
      .query<{ findTransactionById: TransactionDTO }>({
        query: FIND_TRANSACTION_BY_ID,
        variables: { id },
      })
      .pipe(map((r) => r.data!.findTransactionById));
  }

  // ── Listagens simples ───────────────────────────────────────────

  listByUser(userId: string): Observable<TransactionListWithBalanceDTO> {
    return this.apollo
      .watchQuery<{ listUserTransactions: TransactionListWithBalanceDTO }>({
        query: LIST_USER_TRANSACTIONS,
        variables: { userId },
      })
      .valueChanges.pipe(map((r) => r.data!.listUserTransactions as TransactionListWithBalanceDTO));
  }

  listByAccount(accountId: string): Observable<TransactionListWithBalanceDTO> {
    return this.apollo
      .watchQuery<{ listAccountTransactions: TransactionListWithBalanceDTO }>({
        query: LIST_ACCOUNT_TRANSACTIONS,
        variables: { accountId },
      })
      .valueChanges.pipe(map((r) => r.data!.listAccountTransactions as TransactionListWithBalanceDTO));
  }

  listByPeriod(
    accountId: string,
    range: DateRangeInput
  ): Observable<TransactionListWithBalanceDTO> {
    return this.apollo
      .watchQuery<{ listTransactionsByPeriod: TransactionListWithBalanceDTO }>({
        query: LIST_TRANSACTIONS_BY_PERIOD,
        variables: { accountId, range },
      })
      .valueChanges.pipe(map((r) => r.data!.listTransactionsByPeriod as TransactionListWithBalanceDTO));
  }

  listByType(
    accountId: string,
    type: string
  ): Observable<TransactionListWithBalanceDTO> {
    return this.apollo
      .watchQuery<{ listTransactionsByType: TransactionListWithBalanceDTO }>({
        query: LIST_TRANSACTIONS_BY_TYPE,
        variables: { accountId, type },
      })
      .valueChanges.pipe(map((r) => r.data!.listTransactionsByType as TransactionListWithBalanceDTO));
  }

  listByFilter(
    accountId: string,
    filter: TransactionFilterInput
  ): Observable<TransactionListWithBalanceDTO> {
    return this.apollo
      .watchQuery<{ listTransactionsByFilter: TransactionListWithBalanceDTO }>({
        query: LIST_TRANSACTIONS_BY_FILTER,
        variables: { accountId, filter },
      })
      .valueChanges.pipe(map((r) => r.data!.listTransactionsByFilter as TransactionListWithBalanceDTO));
  }

  listUncategorized(accountId: string): Observable<TransactionDTO[]> {
    return this.apollo
      .watchQuery<{ listUncategorizedTransactions: TransactionDTO[] }>({
        query: LIST_UNCATEGORIZED_TRANSACTIONS,
        variables: { accountId },
      })
      .valueChanges.pipe(map((r) => r.data!.listUncategorizedTransactions as TransactionDTO[]));
  }

  // ── Listagens paginadas ─────────────────────────────────────────

  listByAccountPaginated(
    accountId: string,
    pagination?: PaginationInput
  ): Observable<TransactionPageDTO> {
    return this.apollo
      .watchQuery<{
        listAccountTransactionsPaginated: TransactionPageDTO;
      }>({
        query: LIST_ACCOUNT_TRANSACTIONS_PAGINATED,
        variables: { accountId, pagination },
      })
      .valueChanges.pipe(
        map((r) => r.data!.listAccountTransactionsPaginated as TransactionPageDTO)
      );
  }

  listByPeriodPaginated(
    accountId: string,
    range: DateRangeInput,
    pagination?: PaginationInput
  ): Observable<TransactionPageDTO> {
    return this.apollo
      .watchQuery<{
        listTransactionsByPeriodPaginated: TransactionPageDTO;
      }>({
        query: LIST_TRANSACTIONS_BY_PERIOD_PAGINATED,
        variables: { accountId, range, pagination },
      })
      .valueChanges.pipe(
        map((r) => r.data!.listTransactionsByPeriodPaginated as TransactionPageDTO)
      );
  }

  listByTypePaginated(
    accountId: string,
    type: string,
    pagination?: PaginationInput
  ): Observable<TransactionPageDTO> {
    return this.apollo
      .watchQuery<{
        listTransactionsByTypePaginated: TransactionPageDTO;
      }>({
        query: LIST_TRANSACTIONS_BY_TYPE_PAGINATED,
        variables: { accountId, type, pagination },
      })
      .valueChanges.pipe(
        map((r) => r.data!.listTransactionsByTypePaginated as TransactionPageDTO)
      );
  }

  // ── Mutations ───────────────────────────────────────────────────

  create(input: TransactionInput): Observable<TransactionDTO> {
    return this.apollo
      .mutate<{ createTransaction: TransactionDTO }>({
        mutation: CREATE_TRANSACTION,
        variables: { input },
      })
      .pipe(map((r) => r.data!.createTransaction));
  }

  update(id: string, input: TransactionInput): Observable<TransactionDTO> {
    return this.apollo
      .mutate<{ updateTransaction: TransactionDTO }>({
        mutation: UPDATE_TRANSACTION,
        variables: { id, input },
      })
      .pipe(map((r) => r.data!.updateTransaction));
  }

  categorize(id: string, categoryId: string | null): Observable<TransactionDTO> {
    return this.apollo
      .mutate<{ categorizeTransaction: TransactionDTO }>({
        mutation: CATEGORIZE_TRANSACTION,
        variables: { id, categoryId },
      })
      .pipe(map((r) => r.data!.categorizeTransaction));
  }

  delete(id: string): Observable<TransactionDTO> {
    return this.apollo
      .mutate<{ deleteTransaction: TransactionDTO }>({
        mutation: DELETE_TRANSACTION,
        variables: { id },
      })
      .pipe(map((r) => r.data!.deleteTransaction));
  }
}
