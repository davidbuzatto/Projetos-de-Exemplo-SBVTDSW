import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-dialogo-input',
  templateUrl: './dialogo-input.component.html',
  styleUrls: ['./dialogo-input.component.css']
})
export class DialogoInputComponent {

    campoEntrada: string = "";

    constructor(
        public dialogRef: MatDialogRef<DialogoInputComponent>,
        @Inject(MAT_DIALOG_DATA) public data: DialogData
    ) {}

    enter(): void {
        this.dialogRef.close( this.campoEntrada );
    }

    cancelar(): void {
        this.dialogRef.close();
    }

}

export interface DialogData {
    titulo: string;
    mensagem: string;
}
