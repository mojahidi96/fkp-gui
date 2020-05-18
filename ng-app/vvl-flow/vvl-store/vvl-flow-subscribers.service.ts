import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable()
export class VvlFlowSubscribersService {

  constructor(private http: HttpClient) {

  }

  getEligibleSubscribers(selectedTariff: string): Promise<number> {
    return Promise.resolve(2);
  }

  getOrdersDetails(orderDetails): Observable<any> {
    return this.http.post('/buyflow/rest/order/sec/submit?t=' + new Date().getTime(), orderDetails);
  }
}
