package exemplo.springsecurityjwt.security.jwt;

import exemplo.springsecurityjwt.security.services.UserDetailsImpl;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.MalformedJwtException;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.UnsupportedJwtException;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import java.security.Key;
import java.util.Date;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

/**
 *
 * @author Prof. Dr. David Buzatto
 */
@Component
public class JwtUtils {

    private static final Logger logger = LoggerFactory.getLogger( JwtUtils.class );

    @Value( "${exemplo.app.jwtSecret}" )
    private String jwtSecret;

    @Value( "${exemplo.app.jwtExpirationMs}" )
    private int jwtExpirationMs;

    public String generateJwtToken( Authentication authentication ) {

        UserDetailsImpl userPrincipal = (UserDetailsImpl) authentication.getPrincipal();

        return Jwts.builder()
                .setSubject( ( userPrincipal.getUsername() ) )
                .setIssuedAt( new Date() )
                .setExpiration( new Date( ( new Date() ).getTime() + jwtExpirationMs ) )
                .signWith( key(), SignatureAlgorithm.HS256 )
                .compact();

    }

    private Key key() {
        return Keys.hmacShaKeyFor( Decoders.BASE64.decode( jwtSecret ) );
    }

    public String getUserNameFromJwtToken( String token ) {
        return Jwts.parserBuilder().setSigningKey( key() ).build()
                .parseClaimsJws( token ).getBody().getSubject();
    }

    public boolean validateJwtToken( String authToken ) {

        try {
            Jwts.parserBuilder().setSigningKey( key() ).build().parse( authToken );
            return true;
        } catch ( MalformedJwtException e ) {
            logger.error( "Token JWT inválido: {}", e.getMessage() );
        } catch ( ExpiredJwtException e ) {
            logger.error( "Token JWT expirado: {}", e.getMessage() );
        } catch ( UnsupportedJwtException e ) {
            logger.error( "Token JWT não suportado: {}", e.getMessage() );
        } catch ( IllegalArgumentException e ) {
            logger.error( "String JWT está vazia: {}", e.getMessage() );
        }

        return false;

    }

}
