import {Component, OnInit} from '@angular/core';
import {LocalStorage} from 'ngx-webstorage';
import {ScatterService} from '../../../../services/scatter.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
  @LocalStorage()
  isLogged: boolean;

  constructor(private scatterService: ScatterService) {
  }

  ngOnInit() {
  }

  logout() {
    this.scatterService.logout();
    this.isLogged = false;
  }

  login() {
    this.scatterService.login(function () {
      this.isLogged = true;
    }, function () {
      this.isLogged = false;
    });
  }
}
