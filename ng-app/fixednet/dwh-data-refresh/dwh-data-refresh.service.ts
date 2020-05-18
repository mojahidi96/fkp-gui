import {Injectable} from '@angular/core';
import {FnShop} from '../common/fn-shop';
import {DwhDataRefreshConfig} from './dwh-data-refresh.config';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable()
export class DwhDataRefreshService {

  private options: any;

  constructor(private http: HttpClient) {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    this.options = {headers};
  }

  getDwhRefreshList(flow: string): Promise<any> {
    const endPoint = flow === 'ed' ? 'edfulldatarefresh/customers' : 'fnfulldatarefresh/refresh/customers';
    return this.http.get('/portal/rest/' + endPoint + '?t=' + new Date().getTime(), this.options)
      .toPromise()
      .catch(this.handleError);
  }


  onBoardCustomerForRefresh(fnShop: FnShop, flow: string): Promise<any> {
    const endPoint = flow === 'ed' ? 'edfulldatarefresh/sec/onboard' : 'fnfulldatarefresh/sec/onboard';
    return this.http.post('/portal/rest/' + endPoint + '?t=' + new Date().getTime(), fnShop, this.options)
      .toPromise()
      .catch(this.handleError);
  }


  refreshAction(fnShops: Array<FnShop>, flow: string, actionType: string): Promise<any> {
    const endPoint = flow === 'ed' ? 'edfulldatarefresh/sec/' + actionType : 'fnfulldatarefresh/sec/' + actionType;
    return this.http.put('/portal/rest/' + endPoint + '?t=' + new Date().getTime(), fnShops, this.options)
      .toPromise()
      .catch(this.handleError);
  }

  private handleError(error: any) {
    let errMsg: string;
    errMsg = DwhDataRefreshConfig.DEFAULT_FAILURE;
    return Promise.reject(errMsg);
  }
}
