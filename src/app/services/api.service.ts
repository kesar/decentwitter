import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {eos, telos} from '../../config';

@Injectable()
export class ApiService {
  chain: any;
  constructor(private http: HttpClient) {
    //this.chain = window.location.hostname.startsWith('telos') ? telos: eos;
    this.chain = telos;
  }

  get (url: string) {
    let headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'X-Chain': this.chain.chainApiId,
    });
    return this.http.get(this.chain.apiUrl + url, {headers});
  }
}
