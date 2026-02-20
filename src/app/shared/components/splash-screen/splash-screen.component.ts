import { Component, output, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-splash-screen',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './splash-screen.component.html',
  styleUrl: './splash-screen.component.scss',
})
export class SplashScreenComponent implements OnInit {
  readonly done = output<void>();

  ngOnInit(): void {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    setTimeout(() => this.done.emit(), reduced ? 50 : 2300);
  }
}
