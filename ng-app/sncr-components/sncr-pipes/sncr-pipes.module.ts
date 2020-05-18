import {NgModule} from '@angular/core';
import {SncrFilterPipe} from './sncr-filter.pipe';
import {CustomDatePipe} from './custom-date.pipe';
import {TextFilterPipe} from './text-filter.pipe';

@NgModule({
  declarations: [SncrFilterPipe, CustomDatePipe, TextFilterPipe],
  exports: [SncrFilterPipe, CustomDatePipe, TextFilterPipe]
})
export class SncrPipesModule {}
