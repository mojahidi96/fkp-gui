import {ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SncrPlannedChangesComponent} from './sncr-planned-changes.component';
import {SncrPlannedChangesService} from './sncr-planned-changes.service';
import {SncrControlsModule} from '../sncr-controls/sncr-controls.module';
import {SncrLoaderModule} from '../sncr-loader/sncr-loader.module';
import {TranslationModule} from 'angular-l10n';

@NgModule({
  imports: [
    CommonModule,
    SncrControlsModule,
    SncrLoaderModule,
    TranslationModule
  ],
  declarations: [
    SncrPlannedChangesComponent
  ],
  exports: [
    SncrPlannedChangesComponent
  ]
})
export class SncrPlannedChangesModule {

  static forRoot(): ModuleWithProviders<SncrPlannedChangesModule> {
    return {
      ngModule: SncrPlannedChangesModule,
      providers: [
        SncrPlannedChangesService
      ]
    };
  }
}
