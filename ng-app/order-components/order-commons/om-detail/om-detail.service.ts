import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/index';
import {Address} from '../../../flow-sections/address-selection/create-edit-address/address';
import {DebitorAddress} from '../../../flow-sections/debitor-selection/debitor-address';

@Injectable()
export class OmDetailService {

  constructor(private http: HttpClient) {

  }

  getOrder(id: string): Observable<any> {
    return this.http.get<any>('/portal/rest/om/' + id + '/orderdetails?t=' + new Date().getTime());
  }

  getKIASDetails(id: string): Observable<any> {
    return this.http.get<any>('/portal/rest/kias/universalResponse/' + id + '?t=' + new Date().getTime());
  }

  getSystemHistory(): Observable<any> {
    return this.http.get<any>('/portal/rest/om/systemhist?t=' + new Date().getTime());
  }

  getOMComments(url: string): Observable<any> {
    return this.http.get<any>('/portal/rest/om/' + url + '?t=' + new Date().getTime());
  }

  saveOMComments(url: string, comments: string): Observable<any> {
    return this.http.post(`/portal/rest/om/sec/` + url + `?t=${new Date().getTime()}`, comments);
  }

  updateVoId(voidNumber: string): Observable<any> {
    return this.http.post(`/portal/rest/om/sec/updatevoid?t=${new Date().getTime()}`, voidNumber);
  }

  getBillingAddress(): Observable<any> {
    return this.http.get<any>(`/portal/rest/om/billaddr?t=${new Date().getTime()}`);
  }

  getShippingAddress(): Observable<any> {
    return this.http.get<any>(`/portal/rest/om/shipaddr?t=${new Date().getTime()}`);
  }

  getDeliveryCountries(): Observable<any> {
    return this.http.get(`/buyflow/rest/gen/deliverycountries?t=${new Date().getTime()}`);
  }

  saveAddress(address: Partial<Address>): Observable<any> {
    return this.http.post(`/portal/rest/om/sec/saveaddr?t=${new Date().getTime()}`, address);
  }

  getCpdNumbers(): Observable<any> {
    return this.http.get<any>(`/portal/rest/om/cpdnumber?t=${new Date().getTime()}`);
  }

  saveCpdNumber(cpdNumber: string): Observable<any> {
    return this.http.get<any>(`/portal/rest/om/` + cpdNumber + `/savecpdnumber?t=${new Date().getTime()}`);
  }

  saveDebitorNumber(debitorAddress: DebitorAddress): Observable<any> {
    return this.http.post(`/portal/rest/om/sec/savedebitor?t=${new Date().getTime()}`, debitorAddress);
  }

  deleteCpdNumber(cpdNumber: string): Observable<any> {
    return this.http.post(`/portal/rest/om/sec/deletecpdnum?t=${new Date().getTime()}`, cpdNumber);
  }

  getAvailableTabs(): Observable<any> {
    return this.http.get<any>(`/portal/rest/bulkProlong/available?t=${new Date().getTime()}`)
  }

  loadKIASTabDetails(category: string): Observable<any> {
    return this.http.get<any>(`/portal/rest/bulkProlong/paneldata/` + category + `?t=${new Date().getTime()}`)
  }

  isDebitorEditable(): Observable<any> {
    return this.http.get<any>(`/portal/rest/bulkProlong/debitoreditable?t=${new Date().getTime()}`)
  }

  isDebitorNumberValid(debitorNumber: string): Observable<any> {
    return this.http.get('/portal/rest/om/' + `${debitorNumber}/exist?t=${new Date().getTime()}`);
  }
}
