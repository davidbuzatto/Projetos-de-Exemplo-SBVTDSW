import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Produto } from 'src/app/common/produto';
import { ProdutoService } from 'src/app/services/produto.service';
import { Validadores } from 'src/app/validators/validadores';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { DialogoConfirmacaoComponent } from '../dialogo-confirmacao/dialogo-confirmacao.component';
import { DialogoMensagemComponent } from '../dialogo-mensagem/dialogo-mensagem.component';

@Component({
    selector: 'app-formulario-produto',
    templateUrl: './formulario-produto.component.html',
    styleUrls: ['./formulario-produto.component.css']
})
export class FormularioProdutoComponent implements OnInit {

    // datasource
    produtos: Produto[] = [];

    // tabela
    colunasTabela: string[] = ["id", "nome", "preco", "estoque"];

    // formulários
    produtoFormGroup!: FormGroup;
    buscaProdutoFormGroup!: FormGroup;

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

    constructor( private produtoService: ProdutoService,
                 private formBuilder: FormBuilder,
                 public dialogoCancelar: MatDialog,
                 public dialogoMensagem: MatDialog,
                 private router: Router,
                 private route: ActivatedRoute ) {
    }

    ngOnInit(): void {

        // cria a amarração com o formulário de cadastro
        this.produtoFormGroup = this.formBuilder.group({
            produto: this.formBuilder.group({
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
                preco: new FormControl( "", [
                    Validators.required,
                    Validators.min(0.01),
                    Validators.max(9999.99)
                ]),
                estoque: new FormControl( "", [
                    Validators.required,
                    Validators.min(0.01),
                    Validators.max(9999.99)
                ])
            })
        });

        // cria a amarração com o formulário de busca
        this.buscaProdutoFormGroup = this.formBuilder.group({
            dados: this.formBuilder.group({
                tipoBusca: new FormControl( "todos" ),
                valorBusca: new FormControl( "" )
            })
        });

        // executa a busca
        this.executarBusca( false );

    }

    // getters para obtenção dos componentes do formulário de cadastro
    get id() { return this.produtoFormGroup.get( "produto.id" ); }
    get nome() { return this.produtoFormGroup.get( "produto.nome" ); }
    get preco() { return this.produtoFormGroup.get( "produto.preco" ); }
    get estoque() { return this.produtoFormGroup.get( "produto.estoque" ); }

    // getters para obtenção dos componentes do formulário de cadastro
    get tipoBusca() { return this.buscaProdutoFormGroup.get( "dados.tipoBusca" ); }
    get valorBusca() { return this.buscaProdutoFormGroup.get( "dados.valorBusca" ); }

    private criarProduto(): Produto {
        return new Produto(
            this.id!.value,
            this.nome!.value,
            this.preco!.value,
            this.estoque!.value
        );
    }

    // submit do formulário de cadastro
    onSubmitCadastro( formDirective: FormGroupDirective ): void {

        if ( this.produtoFormGroup.invalid ) {
            this.produtoFormGroup.markAllAsTouched();
        } else {

            let produto: Produto = this.criarProduto();

            this.produtoService.salvar( produto ).subscribe({
                next: response => {
                    this.executarBusca( true );
                    this.produtoFormGroup.reset();
                    formDirective.resetForm();
                },
                error: err => {
                    this.abrirMensagemErro( err );
                }
            });

        }

    }

    // manipulação de produtos da tabela
    cliqueLinhaTabela( p: Produto ): void {
        this.produtoFormGroup.setValue({
            produto: {
                id: p.id,
                nome: p.nome,
                preco: p.preco,
                estoque: p.estoque
            }
        });
    }

    // exclusão
    cliqueBotaoExcluir( formDirective: FormGroupDirective ): void {

        let produto: Produto = this.criarProduto();

        if ( produto.id ) {
            this.abrirDialogoConfirmacaoExclusao( produto, formDirective );
        } else {
            this.dialogoMensagem.open( DialogoMensagemComponent, {
                data: {
                    titulo: "Atenção",
                    mensagem: "Escolha um produto para excluir!"
                }
            });
        }

    }

    private abrirDialogoConfirmacaoExclusao( produto: Produto, formDirective: FormGroupDirective ): void {

        const dialogRef = this.dialogoCancelar.open( DialogoConfirmacaoComponent, {
            data: {
                titulo: "Confirmação",
                mensagem: "Deseja excluir o produto selecionado?"
            }
        });

        dialogRef.afterClosed().subscribe( result => {

            if ( result ) {

                this.produtoService.excluir( produto ).subscribe({
                    next: response => {
                        this.executarBusca( true );
                        this.produtoFormGroup.reset();
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
                this.produtoService.findAllPaginate( this.paginaAtual, this.tamanhoPagina ).subscribe(
                    this.processarResultado()
                );
                break;
            case "id":
                valor = +valor ? +valor : 0;
                this.produtoService.findByIdPaginate( +valor, this.paginaAtual, this.tamanhoPagina ).subscribe(
                    this.processarResultado()
                );
                break;
            case "nome":
                this.produtoService.findByNomeContainingPaginate( valor, this.paginaAtual, this.tamanhoPagina ).subscribe(
                    this.processarResultado()
                );
                break;
        }

        this.tipoBuscaAnterior = tipo;
        this.valorBuscaAnterior = valor;

    }

    private processarResultado() {
        return ( data: any ) => {
            this.produtos = data._embedded.produtos;
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
