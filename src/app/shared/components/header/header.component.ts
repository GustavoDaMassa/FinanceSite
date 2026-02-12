import { Component, inject, computed } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe } from '@ngx-translate/core';

import { AuthService } from '../../../core/services/auth.service';
import { ThemeService } from '../../../core/services/theme.service';
import { I18nService } from '../../../core/services/i18n.service';

/**
 * HeaderComponent — barra de navegacao principal (toolbar).
 *
 * Inspirada no header do GitHub: fundo solido, navegacao horizontal,
 * toggles de tema/idioma, menu do usuario com avatar (iniciais).
 *
 * Conceitos Angular demonstrados:
 * - Signals para reatividade: `isAuthenticated()`, `userName()`, `currentTheme()`
 * - computed() para valores derivados: `userInitials`, `themeIcon`, `currentLangLabel`
 * - inject() para DI funcional (sem constructor)
 * - RouterLink/RouterLinkActive para navegacao declarativa
 * - @if/@for — novo control flow (Angular 17+)
 * - TranslatePipe para i18n nos templates
 *
 * Paralelo Spring: seria como um "layout fragment" no Thymeleaf,
 * ou um componente React de layout que envolve todas as paginas.
 *
 * O header so mostra links de navegacao se o usuario esta autenticado.
 * Isso e controlado pelo signal `isAuthenticated` do AuthService.
 */
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatTooltipModule,
    TranslatePipe,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  private readonly authService = inject(AuthService);
  private readonly themeService = inject(ThemeService);
  private readonly i18nService = inject(I18nService);

  // ── Signals do AuthService ──────────────────────────────────────
  readonly isAuthenticated = this.authService.isAuthenticated;
  readonly userName = computed(() => this.authService.currentUser()?.name ?? '');

  /**
   * computed() — valor derivado que recalcula automaticamente.
   * Quando currentUser() muda, userInitials() recalcula sozinho.
   * E como um @DependsOn no Spring — reage a mudancas na dependencia.
   */
  readonly userInitials = computed(() => {
    const name = this.userName();
    if (!name) return '';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  });

  // ── Theme ───────────────────────────────────────────────────────
  readonly currentTheme = this.themeService.currentTheme;
  readonly themeIcon = computed(() =>
    this.currentTheme() === 'dark' ? 'light_mode' : 'dark_mode'
  );
  readonly themeTooltip = computed(() =>
    this.currentTheme() === 'dark' ? 'theme.light' : 'theme.dark'
  );

  // ── I18N ────────────────────────────────────────────────────────
  readonly currentLang = this.i18nService.currentLang;
  readonly currentLangLabel = computed(() =>
    this.currentLang() === 'pt-BR' ? 'PT' : 'EN'
  );

  // ── Actions ─────────────────────────────────────────────────────

  toggleTheme(): void {
    this.themeService.toggle();
  }

  toggleLang(): void {
    const next = this.currentLang() === 'pt-BR' ? 'en-US' : 'pt-BR';
    this.i18nService.switchLang(next);
  }

  logout(): void {
    this.authService.logout();
  }
}
