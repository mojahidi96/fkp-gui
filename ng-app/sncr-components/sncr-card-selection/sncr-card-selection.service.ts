import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable()
export class SncrCardSelectionService {

  private headers: HttpHeaders;

  constructor(private http: HttpClient) {
    this.headers = new HttpHeaders({'Content-Type': 'application/json'});
  }


  getEligibilityCount(requestObj: any, url: string): Observable<any> {
    return this.http.get(`${url}/${requestObj.socId}?t=${new Date().getTime()}`);
  }
}