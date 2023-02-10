import { HttpClient } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Estado } from '../common/estado';

@Injectable({
  providedIn: 'root'
})
export class EstadoService {

    private baseUrl = "/api/estados";

    constructor( private httpClient: HttpClient,
                @Inject( "servicesRootUrl" ) private servicesRootUrl: string ) {
        this.baseUrl = `${servicesRootUrl}${this.baseUrl}`;
    }

    salvar( estado: Estado ): Observable<any> {
        if ( estado!.id ) {
            return this.httpClient.patch<Estado>( `${this.baseUrl}/${estado.id}`, estado );
        } else {
            return this.httpClient.post<Estado>( this.baseUrl, estado );
        }
    }

    excluir( estado: Estado ): Observable<any> {
        return this.httpClient.delete<Estado>( `${this.baseUrl}/${estado.id}` );
    }

    // métodos base para obtenção de estados
    getEstado( id: number ): Observable<Estado> {
        const searchUrl = `${this.baseUrl}/${id}`;
        return this.httpClient.get<Estado>( searchUrl );
    }

    getEstadoList( pageSize?: number ): Observable<Estado[]> {
        return this.httpClient.get<GetResponseEstados>( pageSize ? `${this.baseUrl}?size=${pageSize}` : this.baseUrl ).pipe(
            map( response => response._embedded.estados )
        );
    }

    // métodos de busca com paginação
    findAllPaginate( page: number, pageSize: number ): Observable<GetResponseEstados> {
        const searchUrl = `${this.baseUrl}?page=${page}&size=${pageSize}`;
        return this.httpClient.get<GetResponseEstados>( searchUrl );
    }

    findByIdPaginate( id: number, page: number, pageSize: number ): Observable<GetResponseEstados> {
        const searchUrl = `${this.baseUrl}/search/findById?id=${id}&page=${page}&size=${pageSize}`;
        return this.httpClient.get<GetResponseEstados>( searchUrl );
    }

    findByNomeContainingPaginate( nome: string, page: number, pageSize: number ): Observable<GetResponseEstados> {
        const searchUrl = `${this.baseUrl}/search/findByNomeContaining?nome=${nome}&page=${page}&size=${pageSize}`;
        return this.httpClient.get<GetResponseEstados>( searchUrl );
    }

    findBySiglaContainingPaginate( sigla: string, page: number, pageSize: number ): Observable<GetResponseEstados> {
        const searchUrl = `${this.baseUrl}/search/findBySiglaContaining?sigla=${sigla}&page=${page}&size=${pageSize}`;
        return this.httpClient.get<GetResponseEstados>( searchUrl );
    }

}

interface GetResponseEstados {
    _embedded: {
        estados: Estado[];
    },
    page: {
        size: number,
        totalElements: number,
        totalPages: number,
        number: number
    }
}
