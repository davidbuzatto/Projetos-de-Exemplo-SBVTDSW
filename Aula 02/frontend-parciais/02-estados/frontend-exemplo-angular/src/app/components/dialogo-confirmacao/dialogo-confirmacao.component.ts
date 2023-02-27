import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-dialogo-confirmacao',
    templateUrl: './dialogo-confirmacao.component.html',
    styleUrls: ['./dialogo-confirmacao.component.css'],
})
export class DialogoConfirmacaoComponent {

    constructor(
        public dialogRef: MatDialogRef<DialogoConfirmacaoComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData
    ) {}

    cancelar(): void {
        this.dialogRef.close();
    }

}

export interface DialogData {
    titulo: string;
    mensagem: string;
}
