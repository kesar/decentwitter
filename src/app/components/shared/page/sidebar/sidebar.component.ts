import {Component, OnInit} from '@angular/core';
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
  accountName() { return this.scatterService.accountName(); }
  isLogged() { return this.scatterService.isLoggedIn(); }
  logout() { this.scatterService.logout(); }
  login() { this.scatterService.login(); }
}
