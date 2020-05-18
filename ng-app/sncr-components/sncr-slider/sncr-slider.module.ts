import {NgModule} from '@angular/core';
import {CurrencyPipe, CommonModule} from '@angular/common';

import {NouisliderModule} from 'ng2-nouislider';

import {SncrSliderComponent} from './sncr-slider.component';

@NgModule({
  imports: [CommonModule, NouisliderModule],
  declarations: [SncrSliderComponent],
  exports: [SncrSliderComponent],
  providers: [CurrencyPipe]
})
export class SncrSliderModule {}
