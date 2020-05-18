import {Injectable} from '@angular/core';
import {AvailableSocs} from '../management-soc/classes/dtos/available-socs';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable()
export class SocManagementService {
  private headers: HttpHeaders;

  constructor(private http: HttpClient) {
    this.headers = new HttpHeaders({'Content-Type': 'application/json'});
  }

  getSocData(): Promise<AvailableSocs> {
    return this.http.post<AvailableSocs>('/buyflow/rest/socmanagement/availablesoc?t=' + new Date().getTime(), {},
      {headers: this.headers})
      .toPromise();
  }

  nextPage(setAvailableSocs): Promise<string> {
    return this.http.post<string>('/buyflow/rest/socmanagement/sec/setavailablesoc?t=' + new Date().getTime(), setAvailableSocs,
      {headers: this.headers})
      .toPromise();
  }

  getBillCycleBySelectedBans(availableSocRequest): Promise<NgbDateStruct> {
    return this.http.post<NgbDateStruct>('/buyflow/rest/socmanagement/billcycles?t=' + new Date().getTime(), availableSocRequest,
      {headers: this.headers})
      .toPromise();
  }

}