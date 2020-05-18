import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable()
export class OrderDetailsService {
  private headers: HttpHeaders;


  constructor(private http: HttpClient) {
    this.headers = new HttpHeaders({'Content-Type': 'application/json'});
  }

  getOrderDetail(transactionId): Promise<any> {
    return this.http.post('/fixedline/rest/orderhistory/orderdetail?t=' + new Date().getTime(), transactionId,
      {headers: this.headers})
      .toPromise();
  }

  getPanels(transactionId): Promise<any> {
    return this.http.get(`/fixedline/rest/productOrder/${transactionId}/fields?t=${new Date().getTime()}`)
      .toPromise();
  }

  getOrderEligiableStatus(transactionId): Observable<any> {
    return this.http.get(`/fixedline/rest/ordermanager/${transactionId}/getordereligiablestatus?t=` + new Date().getTime());
  }

  getOrderStatusHistory(transactionId): Promise<any> {
    return this.http.get(`/fixedline/rest/ordermanager/${transactionId}/orderstatushistory?t=` + new Date().getTime())
      .toPromise();
  }

  submitOrder(transId, fnOrder): Observable<any> {
    let order = {3: fnOrder['status'].value, 15: fnOrder['message'].value, 20: transId};
    return this.http.post(`/fixedline/rest/ordermanager/sec/updateorder?t=${new Date().getTime()}`,
      order, {headers: this.headers});
  }

  getOrderLockedStatus(transactionId): Observable<any> {
    return this.http.get(`/fixedline/rest/ordermanager/${transactionId}/lockorderstatus?t=` + new Date().getTime());
  }

  unlockAnOrder(transactionId): Observable<any> {
    return this.http.get(`/fixedline/rest/ordermanager/${transactionId}/unlockorder?t=` + new Date().getTime());
  }
}
