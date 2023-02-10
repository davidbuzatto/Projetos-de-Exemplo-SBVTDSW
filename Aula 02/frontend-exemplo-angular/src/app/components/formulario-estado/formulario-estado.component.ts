import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Estado } from 'src/app/common/estado';
import { EstadoService } from 'src/app/services/estado.service';
import { Validadores } from 'src/app/validators/validadores';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { DialogoConfirmacaoComponent } from '../dialogo-confirmacao/dialogo-confirmacao.component';
import { DialogoMensagemComponent } from '../dialogo-mensagem/dialogo-mensagem.component';

@Component({
    selector: 'app-formulario-estado',
    templateUrl: './formulario-estado.component.html',
    styleUrls: ['./formulario-estado.component.css']
})
export class FormularioEstadoComponent implements OnInit {

    // datasource
    estados: Estado[] = [];

    // tabela
    colunasTabela: string[] = ["id", "nome", "sigla"];

    // formulários
    estadoFormGroup!: FormGroup;
    buscaEstadoFormGroup!: FormGroup;

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

    constructor( private estadoService: EstadoService,
                 private formBuilder: FormBuilder,
                 public dialogoCancelar: MatDialog,
                 public dialogoMensagem: MatDialog,
                 private router: Router,
                 private route: ActivatedRoute ) {
    }

    ngOnInit(): void {

        // cria a amarração com o formulário de cadastro
        this.estadoFormGroup = this.formBuilder.group({
            estado: this.formBuilder.group({
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
                sigla: new FormControl( "", [
                    Validators.required,
                    Validators.minLength(2),
                    Validators.maxLength(2),
                    Validadores.semEspacosEmBranco
                ])
            })
        });

        // cria a amarração com o formulário de busca
        this.buscaEstadoFormGroup = this.formBuilder.group({
            dados: this.formBuilder.group({
                tipoBusca: new FormControl( "todos" ),
                valorBusca: new FormControl( "" )
            })
        });

        // executa a busca
        this.executarBusca( false );

    }

    // getters para obtenção dos componentes do formulário de cadastro
    get id() { return this.estadoFormGroup.get( "estado.id" ); }
    get nome() { return this.estadoFormGroup.get( "estado.nome" ); }
    get sigla() { return this.estadoFormGroup.get( "estado.sigla" ); }

    // getters para obtenção dos componentes do formulário de cadastro
    get tipoBusca() { return this.buscaEstadoFormGroup.get( "dados.tipoBusca" ); }
    get valorBusca() { return this.buscaEstadoFormGroup.get( "dados.valorBusca" ); }

    private criarEstado(): Estado {
        return new Estado(
            this.id!.value,
            this.nome!.value,
            this.sigla!.value
        );
    }

    // submit do formulário de cadastro
    onSubmitCadastro( formDirective: FormGroupDirective ): void {

        if ( this.estadoFormGroup.invalid ) {
            this.estadoFormGroup.markAllAsTouched();
        } else {

            let estado: Estado = this.criarEstado();

            this.estadoService.salvar( estado ).subscribe({
                next: response => {
                    this.executarBusca( true );
                    this.estadoFormGroup.reset();
                    formDirective.resetForm();
                },
                error: err => {
                    this.abrirMensagemErro( err );
                }
            });

        }

    }

    // manipulação de estados da tabela
    cliqueLinhaTabela( e: Estado ): void {
        this.estadoFormGroup.setValue({
            estado: {
                id: e.id,
                nome: e.nome,
                sigla: e.sigla
            }
        });
    }

    // exclusão
    cliqueBotaoExcluir( formDirective: FormGroupDirective ): void {

        let estado: Estado = this.criarEstado();

        if ( estado.id ) {
            this.abrirDialogoConfirmacaoExclusao( estado, formDirective );
        } else {
            this.dialogoMensagem.open( DialogoMensagemComponent, {
                data: {
                    titulo: "Atenção",
                    mensagem: "Escolha um estado para excluir!"
                }
            });
        }

    }

    private abrirDialogoConfirmacaoExclusao( estado: Estado, formDirective: FormGroupDirective ): void {

        const dialogRef = this.dialogoCancelar.open( DialogoConfirmacaoComponent, {
            data: {
                titulo: "Confirmação",
                mensagem: "Deseja excluir o estado selecionado?"
            }
        });

        dialogRef.afterClosed().subscribe( result => {

            if ( result ) {

                this.estadoService.excluir( estado ).subscribe({
                    next: response => {
                        this.executarBusca( true );
                        this.estadoFormGroup.reset();
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
                this.estadoService.findAllPaginate( this.paginaAtual, this.tamanhoPagina ).subscribe(
                    this.processarResultado()
                );
                break;
            case "id":
                valor = +valor ? +valor : 0;
                this.estadoService.findByIdPaginate( +valor, this.paginaAtual, this.tamanhoPagina ).subscribe(
                    this.processarResultado()
                );
                break;
            case "nome":
                this.estadoService.findByNomeContainingPaginate( valor, this.paginaAtual, this.tamanhoPagina ).subscribe(
                    this.processarResultado()
                );
                break;
            case "sigla":
                this.estadoService.findBySiglaContainingPaginate( valor, this.paginaAtual, this.tamanhoPagina ).subscribe(
                    this.processarResultado()
                );
                break;
        }

        this.tipoBuscaAnterior = tipo;
        this.valorBuscaAnterior = valor;

    }

    private processarResultado() {
        return ( data: any ) => {
            this.estados = data._embedded.estados;
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
