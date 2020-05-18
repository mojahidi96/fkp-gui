import {ActivatedRouteSnapshot, CanActivate, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/operators';

@Injectable()
export class AccessResolverService implements CanActivate {

    constructor(private http: HttpClient, private router: Router) {

    }
    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

        let url = route.routeConfig.path.substr(route.routeConfig.path.lastIndexOf('/') + 1)
        return this.http.get(`/buyflow/rest/orderflows/${url}?t=${new Date()
            .getTime()}`).pipe(map((response: boolean) => {
            if (response) {
                return true;
            } else {
                this.router.navigate(['/error']);
                return false;
            }
        })) ;

    }
}
