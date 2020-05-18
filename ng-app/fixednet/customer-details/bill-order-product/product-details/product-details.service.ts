import {Injectable} from '@angular/core';
import {FixedNetService} from '../../../fixednet.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable()
export class ProductDetailsService {

  constructor(private http: HttpClient, private fixedNetService: FixedNetService) {
  }

  getFnData(fnData: any, url: any): Promise<any> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.post(url + '?t=' + new Date().getTime(), fnData, {headers: headers})
      .toPromise()
      .catch(this.fixedNetService.handleError);
  }
}