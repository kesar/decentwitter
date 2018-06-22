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
  page = 0;
  private alive: boolean;

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
  }

  isOwnerAccount() {
    return (this.scatterService.accountName() &&  this.scatterService.accountName() == this.name);
  }


  isLogged() {
    return this.scatterService.isLoggedIn();
  }

  tweet(msg: string) {
    this.scatterService.tweet(msg).then(transaction => {
      this.msg = '';
      $("#loadingTransfer").modal();
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
