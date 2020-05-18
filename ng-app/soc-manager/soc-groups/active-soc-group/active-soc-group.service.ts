import {Soc} from './../../soc-blacklisted/Soc';
import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable()
export class ActiveSocGroupService {

  private headers: HttpHeaders;

  constructor(private http: HttpClient) {
    this.headers = new HttpHeaders({'Content-Type': 'application/json'}); // ... Set content type to JSON
  }


  getAssociateActiveSocs(groupId): Promise<any[]> {
    return this.http.get<any[]>('/portal/rest/socmanager/' + groupId + '/activesocgroup?t=' + new Date().getTime())
      .toPromise();
  }

  getActiveSocs(groupId): Promise<any[]> {
    return this.http.get<any[]>('/portal/rest/socmanager/' + groupId + '/activesocs?t=' + new Date().getTime())
      .toPromise();
  }

  saveOrUpdate(data): Promise<Soc> {
    return this.http.post<Soc>('/portal/rest/socmanager/sec/activesocgroup/edit?t=' + new Date().getTime(), data,
      {headers: this.headers})
      .toPromise();
  }

  delete(data): Promise<Soc> {
    return this.http.post<Soc>('/portal/rest/socmanager/sec/activesocgroup/delete?t=' + new Date().getTime(), data,
      {headers: this.headers})
      .toPromise();
  }
}