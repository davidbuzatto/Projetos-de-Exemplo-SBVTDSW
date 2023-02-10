import { Component } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {

    itens: any[] = [
        { label: "Estados", routerLink: "formulario/estado" },
        { label: "Cidades", routerLink: "formulario/cidade" },
        { label: "Clientes", routerLink: "formulario/cliente" },
        { label: "Produtos", routerLink: "formulario/produto" },
        { label: "Vendas", routerLink: "formulario/venda" }
    ];

}
