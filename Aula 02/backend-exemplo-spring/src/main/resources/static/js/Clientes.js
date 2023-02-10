let cidades = null;
let clientes = null;
let clienteAtual = null;

const tbodyClientes = document.getElementById( "tbodyClientes" );

const formCliente = document.getElementById( "formCliente" );

const txtIdCliente = document.getElementById( "txtIdCliente" );
const txtNomeCliente = document.getElementById( "txtNomeCliente" );
const selCidadeCliente = document.getElementById( "selCidadeCliente" );

const divErroNomeCliente = document.getElementById( "divErroNomeCliente" );
const divErroCidadeCliente = document.getElementById( "divErroCidadeCliente" );

const btnNovoCliente = document.getElementById( "btnNovoCliente" );
const btnSalvarCliente = document.getElementById( "btnSalvarCliente" );


async function inserir( cliente ) {
    
    await fetch( "/api/clientes", {
        method: "POST",
        body: JSON.stringify( cliente ),
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
        console.log( "ops (erro em inserir o cliente): ", error );
    });
    
}

async function alterar( id, cliente ) {
    
    await fetch( "/api/clientes/" + id, {
        method: "PATCH",
        body: JSON.stringify( cliente ),
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
        console.log( "ops (erro em alterar o cliente): ", error );
    });
    
}

async function excluir( id ) {
    
    await fetch( "/api/clientes/" + id, {
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
        console.log( "ops (erro em excluir o cliente): ", error );
    });
    
}

async function obterPorId( id ) {
    
    await fetch( "/api/clientes/" + id, {
        method: "GET"
    }).then( response => {
        return response.json();
    }).then( data => {
        console.log( data );
    }).catch( error => {
        console.log( "ops (erro em obter cliente por id): ", error );
    });
    
}

async function obterTodos() {
    
    await fetch( "/api/clientes", {
        method: "GET"
    }).then( response => {
        return response.json();
    }).then( data => {
        
        tbodyClientes.innerHTML = "";
        clientes = data._embedded.clientes;
        
        clientes.forEach( ( cliente, i ) => {
            
            const linhaCliente = document.createElement( "tr" );
            
            const cId = document.createElement( "td" );
            const cNome = document.createElement( "td" );
            const cCidade = document.createElement( "td" );
            const cAlterar = document.createElement( "td" );
            const cExcluir = document.createElement( "td" );
            
            const btnAlterar = document.createElement( "button" );
            const btnExcluir = document.createElement( "button" );
            
            cId.innerHTML = cliente.id;
            cNome.innerHTML = cliente.nome;
            cCidade.innerHTML = cliente.cidade.nome;
            cAlterar.appendChild( btnAlterar );
            cExcluir.appendChild( btnExcluir );
            
            btnAlterar.innerHTML = "alterar";
            btnAlterar.onclick = ( event ) => {
                clienteAtual = clientes[i];
                txtIdCliente.value = clienteAtual.id;
                txtNomeCliente.value = clienteAtual.nome;
                selCidadeCliente.value = cliente._links.self.href.replace( "/clientes/" + cliente.id, "/cidades/" + cliente.cidade.id );
            };
            
            btnExcluir.innerHTML = "excluir";
            btnExcluir.onclick = async ( event ) => {
                clienteAtual = clientes[i];
                if ( confirm( "Deseja excluir o cliente selecionado?" ) ) {
                    await excluir( clienteAtual.id );
                    await obterTodos();
                    reset();
                }
                clienteAtual = null;
            };
            
            linhaCliente.appendChild( cId );
            linhaCliente.appendChild( cNome );
            linhaCliente.appendChild( cCidade );
            linhaCliente.appendChild( cAlterar );
            linhaCliente.appendChild( cExcluir );
            
            tbodyClientes.appendChild( linhaCliente );
            
        });
        
        
    }).catch( error => {
        console.log( "ops (erro em obter todos os clientes): ", error );
    });
    
}

async function obterTodasCidades() {
    
    await fetch( "/api/cidades", {
        method: "GET"
    }).then( response => {
        return response.json();
    }).then( data => {
        
        selCidadeCliente.innerHTML = "";
        cidades = data._embedded.cidades;
        
        cidades.forEach( ( cidade, i ) => {
            
            const optCidade = document.createElement( "option" );
            optCidade.innerHTML = `${cidade.nome} - ${cidade.estado.sigla}`;
            optCidade.value = cidade._links.self.href;
            
            selCidadeCliente.appendChild( optCidade );
            
        });
        
        
    }).catch( error => {
        console.log( "ops (erro em obter todas as cidades): ", error );
    });
    
}

function reset() {
    txtIdCliente.value = "";
    txtNomeCliente.value = "";
    txtNomeCliente.classList.remove( "inputInvalido" );
    selCidadeCliente.selectedIndex = 0;
    divErroNomeCliente.innerHTML = "";
    divErroCidadeCliente.innerHTML = "";
    clienteAtual = null;
};

function validar() {
    
    let valido = true;
    
    if ( !txtNomeCliente.validity.valid ) {
        valido = false;
        divErroNomeCliente.innerHTML = txtNomeCliente.validationMessage;
        txtNomeCliente.classList.add( "inputInvalido" );
    } else {
        divErroNomeCliente.innerHTML = "";
        txtNomeCliente.classList.remove( "inputInvalido" );
    }
    
    return valido;
    
}

async function setup() {
    
    formCliente.onsubmit = ( event ) => {
        event.preventDefault();
    };
    
    btnNovoCliente.onclick = ( event ) => {
        reset();
    };
    
    btnSalvarCliente.onclick = async ( event ) => {
        
        if ( validar() ) {
            
            if ( clienteAtual === null ) {
                inserir({
                    nome: txtNomeCliente.value,
                    cidade: selCidadeCliente.value
                });
            } else {
                alterar( +txtIdCliente.value, {
                    nome: txtNomeCliente.value,
                    cidade: selCidadeCliente.value
                });
            }
            
        }
        
    };
    
    obterTodos();
    obterTodasCidades();
    
}

export { setup, obterTodos, obterTodasCidades };