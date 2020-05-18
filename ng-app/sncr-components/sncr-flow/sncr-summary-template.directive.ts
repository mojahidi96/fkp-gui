import {Directive, TemplateRef} from '@angular/core';
@Directive({
  selector: '[sncrSummaryTemplate]'
})
export class SncrSummaryTemplateDirective {

  constructor(public templateRef: TemplateRef<any>) {
  }
}