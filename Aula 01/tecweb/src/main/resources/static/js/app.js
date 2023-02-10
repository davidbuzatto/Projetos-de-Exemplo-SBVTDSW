import { Elipse } from "./Elipse.js";
import { Linha } from "./Linha.js";
import { Retangulo } from "./Retangulo.js";

// https://github.com/sockjs/sockjs-client
import * as SocksM from "../webjars/sockjs-client/sockjs.min.js";

// https://stomp-js.github.io/stomp-websocket/
import * as StompM from "../webjars/stomp-websocket/stomp.min.js";

class App {
    
    txtNome;
    radioLinha;
    radioRetangulo;
    radioElipse;
    colCorContorno;
    colCorPreenchimento;
    canvasDesenho;
    ctx;
    
    xDown;
    yDown;
    arrastando = false;
    
    formas = [];
    formaAtual = null;
    
    stompClient;
    
    constructor() {
        
        this.txtNome = document.getElementById( "txtNome" );
        this.radioLinha = document.getElementById( "radioLinha" );
        this.radioRetangulo = document.getElementById( "radioRetangulo" );
        this.radioElipse = document.getElementById( "radioElipse" );
        this.colCorContorno = document.getElementById( "colCorContorno" );
        this.colCorPreenchimento = document.getElementById( "colCorPreenchimento" );
        this.canvasDesenho = document.getElementById( "canvasDesenho" );
        this.ctx = this.canvasDesenho.getContext( "2d" );
        
        this.canvasDesenho.style.width = "100%";
        this.canvasDesenho.style.height = "100%";
        this.canvasDesenho.width  = this.canvasDesenho.offsetWidth;
        this.canvasDesenho.height = this.canvasDesenho.offsetHeight;
        
        this.txtNome.oninput = ( event ) => {
            this.salvarValores();
        };
        
        this.radioLinha.onchange = ( event ) => {
            this.salvarValores();
        };
        
        this.radioRetangulo.onchange = ( event ) => {
            this.salvarValores();
        };
        
        this.radioElipse.onchange = ( event ) => {
            this.salvarValores();
        };
        
        this.colCorContorno.oninput = ( event ) => {
            this.salvarValores();
        };
        
        this.colCorPreenchimento.oninput = ( event ) => {
            this.salvarValores();
        };
        
        this.canvasDesenho.onmousedown = ( event ) => {
            this.xDown = event.offsetX;
            this.yDown = event.offsetY;
            this.arrastando = true;
        };
        
        this.canvasDesenho.onmousemove = ( event ) => {
            if ( this.arrastando ) {
                if ( this.radioLinha.checked ) {
                    this.formaAtual = new Linha( 
                            this.xDown, this.yDown, 
                            event.offsetX, event.offsetY, 
                            this.colCorContorno.value, 
                            this.colCorPreenchimento.value );
                } else if ( this.radioRetangulo.checked ) {
                    this.formaAtual = new Retangulo( 
                            this.xDown, this.yDown, 
                            event.offsetX, event.offsetY, 
                            this.colCorContorno.value, 
                            this.colCorPreenchimento.value );
                } else if ( this.radioElipse.checked ) {
                    this.formaAtual = new Elipse( 
                            this.xDown, this.yDown, 
                            event.offsetX, event.offsetY, 
                            this.colCorContorno.value, 
                            this.colCorPreenchimento.value );
                }
            }
        };
        
        this.canvasDesenho.onmouseup = ( event ) => {
            if ( this.formaAtual ) {
                this.formas.push( this.formaAtual );
                this.enviar( this.formaAtual );
                this.formaAtual = null;
            }
            this.arrastando = false;
        };
        
        this.canvasDesenho.onmouseout = ( event ) => {
            if ( this.formaAtual ) {
                this.formas.push( this.formaAtual );
                this.formaAtual = null;
            }
            this.arrastando = false;
        };
        
        setInterval( () => {
            this.desenhar();
        }, 10 );
        
        this.carregarValores();
        this.conectar();
        
    }
    
    desenhar() {
        
        this.ctx.clearRect( 0, 0, 
            this.canvasDesenho.width, 
            this.canvasDesenho.height );
        
        this.formas.forEach( forma => {
            forma.desenhar( this.ctx );
        });
        
        if ( this.formaAtual ) {
            this.formaAtual.desenhar( this.ctx );
        }
        
    }
    
    conectar() {
        
        let socket = new SockJS( "/tecweb-websocket" );
        let formas = this.formas;
        this.stompClient = Stomp.over( socket );
        
        this.stompClient.connect( {}, ( frame ) => {
            
            //console.log( "Conectado: " + frame );
            
            this.stompClient.subscribe( "/formas", function ( mensagem ) {
                
                let forma = JSON.parse( mensagem.body );
                let novaForma;
                
                switch ( forma.tipo ) {
                    case "linha":
                        novaForma = new Linha( 
                                forma.xIni, forma.yIni, 
                                forma.xFim, forma.yFim, 
                                forma.corContorno, 
                                forma.corPreenchimento );
                        break;
                    case "retangulo":
                        novaForma = new Retangulo( 
                                forma.xIni, forma.yIni, 
                                forma.xFim, forma.yFim, 
                                forma.corContorno, 
                                forma.corPreenchimento );
                        break;
                    case "elipse":
                        novaForma = new Elipse( 
                                forma.xIni, forma.yIni, 
                                forma.xFim, forma.yFim, 
                                forma.corContorno, 
                                forma.corPreenchimento );
                        break;
                    
                }
                
                formas.push( novaForma );
                
            });
            
        });
    }
    
    desconectar() {
        if ( this.stompClient !== null ) {
            this.stompClient.disconnect();
        }
        //console.log( "Desconectado" );
    }
    
    enviar( forma ) {
        
        if ( forma instanceof Linha ) {
            forma.tipo = "linha";
        } else if ( forma instanceof Retangulo ) {
            forma.tipo = "retangulo";
        } else if ( forma instanceof Elipse ) {
            forma.tipo = "elipse";
        }
        
        this.stompClient.send( "/app/receberForma", {}, JSON.stringify( forma ) );
        
    }
    
    salvarValores() {
        localStorage.setItem( "valTxtNome", this.txtNome.value );
        localStorage.setItem( "valRadioForma", document.querySelector( "input[type=radio]:checked" ).value );
        localStorage.setItem( "valColCorContorno", this.colCorContorno.value );
        localStorage.setItem( "valColCorPreenchimento", this.colCorPreenchimento.value );
    }
    
    carregarValores() {
        
        if ( localStorage.getItem( "valTxtNome" ) ) {
            this.txtNome.value = localStorage.getItem( "valTxtNome" );
        }
        
        switch ( localStorage.getItem( "valRadioForma" ) ) {
            case "linha":
                this.radioLinha.checked = true;
                break;
            case "retangulo":
                this.radioRetangulo.checked = true;
                break;
            case "elipse":
                this.radioElipse.checked = true;
                break;
        }
        
        if ( localStorage.getItem( "valColCorContorno" ) ) {
            this.colCorContorno.value = localStorage.getItem( "valColCorContorno" );
        }
        
        if ( localStorage.getItem( "valColCorPreenchimento" ) ) {
            this.colCorPreenchimento.value = localStorage.getItem( "valColCorPreenchimento" );
        }
        
    }
    
}

let app = new App();