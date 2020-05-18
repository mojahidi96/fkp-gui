import {LOCALE_ID, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {
  CommonModule,
  HashLocationStrategy,
  LocationStrategy,
  registerLocaleData
} from '@angular/common';
import {RouterModule} from '@angular/router';
import {AppComponent} from './app.component';
import {FooterModule} from './footer/footer.module';
import {TopBarModule} from './top-bar/top-bar.module';
import {SncrControlsModule} from '../sncr-components/sncr-controls/sncr-controls.module';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {SncrLoaderModule} from '../sncr-components/sncr-loader/sncr-loader.module';
import {AppRoutingModule} from './app-routing.module';
import {AuthInterceptorService} from './config/auth-interceptor.service';
import {SncrCommonsModule} from '../sncr-components/sncr-commons/sncr-commons.module';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {TimeoutService} from './timeout/timeout.service';
import {TimeoutComponent} from './timeout/timeout.component';
import {SncrCardSelectionModule} from '../sncr-components/sncr-card-selection/sncr-card-selection.module';
import {SocManagementResolver} from '../soc-management/soc-management-resolver.service';
import {SocManagementService} from '../soc-management/soc-management.service';
import {SncrPlannedChangesModule} from '../sncr-components/sncr-planned-changes/sncr-planned-changes.module';
import {SncrNotificationModule} from '../sncr-components/sncr-notification/sncr-notification.module';
import {SncrConfirmDeactivateModule} from '../sncr-components/sncr-confirm-deactivate/sncr-confirm-deactivate.module';
import {ManagementSocService} from '../management-soc/management-soc.service';
import {L10nLoader, TranslationModule} from 'angular-l10n';
import {PatternResolverService} from '../ban-sub-common/pattern-resolver.service';
import {NgxsModule} from '@ngxs/store';
import {NgxsReduxDevtoolsPluginModule} from '@ngxs/devtools-plugin';
import {FixedNetService} from '../fixednet/fixednet.service';
import {DefaultLandingService} from '../default-landing/default-landing.service';
import {AppService} from './app.service';
import {environment} from '../environments/environment';
import {
  HTTP_INTERCEPTORS,
  HttpClientModule,
  HttpClientXsrfModule
} from '@angular/common/http';
import {NgxPageScrollModule} from 'ngx-page-scroll';
import {SncrTranslateService} from '../sncr-components/sncr-translate/sncr-translate.service';
import localeDe from '@angular/common/locales/de';
import {AccessResolverService} from './config/access-resolver.service';

registerLocaleData(localeDe, 'de-DE');

@NgModule({
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    HttpClientModule,
    HttpClientXsrfModule.withOptions({
      cookieName: 'xtok',
      headerName: 'X-xtok'
    }),
    NgbModule,
    TopBarModule,
    FooterModule,
    SncrNotificationModule,
    SncrCommonsModule.forRoot(),
    SncrControlsModule,
    SncrLoaderModule,
    SncrCardSelectionModule,
    SncrPlannedChangesModule.forRoot(),
    NoopAnimationsModule,
    NgxPageScrollModule,
    SncrConfirmDeactivateModule,
    TranslationModule.forRoot(SncrTranslateService.L10N_CONFIG),
    NgxsModule.forRoot([]),
    NgxsReduxDevtoolsPluginModule.forRoot({disabled: environment.production}),
    AppRoutingModule
  ],
  exports: [RouterModule],
  declarations: [AppComponent, TimeoutComponent],
  providers: [
    AppService,
    AuthInterceptorService,
    TimeoutService,
    SocManagementResolver,
    SocManagementService,
    ManagementSocService,
    AuthInterceptorService,
    PatternResolverService,
    FixedNetService,
    DefaultLandingService,
    AccessResolverService,
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptorService, multi: true},
    {provide: LOCALE_ID, useValue: 'de-DE'}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(l10nLoader: L10nLoader) {
    l10nLoader.load();
  }
}
