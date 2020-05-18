import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable()
export class MaintainSocService {

  private headers: HttpHeaders;

  constructor(private http: HttpClient) {
    this.headers = new HttpHeaders({'Content-Type': 'application/json'}); // ... Set content type to JSON
  }

  submitMaintainSocOrder(maintainSocOrder): Promise<number> {
    return this.http.post<number>('/buyflow/rest/orderflow/sec/submitorder?t=' + new Date().getTime(), maintainSocOrder,
      {headers: this.headers})
      .toPromise();
  }
}
