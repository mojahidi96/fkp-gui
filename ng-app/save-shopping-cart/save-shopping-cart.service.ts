import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';


@Injectable()
export class SaveShoppingCartService {

  private readonly headers = {
    'Cache-Control': 'no-cache,no-store, must-revalidate',
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'Pragma': 'no-cache',
    'Expires': '0'
  };


  constructor(private http: HttpClient) {

  }

  isCartNameExist(requestObj: any): Observable<any> {
    return this.http.post(`/buyflow/rest/psc/sec/cartexist?t=${new Date().getTime()}`, requestObj,
      {headers: this.headers});
  }
}