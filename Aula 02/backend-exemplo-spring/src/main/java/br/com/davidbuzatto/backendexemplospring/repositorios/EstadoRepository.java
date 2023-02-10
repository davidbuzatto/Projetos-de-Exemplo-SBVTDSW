package br.com.davidbuzatto.backendexemplospring.repositorios;

import br.com.davidbuzatto.backendexemplospring.entidades.Estado;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

/**
 * Repositório para a entidade Estado.
 * 
 * Os endpoints para os serviços REST são mapeados com base nas operações CRUD
 * e permite ordenação e paginação dos dados obtidos.
 * 
 * Renomeia o mapeamento e o nome da coleção de estados, pois a nomeação
 * padronizada gera nome errado com base no idioma portuguÊs brasileiro.
 * 
 * @author Prof. Dr. David Buzatto
 */
@RepositoryRestResource( collectionResourceRel = "estados", path = "estados" )
public interface EstadoRepository extends JpaRepository<Estado, Long> {
    
    Page<Estado> findById( @Param( "id" ) Long id, Pageable pageable );
    Page<Estado> findByNomeContaining( @Param( "nome" ) String nome, Pageable pageable );
    Page<Estado> findBySiglaContaining( @Param( "sigla" ) String sigla, Pageable pageable );
    
}
