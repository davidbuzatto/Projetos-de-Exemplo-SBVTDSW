package br.com.davidbuzatto.backendexemplospring.entidades;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * Entidade ItemVenda.
 * 
 * @author Prof. Dr. David Buzatto
 */
@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode( onlyExplicitlyIncluded = true )
public class ItemVenda {
    
    @Id
    @GeneratedValue( strategy = GenerationType.IDENTITY )
    @EqualsAndHashCode.Include
    private Long id;
    
    @NotNull( message = "Venda é obrigatória" )
    @ManyToOne
    private Venda venda;
    
    @NotNull( message = "Produto é obrigatório" )
    @ManyToOne
    private Produto produto;
    
    @NotNull( message = "Quantidade é obrigatória" )
    @Digits( integer = 4, fraction = 2 )
    private BigDecimal quantidade;
    
    @NotNull( message = "Preço de venda é obrigatório" )
    @Digits( integer = 4, fraction = 2 )
    private BigDecimal precoVenda;
    
}
