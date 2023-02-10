package br.com.davidbuzatto.backendexemplospring.entidades;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.Length;

/**
 * Entidade Estado.
 * 
 * @author Prof. Dr. David Buzatto
 */
@Entity               // uma entidade (JPA)
@Data                 // lombok: gerenciado pelo lombok, criará gets e sets etc
@AllArgsConstructor   // lombok: gerar construtor com todos os argumentos
@NoArgsConstructor    // lombok: gerar construtor sem argumentos (construtor padrão)
@EqualsAndHashCode( onlyExplicitlyIncluded = true ) // indica que deve ser informado
                                                    // quais campos deverão ser
                                                    // usados na criação dos métodos
                                                    // equals e hashCode
public class Estado {
    
    @Id                                                    // chave primária
    @GeneratedValue( strategy = GenerationType.IDENTITY )  // geração com auto-incremento
    @EqualsAndHashCode.Include                             // incluído nos métodos equals e hashCode
    private Long id;
    
    @NotNull( message = "Nome é obrigatório" )             // não nulo
    @NotEmpty( message = "Nome não pode ser vazio" )       // não vazio
    @Length( max = 50 )
    private String nome;
    
    @NotNull( message = "Sigla é obrigatória" )
    @NotEmpty( message = "Sigla não pode ser vazio" )
    @Length( min = 2, max = 2 )
    @Column( unique = true )
    private String sigla;
    
}
