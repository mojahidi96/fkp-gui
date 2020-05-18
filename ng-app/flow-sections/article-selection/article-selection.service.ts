import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable()
export class ArticleSelectionService {

  private readonly headers: HttpHeaders;

  constructor(private http: HttpClient) {
    this.headers = new HttpHeaders({'Content-Type': 'application/json'}); // ... Set content type to JSON
  }

  getAvailableArticles(): Observable<any> {
    return this.http.get(`/buyflow/rest/handys/available?t=${new Date().getTime()}`);
  }

  getDEPDetailsForShop(): Observable<any> {
    return this.http.get(`/buyflow/rest/handys/dep?t=${new Date().getTime()}`);
  }

  getAvailableSubsidies(): Observable<any> {
    return this.http.post(`/buyflow/rest/subsidy/available?t=${new Date().getTime()}`, {headers: this.headers});
  }

  saveSelectedSubsidies(articleOptionSelected: number): Observable<any> {
    return this.http.post(`/buyflow/rest/subsidy/sec/${this.getSubsidyType(articleOptionSelected)}/save?t=${new Date().getTime()}`,
      {headers: this.headers});
  }

  saveSelectedHardware(articleSelectedValue: string, articleDEPValue: string): Observable<any> {
    return this.http.post(`/buyflow/rest/handys/sec/${articleSelectedValue}/${articleDEPValue}/save?t=${new Date().getTime()}`,
      {headers: this.headers});
  }

  selectedSubsidiesDetails(): Observable<any> {
    return this.http.post(`/buyflow/rest/subsidy/sec/selected?t=${new Date().getTime()}`, {headers: this.headers});
  }

  getEligibleSubsCount(articleOptionSelected: number): Observable<any> {
    return this.http.get(`/buyflow/rest/subsidy/${this.getSubsidyType(articleOptionSelected)}/eligible?t=${new Date().getTime()}`);
  }

  getEligibleSubsCountHandy(): Observable<any> {
    return this.http.get(`/buyflow/rest/handys/eligible?t=${new Date().getTime()}`);
  }

  getProductDetails(productId: string): Observable<any> {
    return this.http.get('/buyflow/rest/handys/' + productId + '/productDetails?t=' + new Date().getTime());
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
