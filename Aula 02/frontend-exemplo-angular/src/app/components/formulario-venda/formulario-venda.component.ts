import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Venda } from 'src/app/common/venda';
import { VendaService } from 'src/app/services/venda.service';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { DialogoConfirmacaoComponent } from '../dialogo-confirmacao/dialogo-confirmacao.component';
import { DialogoMensagemComponent } from '../dialogo-mensagem/dialogo-mensagem.component';
import { ClienteService } from 'src/app/services/cliente.service';
import { ProdutoService } from 'src/app/services/produto.service';
import { Cliente } from 'src/app/common/cliente';
import { Produto } from 'src/app/common/produto';
import { ItemVenda } from 'src/app/common/item-venda';
import { VendaDTO } from 'src/app/common/venda-dto';
import { DialogoInputComponent } from '../dialogo-input/dialogo-input.component';

@Component({
    selector: 'app-formulario-venda',
    templateUrl: './formulario-venda.component.html',
    styleUrls: ['./formulario-venda.component.css']
})
export class FormularioVendaComponent implements OnInit {

    // datasources
    vendas: Venda[] = [];
    clientes: Cliente[] = [];
    produtos: Produto[] = [];

    // dados
    clienteSelecionado?: Cliente;
    totalVenda: number = 0;
    itensVenda: ItemVenda[] = [];

    // tabela
    colunasTabelaVenda: string[] = ["id", "cliente", "data", "cancelar"];
    colunasTabelaCliente: string[] = ["id", "nome"];
    colunasTabelaProduto: string[] = ["id", "nome"];

    // formulários
    vendaFormGroup!: FormGroup;
    buscaVendaFormGroup!: FormGroup;
    buscaClienteFormGroup!: FormGroup;
    buscaProdutoFormGroup!: FormGroup;

    // valores anteriores para busca
    tipoBuscaComponente: string = "todos";
    private tipoBuscaAnteriorVenda: string = "";
    private tipoBuscaAnteriorCliente: string = "";
    private tipoBuscaAnteriorProduto: string = "";
    private valorBuscaAnteriorVendaTodosId: string = "";
    private valorBuscaAnteriorVendaData: string = "";
    private valorBuscaAnteriorVendaCancelada: string = "";
    private valorBuscaAnteriorCliente: string = "";
    private valorBuscaAnteriorProduto: string = "";

    // paginação
    opcoesTamanhoPaginasVenda: number[] = [5, 10, 25, 50, 100];
    opcoesTamanhoPaginasCliente: number[] = [5, 10, 25, 50, 100];
    opcoesTamanhoPaginasProduto: number[] = [5, 10, 25, 50, 100];
    paginaAtualVenda: number = 0;
    paginaAtualCliente: number = 0;
    paginaAtualProduto: number = 0;
    tamanhoPaginaVenda: number = 5;
    tamanhoPaginaCliente: number = 5;
    tamanhoPaginaProduto: number = 5;
    quantidadeElementosVenda: number = 0;
    quantidadeElementosCliente: number = 0;
    quantidadeElementosProduto: number = 0;
    totalPaginasVenda: number = 0;
    totalPaginasCliente: number = 0;
    totalPaginasProduto: number = 0;
    pageEventVenda!: PageEvent;
    pageEventCliente!: PageEvent;
    pageEventProdutoa!: PageEvent;

    constructor( private vendaService: VendaService,
                 private clienteService: ClienteService,
                 private produtoService: ProdutoService,
                 private formBuilder: FormBuilder,
                 public dialogoCancelar: MatDialog,
                 public dialogoMensagem: MatDialog,
                 public dialogoInput: MatDialog,
                 private router: Router,
                 private route: ActivatedRoute ) {
    }

    ngOnInit(): void {

        // cria a amarração com os formulários de busca
        this.buscaVendaFormGroup = this.formBuilder.group({
            dados: this.formBuilder.group({
                tipoBuscaVenda: new FormControl( "todos" ),
                valorBuscaVendaTodosId: new FormControl( "" ),
                valorBuscaVendaData: new FormControl( new Date() ),
                valorBuscaVendaCancelada: new FormControl( "true" )
            })
        });

        this.buscaClienteFormGroup = this.formBuilder.group({
            dados: this.formBuilder.group({
                tipoBuscaCliente: new FormControl( "todos" ),
                valorBuscaCliente: new FormControl( "" )
            })
        });

        this.buscaProdutoFormGroup = this.formBuilder.group({
            dados: this.formBuilder.group({
                tipoBuscaProduto: new FormControl( "todos" ),
                valorBuscaProduto: new FormControl( "" )
            })
        });

        // executa a busca
        this.executarBuscaVenda( false );
        this.executarBuscaCliente( false );
        this.executarBuscaProduto( false );

    }

    // getters para obtenção dos componentes do formulário de busca
    get tipoBuscaVenda() { return this.buscaVendaFormGroup.get( "dados.tipoBuscaVenda" ); }
    get tipoBuscaCliente() { return this.buscaClienteFormGroup.get( "dados.tipoBuscaCliente" ); }
    get tipoBuscaProduto() { return this.buscaProdutoFormGroup.get( "dados.tipoBuscaProduto" ); }

    get valorBuscaVendaTodosId() { return this.buscaVendaFormGroup.get( "dados.valorBuscaVendaTodosId" ); }
    get valorBuscaVendaData() { return this.buscaVendaFormGroup.get( "dados.valorBuscaVendaData" ); }
    get valorBuscaVendaCancelada() { return this.buscaVendaFormGroup.get( "dados.valorBuscaVendaCancelada" ); }
    get valorBuscaCliente() { return this.buscaClienteFormGroup.get( "dados.valorBuscaCliente" ); }
    get valorBuscaProduto() { return this.buscaProdutoFormGroup.get( "dados.valorBuscaProduto" ); }

    vender(): void {

        if ( this.clienteSelecionado ) {
            if ( this.itensVenda.length > 0 ) {

                let vendaDTO = new VendaDTO( this.clienteSelecionado, this.itensVenda );

                this.vendaService.salvar( vendaDTO ).subscribe({
                    next: response => {
                        this.executarBuscaVenda( true );
                        this.limparVenda();
                    },
                    error: err => {
                        this.abrirMensagemErro( err );
                    }
                });

            } else {
                this.dialogoMensagem.open( DialogoMensagemComponent, {
                    data: {
                        titulo: "ERRO",
                        mensagem: "Uma venda precisa ter pelo menos um item da venda!"
                    }
                });
            }
        } else {
            this.dialogoMensagem.open( DialogoMensagemComponent, {
                data: {
                    titulo: "ERRO",
                    mensagem: "Uma venda precisa ter um cliente!"
                }
            });
        }

    }

    cliqueLinhaTabelaCliente( c: Cliente ): void {
        this.clienteSelecionado = c;
    }

    cliqueLinhaTabelaProduto( p: Produto ): void {

        const dialogRef = this.dialogoInput.open( DialogoInputComponent, {
            data: {
                titulo: "Entrada",
                mensagem: "Quantidade"
            }
        });

        dialogRef.afterClosed().subscribe( result => {

            if ( result ) {

                let quantidade = +result.replace( ",", "." );

                if ( quantidade && quantidade > 0 ) {
                    this.itensVenda.push( new ItemVenda( p, quantidade ) );
                    this.atualizarTotalVenda();
                } else {
                    this.dialogoMensagem.open( DialogoMensagemComponent, {
                        data: {
                            titulo: "ERRO",
                            mensagem: "Forneça um valor maior que zero!"
                        }
                    });
                }

            }

        });

    }

    cliqueRemoverItemVenda( indice: number ): void {

        this.dialogoCancelar.open( DialogoConfirmacaoComponent, {
            data: {
                titulo: "Confirmação",
                mensagem: "Deseja excluir esse item da venda?"
            }
        }).afterClosed().subscribe( result => {
            if ( result ) {
                this.itensVenda.splice( indice, 1 );
                this.atualizarTotalVenda();
            }
        });

    }

    abrirDialogoConfirmacaoCancelamento( venda: Venda ): void {

        const dialogRef = this.dialogoCancelar.open( DialogoConfirmacaoComponent, {
            data: {
                titulo: "Confirmação",
                mensagem: "Deseja cancelar a venda selecionada?"
            }
        });

        dialogRef.afterClosed().subscribe( result => {

            if ( result ) {

                this.vendaService.cancelar( venda ).subscribe({
                    next: response => {
                        this.executarBuscaVenda( true );
                        this.limparVenda();
                    },
                    error: err => {
                        this.abrirMensagemErro( err );
                    }
                });

            }

        });

    }

    private abrirMensagemErro( erro: any ): void {
        this.dialogoMensagem.open( DialogoMensagemComponent, {
            data: {
                titulo: "ERRO",
                mensagem: `${erro.message}`
            }
        });
    }

    // submit do formulário de busca
    onSubmitBuscaVenda( formDirective: FormGroupDirective ): void {
        this.executarBuscaVenda( false );
    }

    onSubmitBuscaCliente( formDirective: FormGroupDirective ): void {
        this.executarBuscaCliente( false );
    }

    onSubmitBuscaProduto( formDirective: FormGroupDirective ): void {
        this.executarBuscaProduto( false );
    }

    // executa a busca de fato
    private executarBuscaVenda( usarBuscaAnterior: boolean ): void {

        let data: Date = this.valorBuscaVendaData!.value;

        let tipo: any = usarBuscaAnterior ? this.tipoBuscaAnteriorVenda : this.tipoBuscaVenda!.value;
        let valorTodosId: any = usarBuscaAnterior ? this.valorBuscaAnteriorVendaTodosId : this.valorBuscaVendaTodosId!.value;
        let valorData: any = usarBuscaAnterior ? this.valorBuscaAnteriorVendaData : `${data.getFullYear()}-${(data.getMonth()+1).toString().padStart(2, "0")}-${data.getDate().toString().padStart(2, "0")}` ;
        let valorCancelada: any = usarBuscaAnterior ? this.valorBuscaAnteriorVendaCancelada : this.valorBuscaVendaCancelada!.value;

        switch ( tipo ) {
            case "todos":
                this.vendaService.findAllPaginate( this.paginaAtualVenda, this.tamanhoPaginaVenda ).subscribe(
                    this.processarResultadoVenda()
                );
                break;
            case "id":
                valorTodosId = +valorTodosId ? +valorTodosId : 0;
                this.vendaService.findByIdPaginate( valorTodosId, this.paginaAtualVenda, this.tamanhoPaginaVenda ).subscribe(
                    this.processarResultadoVenda()
                );
                break;
            case "data":
                this.vendaService.findByDataPaginate( valorData, this.paginaAtualVenda, this.tamanhoPaginaVenda ).subscribe(
                    this.processarResultadoVenda()
                );
                break;
            case "cancelada":
                this.vendaService.findByCanceladaPaginate( valorCancelada, this.paginaAtualVenda, this.tamanhoPaginaVenda ).subscribe(
                    this.processarResultadoVenda()
                );
                break;
        }

        this.tipoBuscaAnteriorVenda = tipo;
        this.valorBuscaAnteriorVendaTodosId = valorTodosId;
        this.valorBuscaAnteriorVendaData = valorData;
        this.valorBuscaAnteriorVendaCancelada = valorCancelada;

    }

    // executa a busca de fato
    private executarBuscaCliente( usarBuscaAnterior: boolean ): void {

        let tipo: any = usarBuscaAnterior ? this.tipoBuscaAnteriorCliente : this.tipoBuscaCliente!.value;
        let valor: any = usarBuscaAnterior ? this.valorBuscaAnteriorCliente : this.valorBuscaCliente!.value;

        switch ( tipo ) {
            case "todos":
                this.clienteService.findAllPaginate( this.paginaAtualCliente, this.tamanhoPaginaCliente ).subscribe(
                    this.processarResultadoCliente()
                );
                break;
            case "id":
                valor = +valor ? +valor : 0;
                this.clienteService.findByIdPaginate( valor, this.paginaAtualCliente, this.tamanhoPaginaCliente ).subscribe(
                    this.processarResultadoCliente()
                );
                break;
            case "nome":
                this.clienteService.findByNomeContainingPaginate( valor, this.paginaAtualCliente, this.tamanhoPaginaCliente ).subscribe(
                    this.processarResultadoCliente()
                );
                break;
        }

        this.tipoBuscaAnteriorCliente = tipo;
        this.valorBuscaAnteriorCliente = valor;

    }

    private executarBuscaProduto( usarBuscaAnterior: boolean ): void {

        let tipo: any = usarBuscaAnterior ? this.tipoBuscaAnteriorProduto : this.tipoBuscaProduto!.value;
        let valor: any = usarBuscaAnterior ? this.valorBuscaAnteriorProduto : this.valorBuscaProduto!.value;

        switch ( tipo ) {
            case "todos":
                this.produtoService.findAllPaginate( this.paginaAtualProduto, this.tamanhoPaginaProduto ).subscribe(
                    this.processarResultadoProduto()
                );
                break;
            case "id":
                valor = +valor ? +valor : 0;
                this.produtoService.findByIdPaginate( +valor, this.paginaAtualProduto, this.tamanhoPaginaProduto ).subscribe(
                    this.processarResultadoProduto()
                );
                break;
            case "nome":
                this.produtoService.findByNomeContainingPaginate( valor, this.paginaAtualProduto, this.tamanhoPaginaProduto ).subscribe(
                    this.processarResultadoProduto()
                );
                break;
        }

        this.tipoBuscaAnteriorProduto = tipo;
        this.valorBuscaAnteriorProduto = valor;

    }

    private processarResultadoVenda() {
        return ( data: any ) => {
            this.vendas = data._embedded.vendas;
            this.paginaAtualVenda = data.page.number;
            this.tamanhoPaginaVenda = data.page.size;
            this.quantidadeElementosVenda = data.page.totalElements;
            this.totalPaginasVenda = data.page.totalPages;
        }
    }

    private processarResultadoCliente() {
        return ( data: any ) => {
            this.clientes = data._embedded.clientes;
            this.paginaAtualCliente = data.page.number;
            this.tamanhoPaginaCliente = data.page.size;
            this.quantidadeElementosCliente = data.page.totalElements;
            this.totalPaginasCliente = data.page.totalPages;
        }
    }

    private processarResultadoProduto() {
        return ( data: any ) => {
            this.produtos = data._embedded.produtos;
            this.paginaAtualProduto = data.page.number;
            this.tamanhoPaginaProduto = data.page.size;
            this.quantidadeElementosProduto = data.page.totalElements;
            this.totalPaginasProduto = data.page.totalPages;
        }
    }

    // paginação
    mudarPaginaVenda( pageEvent: PageEvent ): void {
        this.paginaAtualVenda = pageEvent.pageIndex;
        this.tamanhoPaginaVenda = pageEvent.pageSize;
        this.quantidadeElementosVenda = pageEvent.length;
        this.executarBuscaVenda( true );
    }

    mudarPaginaCliente( pageEvent: PageEvent ): void {
        this.paginaAtualCliente = pageEvent.pageIndex;
        this.tamanhoPaginaCliente = pageEvent.pageSize;
        this.quantidadeElementosCliente = pageEvent.length;
        this.executarBuscaCliente( true );
    }

    mudarPaginaProduto( pageEvent: PageEvent ): void {
        this.paginaAtualProduto = pageEvent.pageIndex;
        this.tamanhoPaginaProduto = pageEvent.pageSize;
        this.quantidadeElementosProduto = pageEvent.length;
        this.executarBuscaProduto( true );
    }

    gerarClasseClienteSelecionado(): string {
        return this.clienteSelecionado ? "alert-success" : "alert-danger";
    }

    limparVenda(): void {
        this.clienteSelecionado = undefined;
        this.totalVenda = 0;
        this.itensVenda = [];
    }

    atualizarTotalVenda(): void {
        this.totalVenda = this.itensVenda.reduce( ( acc, item ) => {
            return acc + ( item.produto.preco * item.quantidade );
        }, 0);
    }

    configurarCampoDeBusca(): void {
        this.tipoBuscaComponente = this.tipoBuscaVenda!.value;
    }

}
