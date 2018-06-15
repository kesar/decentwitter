import {Injectable} from '@angular/core';
import * as Eos from 'eosjs';
import {LocalStorage} from 'ngx-webstorage';
import {environment} from '../../environments/environment';

@Injectable()
export class ScatterService {
  @LocalStorage()
  identity: any;
  eos: any;
  scatter: any;
  network: any;

  load() {
    this.scatter = (<any>window).scatter;
    if (this.identity) {
      this.scatter.useIdentity(this.identity.hash);
    }

    this.network = {
      blockchain: 'eos',
      host: environment.eosHost,
      port: environment.eosPort,
      chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906'
    };
    this.eos = this.scatter.eos(this.network, Eos, {}, environment.eosProtocol);
  }

  login(successCallback, errorCallbak) {
    const requirements = {accounts: [this.network]};

    let that = this;
    this.scatter.getIdentity(requirements).then(
      function (identity) {
        if (!identity) {
          return errorCallbak(null);
        }
        that.identity = identity;
        that.scatter.useIdentity(identity.hash);
        successCallback();
      }
    ).catch(error => {
      errorCallbak(error);
    });
  }

  logout() {
    this.scatter.forgetIdentity().then(() => { this.identity = null; });
  }

  tweet(msg: string, successCallback, errorCallback) {
    this.load();
    let that = this;
    this.login(function () {
      that.eos.contract('decentwitter', {}).then(contract => contract.tweet(msg)).then(transaction => {
          successCallback(transaction);
          return;
        }).catch(error => {
          errorCallback(error);
        });
      }, function (error) {
        errorCallback(error);
      }
    );
  }
}
