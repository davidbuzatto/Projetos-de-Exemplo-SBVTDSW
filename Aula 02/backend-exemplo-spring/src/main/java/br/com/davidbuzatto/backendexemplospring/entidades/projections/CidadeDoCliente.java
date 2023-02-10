package br.com.davidbuzatto.backendexemplospring.entidades.projections;

import br.com.davidbuzatto.backendexemplospring.entidades.Cidade;
import br.com.davidbuzatto.backendexemplospring.entidades.Cliente;
import org.springframework.data.rest.core.config.Projection;

/**
 * Projeção para serializar os dados da cidade nos clientes.
 * 
 * @author Prof. Dr. David Buzatto
 */
@Projection( name = "cidadeDoCliente", types = { Cliente.class } )
public interface CidadeDoCliente {
    
    Long getId();
    String getNome();
    Cidade getCidade();
    
}
