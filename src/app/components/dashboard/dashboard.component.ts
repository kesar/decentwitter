import {Component, OnDestroy, OnInit} from '@angular/core';
import {TimerObservable} from 'rxjs/observable/TimerObservable';
import 'rxjs/add/operator/takeWhile';
import {ScatterService} from '../../services/scatter.service';
import * as _ from 'lodash';
import {ApiService} from '../../services/api.service';
import {eos, telos} from '../../../config';

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
  sending: boolean = false;
  replyId = null;
  chain: any;

  constructor(private api: ApiService, private scatterService: ScatterService) {
    this.alive = true;
    this.chain = window.location.hostname.startsWith('telos') ? telos: eos;
  }

  ngOnInit() {
    TimerObservable.create(0, 10000)
      .takeWhile(() => this.alive)
      .subscribe(() => {
        this.api.get('/tweets?page=0').subscribe(data => {
          if (!this.tweets) {
            this.tweets = [];
          }
          this.tweets = _.orderBy(_.uniqBy(_.concat(this.tweets, data), 'id'), ['created_at'], ['desc']);
        });
      });

    this.api.get('/tweets/stats').subscribe(data => {
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
    this.sending = true;
    this.scatterService.tweet(msg).then(transaction => {
      this.msg = '';
      console.log(transaction);
      $("#loadingTransfer").modal();
      this.sending = false;
      let dialogAlive: boolean = true;
      TimerObservable.create(0, 2000)
        .takeWhile(() => dialogAlive)
        .subscribe(() => {

          this.scatterService.txExist(transaction.transaction_id).then(
            success => {
              if (success) {
                dialogAlive = false;
                this.tweetAdded = true;
              }
            }
          );
        });

    }).catch(error => {
      this.sending = false;
      $("#errorTransfer").modal();
      console.log(error);
    });
  }

  reply(id: string, msg: string) {
    this.sending = true;
    this.scatterService.reply(msg, id).then(transaction => {
      this.msg = '';
      console.log(transaction);
      $("#loadingTransfer").modal();
      this.sending = false;
      let dialogAlive: boolean = true;
      TimerObservable.create(0, 2000)
        .takeWhile(() => dialogAlive)
        .subscribe(() => {
          this.scatterService.txExist(transaction.transaction_id).then(
            success => {
              if (success) {
                dialogAlive = false;
                this.tweetAdded = true;
              }
            }
          );
        });

    }).catch(error => {
      this.sending = false;
      $("#errorTransfer").modal();
      console.log(error);
    });
  }

  setReply(transactionId: string, seq: string) {
      this.replyId = transactionId+seq;
  }

  like(transactionId: string, seq: string) {
    alert('Sorry, not yet implemented ;)');
  }

  onScroll() {
    this.page++;
    this.api.get('/tweets?page=' + this.page).subscribe(data => {
      this.tweets = _.orderBy(_.uniqBy(_.concat(this.tweets, data), 'id'), ['created_at'], ['desc']);
    });
  }
}
