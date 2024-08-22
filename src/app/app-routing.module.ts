import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DefaultComponent } from './layouts/default/default.component';
import {AsistenciasComponent} from './modules/asistencia/asistencias.component';
import {AuthGuard} from './helpers/auth.guard';



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
      path: 'asistencia',
      component: AsistenciasComponent,
      // canActivate: [AuthGuard]
    }
    ]
}];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
