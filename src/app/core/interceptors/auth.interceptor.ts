import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { StorageService } from '../services/storage.service';

/**
 * Auth Interceptor — adiciona o JWT em toda requisicao HTTP (REST).
 *
 * Paralelo Spring: equivale ao JwtAuthenticationFilter do backend,
 * que extrai o token do header Authorization e valida. Aqui fazemos
 * o contrario: ADICIONAMOS o token antes de enviar.
 *
 * Fluxo:
 * Request sai do HttpClient → authInterceptor adiciona Bearer token → servidor
 *
 * IMPORTANTE: Requisicoes GraphQL via Apollo NAO passam por aqui.
 * O Apollo tem seu proprio mecanismo (setContext link no app.config.ts).
 * Este interceptor e apenas para os endpoints REST (/api/auth/*).
 *
 * HttpInterceptorFn e o formato FUNCIONAL (Angular 16+).
 * Antes era uma classe com implements HttpInterceptor — mais verboso.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const storage = inject(StorageService);
  const token = storage.getToken();

  // Endpoints publicos que NAO precisam de token
  const publicUrls = ['/api/auth/login', '/api/auth/register', '/api/auth/create-admin'];
  const isPublic = publicUrls.some(
    (url) => req.url.includes(url) && req.method === 'POST'
  );

  if (token && !isPublic) {
    // clone() cria uma copia imutavel da request com o header adicionado.
    // Requests HTTP sao imutaveis no Angular por design (como records Java).
    const cloned = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`),
    });
    return next(cloned);
  }

  return next(req);
};
