import {Injectable} from '@angular/core';
import {FnShop} from '../common/fn-shop';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable()
export class CreateShopService {

  private options: any;

  constructor(private http: HttpClient) {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    this.options = {headers: headers};
  }

  createShop(fnShop: FnShop): Promise<any> {
    return this.http.post('/portal/rest/shop/sec/fn/create' + '?t=' + new Date().getTime(), fnShop, this.options)
      .toPromise()
      .catch(this.handleError);
  }

  getRootCustomers(): Promise<any> {
    return this.http.get('/portal/rest/fnfulldatarefresh/rootcustomers' + '?t=' + new Date().getTime(), this.options)
      .toPromise()
      .catch(this.handleError);
  }

  getCustomers(fnShop: FnShop): Promise<any> {
    return this.http.post('/portal/rest/fnfulldatarefresh/sec/customers' + '?t=' + new Date().getTime(), fnShop, this.options)
      .toPromise()
      .catch(this.handleError);
  }

  getShopList(): Promise<any> {
    return this.http.get('/portal/rest/shop/fn/shopnames' + '?t=' + new Date().getTime(), this.options)
      .toPromise()
      .catch(this.handleError);
  }

  private handleError(error: any) {
    let errMsg: string;
    errMsg = 'Failed to process request';
    return Promise.reject(errMsg);
  }
}
