import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';


@Injectable()
export class ShoppingCartService {
  private readonly headers: HttpHeaders;

  constructor(private http: HttpClient) {
    this.headers = new HttpHeaders({'Content-Type': 'application/json'});
  }

  getCartCount(): Promise<number> {
    return this.http.get<number>(`/buyflow/rest/psc/count?t=${new Date().getTime()}`)
      .toPromise();
  }

  getShoppingCartDetails(): Promise<any> {
    return this.http.get(`/buyflow/rest/psc/listcarts?t=${new Date().getTime()}`)
      .toPromise();
  }

  deleteCartFromList(shoppingCartId): Observable<any> {
    return this.http.post('/buyflow/rest/psc/sec/delete?t=' + new Date().getTime(),
      shoppingCartId, {headers: this.headers});
  }

  getNoOfSubscribers(cartId): Promise<number> {
    return this.http.get<number>(`/buyflow/rest/psc/${cartId}/subscount?t=${new Date().getTime()}`)
      .toPromise();
  }

  createCart(orderDetails): Observable<any> {
    return this.http.post('/buyflow/rest/psc/sec/create?t=' + new Date().getTime(), orderDetails,
      {headers: this.headers});
  }

  updateCart(orderDetails): Observable<any> {
    return this.http.post('/buyflow/rest/psc/sec/modify?t=' + new Date().getTime(), orderDetails,
      {headers: this.headers});
  }

  getAccess(shoppingCartId: string): Observable<any> {
    return this.http.get(`/buyflow/rest/psc/${shoppingCartId}/access?t=${new Date().getTime()}`);
  }

  setSessionCart(): Promise<any> {
    return this.http.get(`/buyflow/rest/psc/setsession?t=${new Date().getTime()}`)
      .toPromise();
  }

  // ToDo please remove this service once the maintain soc is implemented with lazy load
  getSelectedSubscribers(): Promise<any> {
    return this.http.get(`/buyflow/rest/psc/subscribers?t=${new Date().getTime()}`)
      .toPromise();
  }

  isCartLocked(shoppingCartId: string): Observable<any> {
    return this.http.get(`/buyflow/rest/psc/${shoppingCartId}/locked?t=` + new Date().getTime());
  }

  getSubscriberCount(cartId): Observable<any> {
    return this.http.get<number>(`/buyflow/rest/psc/${cartId}/subscount?t=${new Date().getTime()}`);
  }

  getCDACategory():  Promise<any> {
    return this.http.get(`/buyflow/rest/socs/cdacategory?t=${new Date().getTime()}`).toPromise();
  }
  updateActSubsPreQuery(simType): Observable<any> {
    return this.http.get(`/buyflow/rest/subs/updatePreQuery/${simType}?t=${new Date().getTime()}`);
  }
}