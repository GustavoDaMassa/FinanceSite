import { inject, Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { filter, map, Observable } from 'rxjs';

import {
  AccountDTO,
  TransactionListWithBalanceDTO,
} from '../../shared/models';
import { LIST_ACCOUNTS_BY_USER } from '../../shared/graphql/account.operations';
import { LIST_USER_TRANSACTIONS } from '../../shared/graphql/transaction.operations';

/**
 * DashboardService — busca dados agregados para a tela principal.
 *
 * Injeta o Apollo Client para fazer queries GraphQL.
 * Cada metodo retorna um Observable tipado.
 *
 * Paralelo Spring: como um @Service com metodos que chamam
 * repositorios diferentes e agregam resultados.
 *
 * O Apollo.watchQuery vs Apollo.query:
 * - watchQuery → fica "ouvindo" o cache. Se outra query atualizar
 *   os mesmos dados, o componente recebe a atualizacao automaticamente.
 * - query → faz uma unica requisicao e pronto.
 *
 * Aqui usamos watchQuery com fetchPolicy: 'cache-and-network'
 * para ter resposta rapida do cache + atualizacao do servidor.
 */
@Injectable({ providedIn: 'root' })
export class DashboardService {
  private readonly apollo = inject(Apollo);

  /**
   * Busca todas as contas do usuario.
   *
   * O operador map() do RxJS transforma o Observable:
   * Apollo retorna { data: { listAccountsByUser: [...] } }
   * e nos extraimos apenas o array de contas.
   */
  getAccounts(userId: string): Observable<AccountDTO[]> {
    return this.apollo
      .watchQuery<{ listAccountsByUser: AccountDTO[] }>({
        query: LIST_ACCOUNTS_BY_USER,
        variables: { userId },
      })
      .valueChanges.pipe(
        filter((result) => !!result.data),
        map((result) => result.data!.listAccountsByUser as AccountDTO[])
      );
  }

  /**
   * Busca todas as transacoes do usuario com saldo total.
   * Retorna TransactionListWithBalanceDTO que inclui o balance calculado.
   */
  getTransactionsWithBalance(
    userId: string
  ): Observable<TransactionListWithBalanceDTO> {
    return this.apollo
      .watchQuery<{ listUserTransactions: TransactionListWithBalanceDTO }>({
        query: LIST_USER_TRANSACTIONS,
        variables: { userId },
      })
      .valueChanges.pipe(
        filter((result) => !!result.data),
        map((result) => result.data!.listUserTransactions as TransactionListWithBalanceDTO)
      );
  }
}
