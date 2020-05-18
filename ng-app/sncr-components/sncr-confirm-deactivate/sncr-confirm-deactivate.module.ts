import {NgModule} from '@angular/core';
import {SncrConfirmDeactivateGuard} from './sncr-confirm-deactivate-guard.service';
import {SncrConfirmDeactivateModalComponent} from './sncr-confirm-deactivate-modal.component';
import {SncrControlsModule} from '../sncr-controls/sncr-controls.module';
import {NgbModalModule} from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    SncrControlsModule,
    NgbModalModule
  ],
  declarations: [SncrConfirmDeactivateModalComponent],
  providers: [SncrConfirmDeactivateGuard],
  entryComponents: [SncrConfirmDeactivateModalComponent]
})
export class SncrConfirmDeactivateModule {

}