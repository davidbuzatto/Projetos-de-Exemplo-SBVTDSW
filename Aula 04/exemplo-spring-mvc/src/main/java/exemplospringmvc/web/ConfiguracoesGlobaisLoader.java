package exemplospringmvc.web;

import exemplospringmvc.pojos.ConfiguracoesGlobais;
import jakarta.servlet.ServletContext;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.context.event.ApplicationReadyEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ConfiguracoesGlobaisLoader implements ApplicationListener<ApplicationReadyEvent> {
    
    @Autowired
    private ServletContext context;
    
    @Override
    public void onApplicationEvent( final ApplicationReadyEvent event ) {
        ConfiguracoesGlobais.CONTEXT_PATH = context.getContextPath();        
    }

}
