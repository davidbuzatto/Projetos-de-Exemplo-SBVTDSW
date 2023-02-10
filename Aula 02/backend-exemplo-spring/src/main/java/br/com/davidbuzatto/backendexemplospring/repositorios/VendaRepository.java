package br.com.davidbuzatto.backendexemplospring.repositorios;

import br.com.davidbuzatto.backendexemplospring.entidades.Cliente;
import br.com.davidbuzatto.backendexemplospring.entidades.Venda;
import br.com.davidbuzatto.backendexemplospring.entidades.projections.ClienteDaVenda;
import java.time.LocalDate;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.RequestBody;

/**
 * Repositório para a entidade Venda.
 * 
 * Os endpoints para os serviços REST são mapeados com base nas operações CRUD
 * e permite ordenação e paginação dos dados obtidos.
 * 
 * Configura uma projeção para serializar os dados dos clientes.
 * 
 * @author Prof. Dr. David Buzatto
 */
@RepositoryRestResource( excerptProjection = ClienteDaVenda.class )
public interface VendaRepository extends JpaRepository<Venda, Long> {
    
    Page<Venda> findById( @Param( "id" ) Long id, Pageable pageable );
    Page<Venda> findByData( @Param( "data" ) LocalDate data, Pageable pageable );
    Page<Venda> findByCancelada( @Param( "cancelada" ) Boolean cancelada, Pageable pageable );
    
    Page<Venda> findByCliente( @RequestBody Cliente cliente, Pageable pageable );
    Page<Venda> findByClienteId( @Param( "id" ) Long id, Pageable pageable );
    
}
