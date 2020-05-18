import {NgModule} from '@angular/core';
import {DefaultLandingComponent} from './default-landing.component';
import {SncrControlsModule} from '../sncr-components/sncr-controls/sncr-controls.module';
import {RouterModule} from '@angular/router';
import {SncrDatatableModule} from '../sncr-components/sncr-datatable/sncr-datatable.module';
import {NgbButtonsModule} from '@ng-bootstrap/ng-bootstrap';
import {DefaultLandingRouting} from './default-landing.routing';
import {CommonModule} from '@angular/common';
import {DefaultLandingResolver} from './default-landing.resolver';
import {SncrLoaderModule} from '../sncr-components/sncr-loader/sncr-loader.module';
import {PatternResolverService} from '../ban-sub-common/pattern-resolver.service';
import {ShoppingCartComponent} from '../shopping-cart/shopping-cart.component';
import {ShoppingCartService} from '../shopping-cart/shopping-cart.service';
import {SncrTranslateService} from '../sncr-components/sncr-translate/sncr-translate.service';
import {TranslationsGuidsService} from '../sncr-components/sncr-commons/translations-guids.service';
import {TranslationModule} from 'angular-l10n';
import {ContactImageComponent} from '../contact-image/contact-image.component';
import {ContactImageService} from '../contact-image/contact-image.service';
import {ReactiveFormsModule} from '@angular/forms';
import {SncrPipesModule} from '../sncr-components/sncr-pipes/sncr-pipes.module';
import {SncrNotificationModule} from '../sncr-components/sncr-notification/sncr-notification.module';
import {DeleteShoppingCartModule} from '../delete-shopping-cart/delete-shopping-cart.module';
import {SubMenusComponent} from './sub-menus/sub-menus.component';

@NgModule({
  declarations: [
    DefaultLandingComponent,
    ShoppingCartComponent,
    ContactImageComponent,
    SubMenusComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgbButtonsModule,
    SncrControlsModule,
    SncrDatatableModule,
    RouterModule,
    DefaultLandingRouting,
    SncrLoaderModule,
    SncrNotificationModule,
    DeleteShoppingCartModule,
    TranslationModule.forChild(SncrTranslateService.L10N_CONFIG),
    SncrPipesModule
  ],
  exports: [DefaultLandingComponent],
  providers: [DefaultLandingResolver, PatternResolverService,
    ShoppingCartService, ContactImageService]
})
export class DefaultLandingModule {
  constructor(sncrTranslateService: SncrTranslateService, guids: TranslationsGuidsService) {
    sncrTranslateService.configureLocalisation(...guids.getGuids('common', 'default-data-table', 'shopping-cart', 'fixednet',
      'sub-update-info', 'save-shopping-cart'));
  }
}