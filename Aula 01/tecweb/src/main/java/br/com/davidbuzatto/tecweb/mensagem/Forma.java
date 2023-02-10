package br.com.davidbuzatto.tecweb.mensagem;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.AllArgsConstructor;
import lombok.Data;

/**
 * Uma forma geométrica genérica.
 * 
 * @author Prof. Dr. David Buzatto
 */
@Data
@AllArgsConstructor
public class Forma {
    
    private String tipo;
    
    @JsonProperty( "xIni" )
    private int xIni;
    
    @JsonProperty( "yIni" )
    private int yIni;
    
    @JsonProperty( "xFim" )
    private int xFim;
    
    @JsonProperty( "yFim" )
    private int yFim;
    
    private String corContorno;
    private String corPreenchimento;
    
}
