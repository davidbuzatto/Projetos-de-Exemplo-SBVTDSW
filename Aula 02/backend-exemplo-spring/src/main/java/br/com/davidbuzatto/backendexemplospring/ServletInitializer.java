package br.com.davidbuzatto.backendexemplospring;

import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;

/**
 * Inicilizador dos servlets.
 * Usado para quando for gerado um arquivo war para deploy.
 * 
 * @author Prof. Dr. David Buzatto
 */
public class ServletInitializer extends SpringBootServletInitializer {

    @Override
    protected SpringApplicationBuilder configure( SpringApplicationBuilder application ) {
        return application.sources( BackendExemploSpringApplication.class );
    }

}
