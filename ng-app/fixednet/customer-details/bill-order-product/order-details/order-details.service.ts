import {Injectable} from '@angular/core';
import {FixedNetService} from '../../../fixednet.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable()
export class OrderDetailsService {

  constructor(private http: HttpClient, private fixedNetService: FixedNetService) {
  }

  getFnData(fnData: any, url: any): Promise<any> {
    return this.http.post(url + '?t=' + new Date().getTime(), fnData, this.getRequestOptions())
      .toPromise()
      .catch(this.fixedNetService.handleError);
  }


  getCustomerMessage(fnData: any) {
    return this.http.post(`/fixedline/rest/fnshop/sec/order/customermessage?t=${new Date().getTime()}`, fnData, this.getRequestOptions());
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