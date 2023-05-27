package exemplo.springsecurityjwt.payload.response;

import java.util.List;
import lombok.Data;

/**
 *
 * @author Prof. Dr. David Buzatto
 */
@Data
public class JwtResponse {

    private String accessToken;
    private String tokenType = "Bearer";
    private Long id;
    private String username;
    private String email;
    private List<String> roles;

    public JwtResponse( String accessToken, Long id, String username, String email, List<String> roles ) {
        this.accessToken = accessToken;
        this.id = id;
        this.username = username;
        this.email = email;
        this.roles = roles;
    }
    
}
