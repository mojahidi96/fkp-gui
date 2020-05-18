import {Component} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'sncr-confirm-deactivate-modal',
  template: `
      <div class="modal-body">
          <p>Ihre Änderungen gehen verloren. Möchten Sie trotzdem fortfahren?</p>
      </div>
      <div class="modal-footer">
          <sncr-button type="secondary" (click)="activeModal.dismiss()">Abbrechen</sncr-button>
          <sncr-button type="primary" (click)="activeModal.close()">Weiter</sncr-button>
      </div>
  `
})
export class SncrConfirmDeactivateModalComponent {

  constructor(public activeModal: NgbActiveModal) {

  }
}