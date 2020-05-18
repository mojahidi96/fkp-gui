import {NgModule} from '@angular/core';
import {SncrDownloadSelectionsComponent} from './sncr-download-selections.component';
import {CommonModule} from '@angular/common';
import {SncrDownloadSelectionsService} from './sncr-download-selections.service';
import {SncrControlsModule} from '../sncr-controls/sncr-controls.module';
import {TranslationModule} from 'angular-l10n';
import {FormsModule} from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    SncrControlsModule,
    TranslationModule,
    FormsModule
  ],
  exports: [SncrDownloadSelectionsComponent],
  declarations: [SncrDownloadSelectionsComponent],
  providers: [SncrDownloadSelectionsService]
})

export class SncrDownloadSelectionsModule {

}