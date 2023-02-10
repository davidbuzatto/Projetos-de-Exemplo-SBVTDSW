import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Cidade } from 'src/app/common/cidade';
import { CidadeService } from 'src/app/services/cidade.service';
import { Validadores } from 'src/app/validators/validadores';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { DialogoConfirmacaoComponent } from '../dialogo-confirmacao/dialogo-confirmacao.component';
import { DialogoMensagemComponent } from '../dialogo-mensagem/dialogo-mensagem.component';
import { Estado } from 'src/app/common/estado';
import { EstadoService } from 'src/app/services/estado.service';
import { Utils } from 'src/app/common/utils';

@Component({
    selector: 'app-formulario-cidade',
    templateUrl: './formulario-cidade.component.html',
    styleUrls: ['./formulario-cidade.component.css']
})
export class FormularioCidadeComponent implements OnInit {

    // datasources
    cidades: Cidade[] = [];
    estados: Estado[] = [];

    // tabela
    colunasTabela: string[] = ["id", "nome", "estado"];

    // formulários
    cidadeFormGroup!: FormGroup;
    buscaCidadeFormGroup!: FormGroup;

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

    constructor( private cidadeService: CidadeService,
                 private estadoService: EstadoService,
                 private formBuilder: FormBuilder,
                 public dialogoCancelar: MatDialog,
                 public dialogoMensagem: MatDialog,
                 private router: Router,
                 private route: ActivatedRoute ) {
    }

    ngOnInit(): void {

        // cria a amarração com o formulário de cadastro
        this.cidadeFormGroup = this.formBuilder.group({
            cidade: this.formBuilder.group({
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
                estado: new FormControl( "", [
                    Validators.required
                ])
            })
        });

        // cria a amarração com o formulário de busca
        this.buscaCidadeFormGroup = this.formBuilder.group({
            dados: this.formBuilder.group({
                tipoBusca: new FormControl( "todos" ),
                valorBusca: new FormControl( "" )
            })
        });

        // executa a busca
        this.executarBusca( false );

        // obtém os estados
        this.estadoService.getEstadoList( 1000 ).subscribe(
            data => this.estados = data
        );


    }

    // getters para obtenção dos componentes do formulário de cadastro
    get id() { return this.cidadeFormGroup.get( "cidade.id" ); }
    get nome() { return this.cidadeFormGroup.get( "cidade.nome" ); }
    get estado() { return this.cidadeFormGroup.get( "cidade.estado" ); }

    // getters para obtenção dos componentes do formulário de cadastro
    get tipoBusca() { return this.buscaCidadeFormGroup.get( "dados.tipoBusca" ); }
    get valorBusca() { return this.buscaCidadeFormGroup.get( "dados.valorBusca" ); }

    private criarCidade(): Cidade {
        return new Cidade(
            this.id!.value,
            this.nome!.value,
            this.estado!.value
        );
    }

    // submit do formulário de cadastro
    onSubmitCadastro( formDirective: FormGroupDirective ): void {

        if ( this.cidadeFormGroup.invalid ) {
            this.cidadeFormGroup.markAllAsTouched();
        } else {

            let cidade: Cidade = this.criarCidade();

            this.cidadeService.salvar( cidade ).subscribe({
                next: response => {
                    this.executarBusca( true );
                    this.cidadeFormGroup.reset();
                    formDirective.resetForm();
                },
                error: err => {
                    this.abrirMensagemErro( err );
                }
            });

        }

    }

    // manipulação de cidades da tabela
    cliqueLinhaTabela( c: Cidade ): void {
        this.cidadeFormGroup.setValue({
            cidade: {
                id: c.id,
                nome: c.nome,
                estado: c.estado
            }
        });
    }

    compararPorId( o1: any, o2: any ) {
        return Utils.compararPorId( o1, o2 );
    }

    // exclusão
    cliqueBotaoExcluir( formDirective: FormGroupDirective ): void {

        let cidade: Cidade = this.criarCidade();

        if ( cidade.id ) {
            this.abrirDialogoConfirmacaoExclusao( cidade, formDirective );
        } else {
            this.dialogoMensagem.open( DialogoMensagemComponent, {
                data: {
                    titulo: "Atenção",
                    mensagem: "Escolha uma cidade para excluir!"
                }
            });
        }

    }

    private abrirDialogoConfirmacaoExclusao( cidade: Cidade, formDirective: FormGroupDirective ): void {

        const dialogRef = this.dialogoCancelar.open( DialogoConfirmacaoComponent, {
            data: {
                titulo: "Confirmação",
                mensagem: "Deseja excluir a cidade selecionada?"
            }
        });

        dialogRef.afterClosed().subscribe( result => {

            if ( result ) {

                this.cidadeService.excluir( cidade ).subscribe({
                    next: response => {
                        this.executarBusca( true );
                        this.cidadeFormGroup.reset();
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
                this.cidadeService.findAllPaginate( this.paginaAtual, this.tamanhoPagina ).subscribe(
                    this.processarResultado()
                );
                break;
            case "id":
                valor = +valor ? +valor : 0;
                this.cidadeService.findByIdPaginate( valor, this.paginaAtual, this.tamanhoPagina ).subscribe(
                    this.processarResultado()
                );
                break;
            case "nome":
                this.cidadeService.findByNomeContainingPaginate( valor, this.paginaAtual, this.tamanhoPagina ).subscribe(
                    this.processarResultado()
                );
                break;
        }

        this.tipoBuscaAnterior = tipo;
        this.valorBuscaAnterior = valor;

    }

    private processarResultado() {
        return ( data: any ) => {
            this.cidades = data._embedded.cidades;
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
