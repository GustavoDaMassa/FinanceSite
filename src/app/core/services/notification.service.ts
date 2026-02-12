import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';

/**
 * NotificationService — exibe mensagens de feedback ao usuario.
 *
 * Usa o MatSnackBar (componente Material) que mostra uma barra temporaria
 * no canto da tela. Cores definidas via CSS classes no styles.scss.
 *
 * O inject() e a forma moderna de injecao de dependencia no Angular.
 * Equivalente a @Autowired do Spring, mas como funcao em vez de anotacao.
 * Funciona APENAS dentro de "injection context" (constructor, factory, etc).
 */
@Injectable({ providedIn: 'root' })
export class NotificationService {
  private snackBar = inject(MatSnackBar);
  private translate = inject(TranslateService);

  success(message: string): void {
    this.snackBar.open(message, this.translate.instant('common.close'), {
      duration: 3000,
      panelClass: ['success-snackbar'],
      horizontalPosition: 'end',
      verticalPosition: 'top',
    });
  }

  error(message: string): void {
    this.snackBar.open(message, this.translate.instant('common.close'), {
      duration: 5000,
      panelClass: ['error-snackbar'],
      horizontalPosition: 'end',
      verticalPosition: 'top',
    });
  }

  info(message: string): void {
    this.snackBar.open(message, this.translate.instant('common.close'), {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
    });
  }
}
