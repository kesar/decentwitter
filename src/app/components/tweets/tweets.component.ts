import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import {TimerObservable} from 'rxjs/observable/TimerObservable';
import {ScatterService} from '../../services/scatter.service';

import * as _ from 'lodash';

@Component({
  selector: 'app-tweets',
  templateUrl: './tweets.component.html',
  styleUrls: ['./tweets.component.css']
})
export class TweetsComponent implements OnInit, OnDestroy {

  public name: string;
  public tweetAdded: boolean = false;
  public msg: string;
  public tweets = null;
  public page = 0;
  public stats = null;
  private alive: boolean;

  public msg: string;

  public sending = false;

  public avatarUrl = null;
  public avatarUploading = false;
  public avatarUploaded = false;

  constructor(private route: ActivatedRoute, private http: HttpClient, private scatterService: ScatterService) {
    this.alive = true;
  }

  ngOnInit() {
    this.name = this.route.snapshot.params['id'];
    TimerObservable.create(0, 10000)
      .takeWhile(() => this.alive)
      .subscribe(() => {
          this.http.get(environment.apiUrl + '/tweets/' + this.name + '?page=0').subscribe(data => {
            console.log(data);
            if (!this.tweets) {
              this.tweets = [];
            }
            this.tweets = _.orderBy(_.uniqBy(_.concat(this.tweets, data), 'id'), ['created_at'], ['desc']);

          });
        }
      );

    this.http.get(environment.apiUrl + '/tweets/' + this.name + '/stats').subscribe(data => {
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

      maxAmount = maxAmount + 10;

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

  isOwnerAccount() {
    return (this.scatterService.accountName() && this.scatterService.accountName() == this.name);
  }


  isLogged() {
    return this.scatterService.isLoggedIn();
  }

  openDialogAvatar() {
    $("#loadingAvatarUrl").modal();
  }

  tweet(msg: string) {
    this.sending = true;
    this.scatterService.tweet(msg).then(transaction => {
      this.msg = '';
      $("#loadingTransfer").modal();
      this.sending = false;
      console.log(transaction);
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
      this.sending = false;
      $("#errorTransfer").modal();
      console.log(error);
    });
  }

  uploadAvatar(url: string) {
    this.sending = true;
    this.avatarUploading = true;
    this.scatterService.avatar(url).then(transaction => {
      this.avatarUrl = '';
      this.sending = false;
      console.log(transaction);
      let dialogAlive: boolean = true;
      TimerObservable.create(0, 2000)
        .takeWhile(() => dialogAlive)
        .subscribe(() => {
          this.http.get(environment.apiUrl + '/transactions/' + transaction.transaction_id).subscribe(data => {
            if (data) {
              dialogAlive = false;
              this.avatarUploaded = true;
            }
          });
        });

    }).catch(error => {
      this.sending = false;
      $("#errorTransfer").modal();
      console.log(error);
    });
  }

  onScroll() {
    this.page++;
    this.http.get(environment.apiUrl + '/tweets/' + this.name + '?page=' + this.page).subscribe(data => {
      this.tweets = _.orderBy(_.uniqBy(_.concat(this.tweets, data), 'id'), ['created_at'], ['desc']);
    });
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
