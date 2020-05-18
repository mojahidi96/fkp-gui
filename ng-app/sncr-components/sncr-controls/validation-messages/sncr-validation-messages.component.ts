import {Component, Input, OnChanges, SimpleChanges, ViewChild} from '@angular/core';
import {NgbPopover} from '@ng-bootstrap/ng-bootstrap';
import {UtilsService} from '../../sncr-commons/utils.service';

/**
 * This component is meant to be used internally by the rest of components to show validations messages.
 */
@Component({
  selector: 'sncr-validation-messages',
  templateUrl: 'sncr-validation-messages.component.html',
  styleUrls: ['sncr-validation-messages.component.scss']
})
export class ValidationMessagesComponent implements OnChanges {
  /**
   * List of validations messages to be shown.
   */
  @Input() messages: any[];

  @Input() placement = 'top';

  @ViewChild(NgbPopover, {static: true}) popover: NgbPopover;

  ngOnChanges(changes: SimpleChanges): void {
    this.popover.placement = this.placement ? this.placement : 'top';
    let m = changes['messages'];
    if (m && !UtilsService.deepCompare(m.previousValue, m.currentValue)) {
      setTimeout(() => {
        let len = m.currentValue.length;
        if (len && !this.popover.isOpen()) {
          this.popover.open();
        } else if (!len && this.popover.isOpen()) {
          this.popover.close();
        }
      });
    }
  }
}
