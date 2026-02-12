import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
  inject,
  APP_INITIALIZER,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors, HttpClient } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideApollo } from 'apollo-angular';
import { HttpLink } from 'apollo-angular/http';
import { InMemoryCache, ApolloLink } from '@apollo/client/core';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { I18nService } from './core/services/i18n.service';
import { environment } from '../environments/environment';

/**
 * Factory que cria o loader de traducoes.
 * O HttpLoaderFactory usa o HttpClient para buscar os JSONs em /assets/i18n/.
 * Quando o usuario troca de idioma, o ngx-translate usa este loader para
 * carregar o JSON correspondente (pt-BR.json ou en-US.json).
 */
function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

/**
 * Inicializa o I18N antes da app carregar.
 * APP_INITIALIZER e um token especial do Angular que executa funcoes
 * durante o bootstrap — garante que as traducoes estejam prontas
 * antes de qualquer componente renderizar.
 */
function initI18n(i18nService: I18nService) {
  return () => i18nService.init();
}

/**
 * ApplicationConfig — configuracao central da aplicacao.
 *
 * Paralelo Spring:
 * - provideRouter = @Controller mappings (quais URLs levam a quais componentes)
 * - provideHttpClient = RestTemplate/WebClient configurado com filtros
 * - withInterceptors = FilterChain (auth.interceptor = JwtFilter, error = ExceptionHandler)
 * - provideApollo = seria como configurar um GraphQL client bean
 * - provideAnimationsAsync = habilita animacoes Material (carregadas sob demanda)
 * - TranslateModule = MessageSource para I18N
 *
 * Tudo que esta aqui e SINGLETON e disponivel para toda a aplicacao.
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),

    // Zone.js otimizado — agrupa eventos DOM para reduzir change detection
    provideZoneChangeDetection({ eventCoalescing: true }),

    // Router — mapeia URLs para componentes (lazy loaded)
    provideRouter(routes),

    // HttpClient com interceptors para REST calls
    // A ordem importa: auth adiciona o token, error trata falhas
    provideHttpClient(withInterceptors([authInterceptor, errorInterceptor])),

    // Animacoes Material carregadas async (melhor performance inicial)
    provideAnimationsAsync(),

    // I18N — ngx-translate
    TranslateModule.forRoot({
      defaultLanguage: environment.defaultLang,
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }).providers!,

    // Inicializa I18N antes da app renderizar
    {
      provide: APP_INITIALIZER,
      useFactory: initI18n,
      deps: [I18nService],
      multi: true,
    },

    // Charts — ng2-charts com Chart.js
    provideCharts(withDefaultRegisterables()),

    // Apollo Client — GraphQL
    provideApollo(() => {
      const httpLink = inject(HttpLink);

      // 1. HTTP Link — aponta para o endpoint GraphQL do backend
      const http = httpLink.create({
        uri: environment.graphqlUrl,
      });

      // 2. Auth Link — injeta JWT em TODA requisicao GraphQL
      // setContext roda ANTES de cada request e permite adicionar headers.
      // Le o token direto do localStorage (nao usa StorageService aqui
      // porque estamos fora do injection context normal do Angular).
      const auth = setContext((_, { headers }) => {
        const token = localStorage.getItem('auth_token');
        return {
          headers: {
            ...headers,
            Authorization: token ? `Bearer ${token}` : '',
          },
        };
      });

      // 3. Error Link — log de erros GraphQL
      // Diferente do errorInterceptor (que trata erros HTTP),
      // este trata erros ESPECIFICOS do GraphQL (queries invalidas, etc.)
      const errorLink = onError(({ graphQLErrors, networkError }) => {
        if (graphQLErrors) {
          graphQLErrors.forEach(({ message, locations, path }) => {
            console.error(
              `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
            );
          });
        }
        if (networkError) {
          console.error(`[Network error]: ${networkError}`);
        }
      });

      // Encadeia os links: auth → error → http
      // Como um pipeline de filtros no Spring
      return {
        link: ApolloLink.from([auth, errorLink, http]),
        cache: new InMemoryCache(),
        defaultOptions: {
          watchQuery: {
            fetchPolicy: 'cache-and-network',
            errorPolicy: 'all',
          },
          query: {
            fetchPolicy: 'network-only',
            errorPolicy: 'all',
          },
          mutate: {
            errorPolicy: 'all',
          },
        },
      };
    }),
  ],
};
