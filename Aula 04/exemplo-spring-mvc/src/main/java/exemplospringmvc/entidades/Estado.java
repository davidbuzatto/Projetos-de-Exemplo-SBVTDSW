package exemplospringmvc.entidades;

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

@Entity
@Data
@AllArgsConstructor 
@NoArgsConstructor
@EqualsAndHashCode( onlyExplicitlyIncluded = true )
public class Estado {
    
    @Id
    @GeneratedValue( strategy = GenerationType.IDENTITY )
    @EqualsAndHashCode.Include
    private Long id;
    
    @NotNull( message = "Nome é obrigatório" )
    @NotEmpty( message = "Nome não pode ser vazio" )
    private String nome;
    
    @NotNull( message = "Sigla é obrigatória" )
    @NotEmpty( message = "Sigla não pode ser vazia" )
    @Column( unique = true )
    private String sigla;
    
}
