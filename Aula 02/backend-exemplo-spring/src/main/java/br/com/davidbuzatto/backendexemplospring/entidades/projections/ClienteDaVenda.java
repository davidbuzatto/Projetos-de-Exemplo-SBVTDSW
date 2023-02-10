package br.com.davidbuzatto.backendexemplospring.entidades.projections;

import br.com.davidbuzatto.backendexemplospring.entidades.Cliente;
import br.com.davidbuzatto.backendexemplospring.entidades.Venda;
import java.time.LocalDate;
import org.springframework.data.rest.core.config.Projection;

/**
 * Projeção para serializar os dados do cliente nas vendas.
 * 
 * @author Prof. Dr. David Buzatto
 */
@Projection( name = "clienteDaVenda", types = { Venda.class } )
public interface ClienteDaVenda {
    
    Long getId();
    LocalDate getData();
    Boolean getCancelada();
    Cliente getCliente();
    
}
