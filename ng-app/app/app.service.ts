import {EventEmitter, Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class AppService {

  translationsLoading = new EventEmitter<boolean>();

  constructor(private http: HttpClient) {
  }

  getIsHideTariffApplicable(localeParam): Observable<any> {
    return this.http.get(`/buyflow/rest/orderflow/ctFlow/hidetariff?locale=${localeParam}&t=${new Date().getTime()}`);
  }
}