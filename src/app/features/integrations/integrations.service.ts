import { inject, Injectable } from '@angular/core';
import { Apollo } from 'apollo-angular';
import { map, Observable, Subject } from 'rxjs';

import {
  FinancialIntegrationDTO,
  PluggyAccountDTO,
  AccountDTO,
} from '../../shared/models';
import {
  LIST_FINANCIAL_INTEGRATIONS_BY_USER,
  FIND_FINANCIAL_INTEGRATION_BY_ID,
  LIST_ACCOUNTS_BY_INTEGRATION,
  ACCOUNTS_FROM_PLUGGY,
  CREATE_CONNECT_TOKEN,
  CREATE_FINANCIAL_INTEGRATION,
  DELETE_FINANCIAL_INTEGRATION,
} from '../../shared/graphql/integration.operations';

/**
 * IntegrationsService — operacoes de integracoes financeiras via Apollo.
 *
 * Integracoes conectam o FinanceSite a agregadores bancarios (Pluggy).
 * Permitem importar transacoes automaticamente via webhooks.
 */
@Injectable({ providedIn: 'root' })
export class IntegrationsService {
  private readonly apollo = inject(Apollo);

  readonly integrationLinked$ = new Subject<void>();

  list(): Observable<FinancialIntegrationDTO[]> {
    return this.apollo
      .query<{ listFinancialIntegrationsByUser: FinancialIntegrationDTO[] }>({
        query: LIST_FINANCIAL_INTEGRATIONS_BY_USER,
        fetchPolicy: 'network-only',
      })
      .pipe(map((r) => r.data!.listFinancialIntegrationsByUser as FinancialIntegrationDTO[]));
  }

  findById(id: string): Observable<FinancialIntegrationDTO> {
    return this.apollo
      .query<{ findFinancialIntegrationById: FinancialIntegrationDTO }>({
        query: FIND_FINANCIAL_INTEGRATION_BY_ID,
        variables: { id },
      })
      .pipe(map((r) => r.data!.findFinancialIntegrationById));
  }

  listAccountsByIntegration(id: string): Observable<AccountDTO[]> {
    return this.apollo
      .query<{ listAccountsByIntegration: AccountDTO[] }>({
        query: LIST_ACCOUNTS_BY_INTEGRATION,
        variables: { id },
      })
      .pipe(map((r) => r.data!.listAccountsByIntegration));
  }

  createConnectToken(): Observable<string> {
    return this.apollo
      .query<{ createConnectToken: { accessToken: string } }>({
        query: CREATE_CONNECT_TOKEN,
      })
      .pipe(map((r) => r.data!.createConnectToken.accessToken));
  }

  accountsFromPluggy(integrationId: string): Observable<PluggyAccountDTO[]> {
    return this.apollo
      .query<{ accountsFromPluggy: PluggyAccountDTO[] }>({
        query: ACCOUNTS_FROM_PLUGGY,
        variables: { integrationId },
      })
      .pipe(map((r) => r.data!.accountsFromPluggy));
  }

  create(itemId: string): Observable<FinancialIntegrationDTO> {
    return this.apollo
      .mutate<{ createFinancialIntegration: FinancialIntegrationDTO }>({
        mutation: CREATE_FINANCIAL_INTEGRATION,
        variables: { itemId },
      })
      .pipe(map((r) => r.data!.createFinancialIntegration));
  }

  delete(id: string): Observable<FinancialIntegrationDTO> {
    return this.apollo
      .mutate<{ deleteFinancialIntegration: FinancialIntegrationDTO }>({
        mutation: DELETE_FINANCIAL_INTEGRATION,
        variables: { id },
      })
      .pipe(map((r) => r.data!.deleteFinancialIntegration));
  }
}
