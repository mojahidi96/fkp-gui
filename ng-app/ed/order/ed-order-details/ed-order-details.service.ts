/**
 * Created by dsag0002 on 31-Oct-18.
 */

import {Injectable} from '@angular/core';
import {Observable, BehaviorSubject} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {FnUserDetails} from '../../../fixednet/common/fn-user-details';
import {TopBar} from '../../../app/top-bar/top-bar';
import {TimeoutService} from '../../../app/timeout/timeout.service';
import {map} from 'rxjs/operators';
import {DatepickerParserService} from '../../../sncr-components/sncr-controls/datepicker/datepicker-parser.service';
import {UtilsService} from '../../../sncr-components/sncr-commons/utils.service';

@Injectable()
export class EDOrderDetailsService {
  private headers: HttpHeaders;
  private menus: TopBar;
  private fnUser: FnUserDetails;
  private orderDetailData = new BehaviorSubject({transactionId: '', isVodafoneAccountManager: false});
  currentOrderDetailData = this.orderDetailData.asObservable();

  constructor(private http: HttpClient, private timeoutService: TimeoutService, private dateParserService: DatepickerParserService) {
    this.headers = new HttpHeaders({'Content-Type': 'application/json'});
    this.fnUser = new FnUserDetails();
    this.menus = this.timeoutService.topBar;
  }

  getOrderEligiableStatus(transactionId): Observable<any> {
    return this.http.get(`/ed/rest/om/${transactionId}/getordereligiablestatus?t=` + new Date().getTime());
  }

  getOrderDetail(transactionId): Observable<any> {
    return this.http.get(`/ed/rest/om/${transactionId}/getorderdetails?t=` + new Date().getTime());
  }

  getPanels(transactionId): Observable<any> {
    return this.http.get(`/ed/rest/om/${transactionId}/getpanels?t=${new Date().getTime()}`);
  }

  getCommentList(transactionId): Observable<any> {
    return this.http.get(`/ed/rest/om/${transactionId}/commentlist?t=` + new Date().getTime());
  }

  getMilestoneValues(transactionId): Observable<any> {
    return this.http.get(`/ed/rest/om/${transactionId}/milestones?t=` + new Date().getTime());
  }

  submitOrder(transId, Order): Observable<any> {
    let bindingDate = this.dateParserService.toNumber(Order['bindingDate'].value);
    let currentDate = this.dateParserService.toNumber(Order['currentDate'].value);
    let accessIdentifier = UtilsService.notNull(Order['accessIdentifier1'].value) ? Order['accessIdentifier1'].value : '';
    let accessIdentifier2 = UtilsService.notNull(Order['accessIdentifier2'].value) ? Order['accessIdentifier2'].value : '';
    let additionalContact1 = UtilsService.notNull(Order['additionalContact1'].value) ? Order['additionalContact1'].value : '';
    let additionalContact2 = UtilsService.notNull(Order['additionalContact2'].value) ? Order['additionalContact2'].value : '';


      let order = {22: Order['status'].value, 50: Order['message'].value, 21: (Order['sapValue'].value).trim(),
      23: transId, 51: accessIdentifier, 52: accessIdentifier2, 53: bindingDate, 54: currentDate,
      57: additionalContact1, 58: additionalContact2};
    return this.http.post(`/ed/rest/om/sec/updateorder?t=${new Date().getTime()}`, order);
  }

  getMenu(): Observable<any> {
    return this.http.get('/ed/rest/components/ed/menus?t=' + new Date().getTime()).pipe(
      map((res: TopBar) => this.menus = res));
  }

  getDocuments(transactionId): Observable<any> {
    return this.http.get(`/ed/rest/doc/${transactionId}/getDocuments?t=` + new Date().getTime());
  }

  removeDocuments(transactionId, fileId): Observable<any> {
    return this.http.get(`/ed/rest/doc/${transactionId}/deleteDocuments?fileId=${fileId}&t=` + new Date().getTime());
  }

  downloadDocuments(transactionId, fileId, fileName): Observable<any> {
    return this.http.get(`/ed/rest/doc/${transactionId}/download/${fileId}?fileName=${fileName}&t=` + new Date().getTime(),
      {responseType: 'blob'});
  }

  uploadDocuments(transactionId: any, formData: FormData): Observable<any> {
    return this.http.post(`/ed/rest/doc/${transactionId}/uploadFiles?t=` + new Date().getTime(), formData, {
      reportProgress: true,
      observe: 'events'
    });
  }

  getFnUser(): FnUserDetails {
    // menus API call will give us the user which is logged into the application
    if (this.menus) {
      this.fnUser.vfUser = this.menus.vfUser;
      this.fnUser.isReadOnlyUser = this.menus.isReadOnlyUser;
    } else {
      this.fnUser.vfUser = this.timeoutService.vfUser;
      this.fnUser.isReadOnlyUser = this.timeoutService.isReadOnlyUser;
    }
    return this.fnUser;
  }

  setFnUser(fnUser: FnUserDetails): void {
    this.fnUser = fnUser;
  }

  getOrderView(transactionId): Observable<any> {
    return this.http.get(`/ed/rest/om/${transactionId}/orderview?t=` + new Date().getTime());
  }

  getSystemHistory(transactionId): Observable<any> {
    return this.http.get(`/ed/rest/om/${transactionId}/systemhistory?t=` + new Date().getTime());
  }

  updateOrderDetailData(transactionId: string, isVodafoneAccountManager: boolean) {
    this.orderDetailData.next({transactionId: transactionId, isVodafoneAccountManager: isVodafoneAccountManager})
  }

  clearOrderDetailData() {
    this.orderDetailData.next({transactionId: '', isVodafoneAccountManager: false})
  }

  getArchFiles(transactionId): Observable<any> {
    return this.http.get(`/ed/rest/om/${transactionId}/archive/list?t=` + new Date().getTime());
  }

  downloadArchFile(docId) {
    window.location.href = `/ed/rest/om/archive/download/${docId}?t=` + new Date().getTime();
  }
}
