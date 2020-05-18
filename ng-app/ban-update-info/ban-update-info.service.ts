import {Injectable} from '@angular/core';
import {Observable, Subject} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable()
export class BanUpdateInfoService {

  private headers: HttpHeaders;
  private payFieldsProgress = new Subject();
  private payFieldsFocused = new Subject();

  constructor(private http: HttpClient) {
    this.headers = new HttpHeaders({'Content-Type': 'application/json'}); // ... Set content type to JSON
  }


  persistEditedData(editData: any[], bulkEdit: boolean): Promise<any> {
    return this.http.post(`/buyflow/rest/flowselections/sec/preprocess?t=${new Date().getTime()}`,
      {'configId': '5c60e182-4a75-511c-e053-1405100af36g', editData: editData, bulkEdit: bulkEdit})
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

  persistBansForUpdate(lazyParams: {}): Promise<any> {
    return this.http.post(`/buyflow/rest/flowselections/sec/preprocess?t=${new Date().getTime()}`, lazyParams)
      .toPromise();
  }

  processUpdateBanOrder(orderDetails): Promise<any> {
    return this.http.post('/buyflow/rest/order/sec/submit?t=' + new Date().getTime(), orderDetails,
      {headers: this.headers})
      .toPromise();
  }

  uploadSelections(obj: any): Promise<any> {
    return this.http.post('/buyflow/rest/fileimport/excelselections?t=' + new Date().getTime(),
      obj, {headers: this.headers})
      .toPromise();
  }

  validatePaymentFields(request: any): Observable<any> {
    return this.http.post(`/buyflow/rest/gen/payfieldsvalidate?t=${new Date().getTime()}`,
      Object.assign({}, request));
  }

  sendPayFieldsValidationInProgress(payFieldsValidation) {
    this.payFieldsProgress.next(payFieldsValidation);
  }

  getPayFieldsValidationInProgress(): Observable<any> {
    return this.payFieldsProgress.asObservable();
  }

  sendPayFieldsFocussed(payFieldsValidation) {
    this.payFieldsFocused.next(payFieldsValidation);
  }

  getPayFieldsFocussed(): Observable<any> {
    return this.payFieldsFocused.asObservable();
  }
}
