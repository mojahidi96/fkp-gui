import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable()
export class OrderSubmitService {

  private headers: HttpHeaders;

  constructor(private http: HttpClient) {

  }


  getPanelsData(): Observable<any> {
    return this.http.get(`/ed/rest/om/panels?t=${new Date().getTime()}`, {headers: this.headers});
  }

  submitPanelFormData(panelFormData: any) {
    return this.http.post(`/ed/rest/om/submit?t=${new Date().getTime()}`, panelFormData, {headers: this.headers});
  }
}


