import {Directive, Input} from '@angular/core';
import {NgControl} from '@angular/forms';

@Directive({
  selector: '[disableControl]'
})
export class DisableControlDirective {

  @Input() set disableControl(condition: boolean) {
    this.ngControl.control[condition ? 'disable' : 'enable']();
  }

  constructor(private ngControl: NgControl) {
  }
}