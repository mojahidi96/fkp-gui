import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable()
export class ManageItemizedService {
  private headers: HttpHeaders;

  constructor(private http: HttpClient) {
    this.headers = new HttpHeaders({'Content-Type': 'application/json'}); // ... Set content type to JSON
  }

  getManageItemizedData(): Observable<any> {
    return this.http.get('/buyflow/rest/flowselections/changebillparam/managedata?t=' + new Date().getTime(),
      {headers: this.headers});
  }

  persistManageItemizedData(editedRows): Observable<any> {
    let requestObj = Object.assign({}, {editData: editedRows});
    return this.http.post('/buyflow/rest/flowselections/sec/changebillparam/preprocess?t=' + new Date().getTime(), requestObj,
      {headers: this.headers});
  }

  getCountForAffectedSubscribers(configId): Observable<any> {
    let requestObj = Object.assign({}, {'configId': configId});
    return this.http.post('/buyflow/rest/table/custom/count?t=' + new Date().getTime(), requestObj,
      {headers: this.headers});
  }
}