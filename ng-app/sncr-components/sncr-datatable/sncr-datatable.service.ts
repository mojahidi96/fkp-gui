import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class SncrDatatableService {

  static areDirtyFormsInvalid(rowsForm) {
    return rowsForm && rowsForm.controls['rows']['controls'].filter(form => form.dirty).some(form => form.invalid);
  }

  constructor(private http: HttpClient) {

  }

  getColumns$(url: string, lazyParams: any): Observable<any> {
    return this.http.get(`${url}/columns/${lazyParams.configId}?t=${new Date().getTime()}`);
  }

  getData(url: string, lazyParams: any, selections: any): Promise<any> {
    return this.http.post(url + '/data?t=' + new Date().getTime(),
      Object.assign({}, lazyParams, {selections: selections}))
      .toPromise();
  }

  getData$({url, lazyParams, selections}: any): Observable<any> {
    return this.http.post(url + '/data?t=' + new Date().getTime(),
      Object.assign({}, lazyParams, {selections: selections}));
  }

  getCount(url: string, lazyParams: any): Promise<any> {
    return this.http.post(url + '/count?t=' + new Date().getTime(), lazyParams)
      .toPromise();
  }

  getCount$({url, lazyParams}: any): Observable<number> {
    return this.http.post<number>(url + '/count?t=' + new Date().getTime(), lazyParams);
  }

  getSelectCount(url: string, lazyParams: any): Promise<any> {
    return this.getSelectCount$({url, lazyParams}).toPromise();
  }

  getSelectCount$({url, lazyParams}: any): Observable<number> {
    return this.http.get<number>(url + `/selectcount/${lazyParams['configId']}?t=` + new Date().getTime());
  }

  getmaxSelectCount(url, maxSelectKey): Promise<any> {
      return this.http.get(url + `/maxselectcount/` + maxSelectKey + `?t=` + new Date().getTime()).toPromise();
  }

  // http API call to select all or deselect all on server side
  updateOnSelectDeselectAll(lazyParams: {}): Observable<any> {
    return this.http.post(`/buyflow/rest/flowselections/sec/updateOnSelectDeselectAll?t=${new Date().getTime()}`, lazyParams);
  }

  persistSelections(lazyParams: {}): Observable<any> {
    return this.http.post(`/buyflow/rest/flowselections/sec/preprocess?t=${new Date().getTime()}`, lazyParams);
  }
}
