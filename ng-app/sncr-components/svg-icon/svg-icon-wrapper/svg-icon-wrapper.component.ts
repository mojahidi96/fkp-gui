import {Component} from '@angular/core';

import {SvgIconComponent} from 'angular-svg-icon';

@Component({
  selector: 'svg-icon-wrapper',
  template: '<ng-content></ng-content>'
})
export class SvgIconWrapperComponent extends SvgIconComponent {}
