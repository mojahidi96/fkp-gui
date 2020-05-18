import {Injectable} from '@angular/core';
import {Soc} from './Soc';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable()
export class SocBlackListedService {

  private headers: HttpHeaders;

  constructor(private http: HttpClient) {
    this.headers = new HttpHeaders({'Content-Type': 'application/json'}); // ... Set content type to JSON
  }

  getSocBlackListed(): Promise<Soc[]> {
    return this.http.get<Soc[]>('/portal/rest/socmanager/blacklistedsocs?t=' + new Date().getTime())
      .toPromise();
  }

  getFilterList(data) {
    return data.filter(d => d.status);
  }

  saveOrDelete(data): Promise<boolean> {
    let soc = new Soc();
    soc.socId = data.socId;
    if (data._sncrChecked) {
      return this.http.post<boolean>('/portal/rest/socmanager/sec/blacklistedsoc/edit?t=' + new Date().getTime(),
        soc, {headers: this.headers})
        .toPromise();
    } else {
      return this.http.post<boolean>('/portal/rest/socmanager/sec/blacklistedsoc/delete?t=' + new Date().getTime(), soc,
        {headers: this.headers})
        .toPromise();
    }

  }


}