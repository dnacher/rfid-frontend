import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {Router} from '@angular/router';
import {ApiService} from '../../../service/api.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Output() toggleSideBarForMe: EventEmitter<any> = new EventEmitter();

  constructor(private router: Router, private apiService: ApiService) { }

  logout() {
    this.apiService.logout();
    this.router.navigate(['login']);
  }

  ngOnInit() { }

  toggleSideBar() {
    this.toggleSideBarForMe.emit();
    setTimeout(() => {
      window.dispatchEvent(
        new Event('resize')
      );
    }, 300);
  }

}
