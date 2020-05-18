import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SncrNotificationModule} from '../../../sncr-components/sncr-notification/sncr-notification.module';
import {SncrControlsModule} from '../../../sncr-components/sncr-controls/sncr-controls.module';
import {FormsModule} from '@angular/forms';
import {SncrTranslateService} from '../../../sncr-components/sncr-translate/sncr-translate.service';
import {TranslationsGuidsService} from '../../../sncr-components/sncr-commons/translations-guids.service';
import {TranslationModule} from 'angular-l10n';
import {EDReportingComponent} from './ed-reporting.component';
import {UploadChangesModule} from '../../../upload-changes/upload-changes.module';
import {edReportingRouting} from './ed-reporting.routing';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FileExplorerModule} from './file-explorer/file-explorer.module';
import {FileService} from './service/file-explorer.service';
import {LandingPageService} from '../order-manager/landing-page/landing-page.service';
import {EDOrderDetailsService} from '../ed-order-details/ed-order-details.service';


@NgModule({
  imports: [
    CommonModule,
    edReportingRouting,
    SncrNotificationModule,
    SncrControlsModule,
    FormsModule,
    UploadChangesModule,
    TranslationModule.forChild(SncrTranslateService.L10N_CONFIG),
    FileExplorerModule,
    NgbModule
  ],
  declarations: [
    EDReportingComponent
  ],
  providers: [FileService, EDOrderDetailsService, LandingPageService]
})
export class EDReportingModule {
  constructor(sncrTranslateService: SncrTranslateService, guids: TranslationsGuidsService) {
    sncrTranslateService.configureLocalisation(...guids.getGuids('ed-order-manager',
      'common', 'default-data-table'));
  }
}
