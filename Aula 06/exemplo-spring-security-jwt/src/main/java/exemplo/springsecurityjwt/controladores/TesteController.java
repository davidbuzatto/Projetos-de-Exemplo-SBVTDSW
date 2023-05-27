package exemplo.springsecurityjwt.controladores;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Realiza os testes de acesso a recursos baseados na função do usuário.
 * 
 * @author Prof. Dr. David Buzatto
 */
@CrossOrigin( origins = "*", maxAge = 3600 )
@RestController
@RequestMapping( "/api/teste" )
public class TesteController {

    @GetMapping( "/tudo" )
    public String allAccess() {
        return "Conteúdo Público.";
    }

    @GetMapping( "/usuario" )
    @PreAuthorize( "hasRole('USUARIO') or hasRole('MODERADOR') or hasRole('ADMINISTRADOR')" )
    public String userAccess() {
        return "Conteúdo do Usuário.";
    }

    @GetMapping( "/moderador" )
    @PreAuthorize( "hasRole('MODERADOR')" )
    public String moderatorAccess() {
        return "Tela de Moderação.";
    }

    @GetMapping( "/administrador" )
    @PreAuthorize( "hasRole('ADMINISTRADOR')" )
    public String adminAccess() {
        return "Tela de Administração.";
    }
    
}
