import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { MatNativeDateModule, MAT_DATE_LOCALE } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, MatPaginatorIntl } from '@angular/material/paginator';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';

import { FormularioEstadoComponent } from './components/formulario-estado/formulario-estado.component';
import { MenuComponent } from './components/menu/menu.component';
import { FormularioCidadeComponent } from './components/formulario-cidade/formulario-cidade.component';
import { FormularioClienteComponent } from './components/formulario-cliente/formulario-cliente.component';
import { FormularioProdutoComponent } from './components/formulario-produto/formulario-produto.component';
import { FormularioVendaComponent } from './components/formulario-venda/formulario-venda.component';
import { RodapeComponent } from './components/rodape/rodape.component';
import { HomeComponent } from './components/home/home.component';
import { EstadoService } from './services/estado.service';
import { DialogoConfirmacaoComponent } from './components/dialogo-confirmacao/dialogo-confirmacao.component';
import { MatPaginatorIntlPtBr } from './common/i18n/mat-paginator-intl-pt-br';
import { DialogoMensagemComponent } from './components/dialogo-mensagem/dialogo-mensagem.component';

import localePt from '@angular/common/locales/pt';
import { registerLocaleData } from '@angular/common';
import { LOCALE_ID } from '@angular/core';
import { DialogoInputComponent } from './components/dialogo-input/dialogo-input.component';

registerLocaleData( localePt, "pt-BR" );


@NgModule({
    declarations: [
        AppComponent,
        HomeComponent,
        MenuComponent,
        RodapeComponent,
        FormularioEstadoComponent,
        FormularioCidadeComponent,
        FormularioClienteComponent,
        FormularioProdutoComponent,
        FormularioVendaComponent,
        DialogoConfirmacaoComponent,
        DialogoMensagemComponent,
        DialogoInputComponent
    ],
    imports: [
        AppRoutingModule,
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        MatButtonModule,
        MatCardModule,
        MatDatepickerModule,
        MatDialogModule,
        MatDividerModule,
        MatFormFieldModule,
        MatGridListModule,
        MatIconModule,
        MatInputModule,
        MatNativeDateModule,
        MatPaginatorModule,
        MatRadioModule,
        MatSelectModule,
        MatTableModule,
        MatToolbarModule
    ],
    providers: [
        //{ provide: "servicesRootUrl", useValue: "http://localhost:8080" },
        { provide: "servicesRootUrl", useValue: "" },
        { provide: MatPaginatorIntl, useClass: MatPaginatorIntlPtBr },
        { provide: LOCALE_ID, useValue: "pt-BR" },
        { provide: MAT_DATE_LOCALE, useValue: "pt-BR" },
    ],
    bootstrap: [AppComponent],
})
export class AppModule {}
