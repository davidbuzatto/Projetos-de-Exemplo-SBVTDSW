package exemplo.springsecurityjwt.repositorios;

import exemplo.springsecurityjwt.entidades.Funcao;
import exemplo.springsecurityjwt.entidades.TipoFuncao;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 *
 * @author Prof. Dr. David Buzatto
 */
public interface FuncaoRepository extends JpaRepository<Funcao, Long>{
    
    Optional<Funcao> findByTipo( TipoFuncao tipo );
    
}
