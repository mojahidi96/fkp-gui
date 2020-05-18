import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable()
export class ShopListService {

  constructor(private http: HttpClient) {

  }

  getShopList(): Promise<any> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.get('/portal/rest/shop/fn/shoplist' + '?t=' + new Date().getTime(), {headers})
      .toPromise()
      .catch(this.handleError);
  }

  private handleError(error: any) {
    let errMsg: string;
    errMsg = 'Shop konnte nicht gespeichert werden.';
    return Promise.reject(errMsg);
  }
}
