import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class OrderReviewService {

  constructor(private http: HttpClient) {

  }

  getBANSummary(): Observable<any> {
    return this.http.get(`/buyflow/rest/flowselections/banSummary?t=` + new Date().getTime());
  }

  getTariffSummary(): Observable<any> {
    return this.http.get(`/buyflow/rest/tariffs/summary?t=` + new Date().getTime());
  }

  getHandySummary(): Observable<any> {
    return this.http.get(`/buyflow/rest/handys/summary?t=` + new Date().getTime());
  }

  getSocSummary(): Observable<any> {
    return this.http.get(`/buyflow/rest/socs/summary?t=` + new Date().getTime());
  }

  getSubsSummary(): Observable<any> {
    return this.http.get(`/buyflow/rest/subs/summary?t=` + new Date().getTime());
  }

  getTotalSummary(): Observable<any> {
    return this.http.get(`/buyflow/rest/order/summary?t=` + new Date().getTime());
  }

  getDEPDetailsForHandy(): Observable<any> {
      return this.http.get(`/buyflow/rest/handys/dep?t=${new Date().getTime()}`);
  }

  getOrdersDetails(orderDetails): Observable<any> {
    return this.http.post('/buyflow/rest/order/sec/submit?t=' + new Date().getTime(), orderDetails);
  }

  getDebitorSummary(): Observable<any> {
    return this.http.get(`/buyflow/rest/debitor/summary?t=${new Date().getTime()}`);
  }

  getShippingSummary(): Observable<any> {
    return this.http.get(`/buyflow/rest/shipment/summary?t=${new Date().getTime()}`);
  }

  getSubsidySummary(): Observable<any> {
    return this.http.get(`/buyflow/rest/subsidy/summary?t=${new Date().getTime()}`);
  }

  getSubsidyEligibilityCount(articleOptionSelected: number): Observable<any> {
    return this.http.get(`/buyflow/rest/subsidy/${this.getSubsidyType(articleOptionSelected)}/eligible?t=${new Date().getTime()}`);
  }

  getAvailableArticles(): Observable<any> {
    return this.http.get(`/buyflow/rest/handys/available?t=${new Date().getTime()}`);
  }

  getExistingTariffSubCount() {
    return this.http.get<number>(`/buyflow/rest/tariffs/newTariff/existingsSubsCount?t=${new Date().getTime()}`);
  }

  simSerialNoExists(simSerialNo: string) {
    return this.http.get(`/buyflow/rest/subs/isExisting/${simSerialNo}?t=${new Date().getTime()}`);
  }
  
  getSubsidyType(articleOptionSelected) {
    if (articleOptionSelected === 1) {
      return 'cv';
    } else if (articleOptionSelected === 2) {
      return 'ds';
    } else if (articleOptionSelected === 0) {
      return 'handy';
    } else {
      return articleOptionSelected;
    }
  }
}
