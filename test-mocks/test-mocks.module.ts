import {NgModule} from '@angular/core';
import {TranslatePipe} from './translate.pipe';
import {HttpClientModule} from '@angular/common/http';
import {TranslationModule} from 'angular-l10n';
import {SncrTranslateService} from '../ng-app/sncr-components/sncr-translate/sncr-translate.service';

@NgModule({
  imports: [
    HttpClientModule,
    TranslationModule.forRoot(SncrTranslateService.L10N_CONFIG)
  ],
  declarations: [TranslatePipe],
  exports: [TranslatePipe]
})
export class TestMocksModule {

}