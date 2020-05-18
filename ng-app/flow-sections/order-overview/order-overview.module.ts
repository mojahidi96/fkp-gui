import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {SncrControlsModule} from '../../sncr-components/sncr-controls/sncr-controls.module';
import {OrderOverviewComponent} from './order-overview.component';
import {SncrTranslateService} from '../../sncr-components/sncr-translate/sncr-translate.service';
import {TranslationModule} from 'angular-l10n';

@NgModule({
  imports: [
    FormsModule,
    CommonModule,
    NgbModule,
    SncrControlsModule,
    TranslationModule.forChild(SncrTranslateService.L10N_CONFIG)
  ],
  declarations: [
    OrderOverviewComponent
  ],
  exports: [
    OrderOverviewComponent
  ],
  providers: []

})

export class OrderOverviewModule {

}
