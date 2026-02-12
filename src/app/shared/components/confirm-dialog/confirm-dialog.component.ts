import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogModule,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Interface dos dados que o dialog recebe.
 * Quem abre o dialog passa um objeto com titulo e mensagem.
 */
export interface ConfirmDialogData {
  title: string;
  message: string;
}

/**
 * ConfirmDialogComponent — dialog de confirmacao generico.
 *
 * Usado para confirmacoes como "Tem certeza que deseja excluir?"
 * antes de acoes destrutivas (delete de conta, transacao, etc.).
 *
 * Como funciona:
 * 1. Componente pai abre o dialog: `dialog.open(ConfirmDialogComponent, { data: {...} })`
 * 2. Dialog exibe titulo + mensagem + botoes Cancelar/Confirmar
 * 3. Ao fechar, retorna true (confirmou) ou false/undefined (cancelou)
 * 4. Componente pai reage: `dialogRef.afterClosed().subscribe(result => ...)`
 *
 * Paralelo Spring: nao tem equivalente direto no backend. Seria como
 * uma validacao extra antes de executar um delete — "voce tem certeza?"
 *
 * MAT_DIALOG_DATA e um InjectionToken do Material que carrega os dados
 * passados na abertura do dialog. Funciona como um @Value ou @Qualifier
 * do Spring — injeta um valor especifico no componente.
 */
@Component({
  selector: 'app-confirm-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, TranslatePipe],
  template: `
    <h2 mat-dialog-title>{{ data.title }}</h2>
    <mat-dialog-content>
      <p>{{ data.message }}</p>
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button (click)="dialogRef.close(false)">
        {{ 'common.cancel' | translate }}
      </button>
      <button mat-flat-button color="warn" (click)="dialogRef.close(true)">
        {{ 'common.confirm' | translate }}
      </button>
    </mat-dialog-actions>
  `,
  styles: `
    mat-dialog-content p {
      color: var(--color-text-secondary);
      font-size: var(--font-sm);
    }
  `,
})
export class ConfirmDialogComponent {
  readonly dialogRef = inject(MatDialogRef<ConfirmDialogComponent>);
  readonly data = inject<ConfirmDialogData>(MAT_DIALOG_DATA);
}
