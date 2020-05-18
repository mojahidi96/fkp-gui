import {NgModule} from '@angular/core';
import {SncrFlowComponent} from './sncr-flow.component';
import {SncrFlowSectionComponent} from './sncr-flow-section.component';
import {CommonModule} from '@angular/common';
import {SncrSectionTemplateDirective} from './sncr-section-template.directive';
import {SncrSummaryTemplateDirective} from './sncr-summary-template.directive';
import {TranslationModule} from 'angular-l10n';

@NgModule({
  imports: [
    CommonModule,
    TranslationModule
  ],
  declarations: [
    SncrFlowComponent,
    SncrFlowSectionComponent,
    SncrSectionTemplateDirective,
    SncrSummaryTemplateDirective
  ],
  exports: [
    SncrFlowComponent,
    SncrFlowSectionComponent,
    SncrSectionTemplateDirective,
    SncrSummaryTemplateDirective
  ]
})
export class SncrFlowModule {

}