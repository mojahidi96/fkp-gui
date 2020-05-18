import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {HttpClient, HttpHeaders} from '@angular/common/http';

@Injectable()
export class FilterOptionsResolver implements Resolve<any[]> {

  private headers: HttpHeaders;

  constructor(private http: HttpClient) {
    this.headers = new HttpHeaders({'Content-Type': 'application/json'}); // ... Set content type to JSON
  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any[]> {
    return this.http.post<any[]>('/buyflow/rest/fkpdatareport/filteroptions/data?t=' + (new Date()).getTime(),
      {headers: this.headers})
      .toPromise();
  }
}