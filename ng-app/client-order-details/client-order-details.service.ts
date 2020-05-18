import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable()
export class ClientOrderDetailsService {

  private headers: HttpHeaders;

  constructor(private http: HttpClient) {
    this.headers = new HttpHeaders({'Content-Type': 'application/json'}); // ... Set content type to JSON
  }

  getVoids(): Promise<any[]> {
    return this.http.get<any[]>('/buyflow/rest/user/voids?t=' + new Date().getTime(), {headers: this.headers})
      .toPromise();
  }

  addVoid(voidNumber): Promise<any> {
    return this.http.post('/buyflow/rest/user/sec/voids?t=' + new Date().getTime(), voidNumber, {headers: this.headers})
      .toPromise();
  }

  deleteVoid(voidNumber): Promise<any> {
    return this.http.delete('/buyflow/rest/user/sec/voids/' + voidNumber, {headers: this.headers})
      .toPromise();
  }


  getUserRole(): Observable<any> {
    let enterPriseUserRole = 'Enterprise Partner';
    return this.http.get('/buyflow/rest/orderflow/userrole/' + enterPriseUserRole + '?t=' + new Date().getTime(), {headers: this.headers});
  }
}
