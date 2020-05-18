import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class MSISDNResolverService {

  constructor(private http: HttpClient) {
  }

  getMsisdnForShop(ban): Promise<any> {
    return this.http.get(`/buyflow/rest/flowselections/getShopMsisdn/${ban}?t=${new Date().getTime()}`)
      .toPromise();
  }
}
