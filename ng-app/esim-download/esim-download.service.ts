import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable()
export class EsimDownloadService {
  private headers: HttpHeaders;

  constructor(private http: HttpClient) {
    this.headers = new HttpHeaders({'Content-Type': 'application/json'}); // ... Set content type to JSON
  }

  getColumns(configId: string): Observable<any> {
    return this.http.get(`/buyflow/rest/table/custom/columns/${configId}?t=` + new Date().getTime());
  }

  setShopSession(shopId): Observable<any> {
    return this.http.get(`/portal/rest/export/setShopId/${shopId}?t=` + new Date().getTime());
  }

  downloadPDF(transactionId) {
    window.location.href = `/portal/rest/export/${transactionId}?t=` + new Date().getTime();

  }
}
