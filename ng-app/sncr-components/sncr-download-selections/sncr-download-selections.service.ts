import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class SncrDownloadSelectionsService {

  constructor(private http: HttpClient) {

  }

  persistSelection(lazyParams: {}): Promise<any> {
    return this.http.post(`/buyflow/rest/flowselections/sec/preprocess?t=${new Date().getTime()}`, lazyParams)
      .toPromise();
  }


  getSelectCount(configId): Promise<any> {
    return this.http.get(`/buyflow/rest/table/custom/selectcount/${configId}?t=${new Date().getTime()}`)
      .toPromise();
  }

  setViewOptKeyToSession(lazyParams: {}): Promise<any> {
    return this.http.post(`/buyflow/rest/exportfile/viewoptkey?t=${new Date().getTime()}`, lazyParams)
      .toPromise();
  }
}