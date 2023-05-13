/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package exemplorelatoriomvc.controladores;

import exemplorelatoriomvc.utils.ReportUtils;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.sql.SQLException;
import java.util.HashMap;
import java.util.Map;
import javax.sql.DataSource;
import net.sf.jasperreports.engine.JRException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

/**
 *
 * @author Prof. Dr. David Buzatto
 */
@Controller
@RequestMapping( "/relatorios" )
public class ReportController {

    @Autowired
    private DataSource dataSource;

    @GetMapping( "/clientes" )
    public ResponseEntity<byte[]> getClientesPDF() throws JRException, IOException, SQLException {

        byte[] contents = ReportUtils.createPDFReport(
                getClass().getClassLoader().getResourceAsStream(
                        "relatorios/Clientes.jasper" ),
                null, dataSource.getConnection() );

        return gerarResponseEntity( "clientes.pdf", contents );

    }

    @GetMapping( "/clientesPorNome" )
    public ResponseEntity<byte[]> getClientesPorNomePDF( @RequestParam( required = false ) String nome ) throws JRException, IOException, SQLException {

        Map<String, Object> parametros = new HashMap<>();
        parametros.put( "nome", nome == null ? "" : nome );

        byte[] contents = ReportUtils.createPDFReport(
                getClass().getClassLoader().getResourceAsStream(
                        "relatorios/ClientesPorNome.jasper" ),
                parametros, dataSource.getConnection() );

        return gerarResponseEntity( "clientesPorNome.pdf", contents );

    }
    
    private ResponseEntity<byte[]> gerarResponseEntity( String nomeArquivo, byte[] contents ) {
        
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType( MediaType.APPLICATION_PDF );
        headers.setContentDispositionFormData( nomeArquivo, nomeArquivo );
        headers.setCacheControl( "must-revalidate, post-check=0, pre-check=0" );
        
        return new ResponseEntity<>( contents, headers, HttpStatus.OK );
        
    }

}
