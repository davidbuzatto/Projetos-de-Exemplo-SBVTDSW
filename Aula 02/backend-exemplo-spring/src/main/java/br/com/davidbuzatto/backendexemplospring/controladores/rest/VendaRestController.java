package br.com.davidbuzatto.backendexemplospring.controladores.rest;

import br.com.davidbuzatto.backendexemplospring.controladores.dtos.VendaDTO;
import br.com.davidbuzatto.backendexemplospring.entidades.Cliente;
import br.com.davidbuzatto.backendexemplospring.entidades.ItemVenda;
import br.com.davidbuzatto.backendexemplospring.entidades.Produto;
import br.com.davidbuzatto.backendexemplospring.entidades.Venda;
import br.com.davidbuzatto.backendexemplospring.repositorios.ClienteRepository;
import br.com.davidbuzatto.backendexemplospring.repositorios.ItemVendaRepository;
import br.com.davidbuzatto.backendexemplospring.repositorios.ProdutoRepository;
import br.com.davidbuzatto.backendexemplospring.repositorios.VendaRepository;
import jakarta.persistence.EntityManager;
import jakarta.transaction.Transactional;
import java.time.LocalDate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controlador REST para a entidade Venda.
 * Implementação de serviços adicionais.
 * 
 * @author Prof. Dr. David Buzatto
 */
@CrossOrigin
@RestController
@RequestMapping( "/api/vendas" )
public class VendaRestController {
    
    @Autowired
    private VendaRepository vendaRepo;
    
    @Autowired
    private ItemVendaRepository itemVendaRepo;
    
    @Autowired
    private ClienteRepository clienteRepo;
    
    @Autowired
    private ProdutoRepository produtoRepo;
    
    @Autowired
    private EntityManager em;
    
    @PostMapping( "/vender" )
    @Transactional
    public Venda vender( @RequestBody VendaDTO vendaDTO ) {
        
        Cliente c = clienteRepo.findById( vendaDTO.getCliente().getId() ).get();
        
        Venda v = new Venda();
        v.setData( LocalDate.now() );
        v.setCancelada( Boolean.FALSE );
        v.setCliente( c );
        
        v = vendaRepo.save( v );
        
        for ( ItemVenda iv : vendaDTO.getItensVenda() ) {
            
            Produto p = produtoRepo.findById( iv.getProduto().getId() ).get();
            p.setEstoque( p.getEstoque().subtract( iv.getQuantidade() ) );
            p = produtoRepo.save( p );
            
            iv.setVenda( v );
            iv.setProduto( p );
            iv.setPrecoVenda( p.getPreco() );
            // quantidade já vem do cliente
            
            itemVendaRepo.save( iv );
            
        }
        
        return v;
        
    }
    
    @PatchMapping( "/cancelar/{id}" )
    @Transactional
    public Venda cancelar( @PathVariable Long id ) {
        
        Venda venda = vendaRepo.findById( id ).get();
        venda.setCancelada( true );
        vendaRepo.save( venda );
        
        for ( ItemVenda iv : itemVendaRepo.findByVenda( venda, null ) ) {
            
            Produto p = produtoRepo.findById( iv.getProduto().getId() ).get();
            p.setEstoque( p.getEstoque().add( iv.getQuantidade() ) );
            produtoRepo.save( p );
            
        }
        
        return venda;
        
    }
    
}
