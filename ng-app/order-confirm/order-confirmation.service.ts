import {Injectable} from '@angular/core';
import {OrderType} from './order-confirm';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable()
export class OrderConfirmationService {

  constructor(private http: HttpClient) {

  }

  downloadPdf(orderNumber, orderType): Observable<any> {
    return this.http.get('/buyflow/rest/orderflow/' + orderNumber + '/' + OrderType[orderType] + '/pdf?t=' + new Date().getTime(),
      {responseType: 'arraybuffer'});
  }
}
