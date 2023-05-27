package exemplo.springsecurityjwt.repositorios;

import exemplo.springsecurityjwt.entidades.User;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repositório para os usuários.
 * @author Prof. Dr. David Buzatto
 */
public interface UserRepository extends JpaRepository<User, Long>{
    
    Optional<User> findByUsername( String username );
    Boolean existsByUsername( String username );
    Boolean existsByEmail( String email );
        
}
