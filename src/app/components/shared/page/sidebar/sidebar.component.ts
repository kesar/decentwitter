import {Component, OnInit} from '@angular/core';
import {LocalStorage} from 'ngx-webstorage';
import {ScatterService} from '../../../../services/scatter.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  constructor(private scatterService: ScatterService) {
  }

  ngOnInit() {
  }
  isLogged() { return this.scatterService.isLoggedIn(); }
  logout() { this.scatterService.logout(); }
  login() { this.scatterService.login(); }
}
