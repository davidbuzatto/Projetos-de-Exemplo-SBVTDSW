import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormularioEstadoComponent } from './components/formulario-estado/formulario-estado.component';
import { HomeComponent } from './components/home/home.component';

const routes: Routes = [
    { path: "home", component: HomeComponent },
    { path: "formulario/estado", component: FormularioEstadoComponent },
    { path: "", redirectTo: "/home", pathMatch: "full" },
    { path: "**", redirectTo: "/home", pathMatch: "full" }
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }
