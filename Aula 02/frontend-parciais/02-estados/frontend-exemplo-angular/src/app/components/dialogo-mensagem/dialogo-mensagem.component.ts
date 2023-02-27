import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-dialogo-mensagem',
  templateUrl: './dialogo-mensagem.component.html',
  styleUrls: ['./dialogo-mensagem.component.css']
})
export class DialogoMensagemComponent {

    constructor(
        public dialogRef: MatDialogRef<DialogoMensagemComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData
    ) {}

    ok(): void {
        this.dialogRef.close();
    }

}

export interface DialogData {
    titulo: string;
    mensagem: string;
}
