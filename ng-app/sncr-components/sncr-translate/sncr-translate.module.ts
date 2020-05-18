import {NgModule} from '@angular/core';
import {SncrTranslateDirective} from './sncr-translate.directive';
import {SncrTranslateService} from './sncr-translate.service';

@NgModule({
  declarations: [
    SncrTranslateDirective
  ],
  exports: [
    SncrTranslateDirective
  ],
  providers: [
    SncrTranslateService
  ]
})
export class SncrTranslateModule {

}