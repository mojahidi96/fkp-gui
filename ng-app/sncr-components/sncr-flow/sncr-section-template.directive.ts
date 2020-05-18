import {Directive, TemplateRef} from '@angular/core';
@Directive({
  selector: '[sncrSectionTemplate]'
})
export class SncrSectionTemplateDirective {

  constructor(public templateRef: TemplateRef<any>) {
  }
}