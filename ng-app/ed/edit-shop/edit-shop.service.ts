import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';
import {EdBillingAccPanel, EdCustomerPanel, EdShop} from '../common/ed-shop';

@Injectable()
export class EditShopService {

  constructor(private http: HttpClient) {
  }

  getShopSetup(edShop: EdShop, url: any): Observable<EdShop> {
    return this.http.post<EdShop>(url + '?t=' + new Date().getTime(), edShop, this.getRequestOptions());
  }

  getCustomerPanelData(edShop: EdShop, url: any): Observable<EdCustomerPanel> {
    return this.http.post<EdCustomerPanel>(url + '?t=' + new Date().getTime(), edShop, this.getRequestOptions());
  }

  getCustomersShopCount(edShop): Observable<any> {
    return this.http.post('/ed/rest/edshop/getcustomershopcount' + '?t=' + new Date().getTime(), edShop, this.getRequestOptions());
  }

  getBillingPanelData(edShop: EdShop, url: any): Observable<EdBillingAccPanel> {
    return this.http.post<EdBillingAccPanel>(url + '?t=' + new Date().getTime(), edShop, this.getRequestOptions());
  }

  getProductData(edData: any, url: any): Observable<any> {
    return this.http.post(url + '?t=' + new Date().getTime(), edData, this.getRequestOptions());
  }

  savePanelData(edShop: EdShop, url: string): Observable<any> {
    return this.http.post(url + '?t=' + new Date().getTime(), edShop, this.getRequestOptions());
  }

  saveProductData(edDetails: any, url: string): Observable<any> {
    return this.http.post(url + '?t=' + new Date().getTime(), edDetails, this.getRequestOptions());
  }

  getCustBillingCount(edShop: EdShop): Observable<any> {
    return this.http.post('/ed/rest/edshop/productsflag' + '?t=' + new Date().getTime(), edShop, this.getRequestOptions());
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