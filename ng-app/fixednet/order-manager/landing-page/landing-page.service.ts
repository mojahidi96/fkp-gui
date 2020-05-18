import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable()
export class LandingPageService {

  private orderManagerSessionData = {cols: []};

  constructor(private http: HttpClient) {

  }

  // http API call to get the default set of orders in error
  getOrdersInError(): Observable<Array<any>> {
    return this.http.get<Array<any>>('/fixedline/rest/orderhistory/searchOrders?t=' + new Date().getTime(), this.getRequestOptions());
  }

  // http API call to get the shop names to be displayed for predictive search
  getSalesProducts(): Observable<Array<any>> {
    return this.http.get<Array<any>>(`/fixedline/rest/ordermanager/salesproducts?t=${new Date().getTime()}`, this.getRequestOptions());
  }


  persistSelections(lazyParams: {}): Observable<any> {
    return this.http.post(`/buyflow/rest/flowselections/sec/preprocess?t=${new Date().getTime()}`, lazyParams, this.getRequestOptions());
  }


  getSelectCount(configId): Observable<any> {
    return this.http.get(`/buyflow/rest/table/custom/selectcount/${configId}?t=${new Date().getTime()}`);
  }

  updateOrders(request: {}): Observable<any> {
    return this.http.put(`/fixedline/rest/ordermanager/sec/updateorders?t=${new Date().getTime()}`, request, this.getRequestOptions());
  }

  updateSessionColumns(cols) {
    this.orderManagerSessionData.cols = cols;
  }


  getRequestOptions() {
    const headers = new HttpHeaders({
      'Cache-Control': 'no-cache,no-store, must-revalidate',
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Pragma': 'no-cache',
      'Expires': '0'
    });
    return {headers};
  }
}