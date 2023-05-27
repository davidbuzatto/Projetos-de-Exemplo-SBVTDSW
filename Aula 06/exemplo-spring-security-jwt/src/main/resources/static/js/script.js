const txtUsuarioSignup = document.getElementById( "txtUsuarioSignup" );
const txtEmailSignup = document.getElementById( "txtEmailSignup" );
const txtSenhaSignup = document.getElementById( "txtSenhaSignup" );
const chkFuncaoUsuarioSignup = document.getElementById( "chkFuncaoUsuarioSignup" );
const chkFuncaoModeradorSignup = document.getElementById( "chkFuncaoModeradorSignup" );
const chkFuncaoAdministradorSignup = document.getElementById( "chkFuncaoAdministradorSignup" );
const btnCadastrarSignup = document.getElementById( "btnCadastrarSignup" );

const txtUsuarioSignin = document.getElementById( "txtUsuarioSignin" );
const txtSenhaSignin = document.getElementById( "txtSenhaSignin" );
const spanAccessToken = document.getElementById( "spanAccessToken" );
const btnEntrarSignup = document.getElementById( "btnEntrarSignup" );

const btnTestarTudo = document.getElementById( "btnTestarTudo" );
const btnTestarUsuario = document.getElementById( "btnTestarUsuario" );
const btnTestarModerador = document.getElementById( "btnTestarModerador" );
const btnTestarAdministrador = document.getElementById( "btnTestarAdministrador" );

const divSaida = document.getElementById( "divSaida" );

var accessToken = null;

function iniciar() {
    
    btnCadastrarSignup.onclick = event => {
        
        let usuario = {};
        usuario.username = txtUsuarioSignup.value;
        usuario.email = txtEmailSignup.value;
        usuario.password = txtSenhaSignup.value;
        usuario.role = [];
        
        if ( chkFuncaoUsuarioSignup.checked ) {
            usuario.role.push( "usr" );
        }
        
        if ( chkFuncaoModeradorSignup.checked ) {
            usuario.role.push( "mod" );
        }
        
        if ( chkFuncaoAdministradorSignup.checked ) {
            usuario.role.push( "admin" );
        }
        
        fetch( "/api/auth/signup", {
            method: "POST",
            body: JSON.stringify( usuario ),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        }).then( response => {
            if ( response.ok ) {
                txtUsuarioSignup.value = "";
                txtEmailSignup.value = "";
                txtSenhaSignup.value = "";
                chkFuncaoUsuarioSignup.checked = false;
                chkFuncaoModeradorSignup.checked = false;
                chkFuncaoAdministradorSignup.checked = false;
            }
            return response.json();
        }).then( data => {
            if ( data.message ) {
                alert( data.message );
            }
        }).catch( error => {
            console.log( "ops (erro em criar um novo usuário): ", error );
        });
    
    };
    
    btnEntrarSignup.onclick = event => {
        
        let usuario = {};
        usuario.username = txtUsuarioSignin.value;
        usuario.password = txtSenhaSignin.value;
        
        fetch( "/api/auth/signin", {
            method: "POST",
            body: JSON.stringify( usuario ),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        }).then( response => {
            if ( response.ok ) {
                txtUsuarioSignin.value = "";
                txtSenhaSignin.value = "";
            }
            return response.json();
        }).then( data => {
            if ( data.accessToken ) {
                accessToken = data.accessToken;
                spanAccessToken.innerHTML = accessToken;
                alert( "Signin realizado com sucesso!" );
            } else {
                accessToken = null;
                spanAccessToken.innerHTML = "não há";
                alert( "Erro ao realizar o signin!" );
            }
        }).catch( error => {
            console.log( "ops (erro em realizar acesso): ", error );
        });
        
    };
    
    btnTestarTudo.onclick = event => {
        
        fetch( "/api/teste/tudo", {
            method: "GET",
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        }).then( response => {
            if ( response.ok ) {
                return response.text();
            }
            return null;
        }).then( text => {
            if ( text ) {
                divSaida.innerHTML = text;
            }
        }).catch( error => {
            console.log( "ops (erro ao acessar o serviço /api/teste/tudo): ", error );
        });
        
    };
    
    btnTestarUsuario.onclick = event => {
        
        if ( accessToken ) {
            
            fetch( "/api/teste/usuario", {
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + accessToken,
                    "Content-type": "application/json; charset=UTF-8"
                }
            }).then( response => {
                if ( response.ok ) {
                    return response.text();
                }
                return response.json();
            }).then( data => {
                if ( data.message ) {
                    divSaida.innerHTML = data.message;
                } else {
                    divSaida.innerHTML = data;
                }
            }).catch( error => {
                console.log( "ops (erro ao acessar o serviço /api/teste/administrador): ", error );
            });
        
        } else {
            alert( "Usuário não autenticado!" );
        }
        
    };
    
    btnTestarModerador.onclick = event => {
        
        if ( accessToken ) {
            
            fetch( "/api/teste/moderador", {
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + accessToken,
                    "Content-type": "application/json; charset=UTF-8"
                }
            }).then( response => {
                if ( response.ok ) {
                    return response.text();
                }
                return response.json();
            }).then( data => {
                if ( data.message ) {
                    divSaida.innerHTML = data.message;
                } else {
                    divSaida.innerHTML = data;
                }
            }).catch( error => {
                console.log( "ops (erro ao acessar o serviço /api/teste/administrador): ", error );
            });
        
        } else {
            alert( "Usuário não autenticado!" );
        }
        
    };
    
    btnTestarAdministrador.onclick = event => {
        
        if ( accessToken ) {
            
            fetch( "/api/teste/administrador", {
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + accessToken,
                    "Content-type": "application/json; charset=UTF-8"
                }
            }).then( response => {
                if ( response.ok ) {
                    return response.text();
                }
                return response.json();
            }).then( data => {
                if ( data.message ) {
                    divSaida.innerHTML = data.message;
                } else {
                    divSaida.innerHTML = data;
                }
            }).catch( error => {
                console.log( "ops (erro ao acessar o serviço /api/teste/administrador): ", error );
            });
        
        } else {
            alert( "Usuário não autenticado!" );
        }
        
    };

}

iniciar();