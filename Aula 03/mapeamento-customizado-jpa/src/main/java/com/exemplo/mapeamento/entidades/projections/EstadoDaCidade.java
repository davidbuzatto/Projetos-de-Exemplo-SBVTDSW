package com.exemplo.mapeamento.entidades.projections;

import com.exemplo.mapeamento.entidades.Cidade;
import com.exemplo.mapeamento.entidades.Estado;
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
