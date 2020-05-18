import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {SubscriberType} from '../subscribers-selection/subscriber-selection';
import {SncrFlowSectionComponent} from '../sncr-components/sncr-flow/sncr-flow-section.component';
import {CONSTANTS} from './constants';
import {OrderConfirmDetails, OrderDetails, OrderType} from '../order-confirm/order-confirm';
import {OrderReviewService} from './order-review/order-review.service';
import {SubscriberReqType} from './order-review/processSubscribers';
import {NotificationHandlerService} from '../sncr-components/sncr-notification/notification-handler.service';
import {ChangeBillingParamService} from './change-billing-param.service';
import {UtilsService} from '../sncr-components/sncr-commons/utils.service';
import {TimeoutService} from '../app/timeout/timeout.service';
import {TranslationService} from 'angular-l10n';

@Component({
  selector: 'change-billing-param',
  templateUrl: 'change-billing-param.component.html',
  styleUrls: ['change-billing-param.component.scss']
})
export class ChangeBillingParamComponent implements OnInit {

  constants: CONSTANTS;
  orderDetails = new OrderConfirmDetails;
  orderStatus: boolean;
  orderProcessReq: SubscriberReqType;
  columns: any[];
  subscribers: any[];
  footerNoteForReview: boolean;
  orderProcessing: boolean;
  properties: Map<any, any>;
  eventType = '';

  isReadOnly: boolean;
  infomsg = 'EVN_SELECTION-INFO_MSG';

  @ViewChild('subsFlow') subsFlow: SncrFlowSectionComponent;
  @ViewChild('itemizedFlow') itemizedFlow: SncrFlowSectionComponent;

  private lazyLoadUrlSubsSelection = '/buyflow/rest/table/custom/5c60e182-4a75-511c-e053-1405100af36j';
  private submitOrderDetails: OrderDetails;
  private superScript = '\u00B9Den Preis entnehmen Sie bitte ihren Rahmenvertragskonditionen.';

  constructor(private route: ActivatedRoute,
              private orderReviewService: OrderReviewService,
              private changeBillingParamService: ChangeBillingParamService,
              private orderReviewNotify: NotificationHandlerService,
              private timeOutService: TimeoutService,
              public translation: TranslationService) {
  }


  ngOnInit(): void {
    this.route.data.subscribe((data: { columns: SubscriberType[], subscribers: any[] }) => {
      this.columns = data.columns;
      this.subsFlow.model = {
        selected: []
      };
    });
    this.constants = new CONSTANTS;
    this.properties = this.constants.getProperties();
    this.footerNoteForReview = false;
    this.isReadOnly = this.timeOutService.isReadOnlyUser;
  }

  processOrder() {
    this.orderProcessing = true;
    this.submitOrderDetails = new OrderDetails();
    this.submitOrderDetails.type = 'changeBillingParamDTO';

    const errorText = `<b>Vorübergehende technische Störung</b><p></p>` +
      `Aufgrund einer Systemstörung steht Ihnen die gewünschte Internetseite zurzeit leider nicht zur Verfügung.` +
      ` Bitte versuchen Sie es später noch einmal.<p></p>Viele Grüße, Ihr Vodafone Team`;

    this.changeBillingParamService.submitOrder(this.submitOrderDetails)
      .then((data) => {
        this.orderProcessing = false;
        if (UtilsService.notNull(data)) {
          Object.keys(data).forEach(key => {
            this.orderDetails.orderNumber = parseInt(key, 10);
            this.orderDetails.orderType = OrderType[data[key]];
          });
          this.orderDetails.description = `Vielen Dank für Ihren Auftrag. Dieser befindet sich aktuell in Bearbeitung. ` +
            `Bitte beachten Sie, dass die Aktualisierung der Informationen zum Folgetag vorgenommen wird. Wir möchten Sie bitten, ` +
            `weiterführende Aufträge zu dieser/n Rufnummer/n erst nach Abschluss der Aktualisierung zu übermitteln.`;
          this.orderStatus = true;
        } else {
          this.orderReviewNotify.printErrorNotification(errorText);
        }
      })
      .catch((ex) => {
        console.error('exception in order', ex);
        this.orderProcessing = false;
        this.orderReviewNotify.printErrorNotification(errorText);
      });
  }

  getSubsUpdateProperties() {
    let mapList = new Map;
    mapList.set('subscriber.section.label', this.translation.translate('SELECTION-SELECTION_MESSAGE'));
    mapList.set('subscriber.next.button', this.translation.translate('SELECTION-CONTINUE_TO_NEXT'));
    return mapList;
  }


  processingEvent(event: any) {
    this.orderProcessing = event;
  }

  footerNoteEvent(event: any) {
    this.footerNoteForReview = event;
  }
}
