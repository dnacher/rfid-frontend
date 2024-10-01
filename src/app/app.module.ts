import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DefaultModule } from './layouts/default/default.module';
import {FormsModule} from '@angular/forms';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {AuthInterceptor} from './helpers/auth.interceptor';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import {AsistenciasComponent} from './modules/asistencia/asistencias.component';
import {NoasistenComponent} from './modules/no-asisten/noasisten.component';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {MatCardModule} from '@angular/material/card';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatTableModule} from '@angular/material/table';
import {MatGridListModule} from '@angular/material/grid-list';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {NgxSpinnerModule} from 'ngx-spinner';
import {IndexComponent} from './modules/index/index.component';
import {LibroComponent} from './modules/libro/libro.component';
import {ProductoComponent} from './modules/producto/producto.component';
import {UsuarioCantinaComponent} from './modules/usuarioCantina/usuario-cantina.component';
import {VentasComponent} from './modules/ventas/ventas.component';
import {LoginComponent} from './modules/login/login.component';
import {PermisoComponent} from './modules/permisoUsuario/permiso.component';
import {MatListModule} from '@angular/material/list';
import {AlumnoComponent} from './modules/alumno/alumno.component';
import {CursoComponent} from './modules/curso/curso.component';
import {TipoUsuarioComponent} from './modules/tipoUsuario/tipo-usuario.component';
import {AsignarRFIDComponent} from './modules/asignarRFID/asignar-r-f-i-d.component';
import {ReAsignarRFIDComponent} from './modules/reAsignarRFID/re-asignar-r-f-i-d.component';
import {UsuarioComponent} from './modules/usuario/usuario.component';
import {PasarClaseComponent} from './modules/pasarClase/pasar-clase.component';
import {BibliotecaReporteComponent} from './modules/biblioteca-reporte/biblioteca-reporte.component';
import {BibliotecaComponent} from './modules/biblioteca/biblioteca.component';

@NgModule({
  declarations: [
    IndexComponent,
    AppComponent,
    AsistenciasComponent,
    NoasistenComponent,
    BibliotecaComponent,
    BibliotecaReporteComponent,
    LibroComponent,
    ProductoComponent,
    UsuarioCantinaComponent,
    VentasComponent,
    LoginComponent,
    PermisoComponent,
    AlumnoComponent,
    CursoComponent,
    TipoUsuarioComponent,
    AsignarRFIDComponent,
    ReAsignarRFIDComponent,
    UsuarioComponent,
    PasarClaseComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    DefaultModule,
    MatCardModule,
    FormsModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatRadioModule,
    MatSelectModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatSnackBarModule,
    MatGridListModule,
    MatCheckboxModule,
    NgxSpinnerModule,
    MatListModule,
  ],
  exports: [

  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true
    },
    provideAnimationsAsync()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
