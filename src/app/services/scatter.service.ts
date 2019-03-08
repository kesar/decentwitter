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
    this.chain = window.location.hostname.startsWith('telos') ? telos: eos;
    this.network =  {
      blockchain: this.chain.blockchain,
      protocol: this.chain.eosProtocol,
      host: this.chain.eosHost,
      port: this.chain.eosPort,
      chainId: this.chain.chainId
    };
  }

  load(chainName: string = 'eos') {
    this.network.blockchain = chainName;
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

  updateScatterWithDifferentChain(chainName: string) {
    this.network.blockchain = chainName;
    this.eos = this.scatter.eos(this.network, Eos, {chainId: this.chain.chainId}, this.chain.eosProtocol);
    console.log(this.scatter.identity);
  }

  async login() {
    const requirements = {accounts: [this.network]};
    try {
      return await this.scatter.getIdentity(requirements);
    } catch(err) {
      if (err.type === 'no_network' && this.network.blockchain === 'tlos') { // sqrl thing
        await this.updateScatterWithDifferentChain('eos');
        this.login();
      }
    }
  }

  logout() {
    this.identity = null;
    this.scatter.forgetIdentity();
  }

  isLoggedIn() {
    return this.scatter && !!this.scatter.identity;
  }

  accountName() {
    if (!this.scatter || !this.scatter.identity) {
      return;
    }
    const chainName = this.scatter.identity.accounts[0].blockchain;
    const account = this.scatter.identity.accounts.find(acc => acc.blockchain === chainName);
    return account.name;
  }

  tweet(msg: string) {
    const chainName = this.scatter.identity.accounts[0].blockchain;
    this.load(chainName);
    const account = this.scatter.identity.accounts.find(acc => acc.blockchain === chainName);
    const options = {authorization: [`${account.name}@${account.authority}`]};
    return this.eos.contract('decentwitter').then(contract => contract.tweet(msg, options));
  }

  reply(msg: string, id: string) {
    const chainName = this.scatter.identity.accounts[0].blockchain;
    this.load(chainName);
    const account = this.scatter.identity.accounts.find(acc => acc.blockchain === chainName);
    const options = {authorization: [`${account.name}@${account.authority}`]};
    return this.eos.contract('decentwitter').then(contract => contract.reply({id: id, msg: msg}, options));
  }

  avatar(url: string) {
    const chainName = this.scatter.identity.accounts[0].blockchain;
    this.load(chainName);
    const account = this.scatter.identity.accounts.find(acc => acc.blockchain === chainName);
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
