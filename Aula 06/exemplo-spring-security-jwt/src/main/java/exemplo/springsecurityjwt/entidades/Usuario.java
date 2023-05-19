package exemplo.springsecurityjwt.entidades;

import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.JoinTable;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.HashSet;
import java.util.Set;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;


/**
 *
 * @author Prof. Dr. David Buzatto
 */
@Entity
@Table(	uniqueConstraints = { 
    @UniqueConstraint(columnNames = "username" ),
    @UniqueConstraint(columnNames = "email" ) 
})
@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode( onlyExplicitlyIncluded = true )
public class Usuario {

    @Id
    @GeneratedValue( strategy = GenerationType.IDENTITY )
    @EqualsAndHashCode.Include
    private Long id;

    @NotBlank
    @Size( max = 20 )
    private String username;

    @NotBlank
    @Size( max = 50 )
    @Email
    private String email;

    @NotBlank
    @Size( max = 120 )
    private String password;

    @ManyToMany( fetch = FetchType.LAZY )
    @JoinTable( name = "funcoes_usuario",
            joinColumns = @JoinColumn( name = "usuario_id" ),
            inverseJoinColumns = @JoinColumn( name = "funcao_id" ) )
    private Set<Funcao> funcoes = new HashSet<>();

}
