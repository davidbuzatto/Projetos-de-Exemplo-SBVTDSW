import * as Utils from "./Utils.js";

let produtos = null;
let produtoAtual = null;

const tbodyProdutos = document.getElementById( "tbodyProdutos" );

const formProduto = document.getElementById( "formProduto" );

const txtIdProduto = document.getElementById( "txtIdProduto" );
const txtNomeProduto = document.getElementById( "txtNomeProduto" );
const txtPrecoProduto = document.getElementById( "txtPrecoProduto" );
const txtEstoqueProduto = document.getElementById( "txtEstoqueProduto" );

const divErroNomeProduto = document.getElementById( "divErroNomeProduto" );
const divErroPrecoProduto = document.getElementById( "divErroPrecoProduto" );
const divErroEstoqueProduto = document.getElementById( "divErroEstoqueProduto" );

const btnNovoProduto = document.getElementById( "btnNovoProduto" );
const btnSalvarProduto = document.getElementById( "btnSalvarProduto" );

async function inserir( produto ) {
    
    await fetch( "/api/produtos", {
        method: "POST",
        body: JSON.stringify( produto ),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    }).then( response => {
        if ( response.ok ) {
            reset();
            obterTodos();
        }
        return response.json();
    }).then( data => {
        if ( data.message ) {
            alert( "Erro interno do servidor!\n\n" + data.message );
        }
    }).catch( error => {
        console.log( "ops (erro em inserir o produto): ", error );
    });
    
}

async function alterar( id, produto ) {
    
    await fetch( "/api/produtos/" + id, {
        method: "PATCH",
        body: JSON.stringify( produto ),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    }).then( response => {
        if ( response.ok ) {
            reset();
            obterTodos();
        }
        return response.json();
    }).then( data => {
        if ( data.message ) {
            alert( "Erro interno do servidor!\n\n" + data.message );
        }
    }).catch( error => {
        console.log( "ops (erro em alterar o produto): ", error );
    });
    
}

async function excluir( id ) {
    
    await fetch( "/api/produtos/" + id, {
        method: "DELETE"
    }).then( response => {
        if ( response.ok ) {
            obterTodos();
        } else {
            return response.json();
        }
    }).then( data => {
        if ( data && data.cause ) {
            alert( "Erro interno do servidor!\n\n" + data.cause.cause.message );
        }
    }).catch( error => {
        console.log( "ops (erro em excluir o produto): ", error );
    });
    
}

async function obterPorId( id ) {
    
    await fetch( "/api/produtos/" + id, {
        method: "GET"
    }).then( response => {
        return response.json();
    }).then( data => {
        console.log( data );
    }).catch( error => {
        console.log( "ops (erro em obter produto por id): ", error );
    });
    
}

async function obterTodos() {
    
    await fetch( "/api/produtos", {
        method: "GET"
    }).then( response => {
        return response.json();
    }).then( data => {
        
        tbodyProdutos.innerHTML = "";
        produtos = data._embedded.produtos;
        
        produtos.forEach( ( produto, i ) => {
            
            const linhaProduto = document.createElement( "tr" );
            
            const cId = document.createElement( "td" );
            const cNome = document.createElement( "td" );
            const cPreco = document.createElement( "td" );
            const cEstoque = document.createElement( "td" );
            const cAlterar = document.createElement( "td" );
            const cExcluir = document.createElement( "td" );
            
            const btnAlterar = document.createElement( "button" );
            const btnExcluir = document.createElement( "button" );
            
            cId.innerHTML = produto.id;
            cNome.innerHTML = produto.nome;
            cPreco.innerHTML = Utils.fmtMoeda.format( produto.preco );
            cEstoque.innerHTML = Utils.fmtNumero.format( produto.estoque );
            cAlterar.appendChild( btnAlterar );
            cExcluir.appendChild( btnExcluir );
            
            btnAlterar.innerHTML = "alterar";
            btnAlterar.onclick = ( event ) => {
                produtoAtual = produtos[i];
                txtIdProduto.value = produtoAtual.id;
                txtNomeProduto.value = produtoAtual.nome;
                txtPrecoProduto.value = produtoAtual.preco;
                txtEstoqueProduto.value = produtoAtual.estoque;
            };
            
            btnExcluir.innerHTML = "excluir";
            btnExcluir.onclick = async ( event ) => {
                produtoAtual = produtos[i];
                if ( confirm( "Deseja excluir o produto selecionado?" ) ) {
                    await excluir( produtoAtual.id );
                    await obterTodos();
                    reset();
                }
                produtoAtual = null;
            };
            
            linhaProduto.appendChild( cId );
            linhaProduto.appendChild( cNome );
            linhaProduto.appendChild( cPreco );
            linhaProduto.appendChild( cEstoque );
            linhaProduto.appendChild( cAlterar );
            linhaProduto.appendChild( cExcluir );
            
            tbodyProdutos.appendChild( linhaProduto );
            
        });
        
        
    }).catch( error => {
        console.log( "ops (erro em obter todos os produtos): ", error );
    });
    
}

function reset() {
    txtIdProduto.value = "";
    txtNomeProduto.value = "";
    txtNomeProduto.classList.remove( "inputInvalido" );
    txtPrecoProduto.value = "";
    txtPrecoProduto.classList.remove( "inputInvalido" );
    txtEstoqueProduto.value = "";
    txtEstoqueProduto.classList.remove( "inputInvalido" );
    divErroNomeProduto.innerHTML = "";
    divErroPrecoProduto.innerHTML = "";
    divErroEstoqueProduto.innerHTML = "";
    produtoAtual = null;
};

function validar() {
    
    let valido = true;
    
    if ( !txtNomeProduto.validity.valid ) {
        valido = false;
        divErroNomeProduto.innerHTML = txtNomeProduto.validationMessage;
        txtNomeProduto.classList.add( "inputInvalido" );
    } else {
        divErroNomeProduto.innerHTML = "";
        txtNomeProduto.classList.remove( "inputInvalido" );
    }
    
    if ( !txtPrecoProduto.validity.valid ) {
        valido = false;
        divErroPrecoProduto.innerHTML = txtPrecoProduto.validationMessage;
        txtPrecoProduto.classList.add( "inputInvalido" );
    } else {
        divErroPrecoProduto.innerHTML = "";
        txtPrecoProduto.classList.remove( "inputInvalido" );
    }
    
    if ( !txtEstoqueProduto.validity.valid ) {
        valido = false;
        divErroEstoqueProduto.innerHTML = txtEstoqueProduto.validationMessage;
        txtEstoqueProduto.classList.add( "inputInvalido" );
    } else {
        divErroEstoqueProduto.innerHTML = "";
        txtEstoqueProduto.classList.remove( "inputInvalido" );
    }
    
    return valido;
    
}

async function setup() {
    
    formProduto.onsubmit = ( event ) => {
        event.preventDefault();
    };
    
    btnNovoProduto.onclick = ( event ) => {
        reset();
    };
    
    btnSalvarProduto.onclick = async ( event ) => {
        
        if ( validar() ) {
            
            if ( produtoAtual === null ) {
                inserir({
                    nome: txtNomeProduto.value,
                    preco: txtPrecoProduto.value,
                    estoque: txtEstoqueProduto.value
                });
            } else {
                alterar( +txtIdProduto.value, {
                    nome: txtNomeProduto.value,
                    preco: txtPrecoProduto.value,
                    estoque: txtEstoqueProduto.value
                });
            }
        
        }
        
    };
    
    obterTodos();
    
}

export { setup, obterTodos };