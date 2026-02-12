import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';

/**
 * AppComponent — componente raiz da aplicacao.
 *
 * E o primeiro componente que o Angular renderiza (definido no bootstrap).
 * Sua unica responsabilidade e montar o layout base:
 * - Header (toolbar de navegacao)
 * - <router-outlet> (onde os componentes das rotas sao renderizados)
 *
 * Paralelo Spring: seria como o "template base" no Thymeleaf
 * (layout.html) que define header + area de conteudo.
 *
 * O <router-outlet> funciona como um "placeholder" — o Angular
 * substitui seu conteudo pelo componente da rota ativa.
 * Ex: ao navegar para /dashboard, o DashboardComponent e renderizado
 * DENTRO do <router-outlet>.
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {}
