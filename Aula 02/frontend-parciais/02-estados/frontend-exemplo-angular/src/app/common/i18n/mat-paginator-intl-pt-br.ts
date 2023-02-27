import { Injectable } from "@angular/core";
import { MatPaginatorIntl } from "@angular/material/paginator";

/**
 * Internacionalização do componente de paginação do Angular Material UI.
 */
@Injectable()
export class MatPaginatorIntlPtBr extends MatPaginatorIntl {

    override itemsPerPageLabel = "Items por página";
    override nextPageLabel = "Próxima página";
    override previousPageLabel = "Página anterior";
    override firstPageLabel = "Primeira página"
    override lastPageLabel = "Última página";

    override getRangeLabel = ( page: number, pageSize: number, length: number ) => {

        if ( length === 0 || pageSize === 0 ) {
            return "0 de " + length;
        }

        length = Math.max( length, 0 );
        const startIndex = page * pageSize;

        const endIndex =
            startIndex < length
                ? Math.min( startIndex + pageSize, length )
                : startIndex + pageSize;

        return startIndex + 1 + " a " + endIndex + " de " + length;

    };

}
