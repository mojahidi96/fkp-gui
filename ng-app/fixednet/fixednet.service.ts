import {map} from 'rxjs/operators';
import {Injectable, OnInit} from '@angular/core';
import {FnShop} from './common/fn-shop';
import {FnUserDetails} from './common/fn-user-details';
import {UtilsService} from '../sncr-components/sncr-commons/utils.service';
import {FnOrderDetails} from './common/fn-order-details';
import {TimeoutService} from '../app/timeout/timeout.service';
import {TopBar} from '../app/top-bar/top-bar';
import {HttpClient} from '@angular/common/http';

@Injectable()
export class FixedNetService implements OnInit {

  static readonly FAILED_TO_PROCESS = `Die eingegebenen Daten können aktuell nicht überprüft werden; 
  bitte versuchen Sie es später noch einmal.`;

  private fnShop: FnShop;
  private menus: TopBar;
  private fnUser: FnUserDetails;
  public fnOrder: FnOrderDetails;
  public pattern: any;

  constructor(private http: HttpClient, private timeoutService: TimeoutService) {
    this.fnUser = new FnUserDetails();
    this.fnOrder = new FnOrderDetails();
  }


  ngOnInit(): void {
    this.menus = this.timeoutService.topBar;
  }

  getMenu(): Promise<any> {
    return this.http.get('/portal/rest/components/fixednet/menus?t=' + new Date().getTime()).pipe(
      map((res: TopBar) => this.menus = res))
      .toPromise();
  }

  getFnShop(): FnShop {
    return this.fnShop;
  }

  setFnShop(fnShop: FnShop): void {
    this.fnShop = fnShop;
  }

  getFnSubMenus(): Array<any> {
    if (UtilsService.notNull(this.menus) && this.menus.menus && this.menus.menus.length) {
      return this.menus.menus;
    }
  }


  getFnUser(): FnUserDetails {
    // menus API call will give us the user which is logged into the application
    if (this.menus) {
      this.fnUser.vfUser = this.menus.vfUser;
      this.fnUser.isReadOnlyUser = this.menus.isReadOnlyUser;
    } else {
      this.fnUser.vfUser = this.timeoutService.vfUser;
      this.fnUser.isReadOnlyUser = this.timeoutService.isReadOnlyUser;
    }
    return this.fnUser;
  }

  setFnUser(fnUser: FnUserDetails): void {
    this.fnUser = fnUser;
  }


  setFnOrder(fnOrder: FnOrderDetails): void {
    this.fnOrder = fnOrder;
  }


  getFnOrder(): FnOrderDetails {
    return this.fnOrder;
  }

  getTopBar(): TopBar {
    return this.menus;
  }

  setTopBar(topBar: TopBar) {
    if (topBar && topBar.menus && topBar.menus.length) {
      this.menus = topBar;
    }
  }


  getPattern() {
    return this.pattern;
  }

  setPattern(pattern: any) {
    this.pattern = pattern;
  }


  handleError(error: any) {
    return Promise.reject(FixedNetService.FAILED_TO_PROCESS);
  }
}
