import {Injectable} from '@angular/core';
import {FixedNetService} from '../../fixednet.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable()
export class ShopSelectionService {

  constructor(private http: HttpClient, private fixedNetService: FixedNetService) {

  }

  getShopList(): Promise<any> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.get('/portal/rest/shop/fn/shoplist' + '?t=' + new Date().getTime(), {headers: headers})
      .toPromise()
      .catch(this.fixedNetService.handleError);
  }
}