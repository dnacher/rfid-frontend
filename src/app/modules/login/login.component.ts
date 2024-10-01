import { Component, OnInit } from '@angular/core';
import {Credentials} from '../../model/Credentials';
import {ApiService} from '../../service/seguridad/api.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  public loginValid = true;
  creds: Credentials = {
    email: '',
    password: ''
  };

  constructor(private apiService: ApiService, private router: Router) { }

  ngOnInit() {
  }

  login() {
    console.log('creds: ', this.creds);
    this.apiService.login(this.creds)
      .subscribe(response => {
        this.router.navigate(['/']);
      });
  }

}
