import {Injectable} from '@angular/core';
import {TimeoutService} from '../timeout/timeout.service';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {catchError, map} from 'rxjs/operators';
import {of} from 'rxjs/internal/observable/of';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

  constructor(private timeoutService: TimeoutService) {

  }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req).pipe(
      catchError(err => of(err)),
      map((response: HttpEvent<any>) => {
        if (response['status'] === 200) {
          this.timeoutService.resetTimeout();
        }

        if (response['status'] === 401) {
          window.location.href = response['url'];
        }
        if (response['status'] === 403) {
          window.location.href = '/portal/app/#/error';
        }

        return response;
      })
    );
  }
}