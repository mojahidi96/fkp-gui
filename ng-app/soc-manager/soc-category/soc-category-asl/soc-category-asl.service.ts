import {Group} from '../../soc-groups/group';
import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable()
export class SocCategoryAslService {
  private headers: HttpHeaders;

  constructor(private http: HttpClient) {
    this.headers = new HttpHeaders({'Content-Type': 'application/json'}); // ... Set content type to JSON
  }

  getSocsByCategoryId(categoryId): Promise<any[]> {
    return this.http.get<any[]>('/portal/rest/socmanager/' + categoryId + '/socsbyid?t=' + new Date().getTime())
      .toPromise();
  }

  getAssocateSocs(categoryId): Promise<any[]> {
    return this.http.get<any[]>('/portal/rest/socmanager/' + categoryId + '/associatesocs?t=' + new Date().getTime())
      .toPromise();
  }

  saveOrUpdate(data): Promise<Group> {
    return this.http.post<Group>('/portal/rest/socmanager/sec/soccategoryasl/edit?t=' + new Date().getTime(), data,
      {headers: this.headers})
      .toPromise();
  }

  delete(data): Promise<Group> {
    return this.http.post<Group>('/portal/rest/socmanager/sec/soccategoryasl/delete?t=' + new Date().getTime(), data,
      {headers: this.headers})
      .toPromise();
  }
}