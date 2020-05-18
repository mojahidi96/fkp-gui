import {NgModule} from '@angular/core';
import {SncrControlsModule} from '../sncr-components/sncr-controls/sncr-controls.module';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {ClientOrderDetailsComponent} from './client-order-details.component';
import {ClientOrderDetailsService} from './client-order-details.service';
import {TranslationModule} from 'angular-l10n';

@NgModule({
  declarations: [
    ClientOrderDetailsComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SncrControlsModule,
    TranslationModule
  ],
  providers: [
    ClientOrderDetailsService
  ],
  exports: [ClientOrderDetailsComponent]
})
export class ClientOrderDetailsModule {

}