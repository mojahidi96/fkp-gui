import {Injectable} from '@angular/core';

/**
 * Service for common methods used along the application.
 */
@Injectable()
export class DefaultLandingMenusUtil {
  private urlPrefix = '/portal/app/#';

  isAngularUrl(url) {
    return url.startsWith(this.urlPrefix);
  }

  private getRouterUrl(url) {
    let start = this.urlPrefix.length,
      end = -1;
    end = url.indexOf('?');
    return url.substr(start, (end !== -1 ? end : url.length) - start);
  }

  addRouterUrl(menusData: Array<any>): Array<any> {
    menusData.forEach(m => {
      if (this.isAngularUrl(m.url)) {
        m.url = this.getRouterUrl(m.url);
        m.routerLink = true;
      }
    });
    return menusData;
  }
}