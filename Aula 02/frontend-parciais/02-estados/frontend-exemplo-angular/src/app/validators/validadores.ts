import { FormControl, ValidationErrors } from "@angular/forms";

export class Validadores {

    static semEspacosEmBranco( control: FormControl ): ValidationErrors | null {

        if ( control.value !== null && control.value.trim().length === 0 ) {
            return { "semEspacosEmBranco": true };
        }

        return null;

    }

}
