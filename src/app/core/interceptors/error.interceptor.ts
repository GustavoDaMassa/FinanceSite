import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from '../services/notification.service';
import { StorageService } from '../services/storage.service';

/**
 * Error Interceptor — tratamento centralizado de erros HTTP.
 *
 * Paralelo Spring: equivale ao @ControllerAdvice / @ExceptionHandler
 * que centraliza o tratamento de excecoes no backend. Aqui fazemos
 * o mesmo no frontend — qualquer erro HTTP e capturado e tratado.
 *
 * O operador catchError do RxJS funciona como um try/catch reativo:
 * intercepta o erro no stream do Observable e permite tratar ou re-lancar.
 *
 * Fluxo:
 * Servidor retorna erro → errorInterceptor captura → mostra notificacao → re-lanca
 */
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const notification = inject(NotificationService);
  const storage = inject(StorageService);
  const translate = inject(TranslateService);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
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
