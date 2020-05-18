import {Component, OnDestroy, OnInit, Renderer2} from '@angular/core';
import {Event as RouterEvent, GuardsCheckEnd, NavigationCancel, NavigationEnd, NavigationStart, Router} from '@angular/router';
import {PageScrollConfig} from 'ngx-page-scroll';
import {Location} from '@angular/common';
import {TopBarService} from './top-bar/top-bar.service';
import {LocaleService} from 'angular-l10n';
import {TranslationsGuidsService} from '../sncr-components/sncr-commons/translations-guids.service';
import {Subscription} from 'rxjs';
import {AppService} from './app.service';
import {UtilsService} from '../sncr-components/sncr-commons/utils.service';

@Component({
  selector: 'sncr-app',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {

  loading = true;
  firstLoad = true;
  legacy = true;
  translationsLoading = false;
  showTariffDisclaimer = false;
  tariffDisclaimer: string;
  previousUrl: string;
  currentUrl: string;
  disableClearSessionArray = [
    {
      previousUrl: '/ed/ordermanager',
      currentUrl: '/ed/orderdetails'
    },
    {
      previousUrl: '/ed/orderdetails',
      currentUrl: '/ed/ordermanager'
    }
    ];

  // Properties for VF analytics
  private _ddq: any[];

  private subscriptions$: Subscription[] = [];

  constructor(router: Router, location: Location, private topBarService: TopBarService, private locale: LocaleService,
              private translationsGuidsService: TranslationsGuidsService, private appService: AppService,
              private renderer: Renderer2) {

    this.legacy = location.path().includes('(legacy:');

    this.subscriptions$.push(
      router.events.subscribe((event: RouterEvent) => this.navigationInterceptor(event))
    );

    this.subscriptions$.push(
      this.appService.translationsLoading.subscribe(loading => this.translationsLoading = loading)
    );

    // Page scroll configuration
    PageScrollConfig.defaultDuration = 300;
  }

  ngOnInit(): void {
    this._ddq = window['_ddq'] || (window['_ddq'] = []);
  }


  ngOnDestroy(): void {
    this.subscriptions$.forEach(s => s.unsubscribe());
    this.renderer.removeClass(document.body, 'loading-open');
  }

  // Placeholder for navigation loader functionality
  private navigationInterceptor(event: RouterEvent): void {
    if (event instanceof NavigationStart) {
      this.previousUrl = this.currentUrl;
      this.currentUrl = event.url;
      this.handleLocaleChange(event);
      this.isCTHideTariffFlow();
    } else if (event instanceof NavigationEnd || event instanceof NavigationCancel) {
      this.loading = false;
      this.firstLoad = false;
      this.renderer.removeClass(document.body, 'loading-open');

      if (event instanceof NavigationEnd) {
        const dl = {
          siteStructure: ['geschaeftskunden', 'firmenkundenportal'].concat(event.urlAfterRedirects.substr(1).split('/')),
          pageType: 'self service',
          siteArea: 'enterprise-service',
          loginStatus: 'logged in',
          platformType: 'desktop'
        };
        this._ddq.push(['pageview', dl]);
      }
    } else if (event instanceof GuardsCheckEnd) {
      this.loading = true;
      this.renderer.addClass(document.body, 'loading-open');
      if (!(event.url.indexOf('psc=t') > -1)) {
        this.clearSession();
      }
    }
  }

  private isCTHideTariffFlow() {
    if (this.currentUrl.startsWith('/mobile/ctflow')) {
      let localeParam = this.currentUrl.split('locale=') [1];
      if (UtilsService.isEmpty(localeParam)) {
        localeParam = '';
      }
      this.appService.getIsHideTariffApplicable(localeParam).subscribe(res => {
        if (res.showHideTrafiffDisclaimer) {
          this.showTariffDisclaimer = true;
          this.tariffDisclaimer = res.tariffDisclaimer;
        } else {
          this.showTariffDisclaimer = false;
        }
      });
    } else {
      this.showTariffDisclaimer = false;
    }
  }

  private clearSession() {
    let enableClearSession = true;
    this.disableClearSessionArray.forEach( value => {
      if (this.previousUrl === value.previousUrl && this.currentUrl === value.currentUrl) {
        enableClearSession = false;
      }
    });
    if (enableClearSession) {
      this.topBarService.clearSession().then(() => console.log('clear session'));
    }
  }

  private handleLocaleChange(event: NavigationStart) {
    if (!this.translationsGuidsService.isTranslationEnabled(event.url)) {
      if (this.locale.getCurrentLocale() !== 'de-DE') {
        this.locale.setDefaultLocale('de', 'DE');
      }
    } else {
      const regex = /locale=([a-zA-Z\-]{0,5})/g;
      const locale = regex.exec(event.url);

      if (locale) {
        const [lang, country] = locale[1].split('-');
        this.locale.setDefaultLocale(lang, (country ? country : ''));
      } else if (this.locale.getCurrentLocale() !== 'de-DE') {
        this.locale.setDefaultLocale('de', 'DE');
      }
    }
  }
}
