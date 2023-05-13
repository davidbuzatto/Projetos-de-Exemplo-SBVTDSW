/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package exemplorelatoriomvc.utils;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.sql.Connection;
import java.util.Map;
import net.sf.jasperreports.engine.JRDataSource;
import net.sf.jasperreports.engine.JRException;
import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.JasperPrint;
import net.sf.jasperreports.engine.export.JRPdfExporter;
import net.sf.jasperreports.export.SimpleExporterInput;
import net.sf.jasperreports.export.SimpleOutputStreamExporterOutput;

/**
 * Classe com métodos utilitários para gerar relatórios.
 *
 * @author Prof. Dr. David Buzatto
 */
public class ReportUtils {

    /**
     * Gera o relatório em PDF usando uma conexão como datasource.
     *
     * @param inputStream InputStream que contém o relatório.
     * @param parametros Parâmetros utilizados pelo relatório.
     * @param conexao Conexão utilizada para a execução da query.
     * @return Os dados do relatóri gerado como um array de bytes.
     * @throws JRException Caso ocorra algum problema na geração do relatório.
     * @throws IOException Caso ocorra algum problema na obtenção do
     * OutputStream.
     */
    public static byte[] createPDFReport(
            InputStream inputStream,
            Map<String, Object> parametros,
            Connection conexao ) throws JRException, IOException {
        
        byte[] dados;
        
        try ( ByteArrayOutputStream baos = new ByteArrayOutputStream() ) {
            
            /*
            * Cria um JasperPrint, que é a versão preenchida do relatório,
            * usando uma conexão.
            */
            JasperPrint jasperPrint = JasperFillManager.fillReport(
                    inputStream, parametros, conexao );
            
            JRPdfExporter exporter = new JRPdfExporter();
            exporter.setExporterInput( new SimpleExporterInput( jasperPrint ) );
            exporter.setExporterOutput( new SimpleOutputStreamExporterOutput( baos ) );
            
            // gera o relatório
            exporter.exportReport();
            
            // obtém os dados do relatório gerado
            dados = baos.toByteArray();
            
        }
        
        return dados;

    }
    
    /**
     * Gera o relatório em PDF usando um datasource genérico.
     *
     * @param inputStream InputStream que contém o relatório.
     * @param parametros Parâmetros utilizados pelo relatório.
     * @param dataSource Datasource a ser utilizado pelo relatório.
     * @return Os dados do relatóri gerado como um array de bytes.
     * @throws JRException Caso ocorra algum problema na geração do relatório.
     * @throws IOException Caso ocorra algum problema na obtenção do
     * OutputStream.
     */
    public static byte[] createPDFReport(
            InputStream inputStream,
            Map<String, Object> parametros,
            JRDataSource dataSource ) throws JRException, IOException {
        
        byte[] dados;
        
        try ( ByteArrayOutputStream baos = new ByteArrayOutputStream() ) {

            /*
             * Cria um JasperPrint, que é a versão preenchida do relatório,
             * usando um datasource genérico.
             */
            JasperPrint jasperPrint = JasperFillManager.fillReport(
                    inputStream, parametros, dataSource );

            JRPdfExporter exporter = new JRPdfExporter();
            exporter.setExporterInput( new SimpleExporterInput( jasperPrint ) );
            exporter.setExporterOutput( new SimpleOutputStreamExporterOutput( baos ) );

            // gera o relatório
            exporter.exportReport();

            // obtém os dados do relatório gerado
            dados = baos.toByteArray();
        
        }
        
        return dados;

    }

}
