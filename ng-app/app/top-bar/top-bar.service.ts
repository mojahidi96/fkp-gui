import {map} from 'rxjs/operators';
import {Injectable} from '@angular/core';
import {MenuItem, TopBar} from './top-bar';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject} from 'rxjs';

@Injectable()
export class TopBarService {

  private externalUrl = 'www.vodafone.de';
  private menuSelectedSubject$: BehaviorSubject<any> = new BehaviorSubject('');


  constructor(private http: HttpClient) {

  }

  getData(): Promise<TopBar> {
    return this.http.get(`/${this.getContext()}/rest/components/${this.getPathComponent()}/menus?t=${new Date().getTime()}`).pipe(
      map((topBar: TopBar) => {
        this.selectTab(topBar);
        topBar.menus.sort((a, b) => a.menuOrder - b.menuOrder);
        topBar.menus.forEach(m => {
          if (m.url && m.url.includes(this.externalUrl)) {
            m.target = '_blank';
          } else {
            m.target = '_self';
          }

          m.submenus.forEach(s => {
            s.links.forEach(l => {
              if (l.url && l.url.includes(this.externalUrl)) {
                l.target = '_blank';
              } else {
                l.target = '_self';
              }
            });
          });
        });
        if (topBar.menus) {
          this.getSelectedMenuItem(topBar.menus)
        }
        return topBar;
      }))

      .toPromise();
  }

  getSelectedMenuItem(menus) {
    this.publishMenuSelectedSubject(menus
      .find(m => m.url === '/portal/app/' + location.hash.substring(0, location.hash.indexOf('?'))));
  }

  selectTab(topBar: TopBar): boolean {
    let activeIndex = 0;
    let needsChange = topBar && topBar.tabs ? !topBar.tabs[activeIndex].active : false;

    if (needsChange) {
      topBar.tabs.forEach((t, i) => t.active = i === activeIndex);
    }

    return needsChange;
  }


  keepAlive(): Promise<any> {
    return this.http.get('/buyflow/rest/session/keepAlive?t=' + new Date().getTime())
      .toPromise();
  }

  terminateSession(): Promise<any> {
    return this.http.get('/buyflow/rest/session/terminateSession?t=' + new Date().getTime())
      .toPromise();
  }

  clearSession(): Promise<any> {
    return this.http.get('/portal/rest/components/clearSession?t=' + new Date().getTime())
      .toPromise();
  }


  /**
   * this method returns the context which is used to make the api calls for menus
   * currently context only separated for ed but for mobile and fixednet
   * we have same context which will use portal
   */
  getContext(): string {
    let context = location && location.hash ? location.hash.split('/')[1] : '';
    return context === 'ed' ? context : 'portal';
  }

  getPathComponent(): string {
    return location.hash.split('/')[1] || 'mobile';
  }

  publishMenuSelectedSubject(menuItem: MenuItem) {
    this.menuSelectedSubject$.next(menuItem);
  }

  getMenuSelectedSubject() {
    return this.menuSelectedSubject$;
  }
}