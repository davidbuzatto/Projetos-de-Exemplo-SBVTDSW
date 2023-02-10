package br.com.davidbuzatto.backendexemplospring.repositorios;

import br.com.davidbuzatto.backendexemplospring.entidades.Produto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

/**
 * Repositório para a entidade Produto.
 * 
 * Os endpoints para os serviços REST são mapeados com base nas operações CRUD
 * e permite ordenação e paginação dos dados obtidos.
 * 
 * Renomeia o mapeamento e o nome da coleção de produtos, pois a nomeação
 * padronizada gera nome errado com base no idioma português brasileiro.
 * 
 * @author Prof. Dr. David Buzatto
 */
@RepositoryRestResource( collectionResourceRel = "produtos", path = "produtos" )
public interface ProdutoRepository extends JpaRepository<Produto, Long> {
    
    Page<Produto> findById( @Param( "id" ) Long id, Pageable pageable );
    Page<Produto> findByNomeContaining( @Param( "nome" ) String nome, Pageable pageable );
    
}
