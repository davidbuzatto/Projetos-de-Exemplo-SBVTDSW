package exemplospringmvc.repositorios;

import exemplospringmvc.entidades.Estado;
import org.springframework.data.repository.CrudRepository;

public interface EstadoRepository extends CrudRepository<Estado, Long> {
    
}
