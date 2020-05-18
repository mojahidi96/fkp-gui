import {Group} from './group';
/**
 * Created by srao0004 on 3/14/2017.
 */
import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable()
export class SocGroupsService {

  private headers: HttpHeaders;

  constructor(private http: HttpClient) {
    this.headers = new HttpHeaders({'Content-Type': 'application/json'}); // ... Set content type to JSON
  }


  getSocData(): Promise<any[]> {
    return this.http.get<any[]>('/portal/rest/socmanager/socgroups?t=' + new Date().getTime())
      .toPromise();
  }

  getIcons(): Promise<any[]> {
    return this.http.get<any[]>('/portal/rest/socmanager/socgroupIcons?t=' + new Date().getTime())
      .toPromise();
  }

  saveOrUpdate(data): Promise<Group> {
    return this.http.post<Group>('/portal/rest/socmanager/sec/socgroup/edit?t=' + new Date().getTime(), data,
      {headers: this.headers})
      .toPromise();
  }

  delete(data): Promise<Group> {
    let socGroup = new Group();
    socGroup.id = data.id;
    socGroup.icon = data.icon;
    socGroup.groupName = data.groupName;
    return this.http.post<Group>('/portal/rest/socmanager/sec/socgroup/delete?t=' + new Date().getTime(), socGroup,
      {headers: this.headers})
      .toPromise();
  }
}