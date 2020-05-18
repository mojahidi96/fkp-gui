import {ModuleWithProviders, NgModule} from '@angular/core';
import {UtilsService} from './utils.service';
import {TranslationsGuidsService} from './translations-guids.service';
import {DisableControlDirective} from './disable-control.directive';

@NgModule({
  declarations: [DisableControlDirective],
  exports: [DisableControlDirective]
})
export class SncrCommonsModule {
  static forRoot(): ModuleWithProviders<SncrCommonsModule> {
    return {
      ngModule: SncrCommonsModule,
      providers: [TranslationsGuidsService, UtilsService]
    };
  }
}
