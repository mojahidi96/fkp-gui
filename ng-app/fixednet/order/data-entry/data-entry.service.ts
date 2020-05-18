import {Injectable} from '@angular/core';
import {OrderService} from '../order.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable()
export class DataEntryService {

  constructor(private http: HttpClient, private orderService: OrderService) {
  }

  submitOrder() {
    let order = this.orderService.getFnorderRequest();
    order.items = order.items.map(item => {
      item.detail = item.detail.map(detail => {
        detail.panelFields = detail.panelFields.map(field => {
          const splitId = field.fieldId.split('-');
          if (splitId.length) {
            field.fieldId = splitId[splitId.length - 1];
          }
          return field;
        });
        return detail;
      });
      return item;
    });

    return this.http.post(`/fixedline/rest/productOrder/${order.customerNumber}/order`, order)
      .toPromise();
  }

  getPanelsByProduct(product): Promise<any> {
    const order = this.orderService.getFnorderRequest();
    return this.http.get(`/fixedline/rest/productOrder/${order.customerNumber}/${product}/panels`)
      .toPromise();
  }

  getBillingDetails(): Promise<any> {
    const order = this.orderService.getFnorderRequest();
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.get(`/fixedline/rest/productOrder/${order.customerNumber}/getBillingDetails` + '?t=' + new Date().getTime(), {headers})
      .toPromise()
      .catch(this.handleError);
  }

  private handleError(error: any) {
    let errMsg: string;
    errMsg = 'Failed to process requeust';
    return Promise.reject(errMsg);
  }

}
