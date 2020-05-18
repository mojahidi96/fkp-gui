import {Injectable} from '@angular/core';
import {FixedNetService} from '../../fixednet.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable()
export class BillOrdProdService {

  productData: any;

  constructor(private http: HttpClient, private fixedNetService: FixedNetService) {
  }

  getFnData(fnData: any, url: any): Promise<any> {
    let headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.post(url + '?t=' + new Date().getTime(), fnData, {headers: headers})
      .toPromise()
      .catch(this.fixedNetService.handleError);
  }

  setProductData(data: any) {
    this.productData = data;
  }

  getProductData(): any {
    return this.productData;
  }
}