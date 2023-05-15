package exemplospringmvc.repositorios;

import exemplospringmvc.entidades.Cidade;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CidadeRepository extends JpaRepository<Cidade, Long> {
    
}
