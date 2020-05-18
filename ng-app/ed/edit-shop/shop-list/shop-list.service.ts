import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable()
export class ShopListService {

  constructor(private http: HttpClient) {}

  getShopList(): Observable<any> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.get('/ed/rest/edshop/shoplist' + '?t=' + new Date().getTime(), {headers});
  }
}