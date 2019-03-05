import {Injectable} from '@angular/core';
import * as Eos from 'eosjs';
import ScatterJS from 'scatter-js/dist/scatter.esm.js';
import {LocalStorage} from 'ngx-webstorage';
import {eos, telos} from '../../config'

@Injectable()
export class ScatterService {
  @LocalStorage()
  identity: any;
  eos: any;
  scatter: any;
  network: any;
  chain: any;

  constructor() {
    //this.chain = window.location.hostname.startsWith('telos') ? telos: eos;
    this.chain = telos;
    this.network =  {
      blockchain: this.chain.blockchain,
      protocol: this.chain.eosProtocol,
      host: this.chain.eosHost,
      port: this.chain.eosPort,
      chainId: this.chain.chainId
    };
  }

  load() {

    ScatterJS.scatter.connect('Decentwitter').then(connected => {
      if (!connected) {
        return false;
      }
      this.scatter = ScatterJS.scatter;
    });

    if (this.scatter) {
      this.eos = this.scatter.eos(this.network, Eos, {chainId: this.chain.chainId}, this.chain.eosProtocol);
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
    const account = this.scatter.identity.accounts.find(acc => acc.blockchain === this.chain.blockchain);
    return account.name;
  }

  tweet(msg: string) {
    this.load();
    const account = this.scatter.identity.accounts.find(acc => acc.blockchain === this.chain.blockchain);
    const options = {authorization: [`${account.name}@${account.authority}`]};
    return this.eos.contract('decentwitter').then(contract => contract.tweet(msg, options));
  }

  reply(msg: string, id: string) {
    this.load();
    const account = this.scatter.identity.accounts.find(acc => acc.blockchain === this.chain.blockchain);
    const options = {authorization: [`${account.name}@${account.authority}`]};
    return this.eos.contract('decentwitter').then(contract => contract.reply({id: id, msg: msg}, options));
  }

  avatar(url: string) {
    this.load();
    const account = this.scatter.identity.accounts.find(acc => acc.blockchain === this.chain.blockchain);
    const options = {authorization: [`${account.name}@${account.authority}`]};
    return this.eos.contract('decentwitter').then(contract => contract.avatar(url, options));
  }

  txExist(tx: string): Promise<boolean> {
    this.scatter = ScatterJS.scatter;
    this.eos = this.scatter.eos(this.network, Eos, {chainId: this.chain.chainId}, this.chain.eosProtocol);
    return this.eos.getTransaction(tx).then((result, error) => {
      return result && result.id != '0000000000000000000000000000000000000000000000000000000000000000';
    });
  }
}
