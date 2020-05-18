import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DeleteShoppingCartComponent} from './delete-shopping-cart.component';
import {DeleteShoppingCartService} from './delete-shopping-cart.service';
import {SncrControlsModule} from '../sncr-components/sncr-controls/sncr-controls.module';
import {TranslationModule} from 'angular-l10n';

@NgModule({
  imports: [
    CommonModule,
    SncrControlsModule,
    TranslationModule
  ],
  declarations: [
    DeleteShoppingCartComponent
  ],
  exports: [
    DeleteShoppingCartComponent
  ],
  providers: [
    DeleteShoppingCartService
  ]
})
export class DeleteShoppingCartModule {

}