import {Injectable, OnInit} from '@angular/core';
import {UtilsService} from '../sncr-components/sncr-commons/utils.service';
import {TimeoutService} from '../app/timeout/timeout.service';
import {TopBar} from '../app/top-bar/top-bar';
import {FnShop} from '../fixednet/common/fn-shop';
import {FnUserDetails} from '../fixednet/common/fn-user-details';
import {FnOrderDetails} from '../fixednet/common/fn-order-details';
import {HttpClient} from '@angular/common/http';
import {TopBarService} from '../app/top-bar/top-bar.service';

@Injectable()
export class DefaultLandingService implements OnInit {

  static readonly FAILED_TO_PROCESS = 'FIXEDNET_FAILED_TO_PROCESS';

  private fnShop: FnShop;
  private menus: TopBar;
  private fnUser: FnUserDetails;
  public fnOrder: FnOrderDetails;
  public pattern: any;

  constructor(private http: HttpClient, private timeoutService: TimeoutService,
              private topBarService: TopBarService) {
    this.fnUser = new FnUserDetails();
    this.fnOrder = new FnOrderDetails();
  }


  ngOnInit(): void {
    this.menus = this.timeoutService.topBar;
  }

  getMenu(context: string): Promise<any> {
    return this.http.get(`/${this.topBarService.getContext()}/rest/components/${context}/menus?t=${new Date().getTime()}`)
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

  getBanner() {
    return this.http.get('/public/partials/index.html', {responseType: 'text'})
      .toPromise();
  }


  handleError(error: any) {
    return Promise.reject(DefaultLandingService.FAILED_TO_PROCESS);
  }
}
