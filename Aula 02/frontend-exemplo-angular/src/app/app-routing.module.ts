import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormularioCidadeComponent } from './components/formulario-cidade/formulario-cidade.component';
import { FormularioClienteComponent } from './components/formulario-cliente/formulario-cliente.component';
import { FormularioEstadoComponent } from './components/formulario-estado/formulario-estado.component';
import { FormularioProdutoComponent } from './components/formulario-produto/formulario-produto.component';
import { FormularioVendaComponent } from './components/formulario-venda/formulario-venda.component';
import { HomeComponent } from './components/home/home.component';

const routes: Routes = [
    { path: "home", component: HomeComponent },
    { path: "formulario/estado", component: FormularioEstadoComponent },
    { path: "formulario/cidade", component: FormularioCidadeComponent },
    { path: "formulario/cliente", component: FormularioClienteComponent },
    { path: "formulario/produto", component: FormularioProdutoComponent },
    { path: "formulario/venda", component: FormularioVendaComponent },
    { path: "", redirectTo: "/home", pathMatch: "full" },
    { path: "**", redirectTo: "/home", pathMatch: "full" }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
