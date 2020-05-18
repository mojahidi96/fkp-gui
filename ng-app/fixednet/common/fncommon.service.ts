import {Injectable} from '@angular/core';
import {FnShop} from './fn-shop';
import {HttpClient, HttpHeaders} from '@angular/common/http';


@Injectable()
export class FnCommonService {

  constructor(private http: HttpClient) {

  }

  saveFullRefreshData(fnShop: FnShop): Promise<any> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.post('/portal/rest/fnfulldatarefresh/sec/getdata' + '?t=' + new Date().getTime(), fnShop,
      {headers: headers})
      .toPromise()
      .catch(this.handleError);
  }

  private handleError(error: any) {
    let errMsg: string;
    errMsg = 'Failed to process request';
    return Promise.reject(errMsg);
  }
}
