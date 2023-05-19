package exemplo.springsecurityjwt.repositorios;

import exemplo.springsecurityjwt.entidades.Usuario;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 *
 * @author Prof. Dr. David Buzatto
 */
public interface UsuarioRepository extends JpaRepository<Usuario, Long>{
    
    Optional<Usuario> findByUsername(String username);
    Boolean existsByUsername(String username);
    Boolean existsByEmail(String email);
        
}
