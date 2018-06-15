import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {Subscription} from 'rxjs/Subscription';
import {environment} from '../../../environments/environment';
import {TimerObservable} from 'rxjs/observable/TimerObservable';
import {ScatterService} from '../../services/scatter.service';

@Component({
  selector: 'app-tweets',
  templateUrl: './tweets.component.html',
  styleUrls: ['./tweets.component.css']
})
export class TweetsComponent implements OnInit, OnDestroy {

  public name: string;
  public msg: string;
  public tweets = null;
  private subscriber: Subscription;
  page = 0;
  private alive: boolean;

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router, private scatterService: ScatterService) {
    this.alive = true;
  }

  ngOnInit() {
    this.name = this.route.snapshot.params['id'];
    TimerObservable.create(0, 10000)
      .takeWhile(() => this.alive)
      .subscribe(() => {
          this.http.get(environment.apiUrl + '/tweets/' + this.name + '?page=' + this.page).subscribe(data => {
            this.tweets = data;
            console.log(data);
          });
        }
      );
  }

  tweet(msg: string) {
    this.scatterService.tweet(msg).then(transaction => {
      this.msg = '';
      console.log(transaction);
    }).catch(error => {
      $("#errorTransfer").modal();
      console.log(error);
    });
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
