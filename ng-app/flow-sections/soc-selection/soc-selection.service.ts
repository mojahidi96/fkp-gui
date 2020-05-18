import {Injectable} from '@angular/core';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {AvailableSocs} from '../../management-soc/classes/dtos/available-socs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable, of} from 'rxjs';

@Injectable()
export class SocSelectionService {
  private headers: HttpHeaders;

  constructor(private http: HttpClient) {
    this.headers = new HttpHeaders({'Content-Type': 'application/json'});
  }

  getBillCycleBySelectedBans(availableSocRequest): Observable<NgbDateStruct> {
    return this.http.post<NgbDateStruct>('/buyflow/rest/socmanagement/billcycles?t=' + new Date().getTime(), availableSocRequest,
      {headers: this.headers});
  }

  getAvailableSocs(availableSocRequest): Observable<AvailableSocs> {
    return this.http.post<AvailableSocs>('/buyflow/rest/socs/available?t=' + new Date().getTime(), availableSocRequest,
      {headers: this.headers});
  }

  getBundleValues(): Promise<any[]> {
    return this.http.get<any[]>('/buyflow/rest/socmanagement/bundleValues?t=' + new Date().getTime(),
      {headers: this.headers})
      .toPromise();
  }

  getSubscriberCount(): Observable<number> {
    return this.http.get<number>(`/buyflow/rest/socs/count?t=` + new Date().getTime());
  }

  preprocess(socs: any[]): Observable<any> {
    return this.http.post(`/buyflow/rest/socs/sec/save?t=${new Date().getTime()}`, socs,
      {headers: this.headers});
  }
}
