import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/components/header/header.component';
import { SplashScreenComponent } from './shared/components/splash-screen/splash-screen.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HeaderComponent, SplashScreenComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  readonly showSplash = signal(!sessionStorage.getItem('splashShown'));

  onSplashDone(): void {
    sessionStorage.setItem('splashShown', '1');
    this.showSplash.set(false);
  }
}
