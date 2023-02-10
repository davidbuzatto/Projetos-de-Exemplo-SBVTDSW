import * as Utils from "./Utils.js";
import * as Produtos from "./Produtos.js";

let vendas = null;
let vendaAtual = null;

let clientes = null;
let produtos = null;
let itensVenda = [];

const tbodyVendas = document.getElementById( "tbodyVendas" );
const tbodyItendsVenda = document.getElementById( "tbodyItensVenda" );

const formVenda = document.getElementById( "formVenda" );

const selClienteVenda = document.getElementById( "selClienteVenda" );
const selProdutoVenda = document.getElementById( "selProdutoVenda" );
const txtQuantidadeProdutoVenda = document.getElementById( "txtQuantidadeProdutoVenda" );
const btnAdicionarItemVenda = document.getElementById( "btnAdicionarItemVenda" );

const spanTotalVenda = document.getElementById( "spanTotalVenda" );

const btnNovaVenda = document.getElementById( "btnNovaVenda" );
const btnSalvarVenda = document.getElementById( "btnSalvarVenda" );
    
async function inserir( venda ) {
    
    await fetch( "/api/vendas/vender", {
        method: "POST",
        body: JSON.stringify( venda ),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    }).then( response => {
        if ( response.ok ) {
            obterTodos();
            Produtos.obterTodos();
        }
        return response.json();
    }).then( data => {
        if ( data.message ) {
            alert( "Erro interno do servidor!\n\n" + data.message );
        } else {
            inserirItensVenda( data );
        }
    }).catch( error => {
        console.log( "ops (erro em inserir o venda): ", error );
    });
    
}

/*async function inserirItensVenda( venda ) {
    
    const itens = [];
    itensVenda.forEach( ( itemVenda ) => {
        itens.push({
            venda: {
                id: venda.id
            },
            produto: {
                id: itemVenda.produto.id
            },
            quantidade: itemVenda.quantidade,
            precoVenda: itemVenda.produto.preco
        });
    });
    
    await fetch( "/api/itensVendas/inserirVarios", {
        method: "POST",
        body: JSON.stringify( itens ),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    }).then( response => {
        if ( response.ok ) {
            reset();
            Produtos.obterTodos();
        } else {
            return response.json();
        }
    }).then( data => {
        if ( data && data.message ) {
            alert( "Erro interno do servidor!\n\n" + data.message );
        }
    }).catch( error => {
        console.log( "ops (erro em inserir os itens da venda): ", error );
    });
    
}*/

async function cancelar( id ) {
    
    await fetch( "/api/vendas/cancelar/" + id, {
        method: "PATCH",
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    }).then( response => {
        if ( response.ok ) {
            obterTodos();
            Produtos.obterTodos();
        } else {
            return response.json();
        }
    }).then( data => {
        if ( data && data.message ) {
            alert( "Erro interno do servidor!\n\n" + data.message );
        }
    }).catch( error => {
        console.log( "ops (erro em cancelar a venda): ", error );
    });
    
}

async function obterPorId( id ) {
    
    await fetch( "/api/vendas/" + id, {
        method: "GET"
    }).then( response => {
        return response.json();
    }).then( data => {
        console.log( data );
    }).catch( error => {
        console.log( "ops (erro em obter venda por id): ", error );
    });
    
}

async function obterTodos() {
    
    await fetch( "/api/vendas", {
        method: "GET"
    }).then( response => {
        return response.json();
    }).then( data => {
        
        tbodyVendas.innerHTML = "";
        vendas = data._embedded.vendas;
        
        vendas.forEach( ( venda, i ) => {
            
            const linhaVenda = document.createElement( "tr" );
            
            const cId = document.createElement( "td" );
            const cCliente = document.createElement( "td" );
            const cCancelar = document.createElement( "td" );
            
            const btnCancelar = document.createElement( "button" );
            
            cId.innerHTML = venda.id;
            cCliente.innerHTML = venda.cliente.nome;
            
            if ( venda.cancelada ) {
                cCancelar.innerHTML = "cancelada";
            } else {
                
                cCancelar.appendChild( btnCancelar );

                btnCancelar.innerHTML = "cancelar";
                btnCancelar.onclick = ( event ) => {
                    vendaAtual = vendas[i];
                    if ( confirm( "Deseja cancelar a venda selecionada?" ) ) {
                        cancelar( vendaAtual.id );
                        reset();
                    }
                    vendaAtual = null;
                };
                
            }
            
            linhaVenda.appendChild( cId );
            linhaVenda.appendChild( cCliente );
            linhaVenda.appendChild( cCancelar );
            
            tbodyVendas.appendChild( linhaVenda );
            
        });
        
        
    }).catch( error => {
        console.log( "ops (erro em obter todas as vendas): ", error );
    });
    
}

async function obterTodosClientes() {
    
    await fetch( "/api/clientes", {
        method: "GET"
    }).then( response => {
        return response.json();
    }).then( data => {
        
        selClienteVenda.innerHTML = "";
        clientes = data._embedded.clientes;
        
        clientes.forEach( ( cliente, i ) => {
            
            const optCliente = document.createElement( "option" );
            optCliente.innerHTML = cliente.nome;
            optCliente.value = cliente.id;
            
            selClienteVenda.appendChild( optCliente );
            
        });
        
        
    }).catch( error => {
        console.log( "ops (erro em obter todos os clientes): ", error );
    });
    
}

async function obterTodosProdutos() {
    
    await fetch( "/api/produtos", {
        method: "GET"
    }).then( response => {
        return response.json();
    }).then( data => {
        
        selProdutoVenda.innerHTML = "";
        produtos = data._embedded.produtos;
        
        produtos.forEach( ( produtos, i ) => {
            
            const optProduto = document.createElement( "option" );
            optProduto.innerHTML = produtos.nome;
            optProduto.value = produtos._links.self.href;
            
            selProdutoVenda.appendChild( optProduto );
            
        });
        
        
    }).catch( error => {
        console.log( "ops (erro em obter todos os produtos): ", error );
    });
    
}

function reset() {
    selClienteVenda.selectedIndex = 0;
    selProdutoVenda.selectedIndex = 0;
    txtQuantidadeProdutoVenda.value = "";
    itensVenda = [];
    vendaAtual = null;
    atualizarTabelaItensVenda();
};

function atualizarTabelaItensVenda() {
    
    tbodyItendsVenda.innerHTML = "";
    let total = 0;
    
    itensVenda.forEach( ( itemVenda, i ) => {
        
        const linhaItemVenda = document.createElement( "tr" );
            
        const cProduto = document.createElement( "td" );
        const cPreco = document.createElement( "td" );
        const cQuantidade = document.createElement( "td" );
        const cTotal = document.createElement( "td" );
        const cRemover = document.createElement( "td" );

        const btnRemover = document.createElement( "button" );
        const totalLinha = Number( itemVenda.produto.preco ) * itemVenda.quantidade;
        
        cProduto.innerHTML = itemVenda.produto.nome;
        cPreco.innerHTML = Utils.fmtMoeda.format( itemVenda.produto.preco );
        cQuantidade.innerHTML = Utils.fmtNumero.format( itemVenda.quantidade );
        cTotal.innerHTML = Utils.fmtMoeda.format( totalLinha );
        cRemover.appendChild( btnRemover );
        
        total += totalLinha;
        
        btnRemover.innerHTML = "&#x2796;";
        btnRemover.onclick = ( event ) => {
            if ( confirm( "Deseja mesmo remover este item da venda?" ) ) {
                itensVenda.splice( i, 1 );
                atualizarTabelaItensVenda();
            }
        };

        linhaItemVenda.appendChild( cProduto );
        linhaItemVenda.appendChild( cPreco );
        linhaItemVenda.appendChild( cQuantidade );
        linhaItemVenda.appendChild( cTotal );
        linhaItemVenda.appendChild( cRemover );
        
        tbodyItendsVenda.appendChild( linhaItemVenda );
    
    });
    
    spanTotalVenda.innerHTML = Utils.fmtMoeda.format( total );
    
}

async function setup() {
    
    formVenda.onsubmit = ( event ) => {
        event.preventDefault();
    };
    
    btnNovaVenda.onclick = ( event ) => {
        reset();
    };
    
    btnAdicionarItemVenda.onclick = ( event ) => {
        
        const produto = produtos[selProdutoVenda.selectedIndex];
        const quantidade = Number( txtQuantidadeProdutoVenda.value );
        
        if ( quantidade && quantidade > 0 ) {
            
            itensVenda.push({
                produto: produto,
                quantidade: quantidade
            });
            
            txtQuantidadeProdutoVenda.value = "";
            atualizarTabelaItensVenda();
            
        } else {
            alert( "Forneça uma quantidade maior que zero!" );
        }
        
    };
    
    btnSalvarVenda.onclick = async ( event ) => {
        
        if ( itensVenda.length === 0 ) {
            alert( "Uma venda precisa ter pelo menos um item da venda!" );
        } else {
            
            let itens = [];
            
            itensVenda.forEach( ( itemVenda ) => {
                itens.push({
                    produto: {
                        id: itemVenda.produto.id
                    },
                    quantidade: itemVenda.quantidade
                });
            });
    
            await inserir({
                cliente: {
                    id: selClienteVenda.value
                },
                itensVenda: itens
            });
            
        }
        
        reset();
        await obterTodos();
        
    };
    
    obterTodos();
    obterTodosClientes();
    obterTodosProdutos();
    
}

export { setup };