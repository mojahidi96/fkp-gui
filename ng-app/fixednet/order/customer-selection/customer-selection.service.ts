import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable()
export class CustomerSelectionService {


  constructor(private http: HttpClient) {

  }

  getCustomersOnLandingPage(): Promise<any> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.get('/fixedline/rest/fnshop/customers' + '?t=' + new Date().getTime(), {headers})
      .toPromise()
      .catch(this.handleError);
  }

  private handleError(error: any) {
    let errMsg: string;
    errMsg = 'Failed to process requeust';
    return Promise.reject(errMsg);
  }

}
