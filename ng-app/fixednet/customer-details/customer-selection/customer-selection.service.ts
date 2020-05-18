import {Injectable} from '@angular/core';
import {FixedNetService} from '../../fixednet.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';


@Injectable()
export class CustomerSelctionService {

  constructor(private http: HttpClient, private fixedNetService: FixedNetService) {
  }

  getCustomersOnLandingPage(shopId: string): Promise<any> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    const url = shopId ? `/fixedline/rest/fnshop/${shopId}/customers` :
      `/fixedline/rest/fnshop/customers?t=${new Date().getTime()}`;

    return this.http.get(url, {headers: headers}).toPromise()
      .catch(this.fixedNetService.handleError);
  }
}