import { Component, OnInit } from '@angular/core';
import { OrderSubmitService } from './order-submit.service';
import { NotificationHandlerService } from '../../../sncr-components/sncr-notification/notification-handler.service';
import { Panel } from '../../../fixednet/order/dynamic-panels/panel';
import { FormGroup } from '@angular/forms';
import { UtilsService } from '../../../sncr-components/sncr-commons/utils.service';
import { DatepickerParserService } from '../../../sncr-components/sncr-controls/datepicker/datepicker-parser.service';
import { OrderConfirmDetails, OrderType } from '../../../order-confirm/order-confirm';
import { TranslationService } from 'angular-l10n';
import { take } from 'rxjs/operators';
import { EDOrderDetailsService } from '../ed-order-details/ed-order-details.service';

@Component({
  selector: 'ed-order-submit',
  templateUrl: './order-submit.component.html',
  styleUrls: ['./order-submit.component.scss']
})
export class OrderSubmitComponent implements OnInit {

  alert: NotificationHandlerService = new NotificationHandlerService();
  panels: Panel[];
  mainForm: FormGroup;
  hasErrors = false;
  orderDetails: OrderConfirmDetails = new OrderConfirmDetails();
  loading: boolean;
  isReadOnlyUser: boolean;

  constructor(private orderSubmitService: OrderSubmitService, private dateParserService: DatepickerParserService,
    private translationService: TranslationService,
    private orderDetailsService: EDOrderDetailsService) {
  }

  ngOnInit() {
    this.loading = true;
    this.orderSubmitService.getPanelsData().subscribe(panelData => {
      if (panelData && Object.keys(panelData).length) {
        this.loading = false;
        this.panels = panelData.panels;
      }
    },
      () => this.alert.printErrorNotification('ERROR'));
    this.getUserDetails();
  }

  getUserDetails(): void {
    this.orderDetailsService.getMenu().pipe(take(1)).subscribe(value => {
      this.isReadOnlyUser = value.isReadOnlyUser;
    })
  }


  submitForm() {
    if (this.mainForm.valid) {
      let details = this.mainForm.controls['panels']['controls'].map((c: FormGroup) => {
        return Object.keys(c.controls)
          .filter(k => UtilsService.notNull(c.controls[k].value) && c.controls[k].value !== '')
          .map(k => {
            const value = c.controls[k].value;
            const parsedValue = value.year ? this.dateParserService.toNumber(value) : value;
            return { fieldId: k, fieldValue: parsedValue };
          });
      });

      if (details && details.length) {
        details = UtilsService.flattenArray(details);
        this.orderSubmitService.submitPanelFormData(details)
          .subscribe((data) => {
            if (data) {
              if (data['errorList'] && data['errorList'].length > 0) {
                this.alert.clearNotification();
                this.alert.printErrorNotification(data['errorList']);
              } else {
                this.orderDetails.orderNote = this.translationService.translate('OM-SUBMIT-CONFIRMATION_MSG');
                this.orderDetails.orderNumber = data['orderNumber'];
                this.orderDetails.hidePrintIcon = true;
                this.orderDetails.description = '';
              }
            }
          },
            () => this.alert.printErrorNotification('OM-SUBMIT-SUBMIT_FAILURE'));
      }
    } else {
      this.hasErrors = true;
      this.alert.printErrorNotification('OM-SUBMIT-FORM_ERRORS')
    }
  }

}
