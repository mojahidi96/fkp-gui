import {NgModule} from '@angular/core';

import {CommonModule} from '@angular/common';
import {LoaderComponent} from './loader.component';
import {SvgIconModule} from '../../../sncr-components/svg-icon/svg-icon.module';


@NgModule({
  imports: [
    CommonModule,
    SvgIconModule
  ],
  declarations: [
    LoaderComponent
  ],
  providers: [],
  exports: [LoaderComponent]
})
export class LoaderModule {

}
