/**
 * Created by bhav0001 on 14-Mar-17.
 */
import {Injectable} from '@angular/core';
import {Soc} from '../soc-blacklisted/Soc';
import {Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable()
export class ActiveSocService {
  private headers: HttpHeaders;

  constructor(private http: HttpClient) {
    this.headers = new HttpHeaders({'Content-Type': 'application/json'}); // ... Set content type to JSON
  }

  getActiveSocs(): Observable<any[]> {
    return this.http.get<any[]>('/portal/rest/socmanager/activesocs?t=' + new Date().getTime());
  }

  getActiveTriggerSocs(): Observable<any[]> {
    return this.http.get<any[]>('/portal/rest/socmanager/activetriggersocs?t=' + new Date().getTime());
  }

  getValidUrls(): Promise<any[]> {
    return this.http.get<any[]>('/portal/rest/socmanager/socLinks?t=' + new Date().getTime())
      .toPromise();
  }

  updateActiveSoc(soc): Promise<Soc> {
    return this.http.post<Soc>('/portal/rest/socmanager/sec/updateactivesoc?t=' + new Date().getTime(),
      soc, {headers: this.headers})
      .toPromise();
  }

  getFilterList(data) {
    return data.filter(d => d.status);
  }

  getSocFamilies(): Observable<any[]> {
    return this.http.get<any[]>('/portal/rest/socmanager/socfamilies?t=' + new Date().getTime());
  }

  delete(data): Promise<Soc> {
    let soc = new Soc();
    soc.socId = data.socId;
    return this.http.post<Soc>('/portal/rest/socmanager/sec/deletesoc?t=' + new Date().getTime(),
      soc, {headers: this.headers})
      .toPromise();
  }
}