package exemplo.springsecurityjwt.payload.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 *
 * @author Prof. Dr. David Buzatto
 */
@Data
public class LoginRequest {

    @NotBlank
    private String username;

    @NotBlank
    private String password;

}
