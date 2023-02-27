import { HttpClient } from '@angular/common/http';
import { Injectable, Inject } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { Produto } from '../common/produto';

@Injectable({
  providedIn: 'root'
})
export class ProdutoService {

    private baseUrl = "/api/produtos";

    constructor( private httpClient: HttpClient,
                @Inject( "servicesRootUrl" ) private servicesRootUrl: string ) {
        this.baseUrl = `${servicesRootUrl}${this.baseUrl}`;
    }

    salvar( produto: Produto ): Observable<any> {
        if ( produto!.id ) {
            return this.httpClient.patch<Produto>( `${this.baseUrl}/${produto.id}`, produto );
        } else {
            return this.httpClient.post<Produto>( this.baseUrl, produto );
        }
    }

    excluir( produto: Produto ): Observable<any> {
        return this.httpClient.delete<Produto>( `${this.baseUrl}/${produto.id}` );
    }

    // métodos base para obtenção de produtos
    getProduto( id: number ): Observable<Produto> {
        const searchUrl = `${this.baseUrl}/${id}`;
        return this.httpClient.get<Produto>( searchUrl );
    }

    getProdutoList( pageSize?: number ): Observable<Produto[]> {
        return this.httpClient.get<GetResponseProdutos>( pageSize ? `${this.baseUrl}?size=${pageSize}` : this.baseUrl ).pipe(
            map( response => response._embedded.produtos )
        );
    }

    // métodos de busca com paginação
    findAllPaginate( page: number, pageSize: number ): Observable<GetResponseProdutos> {
        const searchUrl = `${this.baseUrl}?page=${page}&size=${pageSize}`;
        return this.httpClient.get<GetResponseProdutos>( searchUrl );
    }

    findByIdPaginate( id: number, page: number, pageSize: number ): Observable<GetResponseProdutos> {
        const searchUrl = `${this.baseUrl}/search/findById?id=${id}&page=${page}&size=${pageSize}`;
        return this.httpClient.get<GetResponseProdutos>( searchUrl );
    }

    findByNomeContainingPaginate( nome: string, page: number, pageSize: number ): Observable<GetResponseProdutos> {
        const searchUrl = `${this.baseUrl}/search/findByNomeContaining?nome=${nome}&page=${page}&size=${pageSize}`;
        return this.httpClient.get<GetResponseProdutos>( searchUrl );
    }

}

interface GetResponseProdutos {
    _embedded: {
        produtos: Produto[];
    },
    page: {
        size: number,
        totalElements: number,
        totalPages: number,
        number: number
    }
}
