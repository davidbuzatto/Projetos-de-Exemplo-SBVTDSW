package exemplo.springsecurityjwt.security.jwt;

import exemplo.springsecurityjwt.security.services.UserDetailsServiceImpl;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import java.io.IOException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

/**
 * Extende a classe OncePerRequestFilter para realizar apenas uma execução
 * para cada requisição da API.
 * 
 * @author Prof. Dr. David Buzatto
 */
public class AuthTokenFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    private static final Logger logger = LoggerFactory.getLogger( AuthTokenFilter.class );

    // realiza a autenticação
    @Override
    protected void doFilterInternal( HttpServletRequest request, HttpServletResponse response, FilterChain filterChain )
            throws ServletException, IOException {
        
        try {
            
            String jwt = parseJwt( request );
            
            if ( jwt != null && jwtUtils.validateJwtToken( jwt ) ) {
                
                String username = jwtUtils.getUserNameFromJwtToken( jwt );

                UserDetails userDetails = userDetailsService.loadUserByUsername( username );
                UsernamePasswordAuthenticationToken authentication
                        = new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.getAuthorities() );
                authentication.setDetails( new WebAuthenticationDetailsSource().buildDetails( request ) );

                SecurityContextHolder.getContext().setAuthentication( authentication );
                
            }
            
        } catch ( Exception exc ) {
            logger.error( "Não é possível configurar a autorização do usuário: {}", exc );
        }

        filterChain.doFilter( request, response );
        
    }

    private String parseJwt( HttpServletRequest request ) {
        
        String headerAuth = request.getHeader( "Authorization" );

        if ( StringUtils.hasText( headerAuth ) && headerAuth.startsWith( "Bearer " ) ) {
            return headerAuth.substring( 7, headerAuth.length() );
        }

        return null;
        
    }
    
}
