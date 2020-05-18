import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable()
export class EsimShopListService {
  private headers: HttpHeaders;

  constructor(private http: HttpClient) {
    this.headers = new HttpHeaders({'Content-Type': 'application/json'}); // ... Set content type to JSON
  }

  getShops(): Observable<any> {
    return this.http.get('/rest/shopsubset/listusershops?t=' + new Date().getTime(), {headers: this.headers});
  }
}