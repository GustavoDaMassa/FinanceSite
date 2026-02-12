import { Component } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

/**
 * LoadingSpinnerComponent — indicador de carregamento centralizado.
 *
 * O componente mais simples do projeto. Exibe um spinner Material
 * centralizado na tela. Usado como placeholder enquanto dados
 * estao sendo carregados do backend.
 *
 * Standalone component — nao precisa de modulo, se auto-declara
 * com seus imports. Qualquer feature pode usar diretamente:
 *   imports: [LoadingSpinnerComponent]
 *
 * O :host com display:flex centraliza o spinner no container pai.
 */
@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [MatProgressSpinnerModule],
  template: `<mat-spinner diameter="48"></mat-spinner>`,
  styles: `
    :host {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: var(--spacing-xl);
    }
  `,
})
export class LoadingSpinnerComponent {}
