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
  stats = null;
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
          if (!this.tweets) {
            this.tweets = [];
          }
          this.tweets = _.orderBy(_.uniqBy(_.concat(this.tweets, data), 'id'), ['created_at'], ['desc']);
        });
      });

    this.http.get(environment.apiUrl + '/tweets/stats').subscribe(data => {
      this.stats = data;
      let d = [];
      let maxAmount = 0;

      for (let i = 0; i < this.stats.length; i++) {
        let dataPoint = [];
        dataPoint.push( (new Date(this.stats[i].theday)).getTime());
        let amount = parseInt(this.stats[i].amount);
        dataPoint.push(amount);
        if (amount > maxAmount) {
          maxAmount = amount;
        }
        d.push(dataPoint);
      }

      maxAmount = maxAmount + 50;

      $.plot("#flot-pie-chart", [d],{
        series: {
          lines: {
            show: true
          },
          points: {
            show: true
          }
        },
        xaxis: {
          mode: 'time',
          timeformat: '%b %d',
          tickSize: [1, 'day']
        },
        yaxis: {
          min: 0,
          max: maxAmount
        }
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
      this.tweets = _.orderBy(_.uniqBy(_.concat(this.tweets, data), 'id'), ['created_at'], ['desc']);
    });
  }
}
