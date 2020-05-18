import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';


@Injectable()
export class DeleteShoppingCartService {

  constructor(private http: HttpClient) {

  }

  deleteCartFromList(shoppingCartId): Observable<any> {
    return this.http.post('/buyflow/rest/psc/sec/delete?t=' + new Date().getTime(), shoppingCartId,
      {headers: {'Content-Type': 'application/json'}});
  }
}