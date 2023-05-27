package exemplo.springsecurityjwt.security.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import exemplo.springsecurityjwt.entidades.User;
import exemplo.springsecurityjwt.repositorios.UserRepository;

/**
 * Implementação da interface UserDetailsService responsável em retornar um
 * usuário autenticado.
 * 
 * @author Prof. Dr. David Buzatto
 */
@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    @Autowired
    UserRepository usuarioRepo;

    @Override
    @Transactional
    public UserDetails loadUserByUsername( String username ) throws UsernameNotFoundException {
        
        // carrega o usuário
        User usuario = usuarioRepo.findByUsername( username )
                .orElseThrow( () -> new UsernameNotFoundException( "Usuário não encontrado com o nome de: " + username ) );

        // constrói um UserDetails, que contém os dados do usuário e os dados
        // de autorização
        return UserDetailsImpl.build( usuario );
        
    }

}
