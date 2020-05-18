import {SocCategory} from './category';
import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable()
export class SocCategoryService {

  private headers: HttpHeaders;

  constructor(private http: HttpClient) {
    this.headers = new HttpHeaders({'Content-Type': 'application/json'}); // ... Set content type to JSON
  }

  getCategorySocs(): Promise<any[]> {
    return this.http.get<any[]>('/portal/rest/socmanager/soccategories?t=' + new Date().getTime())
      .toPromise();
  }

  saveOrUpdate(data): Promise<SocCategory> {
    return this.http.post<SocCategory>('/portal/rest/socmanager/sec/soccategory/edit?t=' + new Date().getTime(), data,
      {headers: this.headers})
      .toPromise();
  }

  delete(data): Promise<SocCategory> {
    let sc = new SocCategory();
    sc.id = data.id;
    sc.categoryName = data.categoryName;
    return this.http.post<SocCategory>('/portal/rest/socmanager/sec/soccategory/delete?t=' + new Date().getTime(), sc,
      {headers: this.headers})
      .toPromise();
  }
}