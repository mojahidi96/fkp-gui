import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable()
export class OrderDetailsService {
  id: string;
  private readonly headers: HttpHeaders;

  constructor(private http: HttpClient) {
    this.headers = new HttpHeaders({'Content-Type': 'application/json'});
  }

  getOrderHeader(transactionId): Observable<any[]> {
    return this.http.get<any[]>('/buyflow/rest/orderhistory/' + transactionId + '/orderdetails?t=' + new Date().getTime());
  }

  getAdminAndSubComments(transactionId): Observable<any[]> {
    return this.http.get<any[]>('/buyflow/rest/orderhistory/' + transactionId + '/adminandsubcomments?t=' + new Date().getTime());
  }

  getOrderDetails(trancationId): Observable<any[]> {
    return this.http.get<any[]>('/buyflow/rest/orderhistory/' + trancationId + '/banorderdetails?t=' + new Date().getTime());
  }

  getAdressDetails(): Observable<any[]> {
    return this.http.get<any[]>('/buyflow/rest/orderhistory/address?t=' + new Date().getTime());
  }

  getHardwareDetails(transactionId: string): Observable<any> {
    return this.http.get<any[]>('/buyflow/rest/orderhistory/handy?t=' + new Date().getTime());
  }

  getSocDetails(transactionId: string): Observable<any> {
    return this.http.get<any[]>('/buyflow/rest/orderhistory/socs?t=' + new Date().getTime());
  }

  getTariffDetails(transactionId: string): Observable<any> {
    return this.http.get<any[]>('/buyflow/rest/orderhistory/tariff?t=' + new Date().getTime());
  }

  getEligibleSubscribers(selectedTariff: string): Promise<number> {
    return Promise.resolve(2);
  }

  getTotalSummary(): Observable<any> {
    return this.http.get<any>(`/buyflow/rest/orderhistory/pricesummary?t=` + new Date().getTime());
  }

  updateApprovalOrder(orderList): Promise<any> {
    return this.http.post('/portal/rest/orderapprovals/sec/updateapprovalorder?t=' + new Date().getTime(),
      orderList, {headers: this.headers})
      .toPromise()
      .catch(this.handleError);
  }

  private handleError(error: Response | any) {
    let errMsg: string;
    errMsg = 'Failed to process requeust' + error;
    return Promise.reject(errMsg);
  }
}
