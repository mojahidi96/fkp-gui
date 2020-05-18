/**
 * Created by bhav0001 on 11-Jul-17.
 */
import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable()
export class OrderHistoryService {

  constructor(private http: HttpClient) {
  }

  searchOrders(): Promise<any> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.get('/fixedline/rest/orderhistory/searchOrders?t=' + new Date().getTime(), {headers})
      .toPromise()
      .catch(this.handleError);
  }

  private handleError(error: any) {
    let errMsg: string;
    errMsg = 'Failed to process requeust';
    return Promise.reject(errMsg);
  }

}
