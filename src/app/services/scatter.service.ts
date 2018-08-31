import {Injectable} from '@angular/core';
import * as Eos from 'eosjs';
import ScatterJS from 'scatter-js/dist/scatter.esm';
import {LocalStorage} from 'ngx-webstorage';
import {environment} from '../../environments/environment';

@Injectable()
export class ScatterService {
  @LocalStorage()
  identity: any;
  eos: any;
  scatter: any;
  network = {
    blockchain: 'eos',
    protocol: 'https',
    host: 'eos.greymass.com',
    port: 443,
    chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906'
  };

  load() {

    ScatterJS.scatter.connect('Decentwitter').then(connected => {
      if (!connected) {
        return false;
      }
      this.scatter = ScatterJS.scatter;
    });

    if (this.scatter) {
      this.eos = this.scatter.eos(this.network, Eos, {chainId: this.network.chainId}, environment.eosProtocol);
    }

  }

  login() {
    const requirements = {accounts: [this.network]};
    return this.scatter.getIdentity(requirements);
  }

  logout() {
    this.scatter.forgetIdentity();
  }

  isLoggedIn() {
    return this.scatter && !!this.scatter.identity;
  }

  accountName() {
    if (!this.scatter || !this.scatter.identity) {
      return;
    }
    const account = this.scatter.identity.accounts.find(acc => acc.blockchain === 'eos');
    return account.name;
  }

  tweet(msg: string) {
    this.load();
    const account = this.scatter.identity.accounts.find(acc => acc.blockchain === 'eos');
    const options = {authorization: [`${account.name}@${account.authority}`]};
    return this.eos.contract('decentwitter').then(contract => contract.tweet(msg, options));
  }

  reply(msg: string, id: string) {
    this.load();
    const account = this.scatter.identity.accounts.find(acc => acc.blockchain === 'eos');
    const options = {authorization: [`${account.name}@${account.authority}`]};
    return this.eos.contract('decentwitter').then(contract => contract.reply({id: id, msg: msg}, options));
  }

  avatar(url: string) {
    this.load();
    const account = this.scatter.identity.accounts.find(acc => acc.blockchain === 'eos');
    const options = {authorization: [`${account.name}@${account.authority}`]};
    return this.eos.contract('decentwitter').then(contract => contract.avatar(url, options));
  }

  txExist(tx: string): Promise<boolean> {
    this.scatter = ScatterJS.scatter;
    this.eos = this.scatter.eos(this.network, Eos, {chainId: this.network.chainId}, environment.eosProtocol);
    return this.eos.getTransaction(tx).then((result, error) => {
      return result && result.id != '0000000000000000000000000000000000000000000000000000000000000000';
    });
  }
}
