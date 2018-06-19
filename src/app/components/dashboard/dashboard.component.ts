import {Component, OnDestroy, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {TimerObservable} from 'rxjs/observable/TimerObservable';
import 'rxjs/add/operator/takeWhile';
import {environment} from '../../../environments/environment';
import {ScatterService} from '../../services/scatter.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit, OnDestroy {
  tweets = null;
  page = 0;
  private alive: boolean;
  public tweetAdded: boolean = false;
  msg: string;

  constructor(private http: HttpClient, private scatterService: ScatterService) {
    this.alive = true;
  }

  ngOnInit() {
    TimerObservable.create(0, 10000)
      .takeWhile(() => this.alive)
      .subscribe(() => {
        this.http.get(environment.apiUrl + '/tweets?page=0').subscribe(data => {
          console.log(data);
          if (!this.tweets) {
            this.tweets = [];
          }

          let dataArray = Object.keys(data).map(function(dataIndex){
            let tweet = data[dataIndex];
            return tweet;
          });
          this.tweets = _.uniqBy([...this.tweets, ...dataArray], 'id')
        });
      });
  }

  ngOnDestroy() {
    this.alive = false;
  }

  isLogged() {
    return this.scatterService.isLoggedIn();
  }

  tweet(msg: string) {
    this.scatterService.tweet(msg).then(transaction => {
      this.msg = '';
      console.log(transaction);
      $("#loadingTransfer").modal();
      let dialogAlive: boolean = true;
      TimerObservable.create(0, 2000)
        .takeWhile(() => dialogAlive)
        .subscribe(() => {
          this.http.get(environment.apiUrl + '/transactions/' + transaction.transaction_id).subscribe(data => {
            if (data) {
              dialogAlive = false;
              this.tweetAdded = true;
            }
          });
        });

    }).catch(error => {
      $("#errorTransfer").modal();
      console.log(error);
    });
  }

  onScroll() {
    this.page++;
    this.http.get(environment.apiUrl + '/tweets?page=' + this.page).subscribe(data => {
      let dataArray = Object.keys(data).map(function(dataIndex){
        let tweet = data[dataIndex];
        return tweet;
      });

      this.tweets = _.uniqBy([...this.tweets, ...dataArray], 'id')
    });
  }
}
