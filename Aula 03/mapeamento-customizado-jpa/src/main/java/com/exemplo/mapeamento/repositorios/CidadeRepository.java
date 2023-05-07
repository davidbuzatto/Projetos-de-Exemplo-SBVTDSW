package com.exemplo.mapeamento.repositorios;

import com.exemplo.mapeamento.entidades.Cidade;
import com.exemplo.mapeamento.entidades.Estado;
import com.exemplo.mapeamento.entidades.projections.EstadoDaCidade;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;
import org.springframework.web.bind.annotation.RequestBody;

/**
 * Repositório para a entidade Cidade.
 * 
 * Os endpoints para os serviços REST são mapeados com base nas operações CRUD
 * e permite ordenação e paginação dos dados obtidos.
 * 
 * Configura uma projeção para serializar os dados dos estados.
 * 
 * @author Prof. Dr. David Buzatto
 */
@RepositoryRestResource( excerptProjection = EstadoDaCidade.class )
public interface CidadeRepository extends JpaRepository<Cidade, Long> {
    
    Page<Cidade> findById( @Param( "id" ) Long id, Pageable pageable );
    Page<Cidade> findByNomeContaining( @Param( "nome" ) String nome, Pageable pageable );
    
    Page<Cidade> findByEstado( @RequestBody Estado estado, Pageable pageable );
    Page<Cidade> findByEstadoId( @Param( "id" ) Long id, Pageable pageable );
    
}
