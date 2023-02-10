package br.com.davidbuzatto.backendexemplospring.repositorios;

import br.com.davidbuzatto.backendexemplospring.entidades.Cidade;
import br.com.davidbuzatto.backendexemplospring.entidades.Cliente;
import br.com.davidbuzatto.backendexemplospring.entidades.projections.CidadeDoCliente;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.RequestBody;

/**
 * Repositório para a entidade Cliente.
 * 
 * Os endpoints para os serviços REST são mapeados com base nas operações CRUD
 * e permite ordenação e paginação dos dados obtidos.
 * 
 * Configura uma projeção para serializar os dados das cidades.
 * 
 * @author Prof. Dr. David Buzatto
 */
@RepositoryRestResource( excerptProjection = CidadeDoCliente.class )
public interface ClienteRepository extends JpaRepository<Cliente, Long> {
    
    Page<Cliente> findById( @Param( "id" ) Long id, Pageable pageable );
    Page<Cliente> findByNomeContaining( @Param( "nome" ) String nome, Pageable pageable );
    
    Page<Cliente> findByCidade( @RequestBody Cidade cidade, Pageable pageable );
    Page<Cliente> findByCidadeId( @Param( "id" ) Long id, Pageable pageable );
    
}
