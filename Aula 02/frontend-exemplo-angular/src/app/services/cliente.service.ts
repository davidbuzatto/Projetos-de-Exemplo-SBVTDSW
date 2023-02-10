import { HttpClient } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Cliente } from '../common/cliente';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

    private baseUrl = "/api/clientes";
    private cidadeBaseUrl = "/api/cidades";

    constructor( private httpClient: HttpClient,
                @Inject( "servicesRootUrl" ) private servicesRootUrl: string ) {
        this.baseUrl = `${servicesRootUrl}${this.baseUrl}`;
        this.cidadeBaseUrl = `${servicesRootUrl}${this.cidadeBaseUrl}`;
    }

    salvar( cliente: Cliente ): Observable<any> {

        // remontar o objeto para enviar!

        if ( cliente!.id ) {
            return this.httpClient.patch<Cliente>( `${this.baseUrl}/${cliente.id}`, {
                id: cliente!.id,
                nome: cliente!.nome,
                cidade: `${this.cidadeBaseUrl}/${cliente!.cidade.id}`
            });
        } else {
            return this.httpClient.post<Cliente>( this.baseUrl, {
                nome: cliente!.nome,
                cidade: `${this.cidadeBaseUrl}/${cliente!.cidade.id}`
            });
        }

    }

    excluir( cliente: Cliente ): Observable<any> {
        return this.httpClient.delete<Cliente>( `${this.baseUrl}/${cliente.id}` );
    }

    // métodos base para obtenção de clientes
    getCliente( id: number ): Observable<Cliente> {
        const searchUrl = `${this.baseUrl}/${id}`;
        return this.httpClient.get<Cliente>( searchUrl );
    }

    getClienteList( pageSize?: number ): Observable<Cliente[]> {
        return this.httpClient.get<GetResponseClientes>( pageSize ? `${this.baseUrl}?size=${pageSize}` : this.baseUrl ).pipe(
            map( response => response._embedded.clientes )
        );
    }

    // métodos de busca com paginação
    findAllPaginate( page: number, pageSize: number ): Observable<GetResponseClientes> {
        const searchUrl = `${this.baseUrl}?page=${page}&size=${pageSize}`;
        return this.httpClient.get<GetResponseClientes>( searchUrl );
    }

    findByIdPaginate( id: number, page: number, pageSize: number ): Observable<GetResponseClientes> {
        const searchUrl = `${this.baseUrl}/search/findById?id=${id}&page=${page}&size=${pageSize}`;
        return this.httpClient.get<GetResponseClientes>( searchUrl );
    }

    findByNomeContainingPaginate( nome: string, page: number, pageSize: number ): Observable<GetResponseClientes> {
        const searchUrl = `${this.baseUrl}/search/findByNomeContaining?nome=${nome}&page=${page}&size=${pageSize}`;
        return this.httpClient.get<GetResponseClientes>( searchUrl );
    }

}

interface GetResponseClientes {
    _embedded: {
        clientes: Cliente[];
    },
    page: {
        size: number,
        totalElements: number,
        totalPages: number,
        number: number
    }
}
