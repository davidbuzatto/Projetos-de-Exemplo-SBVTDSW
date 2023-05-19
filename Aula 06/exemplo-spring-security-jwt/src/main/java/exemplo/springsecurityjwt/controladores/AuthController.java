package exemplo.springsecurityjwt.controladores;

import exemplo.springsecurityjwt.entidades.Funcao;
import exemplo.springsecurityjwt.entidades.TipoFuncao;
import exemplo.springsecurityjwt.entidades.Usuario;
import exemplo.springsecurityjwt.payload.request.LoginRequest;
import exemplo.springsecurityjwt.payload.request.SignupRequest;
import exemplo.springsecurityjwt.payload.response.JwtResponse;
import exemplo.springsecurityjwt.payload.response.MessageResponse;
import exemplo.springsecurityjwt.repositorios.FuncaoRepository;
import exemplo.springsecurityjwt.repositorios.UsuarioRepository;
import exemplo.springsecurityjwt.security.jwt.JwtUtils;
import exemplo.springsecurityjwt.security.services.UserDetailsImpl;
import jakarta.validation.Valid;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 *
 * @author Prof. Dr. David Buzatto
 */
@CrossOrigin( origins = "*", maxAge = 3600 )
@RestController
@RequestMapping( "/auth" )
public class AuthController {

    @Autowired
    AuthenticationManager authenticationManager;

    @Autowired
    UsuarioRepository usuarioRepo;

    @Autowired
    FuncaoRepository funcaoRepo;

    @Autowired
    PasswordEncoder encoder;

    @Autowired
    JwtUtils jwtUtils;

    @PostMapping( "/signin" )
    public ResponseEntity<?> authenticateUser( @Valid @RequestBody LoginRequest loginRequest ) {

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken( loginRequest.getUsername(), loginRequest.getPassword() ) );

        SecurityContextHolder.getContext().setAuthentication( authentication );
        String jwt = jwtUtils.generateJwtToken( authentication );

        UserDetailsImpl userDetails = (UserDetailsImpl) authentication.getPrincipal();
        List<String> funcoes= userDetails.getAuthorities().stream()
                .map( item -> item.getAuthority() )
                .collect( Collectors.toList() );

        return ResponseEntity.ok( new JwtResponse( jwt,
                userDetails.getId(),
                userDetails.getUsername(),
                userDetails.getEmail(),
                funcoes ) );
        
    }

    @PostMapping( "/signup" )
    public ResponseEntity<?> registerUser( @Valid @RequestBody SignupRequest signUpRequest ) {
        
        if ( usuarioRepo.existsByUsername( signUpRequest.getUsername() ) ) {
            return ResponseEntity
                    .badRequest()
                    .body( new MessageResponse( "Erro: Nome de usuário já usado!" ) );
        }

        if ( usuarioRepo.existsByEmail( signUpRequest.getEmail() ) ) {
            return ResponseEntity
                    .badRequest()
                    .body( new MessageResponse( "Erro: E-mail já usado!" ) );
        }

        // cria uma nova conta de usuário
        Usuario usuario = new Usuario();
        usuario.setUsername( signUpRequest.getUsername() );
        usuario.setEmail( signUpRequest.getEmail() );
        usuario.setPassword( encoder.encode( signUpRequest.getPassword() ) );

        Set<String> funcaoStr = signUpRequest.getFuncao();
        Set<Funcao> funcoes = new HashSet<>();

        if ( funcaoStr == null ) {
            Funcao funcaoUsuario = funcaoRepo.findByTipo( TipoFuncao.USUARIO )
                    .orElseThrow( () -> new RuntimeException( "Erro: Função não encontrada." ) );
            funcoes.add( funcaoUsuario );
        } else {
            
            funcaoStr.forEach( funcao -> {
                
                switch ( funcao ) {
                    case "admin":
                        Funcao funcaoAdministrador = funcaoRepo.findByTipo( TipoFuncao.ADMINISTRADOR )
                                .orElseThrow( () -> new RuntimeException( "Erro: Função não encontrada." ) );
                        funcoes.add( funcaoAdministrador );

                        break;
                    case "mod":
                        Funcao funcaoModerador = funcaoRepo.findByTipo( TipoFuncao.MODERADOR )
                                .orElseThrow( () -> new RuntimeException( "Erro: Função não encontrada." ) );
                        funcoes.add( funcaoModerador );

                        break;
                    default:
                        Funcao funcaoUsuario = funcaoRepo.findByTipo( TipoFuncao.USUARIO )
                                .orElseThrow( () -> new RuntimeException( "Erro: Função não encontrada." ) );
                        funcoes.add( funcaoUsuario );
                }
                
            } );
            
        }

        usuario.setFuncoes( funcoes );
        usuarioRepo.save( usuario );

        return ResponseEntity.ok( new MessageResponse( "Usuário criado com sucesso!" ) );
        
    }
    
}
