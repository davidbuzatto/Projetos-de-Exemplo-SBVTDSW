package exemplo.springsecurityjwt.security.services;

import java.util.Collection;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import com.fasterxml.jackson.annotation.JsonIgnore;
import exemplo.springsecurityjwt.entidades.Usuario;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 *
 * @author Prof. Dr. David Buzatto
 */
@Data
@EqualsAndHashCode( onlyExplicitlyIncluded = true )
public class UserDetailsImpl implements UserDetails {

    private static final long serialVersionUID = 1L;

    @EqualsAndHashCode.Include
    private Long id;

    private String username;

    private String email;

    @JsonIgnore
    private String password;

    private Collection<? extends GrantedAuthority> authorities;

    public UserDetailsImpl( Long id, String nome, String email, String password,
            Collection<? extends GrantedAuthority> authorities ) {
        this.id = id;
        this.username = nome;
        this.email = email;
        this.password = password;
        this.authorities = authorities;
    }

    public static UserDetailsImpl build( Usuario user ) {
        List<GrantedAuthority> authorities = user.getFuncoes().stream()
                .map( role -> new SimpleGrantedAuthority( role.getTipo().name() ) )
                .collect( Collectors.toList() );

        return new UserDetailsImpl(
                user.getId(),
                user.getUsername(),
                user.getEmail(),
                user.getPassword(),
                authorities );
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
    
}
