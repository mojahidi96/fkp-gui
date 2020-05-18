import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'ed-reporting-delete-confirmation-dialog',
  templateUrl: './delete-confirmation-dialog.component.html',
  styleUrls: ['../dialog.component.scss']
})
export class DeleteConfirmationDialogComponent {

  elementName: string;

  constructor(public activeModal: NgbActiveModal) { }

  confirmDelete() {
    this.activeModal.close(true);
  }
}
