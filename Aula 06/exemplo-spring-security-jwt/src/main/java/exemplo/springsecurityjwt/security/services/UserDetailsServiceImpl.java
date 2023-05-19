package exemplo.springsecurityjwt.security.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import exemplo.springsecurityjwt.entidades.Usuario;
import exemplo.springsecurityjwt.repositorios.UsuarioRepository;

/**
 *
 * @author Prof. Dr. David Buzatto
 */
@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    UsuarioRepository usuarioRepo;

    @Override
    @Transactional
    public UserDetails loadUserByUsername( String username ) throws UsernameNotFoundException {
        
        Usuario usuario = usuarioRepo.findByUsername( username )
                .orElseThrow( () -> new UsernameNotFoundException( "Usuário não encontrado com o nome de: " + username ) );

        return UserDetailsImpl.build( usuario );
        
    }

}
