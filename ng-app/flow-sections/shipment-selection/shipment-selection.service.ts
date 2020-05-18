import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';
import {AddressDetails} from '../address-selection/address';


@Injectable()
export class ShipmentSelectionService {

  private headers: any;

  constructor(private http: HttpClient) {
    this.headers = {'Content-Type': 'application/json'}; // ... Set content type to JSON
  }

  getAvailableAddressList(): Observable<any> {
    return this.http.get(`/buyflow/rest/shipment/available?t=${new Date().getTime()}`);
  }

  saveAddress(addressDetails): Observable<any> {
    return this.http.post(`/buyflow/rest/shipment/sec/savecart?t=${new Date().getTime()}`,
      addressDetails, {headers: this.headers});
  }

  updateAddress(addressDetails: AddressDetails): Observable<any> {
    return this.http.post(`/buyflow/rest/shipment/sec/save?t=${new Date().getTime()}`,
      addressDetails.selectedAddress, {headers: this.headers});
  }

  deleteAddress(addressDetails) {
    let addressId = addressDetails.addressId;
    let URL = `/buyflow/rest/shipment/sec/${addressId}/delete?t=${new Date().getTime()}`;
    return this.http.delete(URL, {headers: this.headers});
  }

  getDeliveryCountries(): Observable<any> {
    return this.http.get(`/buyflow/rest/gen/deliverycountries?t=${new Date().getTime()}`);
  }

  defaultAddress(addressDetails, makeDebitorDefault: boolean) {
    let url = `/buyflow/rest/shipment/sec/${addressDetails.addressId}/${makeDebitorDefault}/default?t=${new Date().getTime()}`;
    return this.http.post(url, addressDetails.selectedAddress, {headers: this.headers});
  }
}
