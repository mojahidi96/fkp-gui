import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {SncrFlowSectionComponent} from '../sncr-components/sncr-flow/sncr-flow-section.component';
import {NotificationHandlerService} from '../sncr-components/sncr-notification/notification-handler.service';
import {OrderConfirmDetails, OrderDetails, OrderType} from '../order-confirm/order-confirm';
import {BanUpdateInfoService} from './ban-update-info.service';
import {UtilsService} from '../sncr-components/sncr-commons/utils.service';
import {CONSTANTS} from '../soc-management/constants';
import {ClientOrderDetailsComponent} from '../client-order-details/client-order-details.component';
import {BanSubConfig} from '../ban-sub-common/ban-sub.config';
import {Language, TranslationService} from 'angular-l10n';
import {TimeoutService} from '../app/timeout/timeout.service';

@Component({
  selector: 'ban-update-info',
  templateUrl: 'ban-update-info.component.html',
  styleUrls: ['ban-update-info.component.scss'],
})
export class BanUpdateInfoComponent implements OnInit {

  @ViewChild('banSelectionFlow') banSelectionFlow: SncrFlowSectionComponent;
  @ViewChild('banManagementFlow') banManagementFlow: SncrFlowSectionComponent;
  @ViewChild('clientOrderDetails') clientOrderDetails: ClientOrderDetailsComponent;

  @Language() lang: string;

  columns: any[];

  lazyLoadUrlBanSelection = '/buyflow/rest/table/custom/5c60e182-4a75-511c-e053-1405100af36f';
  lazyLoadUrlBanManagement = '/buyflow/rest/table/custom/5c60e182-4a75-511c-e053-1405100af36g';
  lazyLoadUrlBanReview = '/buyflow/rest/table/custom/5c60e182-4a75-511c-e053-1405100af36h';

  orderProcessing: boolean;
  orderDetails = new OrderConfirmDetails;
  submitOrderDetails: OrderDetails;
  constants: CONSTANTS;
  alertNotify: NotificationHandlerService;

  countries: any[];
  pattern: any;
  flowType = '';
  eventType = '';
  private isReadOnlyUser = false;

  constructor(private route: ActivatedRoute, private banUpdateInfoService: BanUpdateInfoService,
              @Inject('NotificationHandlerFactory') private notificationHandlerFactory,
              private timeoutService: TimeoutService, public translation: TranslationService) {
  }

  ngOnInit(): void {
    this.constants = new CONSTANTS;
    this.flowType = BanSubConfig.FL_TYPE_BAN;

    this.route.data.subscribe((data: { isEnterpriseUser: any, columns: any[], countries: any[], pattern: any }) => {
      this.columns = data.columns;
      /**
       * to set Ban column as text
       */
      if (this.columns.find(c => c['field'] === '1')) {
        this.columns.find(c => c['field'] === '1')['type'] = 'text';
      }

      if (data.countries && JSON.stringify(data.countries) !== '{}') {
        this.countries = Object.keys(data.countries).map(key => {
          let obj = {};
          obj['text'] = data.countries[key];
          obj['value'] = data.countries[key];
          return obj;
        });
      }
      this.pattern = data.pattern ? data.pattern : null;
      this.banSelectionFlow.model = {
        selected: [],
        columns: []
      };
    });

    this.alertNotify = this.notificationHandlerFactory();

    if (this.timeoutService.topBar) {
      this.isReadOnlyUser = this.timeoutService.topBar.isReadOnlyUser;
    }
  }


  processOrderSubmit() {
    this.submitOrderDetails = new OrderDetails();
    this.submitOrderDetails.type = 'banUpdateInfoDTO';
    this.clientOrderDetails.populateClientOrderDetails(this.submitOrderDetails);
    this.banUpdateInfoService.processUpdateBanOrder(this.submitOrderDetails)
      .then((data) => {
        this.orderProcessing = false;
        if (UtilsService.notNull(data)) {
          this.orderDetails.mutlipleOrders = [];
          Object.keys(data).forEach(key => {
            let t: any = {};
            t.orderNumber = key;
            t.orderType = OrderType[data[key]];
            this.orderDetails.mutlipleOrders.push(t);
          });
        } else {
          this.alertNotify.printErrorNotification(this.constants.technicalErrorText);
        }
      })
      .catch((ex) => {
        console.error('exception in order', ex);
        this.orderProcessing = false;
        this.alertNotify.printErrorNotification(this.constants.technicalErrorText);
      });
  }

  persistBulkEditData(editedData: any[]): Promise<any> {
    return this.banUpdateInfoService.persistEditedData(editedData, true);
  }


  processUpdateSubsOrder() {
    if (!this.clientOrderDetails.isFormInValid() && this.clientOrderDetails.saveForm.valid) {
      if (!this.isReadOnlyUser) {
        this.orderProcessing = true;
        if (this.banSelectionFlow.model['bulkEdit']) {
          // in case of bulk edit persist the edited data then process order
          this.persistBulkEditData(this.banManagementFlow.model['editedData']).then(res => this.processOrderSubmit());
        } else {
          this.processOrderSubmit();
        }
      } else {
        this.alertNotify.printErrorNotification(this.translation.translate('REVIEW-READ_ONLY_ERROR_MESSAGE'));
        this.orderProcessing = false;
      }
    } else {
      this.orderProcessing = false;
    }
  }
}
