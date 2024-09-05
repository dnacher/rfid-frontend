import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DefaultComponent } from './layouts/default/default.component';
import {AsistenciasComponent} from './modules/asistencia/asistencias.component';
import {NoasistenComponent} from './modules/no-asisten/noasisten.component';
import {BibliotecaComponent} from './modules/biblioteca/biblioteca.component';
import {IndexComponent} from './modules/index/index.component';

const routes: Routes = [{
  path: '',
  component: DefaultComponent,
  children: [
    // {
    // path: 'dashboard',
    // component: DashboardComponent
    // },
    // {
    //   path: 'login',
    //   component: LoginComponent
    // },
    {
      path: '',
      component: IndexComponent,
    },
    {
      path: 'asistencia',
      component: AsistenciasComponent,
    },
    {
      path: 'no-asisten',
      component: NoasistenComponent,
    },
    {
      path: 'biblioteca',
      component: BibliotecaComponent,
    }
    ]
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
