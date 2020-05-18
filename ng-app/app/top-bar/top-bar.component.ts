import {Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';
import {TopBarService} from './top-bar.service';
import {MenuLinkItem, TopBar} from './top-bar';
import {ActivatedRoute, Event as RouterEvent, NavigationCancel, NavigationEnd, Router, RouterLinkActive} from '@angular/router';
import {TimeoutService} from '../timeout/timeout.service';
import {Subscription} from 'rxjs';
import {fromEvent} from 'rxjs/internal/observable/fromEvent';

@Component({
  selector: 'sncr-top-bar',
  templateUrl: 'top-bar.component.html',
  styleUrls: ['top-bar.scss']
})
export class TopBarComponent implements OnInit, OnDestroy {

  @ViewChildren('rla') links: QueryList<RouterLinkActive>;
  @ViewChild('readOnlyUser') private readonlyUser: ElementRef;

  currentSubmenu: MenuLinkItem[] = [];
  topBar: TopBar;
  private urlPrefix = '/portal/app/#';
  idParam: any;
  isReadOnlyUser: boolean;
  private scroll$: Subscription;
  private flowType = '';

  constructor(private topBarService: TopBarService, private timeoutService: TimeoutService, private router: Router,
              private route: ActivatedRoute) {
    this.topBar = new TopBar;
    router.events.subscribe((event: RouterEvent) => {
      this.navigationInterceptor(event);
    });
  }

  ngOnInit(): void {
    this.getData();
    this.route.queryParams.subscribe(params => {
      if (params['id']) {
        this.idParam = params['id'];
      }
    });
    this.router.events.subscribe((event: RouterEvent) => {
      if (this.topBar && event instanceof NavigationEnd) {
        let tabChanged = this.topBarService.selectTab(this.topBar);

        if (tabChanged) {
          this.getData();
        }
      }
    });
    if (location.hash) {
      this.flowType = location.hash.split('/')[1];
    }
  }

  ngOnDestroy(): void {
    if (this.scroll$) {
      this.scroll$.unsubscribe();
    }
  }

  onScroll1() {
    if (window.pageYOffset >= 54) {
      this.readonlyUser.nativeElement.classList.add('sticky');
    } else {
      this.readonlyUser.nativeElement.classList.remove('sticky');
    }
  }

  onLinkClick(submenu: MenuLinkItem[]) {
    this.currentSubmenu = submenu;
  }

  isAngularUrl(url) {
    return url.startsWith(this.urlPrefix);
  }

  getQueryParams(name: string): any {
    let queryParam = {};
    switch (name) {
      case 'Aufträge anzeigen':
        queryParam = {'id': 1};
        break;

      case 'Produkte am Standort anzeigen':
        queryParam = {'id': 2};
        break;
    }
    return queryParam;
  }

  private getRouterUrl(url) {
    const start = this.urlPrefix.length,
      end = url.indexOf('?');
    return url.substr(start, (end !== -1 ? end : url.length) - start);
  }

  private getData() {
    this.currentSubmenu = [];
    this.topBarService.getData()
      .then(response => {
        this.timeoutService.ssoUser = response.ssoUser;
        this.timeoutService.vfUser = response.vfUser;
        this.timeoutService.isReadOnlyVodafoneUser = response.isReadOnlyVodafoneUser;
        this.timeoutService.isReadOnlyUser = this.isReadOnlyUser = response.isReadOnlyUser;
        this.timeoutService.ssoKeepAliveUrl = response.ssoKeepAliveUrl;
        this.timeoutService.permissions = response.permissions;
        this.timeoutService.topBar = response;
        if (this.isReadOnlyUser) {
          this.scroll$ = fromEvent(window, 'scroll')
            .subscribe(() => this.onScroll1());
        }
        response.menus.forEach(m => {
          if (this.isAngularUrl(m.url)) {
            m.url = this.getRouterUrl(m.url);
            m.routerLink = true;
          }

          m.submenus.forEach(s => {
            s.links.forEach(l => {
              if (this.isAngularUrl(l.url)) {
                l.url = this.getRouterUrl(l.url);
                if (l.url.includes('/customerdetails')) {
                  l.queryParam = this.getQueryParams(l.name);
                }
                l.routerLink = true;
              }
            });
          });
        });
        this.topBar = response;
        this.populateSubMenus();
      });
  }

  private navigationInterceptor(event: RouterEvent): void {
    if ((event instanceof  NavigationCancel) || (event instanceof NavigationEnd)) {
      this.populateSubMenus();
    }
  }

  private populateSubMenus() {
    if (this.topBar.menus) {
      this.topBar.menus.some(l => {
        return l.submenus.some(s => {
          const end = location.hash.indexOf('?');
          if (this.matchingSubmenuExists(s, end)) {
            setTimeout(() => {
              this.currentSubmenu = s.links;
              this.topBar.menus.forEach(m => m.active = false);
              l.active = true;
            });
            return true;
          }
        });
      });
    }
  }

  private matchingSubmenuExists(submenu, end) {
    return submenu.links.some(link => {
      if (location.hash.substr(1, (end !== -1 ? end : location.hash.length) - 1) === '/fixednet/home'
          || location.hash.includes('/fixednet/home')
          || location.hash.includes('/ed/home')) {
        this.currentSubmenu = [];
        return false;
      } else {
        if (link.queryParam) {
          return link.url.endsWith(location.hash.substr(1, (end !== -1 ? end : location.hash.length) - 1)) &&
            link.queryParam.id.toString() === this.idParam;
        } else {
          if (location.hash === '#/ed/orderdetails' && link.url === '/ed/ordermanager') {
            return true;
          } else {
            return link.url.endsWith(location.hash.substr(1, (end !== -1 ? end : location.hash.length) - 1));
          }
        }
      }
    });
  }

  menuSelected(menu) {
    this.topBarService.publishMenuSelectedSubject(menu);
  }
}
