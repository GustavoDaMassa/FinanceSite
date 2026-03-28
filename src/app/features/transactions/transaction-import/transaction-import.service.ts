import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from '../../../../environments/environment';
import { ImportResultDTO } from '../../../shared/models';

@Injectable({ providedIn: 'root' })
export class TransactionImportService {
  private readonly http = inject(HttpClient);

  import(file: File, accountId: string): Observable<ImportResultDTO> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('accountId', accountId);

    return this.http.post<ImportResultDTO>(
      `${environment.apiUrl}/financeapi/import`,
      formData
    );
  }
}
