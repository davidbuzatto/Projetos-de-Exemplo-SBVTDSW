import * as Cidades from "./Cidades.js";

let estados = null;
let estadoAtual = null;

const tbodyEstados = document.getElementById( "tbodyEstados" );

const formEstado = document.getElementById( "formEstado" );

const txtIdEstado = document.getElementById( "txtIdEstado" );
const txtNomeEstado = document.getElementById( "txtNomeEstado" );
const txtSiglaEstado = document.getElementById( "txtSiglaEstado" );

const divErroNomeEstado = document.getElementById( "divErroNomeEstado" );
const divErroSiglaEstado = document.getElementById( "divErroSiglaEstado" );

const btnNovoEstado = document.getElementById( "btnNovoEstado" );
const btnSalvarEstado = document.getElementById( "btnSalvarEstado" );


async function inserir( estado ) {
    
    await fetch( "/api/estados", {
        method: "POST",
        body: JSON.stringify( estado ),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    }).then( response => {
        if ( response.ok ) {
            reset();
            obterTodos();
            Cidades.obterTodosEstados();
        }
        return response.json();
    }).then( data => {
        if ( data.message ) {
            alert( "Erro interno do servidor!\n\n" + data.message );
        }
    }).catch( error => {
        console.log( "ops (erro em inserir o estado): ", error );
    });
    
}

async function alterar( id, estado ) {
    
    await fetch( "/api/estados/" + id, {
        method: "PATCH",
        body: JSON.stringify( estado ),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    }).then( response => {
        if ( response.ok ) {
            reset();
            obterTodos();
            Cidades.obterTodos();
            Cidades.obterTodosEstados();
        }
        return response.json();
    }).then( data => {
        if ( data.message ) {
            alert( "Erro interno do servidor!\n\n" + data.message );
        }
    }).catch( error => {
        console.log( "ops (erro em alterar o estado): ", error );
    });
    
}

async function excluir( id ) {
    
    await fetch( "/api/estados/" + id, {
        method: "DELETE"
    }).then( response => {
        if ( response.ok ) {
            obterTodos();
            Cidades.obterTodosEstados();
        } else {
            return response.json();
        }
    }).then( data => {
        if ( data && data.cause ) {
            alert( "Erro interno do servidor!\n\n" + data.cause.cause.message );
        }
    }).catch( error => {
        console.log( "ops (erro em excluir o estado): ", error );
    });
    
}

async function obterPorId( id ) {
    
    await fetch( "/api/estados/" + id, {
        method: "GET"
    }).then( response => {
        return response.json();
    }).then( data => {
        console.log( data );
    }).catch( error => {
        console.log( "ops (erro em obter estado por id): ", error );
    });
    
}

async function obterTodos() {
    
    await fetch( "/api/estados", {
        method: "GET"
    }).then( response => {
        return response.json();
    }).then( data => {
        
        tbodyEstados.innerHTML = "";
        estados = data._embedded.estados;
        
        estados.forEach( ( estado, i ) => {
            
            const linhaEstado = document.createElement( "tr" );
            
            const cId = document.createElement( "td" );
            const cNome = document.createElement( "td" );
            const cSigla = document.createElement( "td" );
            const cAlterar = document.createElement( "td" );
            const cExcluir = document.createElement( "td" );
            
            const btnAlterar = document.createElement( "button" );
            const btnExcluir = document.createElement( "button" );
            
            cId.innerHTML = estado.id;
            cNome.innerHTML = estado.nome;
            cSigla.innerHTML = estado.sigla;
            cAlterar.appendChild( btnAlterar );
            cExcluir.appendChild( btnExcluir );
            
            btnAlterar.innerHTML = "alterar";
            btnAlterar.onclick = ( event ) => {
                estadoAtual = estados[i];
                txtIdEstado.value = estadoAtual.id;
                txtNomeEstado.value = estadoAtual.nome;
                txtSiglaEstado.value = estadoAtual.sigla;
            };
            
            btnExcluir.innerHTML = "excluir";
            btnExcluir.onclick = async ( event ) => {
                estadoAtual = estados[i];
                if ( confirm( "Deseja excluir o estado selecionado?" ) ) {
                    await excluir( estadoAtual.id );
                    await obterTodos();
                    reset();
                }
                estadoAtual = null;
            };
            
            linhaEstado.appendChild( cId );
            linhaEstado.appendChild( cNome );
            linhaEstado.appendChild( cSigla );
            linhaEstado.appendChild( cAlterar );
            linhaEstado.appendChild( cExcluir );
            
            tbodyEstados.appendChild( linhaEstado );
            
        });
        
        
    }).catch( error => {
        console.log( "ops (erro em obter todos os estados): ", error );
    });
    
}

function reset() {
    txtIdEstado.value = "";
    txtNomeEstado.value = "";
    txtNomeEstado.classList.remove( "inputInvalido" );
    txtSiglaEstado.value = "";
    txtSiglaEstado.classList.remove( "inputInvalido" );
    divErroNomeEstado.innerHTML = "";
    divErroSiglaEstado.innerHTML = "";
    estadoAtual = null;
};

function validar() {
    
    let valido = true;
    
    if ( !txtNomeEstado.validity.valid ) {
        valido = false;
        divErroNomeEstado.innerHTML = txtNomeEstado.validationMessage;
        txtNomeEstado.classList.add( "inputInvalido" );
    } else {
        divErroNomeEstado.innerHTML = "";
        txtNomeEstado.classList.remove( "inputInvalido" );
    }
    
    if ( !txtSiglaEstado.validity.valid ) {
        valido = false;
        divErroSiglaEstado.innerHTML = txtSiglaEstado.validationMessage;
        txtSiglaEstado.classList.add( "inputInvalido" );
    } else {
        divErroSiglaEstado.innerHTML = "";
        txtSiglaEstado.classList.remove( "inputInvalido" );
    }
    
    return valido;
    
}

async function setup() {
    
    formEstado.onsubmit = ( event ) => {
        event.preventDefault();
    };
    
    btnNovoEstado.onclick = ( event ) => {
        reset();
    };
    
    btnSalvarEstado.onclick = async ( event ) => {
        
        if ( validar() ) {
            
            if ( estadoAtual === null ) {
                inserir({
                    nome: txtNomeEstado.value,
                    sigla: txtSiglaEstado.value
                });
            } else {
                alterar( +txtIdEstado.value, {
                    nome: txtNomeEstado.value,
                    sigla: txtSiglaEstado.value
                });
            }
            
        }
        
    };
    
    obterTodos();
    
}

export { setup };