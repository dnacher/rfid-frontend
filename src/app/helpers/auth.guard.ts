import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {AuthService} from '../service/seguridad/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(): boolean {
    const isLoggedIn = this.authService.isLoggedIn();
    console.log('AuthGuard#canActivate called, isLoggedIn:', isLoggedIn);
    if (!isLoggedIn) {
      console.log('User is not logged in. Redirecting to /login');
      this.router.navigate(['/login']);
      return false;
    }
    console.log('User is logged in. Access granted.');
    return true;
  }

}
