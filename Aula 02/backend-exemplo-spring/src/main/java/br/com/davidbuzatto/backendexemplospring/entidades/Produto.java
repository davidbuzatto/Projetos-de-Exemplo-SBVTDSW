package br.com.davidbuzatto.backendexemplospring.entidades;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.Length;

/**
 * Entidade Produto.
 * 
 * @author Prof. Dr. David Buzatto
 */
@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode( onlyExplicitlyIncluded = true )
public class Produto {
    
    @Id
    @GeneratedValue( strategy = GenerationType.IDENTITY )
    @EqualsAndHashCode.Include
    private Long id;
    
    @NotNull( message = "Nome é obrigatório" )
    @NotEmpty( message = "Nome não pode ser vazio" )
    @Length( max = 50 )
    private String nome;
    
    @NotNull( message = "Preço é obrigatório" )
    @Digits( integer = 4, fraction = 2 )
    @DecimalMin( value = "0.01" )
    private BigDecimal preco;
    
    @NotNull( message = "Estoque é obrigatório" )
    @Digits( integer = 4, fraction = 2 )
    @DecimalMin( value = "0.01" )
    private BigDecimal estoque;
    
}