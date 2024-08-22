import { Injectable } from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {ApiService} from '../service/api.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements  CanActivate{

  constructor(
    private apiService: ApiService,
    private router: Router
  ) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const token = this.apiService.getToken();
    if (!token) {
      this.router.navigate(['login']);
      return false;
    }
    return true;
  }

}
