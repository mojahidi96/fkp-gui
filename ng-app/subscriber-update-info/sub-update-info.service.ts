import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable()
export class SubUpdateInfoService {

  private headers: HttpHeaders;

  constructor(private http: HttpClient) {
    this.headers = new HttpHeaders({'Content-Type': 'application/json'}); // ... Set content type to JSON
  }

  persistEditedData(editData: any[], configId: string, bulkEdit: boolean): Promise<any> {
    return this.http.post(`/buyflow/rest/flowselections/sec/preprocess?t=${new Date().getTime()}`,
      {'configId': configId, editData: editData, bulkEdit: bulkEdit})
      .toPromise();
  }

  processUpdateSubsOrder(orderDetails): Promise<any> {
    return this.http.post('/buyflow/rest/order/sec/submit?t=' + new Date().getTime(), orderDetails,
      {headers: this.headers})
      .toPromise();
  }

  getSelectCount(configId): Promise<any> {
    return this.http.get(`/buyflow/rest/table/custom/selectcount/${configId}?t=${new Date().getTime()}`)
      .toPromise();
  }

  getSanitizationPattern(): Promise<any> {
    return this.http.get(`/buyflow/rest/gen/pattern?t=${new Date().getTime()}`)
      .toPromise();
  }

  getCountries(): Promise<any> {
    return this.http.get(`/buyflow/rest/gen/countries?t=${new Date().getTime()}`)
      .toPromise();
  }

  getColumns(configId: string): Promise<any[]> {
    return this.http.get<any[]>(`/buyflow/rest/table/custom/columns/${configId}?t=` + new Date().getTime())
      .toPromise();
  }

  getSubsDetailsPrequery(): Observable<boolean> {
    return this.http.get<any>(`/buyflow/rest/flowselections/getShopSimPreQuery?t=${new Date().getTime()}`);
  }

  assignAllMsisdn(): Observable<any> {
    return this.http.get(`/buyflow/rest/flowselections/assignAllMsisdn?t=${new Date().getTime()}`);
  }

  updateActSubsDetails(data, simType): Observable<any> {
    const actualType = (simType === 'EXISTING_SIM') ? 'Customer_Owned' : 'Portal_Assigned';
    return this.http.post(`/buyflow/rest/subs/sec/save/${actualType}?t=${new Date().getTime()}`, data);
  }

  updateActSubsPreQuery(simType): Observable<any> {
    return this.http.get(`/buyflow/rest/subs/updatePreQuery/${simType}?t=${new Date().getTime()}`);
  }
}
