import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from '@angular/router';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class CountriesResolverService implements Resolve<any> {

  constructor(private http: HttpClient) {

  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<any[]> {
    return this.http.get<any[]>(`/buyflow/rest/gen/countries?t=${new Date().getTime()}`)
      .toPromise();
  }
}