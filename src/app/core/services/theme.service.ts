import { Injectable, signal } from '@angular/core';
import { Chart } from 'chart.js';

/**
 * ThemeService — gerencia o tema dark/light da aplicacao.
 *
 * Paralelo Spring: seria como um @Service que gerencia uma configuracao global.
 * No Angular, @Injectable({ providedIn: 'root' }) torna o service um SINGLETON
 * automaticamente — igual ao escopo padrao do Spring (@Scope("singleton")).
 *
 * Fluxo:
 * 1. No constructor, carrega preferencia do localStorage (ou detecta do sistema)
 * 2. Aplica o atributo data-theme no <html> (que ativa as CSS variables corretas)
 * 3. Qualquer componente pode chamar toggle() ou ler currentTheme()
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  // Signal: estado reativo. Quando muda, qualquer template que lê currentTheme()
  // é re-renderizado automaticamente. Mais simples que Observable para estado local.
  currentTheme = signal<'light' | 'dark'>('dark');

  private readonly STORAGE_KEY = 'theme';

  constructor() {
    this.loadTheme();
  }

  /**
   * Alterna entre dark e light.
   * Atualiza o signal, persiste no localStorage, e aplica no DOM.
   */
  toggle(): void {
    const next = this.currentTheme() === 'dark' ? 'light' : 'dark';
    this.currentTheme.set(next);
    localStorage.setItem(this.STORAGE_KEY, next);
    this.applyTheme(next);
  }

  /**
   * Carrega o tema salvo. Prioridade:
   * 1. localStorage (usuario ja escolheu antes)
   * 2. prefers-color-scheme do sistema operacional
   * 3. fallback: dark
   */
  private loadTheme(): void {
    const saved = localStorage.getItem(this.STORAGE_KEY) as 'light' | 'dark' | null;

    if (saved) {
      this.currentTheme.set(saved);
      this.applyTheme(saved);
      return;
    }

    // Detecta preferencia do SO (Window.matchMedia)
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const detected = prefersDark ? 'dark' : 'light';
    this.currentTheme.set(detected);
    this.applyTheme(detected);
  }

  /**
   * Aplica o tema no DOM via data-attribute.
   * O styles.scss tem seletores html[data-theme='dark'] e html[data-theme='light']
   * que ativam as CSS variables correspondentes.
   */
  private applyTheme(theme: 'light' | 'dark'): void {
    document.documentElement.setAttribute('data-theme', theme);
    this.applyChartDefaults(theme);
  }

  private applyChartDefaults(theme: 'light' | 'dark'): void {
    const isDark = theme === 'dark';
    const textColor  = isDark ? '#e6edf3' : '#1f2328';
    const gridColor  = isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.08)';

    Chart.defaults.color       = textColor;
    Chart.defaults.borderColor = gridColor;
    Chart.defaults.scale.grid  = { ...Chart.defaults.scale.grid, color: gridColor };
    Chart.defaults.scale.ticks = { ...Chart.defaults.scale.ticks, color: textColor };
  }
}
