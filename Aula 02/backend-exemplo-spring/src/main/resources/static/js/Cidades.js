import * as Clientes from "./Clientes.js";

let estados = null;
let cidades = null;
let cidadeAtual = null;

const tbodyCidades = document.getElementById( "tbodyCidades" );

const formCidade = document.getElementById( "formCidade" );

const txtIdCidade = document.getElementById( "txtIdCidade" );
const txtNomeCidade = document.getElementById( "txtNomeCidade" );
const selEstadoCidade = document.getElementById( "selEstadoCidade" );

const divErroNomeCidade = document.getElementById( "divErroNomeCidade" );
const divErroEstadoCidade = document.getElementById( "divErroEstadoCidade" );

const btnNovaCidade = document.getElementById( "btnNovaCidade" );
const btnSalvarCidade = document.getElementById( "btnSalvarCidade" );


async function inserir( cidade ) {
    
    await fetch( "/api/cidades", {
        method: "POST",
        body: JSON.stringify( cidade ),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    }).then( response => {
        if ( response.ok ) {
            reset();
            obterTodos();
            Clientes.obterTodasCidades();
        }
        return response.json();
    }).then( data => {
        if ( data.message ) {
            alert( "Erro interno do servidor!\n\n" + data.message );
        }
    }).catch( error => {
        console.log( "ops (erro em inserir a cidade): ", error );
    });
    
}

async function alterar( id, cidade ) {
    
    await fetch( "/api/cidades/" + id, {
        method: "PATCH",
        body: JSON.stringify( cidade ),
        headers: {
            "Content-type": "application/json; charset=UTF-8"
        }
    }).then( response => {
        if ( response.ok ) {
            reset();
            obterTodos();
            Clientes.obterTodos();
            Clientes.obterTodasCidades();
        }
        return response.json();
    }).then( data => {
        if ( data.message ) {
            alert( "Erro interno do servidor!\n\n" + data.message );
        }
    }).catch( error => {
        console.log( "ops (erro em alterar a cidade): ", error );
    });
    
}

async function excluir( id ) {
    
    await fetch( "/api/cidades/" + id, {
        method: "DELETE"
    }).then( response => {
        if ( response.ok ) {
            obterTodos();
            Clientes.obterTodasCidades();
        } else {
            return response.json();
        }
    }).then( data => {
        if ( data && data.cause ) {
            alert( "Erro interno do servidor!\n\n" + data.cause.cause.message );
        }
    }).catch( error => {
        console.log( "ops (erro em excluir a cidade): ", error );
    });
    
}

async function obterPorId( id ) {
    
    await fetch( "/api/cidades/" + id, {
        method: "GET"
    }).then( response => {
        return response.json();
    }).then( data => {
        console.log( data );
    }).catch( error => {
        console.log( "ops (erro em obter cidade por id): ", error );
    });
    
}

async function obterTodos() {
    
    await fetch( "/api/cidades", {
        method: "GET"
    }).then( response => {
        return response.json();
    }).then( data => {
        
        tbodyCidades.innerHTML = "";
        cidades = data._embedded.cidades;
        
        cidades.forEach( ( cidade, i ) => {
            
            const linhaCidade = document.createElement( "tr" );
            
            const cId = document.createElement( "td" );
            const cNome = document.createElement( "td" );
            const cEstado = document.createElement( "td" );
            const cAlterar = document.createElement( "td" );
            const cExcluir = document.createElement( "td" );
            
            const btnAlterar = document.createElement( "button" );
            const btnExcluir = document.createElement( "button" );
            
            cId.innerHTML = cidade.id;
            cNome.innerHTML = cidade.nome;
            cEstado.innerHTML = cidade.estado.sigla;
            cAlterar.appendChild( btnAlterar );
            cExcluir.appendChild( btnExcluir );
            
            btnAlterar.innerHTML = "alterar";
            btnAlterar.onclick = ( event ) => {
                cidadeAtual = cidades[i];
                txtIdCidade.value = cidadeAtual.id;
                txtNomeCidade.value = cidadeAtual.nome;
                selEstadoCidade.value = cidade._links.self.href.replace( "/cidades/" + cidade.id, "/estados/" + cidade.estado.id );
            };
            
            btnExcluir.innerHTML = "excluir";
            btnExcluir.onclick = async ( event ) => {
                cidadeAtual = cidades[i];
                if ( confirm( "Deseja excluir a cidade selecionada?" ) ) {
                    await excluir( cidadeAtual.id );
                    await obterTodos();
                    reset();
                }
                cidadeAtual = null;
            };
            
            linhaCidade.appendChild( cId );
            linhaCidade.appendChild( cNome );
            linhaCidade.appendChild( cEstado );
            linhaCidade.appendChild( cAlterar );
            linhaCidade.appendChild( cExcluir );
            
            tbodyCidades.appendChild( linhaCidade );
            
        });
        
        
    }).catch( error => {
        console.log( "ops (erro em obter todas as cidades): ", error );
    });
    
}

async function obterTodosEstados() {
    
    await fetch( "/api/estados", {
        method: "GET"
    }).then( response => {
        return response.json();
    }).then( data => {
        
        selEstadoCidade.innerHTML = "";
        estados = data._embedded.estados;
        
        estados.forEach( ( estado, i ) => {
            
            const optEstado = document.createElement( "option" );
            optEstado.innerHTML = `${estado.nome} - ${estado.sigla}`;
            optEstado.value = estado._links.self.href;
            
            selEstadoCidade.appendChild( optEstado );
            
        });
        
        
    }).catch( error => {
        console.log( "ops (erro em obter todos os estados): ", error );
    });
    
}

function reset() {
    txtIdCidade.value = "";
    txtNomeCidade.value = "";
    txtNomeCidade.classList.remove( "inputInvalido" );
    selEstadoCidade.selectedIndex = 0;
    divErroNomeCidade.innerHTML = "";
    divErroEstadoCidade.innerHTML = "";
    cidadeAtual = null;
};

function validar() {
    
    let valido = true;
    
    if ( !txtNomeCidade.validity.valid ) {
        valido = false;
        divErroNomeCidade.innerHTML = txtNomeCidade.validationMessage;
        txtNomeCidade.classList.add( "inputInvalido" );
    } else {
        divErroNomeCidade.innerHTML = "";
        txtNomeCidade.classList.remove( "inputInvalido" );
    }
    
    return valido;
    
}

async function setup() {
    
    formCidade.onsubmit = ( event ) => {
        event.preventDefault();
    };
    
    btnNovaCidade.onclick = ( event ) => {
        reset();
    };
    
    btnSalvarCidade.onclick = async ( event ) => {
        
        if ( validar() ) {
            
            if ( cidadeAtual === null ) {
                inserir({
                    nome: txtNomeCidade.value,
                    estado: selEstadoCidade.value
                });
            } else {
                alterar( +txtIdCidade.value, {
                    nome: txtNomeCidade.value,
                    estado: selEstadoCidade.value
                });
            }
            
        }
        
    };
    
    obterTodos();
    obterTodosEstados();
    
}

export { setup, obterTodos, obterTodosEstados };