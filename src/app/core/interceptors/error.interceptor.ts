import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from '../services/notification.service';
import { StorageService } from '../services/storage.service';

/**
 * Error Interceptor — tratamento centralizado de erros HTTP.
 *
 * NotificationService e TranslateService sao resolvidos via Injector
 * de forma lazy (dentro do catchError) para evitar dependencia circular:
 * NotificationService → TranslateService → HttpClient → errorInterceptor → NotificationService
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const injector = inject(Injector);
  const storage = inject(StorageService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const notification = injector.get(NotificationService);
      const translate = injector.get(TranslateService);

      // Sem conexao com o servidor
      if (error.status === 0) {
        notification.error(translate.instant('errors.connection_error'));
        return throwError(() => error);
      }

      switch (error.status) {
        case 401:
          // Token expirado ou invalido → logout automatico
          storage.clear();
          router.navigate(['/login']);
          notification.error(translate.instant('errors.session_expired'));
          break;

        case 403:
          notification.error(translate.instant('errors.no_permission'));
          break;

        case 404:
          notification.error(translate.instant('errors.not_found'));
          break;

        case 400:
          // Erro de validacao — tenta usar a mensagem do backend
          const backendMessage = error.error?.message;
          notification.error(backendMessage || translate.instant('errors.unexpected'));
          break;

        case 500:
          notification.error(translate.instant('errors.server_error'));
          break;

        default:
          notification.error(translate.instant('errors.unexpected'));
      }

      // Re-lanca o erro para que o componente que chamou tambem possa tratar
      // (ex: parar um loading spinner)
      return throwError(() => error);
    })
  );
};
