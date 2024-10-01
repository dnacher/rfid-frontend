import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DefaultComponent} from './layouts/default/default.component';
import {AsistenciasComponent} from './modules/asistencia/asistencias.component';
import {NoasistenComponent} from './modules/no-asisten/noasisten.component';
import {IndexComponent} from './modules/index/index.component';
import {LibroComponent} from './modules/libro/libro.component';
import {ProductoComponent} from './modules/producto/producto.component';
import {UsuarioCantinaComponent} from './modules/usuarioCantina/usuario-cantina.component';
import {VentasComponent} from './modules/ventas/ventas.component';
import {AuthGuard} from './helpers/auth.guard';
import {LoginComponent} from './modules/login/login.component';
import {PermisoComponent} from './modules/permisoUsuario/permiso.component';
import {AlumnoComponent} from './modules/alumno/alumno.component';
import {CursoComponent} from './modules/curso/curso.component';
import {TipoUsuarioComponent} from './modules/tipoUsuario/tipo-usuario.component';
import {AsignarRFIDComponent} from './modules/asignarRFID/asignar-r-f-i-d.component';
import {ReAsignarRFIDComponent} from './modules/reAsignarRFID/re-asignar-r-f-i-d.component';
import {UsuarioComponent} from './modules/usuario/usuario.component';
import {PasarClaseComponent} from './modules/pasarClase/pasar-clase.component';
import {BibliotecaReporteComponent} from './modules/biblioteca-reporte/biblioteca-reporte.component';
import {BibliotecaComponent} from './modules/biblioteca/biblioteca.component';

const routes: Routes = [{
  path: '',
  component: DefaultComponent,
  children: [
    {
      path: '',
      component: IndexComponent,
    },
    {
      path: 'login',
      component: LoginComponent,
    },
    {
      path: 'asistencia',
      component: AsistenciasComponent,
      canActivate: [AuthGuard],
    },
    {
      path: 'no-asisten',
      component: NoasistenComponent,
      canActivate: [AuthGuard],
    },
    {
      path: 'biblioteca-bib',
      component: BibliotecaComponent,
      canActivate: [AuthGuard],
    },
    {
      path: 'libro',
      component: LibroComponent,
      canActivate: [AuthGuard],
    },
    {
      path: 'producto',
      component: ProductoComponent,
      canActivate: [AuthGuard],
    },
    {
      path: 'usuario-cantina',
      component: UsuarioCantinaComponent,
      canActivate: [AuthGuard],
    },
    {
      path: 'ventas',
      component: VentasComponent,
      canActivate: [AuthGuard],
    },
    {
      path: 'permisos',
      component: PermisoComponent,
      canActivate: [AuthGuard],
    },
    {
      path: 'alumnos',
      component: AlumnoComponent,
      canActivate: [AuthGuard],
    },
    {
      path: 'cursos',
      component: CursoComponent,
      canActivate: [AuthGuard],
    },
    {
      path: 'tipo-usuario',
      component: TipoUsuarioComponent,
      canActivate: [AuthGuard],
    },
    {
      path: 'asignar',
      component: AsignarRFIDComponent,
      canActivate: [AuthGuard],
    },
    {
      path: 'reasignar',
      component: ReAsignarRFIDComponent,
      canActivate: [AuthGuard],
    },
    {
      path: 'usuario',
      component: UsuarioComponent,
      canActivate: [AuthGuard],
    },
    {
      path: 'pasar-clase',
      component: PasarClaseComponent,
      canActivate: [AuthGuard],
    },
    {
      path: 'biblioteca-reporte',
      component: BibliotecaReporteComponent,
      canActivate: [AuthGuard],
    }
    ]
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
