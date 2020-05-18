import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class DataSelectionService {

  constructor(private http: HttpClient) {
  }

  getColumns(configId: string): Promise<any[]> {
    return this.http.get<any[]>(`/buyflow/rest/table/custom/columns/${configId}?t=` + new Date().getTime())
      .toPromise();
  }

  clearShoppingCart(): Promise<any> {
    return this.http.get(`/buyflow/rest/table/custom/removesession?t=` + new Date().getTime())
      .toPromise();
  }


  getData(url: string, lazyParams: {}): Promise<any[]> {
    return this.http.post<any[]>(url + '/data?t=' + new Date().getTime(), lazyParams)
      .toPromise();
  }

  getCount(url: string, lazyParams: {}): Promise<any> {
    return this.http.post(url + '/data?t=' + new Date().getTime(), lazyParams)
      .toPromise();
  }

}