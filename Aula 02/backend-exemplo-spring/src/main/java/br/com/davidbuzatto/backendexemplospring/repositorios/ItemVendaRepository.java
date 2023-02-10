package br.com.davidbuzatto.backendexemplospring.repositorios;

import br.com.davidbuzatto.backendexemplospring.entidades.ItemVenda;
import br.com.davidbuzatto.backendexemplospring.entidades.Venda;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.rest.core.annotation.RepositoryRestResource;

/**
 * Repositório para a entidade ItemVenda.
 * 
 * Os endpoints para os serviços REST são mapeados com base nas operações CRUD
 * e permite ordenação e paginação dos dados obtidos.
 * 
 * Renomeia o mapeamento e o nome da coleção de itens da venda, pois a nomeação
 * padronizada gera nome errado com base no idioma português brasileiro.
 * 
 * @author Prof. Dr. David Buzatto
 */
@RepositoryRestResource( collectionResourceRel = "itensVendas", path = "itensVendas" )
public interface ItemVendaRepository extends JpaRepository<ItemVenda, Long> {

    /**
     * Método personalizado para busca de itens da venda por uma venda.
     * 
     * @param venda A venda a ser consultada.
     * @param pageable Dados da paginação, quando invocado via requisição.
     * @return Uma lista de itens da venda associados à venda fornecida no parâmetro
     */
    Page<ItemVenda> findByVenda( @Param( "venda" ) Venda venda, Pageable pageable  );
    
}
