import { HttpClient } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Cidade } from '../common/cidade';

@Injectable({
  providedIn: 'root'
})
export class CidadeService {

    private baseUrl = "/api/cidades";
    private estadoBaseUrl = "/api/estados";

    constructor( private httpClient: HttpClient,
                @Inject( "servicesRootUrl" ) private servicesRootUrl: string ) {
        this.baseUrl = `${servicesRootUrl}${this.baseUrl}`;
        this.estadoBaseUrl = `${servicesRootUrl}${this.estadoBaseUrl}`;
    }

    salvar( cidade: Cidade ): Observable<any> {

        // remontar o objeto para enviar!

        if ( cidade!.id ) {
            return this.httpClient.patch<Cidade>( `${this.baseUrl}/${cidade.id}`, {
                id: cidade!.id,
                nome: cidade!.nome,
                estado: `${this.estadoBaseUrl}/${cidade!.estado.id}`
            });
        } else {
            return this.httpClient.post<Cidade>( this.baseUrl, {
                nome: cidade!.nome,
                estado: `${this.estadoBaseUrl}/${cidade!.estado.id}`
            });
        }

    }

    excluir( cidade: Cidade ): Observable<any> {
        return this.httpClient.delete<Cidade>( `${this.baseUrl}/${cidade.id}` );
    }

    // métodos base para obtenção de cidades
    getCidade( id: number ): Observable<Cidade> {
        const searchUrl = `${this.baseUrl}/${id}`;
        return this.httpClient.get<Cidade>( searchUrl );
    }

    getCidadeList( pageSize?: number ): Observable<Cidade[]> {
        return this.httpClient.get<GetResponseCidades>( pageSize ? `${this.baseUrl}?size=${pageSize}` : this.baseUrl ).pipe(
            map( response => response._embedded.cidades )
        );
    }

    // métodos de busca com paginação
    findAllPaginate( page: number, pageSize: number ): Observable<GetResponseCidades> {
        const searchUrl = `${this.baseUrl}?page=${page}&size=${pageSize}`;
        return this.httpClient.get<GetResponseCidades>( searchUrl );
    }

    findByIdPaginate( id: number, page: number, pageSize: number ): Observable<GetResponseCidades> {
        const searchUrl = `${this.baseUrl}/search/findById?id=${id}&page=${page}&size=${pageSize}`;
        return this.httpClient.get<GetResponseCidades>( searchUrl );
    }

    findByNomeContainingPaginate( nome: string, page: number, pageSize: number ): Observable<GetResponseCidades> {
        const searchUrl = `${this.baseUrl}/search/findByNomeContaining?nome=${nome}&page=${page}&size=${pageSize}`;
        return this.httpClient.get<GetResponseCidades>( searchUrl );
    }

}

interface GetResponseCidades {
    _embedded: {
        cidades: Cidade[];
    },
    page: {
        size: number,
        totalElements: number,
        totalPages: number,
        number: number
    }
}
