/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package br.com.davidbuzatto.backendexemplospring.controladores.dtos;

import br.com.davidbuzatto.backendexemplospring.entidades.Cliente;
import br.com.davidbuzatto.backendexemplospring.entidades.ItemVenda;
import java.util.List;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;

/**
 * DTO da venda. Note que não é uma entidade, é usado apenas para transferência
 * de dados.
 * 
 * @author Prof. Dr. David Buzatto
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode( onlyExplicitlyIncluded = true )
public class VendaDTO {
    
    private Cliente cliente;
    private List<ItemVenda> itensVenda;
    
}
