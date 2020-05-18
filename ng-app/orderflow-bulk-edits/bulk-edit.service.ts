import {Injectable} from '@angular/core';
import {BulkEditRequest} from './bulk-edit.config';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable()
export class BulkEditService {

  private headers: HttpHeaders;

  constructor(private http: HttpClient) {
    this.headers = new HttpHeaders({'Content-Type': 'application/json'}); // ... Set content type to JSON
  }

  getCountries(): Promise<any> {
    return this.http.get(`/buyflow/rest/gen/countries?t=${new Date().getTime()}`)
      .toPromise();
  }

  persistEditedData(editData: BulkEditRequest[], configId: string): Promise<any> {
    return this.http.post(`/buyflow/rest/flowselections/sec/preprocess?t=${new Date().getTime()}`,
      {'configId': configId, editData: editData, bulkEdit: true})
      .toPromise();
  }

  updateActSubsDetails(data, simType): Observable<any> {
    const actualType = (simType === 'EXISTING_SIM') ? 'Customer_Owned' : 'Portal_Assigned';
    return this.http.post(`/buyflow/rest/subs/sec/save/${actualType}?t=${new Date().getTime()}`, data);
  }

  getSelectCount(configId: string): Promise<any> {
    return this.http.get(`/buyflow/rest/table/custom/selectcount/${configId}?t=${new Date().getTime()}`)
      .toPromise();
  }


  getOldValues(configId: string): Promise<any> {
    return this.http.post(`/buyflow/rest/table/custom/data?t=${new Date().getTime()}`,
      {'configId': configId, first: 0, rows: 10})
      .toPromise();
  }


  getSanitizationPattern(): Promise<any> {
    return this.http.get(`/buyflow/rest/gen/pattern?t=${new Date().getTime()}`)
      .toPromise();
  }


  validatePaymentFields(request: any): Promise<any> {
    return this.http.post(`/buyflow/rest/gen/payfieldsvalidate?t=${new Date().getTime()}`, request)
      .toPromise();
  }

  getShopSpclCond(): Promise<any> {
    return this.http.get(`/buyflow/rest/flowselections/getShopSpclCond?t=${new Date().getTime()}`)
      .toPromise();
  }

  getSubsDetailsPrequery(): Observable<boolean> {
    return this.http.get<any>(`/buyflow/rest/flowselections/getShopSimPreQuery?t=${new Date().getTime()}`);
  }
}
