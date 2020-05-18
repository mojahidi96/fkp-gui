import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable()
export class DataReportShopService {

  private headers: HttpHeaders;

  constructor(private http: HttpClient) {
    this.headers = new HttpHeaders({'Content-Type': 'application/json'}); // ... Set content type to JSON
  }

  getUserShopsList(): Promise<any[]> {
    return this.http.get<any[]>('/rest/shopsubset/listusershops?t=' + (new Date()).getTime(),
      {headers: this.headers})
      .toPromise();
  }
}