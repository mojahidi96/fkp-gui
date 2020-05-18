/**
 * Created by bhav0001 on 06-Jul-17.
 */
import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable()
export class OrderApprovalsService {
  private readonly headers: HttpHeaders;

  constructor(private http: HttpClient) {
    this.headers = new HttpHeaders({'Content-Type': 'application/json'});
  }

  getapprovalslist(flowType): Promise<any> {
    return this.http.get('/portal/rest/orderapprovals/' + flowType + '/getapprovalslist?t=' + new Date().getTime())
      .toPromise()
      .catch(this.handleError);
  }

  updateApprovalOrder(orderList): Observable<any> {
    return this.http.post('/portal/rest/orderapprovals/sec/updateapprovalorder?t=' + new Date().getTime(),
      orderList, {headers: this.headers});
  }

  private handleError(error: any) {
    let errMsg: string;
    errMsg = 'Failed to process requeust' + error;
    return Promise.reject(errMsg);
  }

}
