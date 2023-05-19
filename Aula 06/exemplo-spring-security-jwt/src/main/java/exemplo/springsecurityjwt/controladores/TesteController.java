package exemplo.springsecurityjwt.controladores;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author Prof. Dr. David Buzatto
 */
@CrossOrigin( origins = "*", maxAge = 3600 )
@RestController
@RequestMapping( "/teste" )
public class TesteController {

    @GetMapping( "/all" )
    public String allAccess() {
        return "Conteúdo público.";
    }

    @GetMapping( "/usuario" )
    @PreAuthorize( "temFuncao('USUARIO') or temFuncao('MODERADOR') or temFuncao('ADMINISTRADOR')" )
    public String userAccess() {
        return "Conteúdo do Usuário.";
    }

    @GetMapping( "/moderador" )
    @PreAuthorize( "temFuncao('MODERADOR')" )
    public String moderatorAccess() {
        return "Tela de Moderação.";
    }

    @GetMapping( "/administrador" )
    @PreAuthorize( "temFuncao('ADMINISTRADOR')" )
    public String adminAccess() {
        return "Tela de Adminsitração.";
    }
    
}
