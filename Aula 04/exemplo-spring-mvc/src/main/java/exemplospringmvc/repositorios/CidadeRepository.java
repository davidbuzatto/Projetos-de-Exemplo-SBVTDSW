package exemplospringmvc.repositorios;

import exemplospringmvc.entidades.Cidade;
import org.springframework.data.repository.CrudRepository;

public interface CidadeRepository extends CrudRepository<Cidade, Long> {
    
}
