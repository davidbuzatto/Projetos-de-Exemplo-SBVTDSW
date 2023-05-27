package exemplo.springsecurityjwt.payload.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.Set;
import lombok.Data;

/**
 *
 * @author Prof. Dr. David Buzatto
 */
@Data
public class SignupRequest {

    @NotBlank
    @Size( min = 3, max = 20 )
    private String username;

    @NotBlank
    @Size( max = 50 )
    @Email
    private String email;
    
    @NotBlank
    @Size( min = 6, max = 40 )
    private String password;

    private Set<String> role;
    
}
