import {Injectable} from '@angular/core';
import {FnBillingAccPanel, FnCustomerPanel, FnShop} from '../common/fn-shop';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable()
export class EditShopService {

  constructor(private http: HttpClient) {
  }

  saveData(fnDetails: any, url: string): Promise<any> {
    return this.http.post(url + '?t=' + new Date().getTime(), fnDetails, this.getRequestOptions())
      .toPromise()
      .catch(this.handleError);
  }


  getFnData(fnData: any, url: any): Promise<any> {
    return this.http.post(url + '?t=' + new Date().getTime(), fnData, this.getRequestOptions())
      .toPromise()
      .catch(this.handleError);
  }

  getShopSetup(fnShop: FnShop, url: any): Observable<FnShop> {
    return this.http.post<FnShop>(url + '?t=' + new Date().getTime(), fnShop, this.getRequestOptions());
  }


  getCustomerPanelData(fnData: FnShop, url: any): Observable<FnCustomerPanel> {
    return this.http.post<FnCustomerPanel>(url + '?t=' + new Date().getTime(), fnData, this.getRequestOptions());
  }

  getCustomersShopCount(fnShop): Observable<any> {
    return this.http.post('/portal/rest/shop/fn/getcustomershopcount' + '?t=' + new Date().getTime(), fnShop, this.getRequestOptions());
  }

  getBillingPanelData(fnData: FnShop, url: any): Observable<FnBillingAccPanel> {
    return this.http.post<FnBillingAccPanel>(url + '?t=' + new Date().getTime(), fnData, this.getRequestOptions());
  }

  savePanelData(fnShop: FnShop, url: string): Promise<any> {
    return this.http.post(url + '?t=' + new Date().getTime(), fnShop, this.getRequestOptions())
      .toPromise()
      .catch(this.handleError);
  }

  private handleError(error: any) {
    let errMsg: string;
    errMsg = 'Shop konnte nicht gespeichert werden.';
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
