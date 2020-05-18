import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {TopBar} from '../top-bar/top-bar';
import {Cart} from '../../shopping-cart/Cart';
import {debounceTime} from 'rxjs/operators';

@Injectable()
export class TimeoutService {

  private timeoutSource = new Subject();
  ssoUser: boolean;
  vfUser: boolean;
  isReadOnlyUser: boolean;
  isReadOnlyVodafoneUser: boolean;
  ssoKeepAliveUrl: string;
  topBar: TopBar;
  timeRemaining = 300000;
  cart = new Cart();
  permissions = [];

  timeoutStream = this.timeoutSource.asObservable().pipe(debounceTime(1500000));

  resetTimeout() {
    this.timeoutSource.next();
  }
}