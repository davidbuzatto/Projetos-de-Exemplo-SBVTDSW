import { HttpClient } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Venda } from '../common/venda';
import { VendaDTO } from '../common/venda-dto';

@Injectable({
  providedIn: 'root'
})
export class VendaService {

    private baseUrl = "/api/vendas";

    constructor( private httpClient: HttpClient,
                @Inject( "servicesRootUrl" ) private servicesRootUrl: string ) {
        this.baseUrl = `${servicesRootUrl}${this.baseUrl}`;
    }

    salvar( vendaDTO: VendaDTO ): Observable<any> {
        return this.httpClient.post<Venda>( `${this.baseUrl}/vender`, vendaDTO );
    }

    cancelar( venda: Venda ): Observable<any> {
        return this.httpClient.patch<Venda>( `${this.baseUrl}/cancelar/${venda.id}`, "" );
    }

    // métodos base para obtenção de vendas
    getVenda( id: number ): Observable<Venda> {
        const searchUrl = `${this.baseUrl}/${id}`;
        return this.httpClient.get<Venda>( searchUrl );
    }

    getVendaList( pageSize?: number ): Observable<Venda[]> {
        return this.httpClient.get<GetResponseVendas>( pageSize ? `${this.baseUrl}?size=${pageSize}` : this.baseUrl ).pipe(
            map( response => response._embedded.vendas )
        );
    }

    // métodos de busca com paginação
    findAllPaginate( page: number, pageSize: number ): Observable<GetResponseVendas> {
        const searchUrl = `${this.baseUrl}?page=${page}&size=${pageSize}`;
        return this.httpClient.get<GetResponseVendas>( searchUrl );
    }

    findByIdPaginate( id: number, page: number, pageSize: number ): Observable<GetResponseVendas> {
        const searchUrl = `${this.baseUrl}/search/findById?id=${id}&page=${page}&size=${pageSize}`;
        return this.httpClient.get<GetResponseVendas>( searchUrl );
    }

    findByDataPaginate( data: Date, page: number, pageSize: number ): Observable<GetResponseVendas> {
        const searchUrl = `${this.baseUrl}/search/findByData?data=${data}&page=${page}&size=${pageSize}`;
        return this.httpClient.get<GetResponseVendas>( searchUrl );
    }

    findByCanceladaPaginate( cancelada: boolean, page: number, pageSize: number ): Observable<GetResponseVendas> {
        const searchUrl = `${this.baseUrl}/search/findByCancelada?cancelada=${cancelada}&page=${page}&size=${pageSize}`;
        return this.httpClient.get<GetResponseVendas>( searchUrl );
    }

}

interface GetResponseVendas {
    _embedded: {
        vendas: Venda[];
    },
    page: {
        size: number,
        totalElements: number,
        totalPages: number,
        number: number
    }
}
