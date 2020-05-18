import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Language, TranslationService} from 'angular-l10n';
import {Subscription} from 'rxjs';
import {OmDetailService} from '../order-components/order-commons/om-detail/om-detail.service';
import {OrderConfig} from '../order-components/order-commons/order-config';
@Component({
  selector: 'order-manager',
  templateUrl: 'order-manager.component.html',
  styleUrls: ['order-manager.component.scss']
})
export class OrderManagerComponent implements OnInit, OnDestroy {

  @Language() lang;
  @Output() output = new EventEmitter();
  id: string;
  countries = [];
  pattern: any;
  orderDetail: any;
  availableTabs: any = [];
  panelTitles: any = {};
  isEditable = true;
  orderConfig = OrderConfig;
  private subscriptions$: Subscription[] = [];

  constructor(private route: ActivatedRoute, private translation: TranslationService,
              private omDetailService: OmDetailService) {

  }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];

    this.subscriptions$.push(
      this.route.data.subscribe(({orderDetail, countries, pattern }) => {
          if (countries) {
            this.countries = Object.keys(countries).map(key => ({text: countries[key], value: key.split('-')[1]}));
          }
          this.pattern = pattern ? pattern : '';
          this.orderDetail = orderDetail;
        }
      )
    );

    this.subscriptions$.push(
      this.translation.translationChanged().subscribe(() => {
        this.panelTitles.details = this.translation.translate('ORDER_MANAGER-DETAILS');
        this.panelTitles.shipmentTracking = this.translation.translate('ORDER_MANAGER-SHIPMENT_TRACKING');
        this.panelTitles.subscriberDetails = this.translation.translate('ORDER_MANAGER-SUBSCRIBER_DETAILS');
        this.panelTitles.kias = this.translation.translate('ORDER_MANAGER-KIAS');
        this.panelTitles.comments = this.translation.translate('ORDER_MANAGER-COMMENTS');
        this.panelTitles.history = this.translation.translate('ORDER_MANAGER-HISTORY');
        this.panelTitles.freeText = this.translation.translate('ORDER_MANAGER-FREE_TEXT');
      })
    );
    this.getAvailableTabs();
  }

  ngOnDestroy(): void {
    this.subscriptions$.forEach(s => s.unsubscribe());
  }

  getAvailableTabs(): void {
    this.omDetailService.getAvailableTabs().subscribe(response => {
      this.availableTabs = response;
    }, error => {
        console.error('Error while getting available tabs', error);
    });
  }

  /**
   * Checking is Address/VOId is editable based on state
   * of the order
   * @param event
   */
  orderBulkOutput(event: any) {
    this.isEditable = event !== 3;
  }


}