package br.com.davidbuzatto.tecweb.mensagem.controladores;

import br.com.davidbuzatto.tecweb.mensagem.Forma;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

/**
 * Controlador de mensagens via WebSocket.
 * 
 * @author Prof. Dr. David Buzatto
 */
@Controller
public class MensagemController {
    
    @MessageMapping( "/receberForma" )           // recebe
    @SendTo( "/formas" )                         // envia
    public Forma receberForma( Forma forma ) throws Exception {
        return new Forma( forma.getTipo(), 
                forma.getXIni(), forma.getYIni(), 
                forma.getXFim(), forma.getYFim(), 
                forma.getCorContorno(), forma.getCorPreenchimento() );
    }
    
}
