/**
 * Created by srao0004 on 5/23/2017.
 */
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {SocFamily} from './socfamily';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable()
export class SocFamilyService {
  private headers: HttpHeaders;

  constructor(private http: HttpClient) {
    this.headers = new HttpHeaders({'Content-Type': 'application/json'}); // ... Set content type to JSON
  }


  saveOrUpdate(data): Promise<SocFamily> {
    return this.http.post<SocFamily>('/portal/rest/socmanager/sec/socfamily/edit?t=' + new Date().getTime(), data,
      {headers: this.headers})
      .toPromise();
  }

  getSocFamilies(): Observable<any[]> {
    return this.http.get<any[]>('/portal/rest/socmanager/socfamilies?t=' + new Date().getTime());
  }

  delete(data): Promise<SocFamily> {
    let sc = new SocFamily();
    sc.id = data.id;
    return this.http.post<SocFamily>('/portal/rest/socmanager/sec/socfamily/delete?t=' + new Date().getTime(), sc,
      {headers: this.headers})
      .toPromise();
  }

}