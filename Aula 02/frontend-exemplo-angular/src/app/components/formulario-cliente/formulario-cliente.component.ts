import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Cliente } from 'src/app/common/cliente';
import { ClienteService } from 'src/app/services/cliente.service';
import { Validadores } from 'src/app/validators/validadores';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { DialogoConfirmacaoComponent } from '../dialogo-confirmacao/dialogo-confirmacao.component';
import { DialogoMensagemComponent } from '../dialogo-mensagem/dialogo-mensagem.component';
import { Utils } from 'src/app/common/utils';
import { CidadeService } from 'src/app/services/cidade.service';
import { Cidade } from 'src/app/common/cidade';

@Component({
    selector: 'app-formulario-cliente',
    templateUrl: './formulario-cliente.component.html',
    styleUrls: ['./formulario-cliente.component.css']
})
export class FormularioClienteComponent implements OnInit {

    // datasources
    clientes: Cliente[] = [];
    cidades: Cidade[] = [];

    // tabela
    colunasTabela: string[] = ["id", "nome", "cidade"];

    // formulários
    clienteFormGroup!: FormGroup;
    buscaClienteFormGroup!: FormGroup;

    // valores anteriores para busca
    private tipoBuscaAnterior: string = "";
    private valorBuscaAnterior: string = "";

    // paginação
    opcoesTamanhoPaginas: number[] = [5, 10, 25, 50, 100];
    paginaAtual: number = 0;
    tamanhoPagina: number = 5;
    quantidadeElementos: number = 0;
    totalPaginas: number = 0;
    pageEvent!: PageEvent;

    constructor( private clienteService: ClienteService,
                 private cidadeService: CidadeService,
                 private formBuilder: FormBuilder,
                 public dialogoCancelar: MatDialog,
                 public dialogoMensagem: MatDialog,
                 private router: Router,
                 private route: ActivatedRoute ) {
    }

    ngOnInit(): void {

        // cria a amarração com o formulário de cadastro
        this.clienteFormGroup = this.formBuilder.group({
            cliente: this.formBuilder.group({
                id: new FormControl({
                    value: "",
                    disabled: true
                }),
                nome: new FormControl( "", [
                    Validators.required,
                    Validators.minLength(2),
                    Validators.maxLength(50),
                    Validadores.semEspacosEmBranco
                ]),
                cidade: new FormControl( "", [
                    Validators.required
                ])
            })
        });

        // cria a amarração com o formulário de busca
        this.buscaClienteFormGroup = this.formBuilder.group({
            dados: this.formBuilder.group({
                tipoBusca: new FormControl( "todos" ),
                valorBusca: new FormControl( "" )
            })
        });

        // executa a busca
        this.executarBusca( false );

        // obtém as cidades
        this.cidadeService.getCidadeList( 1000 ).subscribe(
            data => this.cidades = data
        );


    }

    // getters para obtenção dos componentes do formulário de cadastro
    get id() { return this.clienteFormGroup.get( "cliente.id" ); }
    get nome() { return this.clienteFormGroup.get( "cliente.nome" ); }
    get cidade() { return this.clienteFormGroup.get( "cliente.cidade" ); }

    // getters para obtenção dos componentes do formulário de cadastro
    get tipoBusca() { return this.buscaClienteFormGroup.get( "dados.tipoBusca" ); }
    get valorBusca() { return this.buscaClienteFormGroup.get( "dados.valorBusca" ); }

    private criarCliente(): Cliente {
        return new Cliente(
            this.id!.value,
            this.nome!.value,
            this.cidade!.value
        );
    }

    // submit do formulário de cadastro
    onSubmitCadastro( formDirective: FormGroupDirective ): void {

        if ( this.clienteFormGroup.invalid ) {
            this.clienteFormGroup.markAllAsTouched();
        } else {

            let cliente: Cliente = this.criarCliente();

            this.clienteService.salvar( cliente ).subscribe({
                next: response => {
                    this.executarBusca( true );
                    this.clienteFormGroup.reset();
                    formDirective.resetForm();
                },
                error: err => {
                    this.abrirMensagemErro( err );
                }
            });

        }

    }

    // manipulação de clientes da tabela
    cliqueLinhaTabela( c: Cliente ): void {
        this.clienteFormGroup.setValue({
            cliente: {
                id: c.id,
                nome: c.nome,
                cidade: c.cidade
            }
        });
    }

    compararPorId( o1: any, o2: any ) {
        return Utils.compararPorId( o1, o2 );
    }

    // exclusão
    cliqueBotaoExcluir( formDirective: FormGroupDirective ): void {

        let cliente: Cliente = this.criarCliente();

        if ( cliente.id ) {
            this.abrirDialogoConfirmacaoExclusao( cliente, formDirective );
        } else {
            this.dialogoMensagem.open( DialogoMensagemComponent, {
                data: {
                    titulo: "Atenção",
                    mensagem: "Escolha um cliente para excluir!"
                }
            });
        }

    }

    private abrirDialogoConfirmacaoExclusao( cliente: Cliente, formDirective: FormGroupDirective ): void {

        const dialogRef = this.dialogoCancelar.open( DialogoConfirmacaoComponent, {
            data: {
                titulo: "Confirmação",
                mensagem: "Deseja excluir o cliente selecionado?"
            }
        });

        dialogRef.afterClosed().subscribe( result => {

            if ( result ) {

                this.clienteService.excluir( cliente ).subscribe({
                    next: response => {
                        this.executarBusca( true );
                        this.clienteFormGroup.reset();
                        formDirective.resetForm();
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
    onSubmitBusca( formDirective: FormGroupDirective ): void {
        this.executarBusca( false );
    }

    // executa a busca de fato
    private executarBusca( usarBuscaAnterior: boolean ): void {

        let tipo: any = usarBuscaAnterior ? this.tipoBuscaAnterior : this.tipoBusca!.value;
        let valor: any = usarBuscaAnterior ? this.valorBuscaAnterior : this.valorBusca!.value;

        switch ( tipo ) {
            case "todos":
                this.clienteService.findAllPaginate( this.paginaAtual, this.tamanhoPagina ).subscribe(
                    this.processarResultado()
                );
                break;
            case "id":
                valor = +valor ? +valor : 0;
                this.clienteService.findByIdPaginate( valor, this.paginaAtual, this.tamanhoPagina ).subscribe(
                    this.processarResultado()
                );
                break;
            case "nome":
                this.clienteService.findByNomeContainingPaginate( valor, this.paginaAtual, this.tamanhoPagina ).subscribe(
                    this.processarResultado()
                );
                break;
        }

        this.tipoBuscaAnterior = tipo;
        this.valorBuscaAnterior = valor;

    }

    private processarResultado() {
        return ( data: any ) => {
            this.clientes = data._embedded.clientes;
            this.paginaAtual = data.page.number;
            this.tamanhoPagina = data.page.size;
            this.quantidadeElementos = data.page.totalElements;
            this.totalPaginas = data.page.totalPages;
        }
    }

    // paginação
    mudarPagina( pageEvent: PageEvent ): void {
        this.paginaAtual = pageEvent.pageIndex;
        this.tamanhoPagina = pageEvent.pageSize;
        this.quantidadeElementos = pageEvent.length;
        this.executarBusca( true );
    }

}
