import {Component, OnInit} from '@angular/core';
import {take} from 'rxjs/operators';
import {OrderSubmitService} from '../order-submit/order-submit.service';
import {DatepickerParserService} from '../../../sncr-components/sncr-controls/datepicker/datepicker-parser.service';
import {TranslationService} from 'angular-l10n';
import {EDOrderDetailsService} from '../ed-order-details/ed-order-details.service';

@Component({
  selector: 'ed-order-upload',
  templateUrl: './order-upload.component.html',
  styleUrls: ['order-upload.component.scss'],
})

export class OrderUploadComponent implements OnInit {
  cols= [
    {title: 'ED-OU-SUBMIT-COL-CUST-ORDER-NUMBER', field: 'customerOrderNumber', type: 'text', show: true},
    {title: 'ED-OU-SUBMIT-COL-ORDER-NUMBER', field: 'orderNumber', type: 'text', show: true}
  ];
  isReadOnlyUser: boolean;

  constructor(private orderDetailsService: EDOrderDetailsService) {
  }

  ngOnInit() {
    this.getUserDetails();
  }

  getUserDetails(): void {
    this.orderDetailsService.getMenu().pipe(take(1)).subscribe(value => {
      this.isReadOnlyUser = value.isReadOnlyUser;
    })
  }
}
