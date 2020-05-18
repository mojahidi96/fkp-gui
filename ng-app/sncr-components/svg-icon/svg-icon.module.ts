import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';

import {SvgIconWrapperModule} from './svg-icon-wrapper/svg-icon-wrapper.module';
import {SvgIconComponent} from './svg-icon.component';

@NgModule({
  imports: [CommonModule, SvgIconWrapperModule],
  declarations: [SvgIconComponent],
  exports: [SvgIconComponent]
})
export class SvgIconModule {}
