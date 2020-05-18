/**
 * Created by bhav0001 on 08-Mar-17.
 */
import {ActiveSocGroupComponent} from './soc-groups/active-soc-group/active-soc-group.component';
import {ActiveSocGroupService} from './soc-groups/active-soc-group/active-soc-group.service';
import {SocCategoryAslService} from './soc-category/soc-category-asl/soc-category-asl.service';
import {SocCategoryComponent} from './soc-category/soc-category.component';
import {SocCategoryService} from './soc-category/soc-category.service';
import {CommonModule, CurrencyPipe} from '@angular/common';
import {SocBlackListedService} from './soc-blacklisted/soc-blacklisted.service';
import {SocBlackListedComponent} from './soc-blacklisted/soc-blacklisted.component';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {SncrControlsModule} from '../sncr-components/sncr-controls/sncr-controls.module';
import {NgbActiveModal, NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {SncrDatatableModule} from '../sncr-components/sncr-datatable/sncr-datatable.module';
import {SocGroupsComponent} from './soc-groups/soc-groups.component';
import {SocManagerComponent} from './soc-manager.component';
import {socRouting} from './soc-manager.routing';
import {SocGroupsService} from './soc-groups/soc-groups.service';
import {RouterModule} from '@angular/router';
import {TariffOptionsComponent} from './active-soc/active-soc.component';
import {ActiveSocService} from './active-soc/active-soc.service';
import {SocCategoryAslComponent} from './soc-category/soc-category-asl/soc-category-asl.component';
import {DeleteSocComponent} from './soc-common/delete-soc-model/delete-soc-model.component';
import {SocCategoryAslformComponent} from './soc-category/soc-category-asl/soc-category-aslform.component';
import {ActiveSocGroupModelComponent} from './soc-groups/active-soc-group/activesoc-group-model.component';
import {SncrNotificationModule} from '../sncr-components/sncr-notification/sncr-notification.module';
import {GroupIconsResolver} from './soc-groups/soc-group.component.resolver';
import {SncrLoaderModule} from '../sncr-components/sncr-loader/sncr-loader.module';
import {SocFamilyComponent} from './soc-family/soc-family.component';
import {SocFamilyService} from './soc-family/soc-family.service';
import {SocManagerService} from './soc-manager.service';
import {SncrTranslateService} from '../sncr-components/sncr-translate/sncr-translate.service';
import {TranslationsGuidsService} from '../sncr-components/sncr-commons/translations-guids.service';
import {TranslationModule} from 'angular-l10n';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SncrControlsModule,
    SncrDatatableModule,
    SncrNotificationModule,
    SncrLoaderModule,
    socRouting,
    RouterModule,
    NgbModule,
    TranslationModule.forChild(SncrTranslateService.L10N_CONFIG)
  ],
  declarations: [
    SocGroupsComponent,
    SocManagerComponent,
    TariffOptionsComponent,
    SocBlackListedComponent,
    SocCategoryComponent,
    DeleteSocComponent,
    SocCategoryAslComponent,
    SocCategoryAslformComponent,
    ActiveSocGroupComponent,
    ActiveSocGroupModelComponent,
    SocFamilyComponent
  ],
  providers: [
    ActiveSocService,
    GroupIconsResolver,
    NgbActiveModal,
    SocGroupsService,
    SocBlackListedService,
    SocCategoryService,
    SocCategoryAslService,
    ActiveSocGroupService,
    SocFamilyService,
    CurrencyPipe,
    SocManagerService
  ]
})

export class SocManagerModule {
  constructor(sncrTranslateService: SncrTranslateService, guids: TranslationsGuidsService) {
    sncrTranslateService.configureLocalisation(...guids.getGuids(
      'common',
      'default-data-table',
      'soc-manager',
      'soc-panel',
      'selection-panel'));
  }
}

