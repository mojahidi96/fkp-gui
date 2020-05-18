import {LOCALE_ID, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {OrderMilestoneUploadComponent} from './order-milestone-upload.component';
import {RouterModule, Routes} from '@angular/router';
import {SncrTranslateService} from '../../../sncr-components/sncr-translate/sncr-translate.service';
import {TranslationsGuidsService} from '../../../sncr-components/sncr-commons/translations-guids.service';
import {TranslationModule} from 'angular-l10n';
import {UploadChangesModule} from '../../../upload-changes/upload-changes.module';
import {EDOrderDetailsService} from '../ed-order-details/ed-order-details.service';

const routes: Routes = [
  {
    path: '',
    component: OrderMilestoneUploadComponent
  }
];


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    UploadChangesModule,
    TranslationModule.forChild(SncrTranslateService.L10N_CONFIG)
  ],
  declarations: [
    OrderMilestoneUploadComponent
  ],
  providers: [EDOrderDetailsService]
})
export class OrderMilestoneUploadModule {
  constructor(sncrTranslateService: SncrTranslateService, guids: TranslationsGuidsService) {
    sncrTranslateService.configureLocalisation(...guids.getGuids('ed-order-manager',
      'common'));
  }
}
