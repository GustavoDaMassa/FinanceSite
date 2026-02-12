import { Injectable, Injector, inject, signal, runInInjectionContext } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

/**
 * I18nService — gerencia o idioma da aplicacao.
 *
 * Wrapper sobre o ngx-translate que adiciona:
 * - Signal reativo para o idioma atual
 * - Persistencia no localStorage
 * - Lista de idiomas disponiveis
 *
 * Paralelo Spring: seria como o LocaleResolver do Spring MVC,
 * que determina qual Locale usar para MessageSource.
 */
@Injectable({ providedIn: 'root' })
export class I18nService {
  private readonly injector = inject(Injector);
  private translate!: TranslateService;

  private readonly STORAGE_KEY = 'lang';
  readonly availableLanguages = [
    { code: 'pt-BR', label: 'Português' },
    { code: 'en-US', label: 'English' },
  ];

  currentLang = signal<string>('pt-BR');

  /**
   * Inicializa o servico de traducao.
   * Chamado no app.config.ts apos o bootstrap.
   * Registra os idiomas e carrega o salvo ou o padrao.
   */
  init(): void {
    this.translate = this.injector.get(TranslateService);
    const codes = this.availableLanguages.map((l) => l.code);
    this.translate.addLangs(codes);
    this.translate.setDefaultLang('pt-BR');

    const saved = localStorage.getItem(this.STORAGE_KEY);
    const lang = saved && codes.includes(saved) ? saved : 'pt-BR';

    this.currentLang.set(lang);
    this.translate.use(lang);
  }

  /**
   * Troca o idioma. Atualiza o signal, persiste, e o ngx-translate
   * recarrega o JSON correspondente automaticamente.
   */
  switchLang(lang: string): void {
    this.currentLang.set(lang);
    localStorage.setItem(this.STORAGE_KEY, lang);
    this.translate.use(lang);
    document.documentElement.setAttribute('lang', lang);
  }
}
