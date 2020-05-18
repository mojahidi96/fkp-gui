import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class RolesService {

  constructor(private http: HttpClient) {
  }

  getUserRole(): Promise<any> {
    let enterPriseUserRole = 'Enterprise Partner';
    return this.http.get('/buyflow/rest/orderflow/userrole/' + enterPriseUserRole + '?t=' + new Date().getTime())
      .toPromise();
  }

}