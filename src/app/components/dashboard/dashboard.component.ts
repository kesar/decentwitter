import {Component, OnDestroy, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {TimerObservable} from 'rxjs/observable/TimerObservable';
import 'rxjs/add/operator/takeWhile';
import {environment} from '../../../environments/environment';
import {ScatterService} from '../../services/scatter.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  tweets = null;
  page = 0;
  private alive: boolean;
  msg: string;

  constructor(private http: HttpClient, private scatterService: ScatterService) {
    this.alive = true;
  }

  ngOnInit() {
    TimerObservable.create(0, 5000)
      .takeWhile(() => this.alive)
      .subscribe(() => {
        this.http.get(environment.apiUrl + '/tweets?page=' + this.page).subscribe(data => {
          this.tweets = data;
          console.log(data);
        });
      });
  }

  ngOnDestroy() {
    this.alive = false;
  }

  tweet(msg: string) {
    this.scatterService.tweet(msg,
      function (transaction) {
        console.log(transaction);
      }, function (error) {
        $("#errorTransfer").modal();
        console.log(error);
      }
    );
  }
}
