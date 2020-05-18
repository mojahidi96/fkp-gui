import {NgModule} from '@angular/core';

import {AngularSvgIconModule} from 'angular-svg-icon';

import {SvgIconWrapperComponent} from './svg-icon-wrapper.component';

// separate wrapper module needed as we want to use our own
// selector "svg-icon", which is the same selector as used by the
// angular-svg-icon third party library,
// see https://stackoverflow.com/a/39533191

@NgModule({
  imports: [AngularSvgIconModule],
  declarations: [SvgIconWrapperComponent],
  exports: [SvgIconWrapperComponent]
})
export class SvgIconWrapperModule {}
