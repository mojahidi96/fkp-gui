import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable()
export class OrderDetailsService {

  constructor(private http: HttpClient) {
  }

  getOrderDetail(transactionId): Promise<any> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.post('/fixedline/rest/orderhistory/orderdetail?t=' + new Date().getTime(), transactionId, {headers: headers})
      .toPromise()
      .catch(this.handleError);
  }

  getPanels(transactionId): Promise<any> {
    return this.http.get(`/fixedline/rest/productOrder/${transactionId}/fields?t=${new Date().getTime()}`)
      .toPromise();
  }

  getCustomerMessage(fnData: any) {
    return this.http.post(`/fixedline/rest/fnshop/sec/order/customermessage?t=${new Date().getTime()}`, fnData, this.getRequestOptions());
  }

  private handleError(error: any) {
    let errMsg: string;
    errMsg = 'Failed to process requeust';
    return Promise.reject(errMsg);
  }


  getRequestOptions() {
    const headers = new HttpHeaders({
      'Cache-Control': 'no-cache,no-store, must-revalidate',
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Pragma': 'no-cache',
      'Expires': '0'
    });
    return {headers: headers};
  }

}
