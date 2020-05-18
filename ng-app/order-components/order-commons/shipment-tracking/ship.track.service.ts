import {Observable} from 'rxjs/index';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';

@Injectable()
export class ShipTrackService {

  constructor(private http: HttpClient) { }

  getTrackingDetails(): Observable<any> {
    return this.http.get<any>('/buyflow/rest/orderhistory/tracker?t=' + new Date().getTime());
  }
}