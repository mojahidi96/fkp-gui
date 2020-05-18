import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {AddressDetails} from '../address-selection/address';


@Injectable()
export class DebitorSelectionService {

  private headers: any;

  constructor(private http: HttpClient) {
    this.headers = {'Content-Type': 'application/json'}; // ... Set content type to JSON
  }

  getAvailableAddressList(url: string): Observable<any> {
    return this.http.get(url + `?t=${new Date().getTime()}`);
  }

  getAvailableShipmetList(): Observable<any> {
    return this.http.get(`/buyflow/rest/shipment/available?t=${new Date().getTime()}`);
  }

  saveAddress(addressDetails: AddressDetails): Observable<any> {
    return this.http.post(`/buyflow/rest/debitor/sec/save?t=${new Date().getTime()}`,
      addressDetails.selectedAddress, {headers: this.headers});
  }

  deleteShipmentAddress(addressDetails) {
    let addressId = addressDetails.addressId;
    let URL = `/buyflow/rest/shipment/sec/${addressId}/delete?t=${new Date().getTime()}`;
    return this.http.delete(URL, {headers: this.headers});
  }

  defaultAddress(addressDetails, makeDebitorDefault: boolean) {
    let url =
      `/buyflow/rest/debitor/sec/${addressDetails.debitorId}/${makeDebitorDefault}/default?t=${new Date().getTime()}`;
    return this.http.post(url, addressDetails.selectedAddress, {headers: this.headers});
  }

  getDeliveryCountries(): Observable<any> {
    return this.http.get(`/buyflow/rest/gen/deliverycountries?t=${new Date().getTime()}`);
  }

  updateAddress(addressDetails): Observable<any> {
    return this.http.post(`/buyflow/rest/shipment/sec/save?t=${new Date().getTime()}`,
      addressDetails, {headers: this.headers});
  }

}
