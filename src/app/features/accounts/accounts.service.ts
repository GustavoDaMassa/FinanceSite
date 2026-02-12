import { inject, Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { map, Observable } from 'rxjs';

import { AccountDTO, AccountInput, LinkAccountInput } from '../../shared/models';
import {
  LIST_ACCOUNTS_BY_USER,
  FIND_ACCOUNT_BY_ID,
  CREATE_ACCOUNT,
  UPDATE_ACCOUNT,
  DELETE_ACCOUNT,
  LINK_ACCOUNT,
} from '../../shared/graphql/account.operations';

/**
 * AccountsService — CRUD de contas via Apollo (GraphQL).
 *
 * Cada metodo:
 * 1. Chama Apollo.query (leitura) ou Apollo.mutate (escrita)
 * 2. Passa a operacao GraphQL (gql) + variaveis
 * 3. Retorna Observable tipado com o resultado
 *
 * O componente se inscreve no Observable para receber os dados.
 *
 * Paralelo Spring: como um @Service que chama um repositorio.
 * A diferenca e que aqui o "repositorio" e o Apollo Client
 * que se comunica com o backend via HTTP/GraphQL.
 */
@Injectable({ providedIn: 'root' })
export class AccountsService {
  private readonly apollo = inject(Apollo);

  listByUser(userId: string): Observable<AccountDTO[]> {
    return this.apollo
      .watchQuery<{ listAccountsByUser: AccountDTO[] }>({
        query: LIST_ACCOUNTS_BY_USER,
        variables: { userId },
      })
      .valueChanges.pipe(map((r) => r.data!.listAccountsByUser as AccountDTO[]));
  }

  findById(id: string): Observable<AccountDTO> {
    return this.apollo
      .query<{ findAccountById: AccountDTO }>({
        query: FIND_ACCOUNT_BY_ID,
        variables: { id },
      })
      .pipe(map((r) => r.data!.findAccountById));
  }

  create(account: AccountInput): Observable<AccountDTO> {
    return this.apollo
      .mutate<{ createAccount: AccountDTO }>({
        mutation: CREATE_ACCOUNT,
        variables: { account },
      })
      .pipe(map((r) => r.data!.createAccount));
  }

  update(id: string, account: AccountInput): Observable<AccountDTO> {
    return this.apollo
      .mutate<{ updateAccount: AccountDTO }>({
        mutation: UPDATE_ACCOUNT,
        variables: { id, account },
      })
      .pipe(map((r) => r.data!.updateAccount));
  }

  delete(id: string): Observable<AccountDTO> {
    return this.apollo
      .mutate<{ deleteAccount: AccountDTO }>({
        mutation: DELETE_ACCOUNT,
        variables: { id },
      })
      .pipe(map((r) => r.data!.deleteAccount));
  }

  linkAccount(input: LinkAccountInput): Observable<AccountDTO> {
    return this.apollo
      .mutate<{ linkAccount: AccountDTO }>({
        mutation: LINK_ACCOUNT,
        variables: { input },
      })
      .pipe(map((r) => r.data!.linkAccount));
  }
}
