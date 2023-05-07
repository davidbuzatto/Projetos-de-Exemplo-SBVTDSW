/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.exemplo.mapeamento.entidades;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import org.hibernate.validator.constraints.Length;

/**
 *
 * @author Prof. Dr. David Buzatto
 */
@Entity
@Table( name = "tabela_estado" )
@Data
@AllArgsConstructor
@NoArgsConstructor
@EqualsAndHashCode( onlyExplicitlyIncluded = true )
public class Estado {
    
    @Id
    @GeneratedValue( strategy = GenerationType.IDENTITY )
    @Column( name = "id_estado" )
    @EqualsAndHashCode.Include
    private Long id;
    
    @NotNull
    @NotEmpty
    @Column( name = "nome_estado" )
    @Length( max = 50 )
    private String nome;
    
    @NotNull
    @NotEmpty
    @Length( max = 50 )
    @Column( name = "sigla_e", unique = true )
    private String sigla;
    
}
