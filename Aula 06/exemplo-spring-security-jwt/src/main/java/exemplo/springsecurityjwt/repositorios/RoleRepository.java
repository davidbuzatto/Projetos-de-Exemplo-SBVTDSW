package exemplo.springsecurityjwt.repositorios;

import exemplo.springsecurityjwt.entidades.Role;
import exemplo.springsecurityjwt.entidades.ERole;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 * Repositório para as funções do usuário.
 * 
 * @author Prof. Dr. David Buzatto
 */
public interface RoleRepository extends JpaRepository<Role, Long>{
    
    Optional<Role> findByName( ERole name );
    
}
