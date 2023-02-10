package br.com.davidbuzatto.backendexemplospring.entidades.projections;

import br.com.davidbuzatto.backendexemplospring.entidades.Cidade;
import br.com.davidbuzatto.backendexemplospring.entidades.Estado;
import org.springframework.data.rest.core.config.Projection;

/**
 * Projeção para serializar os dados do estado nas cidades.
 * 
 * @author Prof. Dr. David Buzatto
 */
@Projection( name = "estadoDaCidade", types = { Cidade.class } )
public interface EstadoDaCidade {
    
    Long getId();
    String getNome();
    Estado getEstado();
    
}
