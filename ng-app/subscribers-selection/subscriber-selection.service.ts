import {Injectable} from '@angular/core';
import {SubscriberType} from './subscriber-selection';
import {UtilsService} from '../sncr-components/sncr-commons/utils.service';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable()
export class SubscriberSelectionService {

  constructor(private http: HttpClient) {

  }

  getDynamicColumn(orderType: string): Promise<SubscriberType[]> {
    return this.http.get<SubscriberType[]>('/buyflow/rest/orderflow/' + orderType + '/dynamiccolumns?t=' + new Date().getTime())
      .toPromise();
  }


  getData(orderType: string): Promise<any[]> {
    return this.http.get<any[]>('/buyflow/rest/orderflow/' + orderType + '/data?t=' + new Date().getTime())
      .toPromise();
  }

  persistSubscribersForUpdate(lazyParams: {}): Promise<any> {
    return this.http.post(`/buyflow/rest/flowselections/sec/preprocess?t=${new Date().getTime()}`, lazyParams)
      .toPromise();
  }


  getSelectCount(configId): Promise<any> {
    return this.http.get(`/buyflow/rest/table/custom/selectcount/${configId}?t=${new Date().getTime()}`)
      .toPromise();
  }

  getCDACategory():  Observable<any> {
    return this.http.get(`/buyflow/rest/socs/cdacategory?t=${new Date().getTime()}`);
  }

  customSortForBan(a, b, event) {
    let banA = a['1'] instanceof String ? Number.parseInt(a['1'].toString(), 10) : a['1'];
    let banB = b['1'] instanceof String ? Number.parseInt(b['1'].toString(), 10) : b['1'];
    if (UtilsService.notNull(a['2'])) {
      let subA = a['2'] instanceof String ? Number.parseInt(a['2'].toString(), 10) : a['2'];
      let subB = b['2'] instanceof String ? Number.parseInt(b['2'].toString(), 10) : b['2'];
      return (banA - banB + subA - subB) * event.order;
    } else {
      return (banA - banB) * event.order;
    }
  }

}
