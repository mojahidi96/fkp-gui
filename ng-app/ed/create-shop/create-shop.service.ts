import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {EdShop} from '../common/ed-shop';

@Injectable()
export class CreateShopService {

  private options: any;

  constructor(private http: HttpClient) {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    this.options = {headers: headers};
  }
  
  getRootCustomers(): Observable<any> {
    return this.http.get('/ed/rest/edshop/rootcustomers' + '?t=' + new Date().getTime(), this.options);
  }

  getShopList(): Observable<any> {
    return this.http.get('/ed/rest/edshop/shopnames' + '?t=' + new Date().getTime(), this.options);
  }

  getCustomers(edShop: EdShop): Observable<any> {
    return this.http.post('/portal/rest/fnfulldatarefresh/sec/customers' + '?t=' + new Date().getTime(), edShop, this.options);
  }

  createShop(edShop: EdShop): Observable<any> {
    return this.http.post('/ed/rest/edshop/sec/create' + '?t=' + new Date().getTime(), edShop, this.options);
  }
}
