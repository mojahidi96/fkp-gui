import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable()
export class OrderApprovalsService {
  id: string;

  constructor(private http: HttpClient) {

  }

  getOrderHeader(transactionId): Observable<any[]> {
    return this.http.get<any[]>('/buyflow/rest/orderhistory/' + transactionId + '/orderdetails?t=' + new Date().getTime());
  }

  getAdminAndSubComments(transactionId): Observable<any[]> {
    return this.http.get<any[]>('/buyflow/rest/orderhistory/' + transactionId + '/adminandsubcomments?t=' + new Date().getTime());
  }

  updateApprovalOrder(orderList): Promise<any> {
    const headers = new HttpHeaders({'Content-Type': 'application/json'});
    return this.http.post('/portal/rest/orderapprovals/sec/updateapprovalorder?t=' + new Date().getTime(), orderList, {headers})
      .toPromise()
      .catch(this.handleError);
  }

  private handleError(error: any) {
    let errMsg: string;
    errMsg = 'Failed to process requeust';
    return Promise.reject(errMsg);
  }
}
