import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable()
export class ChangeBillingParamService {
  private headers: HttpHeaders;

  constructor(private http: HttpClient) {
    this.headers = new HttpHeaders({'Content-Type': 'application/json'}); // ... Set content type to JSON
  }

  submitOrder(orderDetails): Promise<any> {
    return this.http.post('/buyflow/rest/order/sec/submit?t=' + new Date().getTime(), orderDetails,
      {headers: this.headers})
      .toPromise();
  }
}



