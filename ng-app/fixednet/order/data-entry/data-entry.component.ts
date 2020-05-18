import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {FormGroup} from '@angular/forms';
import {Field, Panel} from '../dynamic-panels/panel';
import {DataEntryService} from './data-entry.service';
import {UtilsService} from '../../../sncr-components/sncr-commons/utils.service';
import {OrderService} from '../order.service';
import {NgbTabset, NgbPagination} from '@ng-bootstrap/ng-bootstrap';
import {NotificationHandlerService} from '../../../sncr-components/sncr-notification/notification-handler.service';
import {DatepickerParserService} from '../../../sncr-components/sncr-controls/datepicker/datepicker-parser.service';
import {FixedNetService} from '../../fixednet.service';
import {FnUserDetails} from '../../common/fn-user-details';

@Component({
  selector: 'data-entry',
  templateUrl: 'data-entry.component.html',
  styleUrls: ['data-entry.component.scss']
})
export class DataEntryComponent implements OnInit {

  @Input() tab: NgbTabset;
  @Input() readonly: boolean;
  @ViewChild('radio') radio;

  public formIndex = 0;
  public disableSubmit: boolean;

  private billingDetails: Array<any> = [];
  private rowData: any = {};
  private mainForms: FormGroup[][];
  public panels: Panel[];
  private hasErrors: boolean;
  public order: any;
  private productPanels = {};
  private currentItemIndex: number;
  public loading: boolean;
  public submitting: boolean;
  private billCols = [];
  private billingAccountNo = '';
  private isBillDetailsLoading: boolean;
  private selected = 0;
  private page = 0;
  private currentItemIdxErr = false;

  @ViewChild('productsPagination') productsPagination: NgbPagination;

  billSelected: any = null;
  fnUser: FnUserDetails = new FnUserDetails();

  constructor(private dataEntryService: DataEntryService, private orderService: OrderService,
              public notificationHandlerService: NotificationHandlerService,
              private datepickerParserService: DatepickerParserService,
              private fixedNetService: FixedNetService) {

  }

  ngOnInit(): void {
    window.scrollTo(0, 0);

    this.page = 1;

    this.order = this.orderService.getFnorderRequest();
    const previousForms = this.orderService.getSharedForms();
    this.fnUser = this.fixedNetService.getFnUser();
    if (previousForms && previousForms.length) {
      this.mainForms = previousForms;
      this.mainForms.forEach(forms => {
        forms.forEach(form => {
          form.valueChanges.subscribe(() => {
            if (form.invalid) {
              this.orderService.disableTabsFrom(3);
            }
          });
        });
      });
    } else {
      this.mainForms = this.order.items.map(() => []);
    }

    this.billCols = [
      {title: 'Rechnungskonto', field: 'accountNo', show: true, sortable: true},
      {title: 'Rechnungskonto Name', field: 'accountName', show: true, sortable: true},
      {title: 'Rechnungskonto Adresse', field: 'accountAddress', show: true, sortable: true},
      {title: 'Zahlmethode', field: 'paymentMode', show: true, sortable: true}
    ];

    this.getBillingDetails();
    if (this.order && this.order.items && this.order.items.length) {
      this.loadPanels(this.order.items[0].productBundle.salesProductId, 0);
    }
  }

  getTotalItems() {
    return this.order.items.reduce((acc, item) => acc + item.detail.length, 0);
  }

  loadPanels(productId: string, itemIndex: number) {
    this.currentItemIdxErr = false;
    if (!this.readonly && UtilsService.notNull(this.currentItemIndex) && this.currentItemIndex !== itemIndex) {
      this.save();
      this.currentItemIdxErr = this.hasErrors;
    }

    if (!this.currentItemIdxErr) {
      this.selected = itemIndex;
      this.formIndex = 0;
      this.loading = true;
      this.currentItemIndex = itemIndex;
      this.page = this.formIndex + 1;
      if (this.mainForms.length > 0 && (!this.mainForms[itemIndex] || !this.mainForms[itemIndex].length)) {
        this.mainForms[itemIndex] = new Array(this.order.items[itemIndex].detail.length);
      }
      this.panels = this.productPanels[productId];
      if (!this.panels) {
        this.dataEntryService.getPanelsByProduct(productId).then(panels => {
          if (panels.tariffPanel && !panels.tariffPanel.tariffs.length) {
            this.notificationHandlerService.printErrorNotification('Error: no tariffs available');
            this.disableSubmit = true;
          } else {
            this.productPanels[productId] = this.panels = this.orderService.parsePanels(panels);
          }
          this.loading = false;
        });
      } else {
        setTimeout(() => this.loading = false);
      }
    }
  }

  addItem() {
    const detail = this.order.items[this.currentItemIndex].detail;

    detail.push({
      cartPanels: null,
      panelFields: []
    });
    this.mainForms[this.currentItemIndex].push(undefined);
    this.orderService.setFnOrderRequest(this.order);
  }

  removeItem(index: number) {
    const detail = this.order.items[this.currentItemIndex].detail;
    if (detail.length > 1) {
      detail.splice(index, 1);
      this.mainForms[this.currentItemIndex].splice(index, 1);
      this.orderService.setFnOrderRequest(this.order);
    } else {
      const locationToRemove = this.order.items[this.currentItemIndex].location;
      const locationData = this.orderService.getFnOrderRequestLocationData();

      this.order.items.splice(this.currentItemIndex, 1);
      this.mainForms.splice(this.currentItemIndex, 1);
      this.panels = this.currentItemIndex = null;
      if (this.order && this.order.items && this.order.items.length) {
        this.loadPanels(this.order.items[0].productBundle.salesProductId, 0);
        this.selected = 0;
      }

      if (locationData && locationData.locations && locationData.locations.length) {
        const noProductLocation = locationData.locations.find(location =>
          UtilsService.deepCompare(location.location, locationToRemove));
        if (noProductLocation) {
          noProductLocation.productNameSelected = 'choose';
          noProductLocation.bandwidthSelected = '';
          noProductLocation.cartAdded = false;
        }
      }

      this.orderService.setFnOrderRequest(this.order);
      this.orderService.setFnOrderRequestLocationData(locationData);
      if (this.order.items.length === 0) {
        this.orderService.enabledTabs[3] = false;
        this.orderService.enabledTabs[4] = false;
        this.tab.select('tab2');
      }
    }
  }

  save() {
    const mainForms = this.mainForms[this.currentItemIndex];
    this.hasErrors = false;

    if (mainForms && mainForms.every(form => form && form.valid)) {
      mainForms.forEach((mainForm, i) => {
        const details = mainForm.controls['panels']['controls'].map((c: FormGroup) => {
          return Object.keys(c.controls)
            .filter(k => UtilsService.notNull(c.controls[k].value) && c.controls[k].value !== '')
            .map(k => {
              const value = c.controls[k].value;
              const parsedValue = value.year ? this.datepickerParserService.toNumber(value) : value;
              return {fieldId: k, fieldValue: parsedValue};
            });
        });
        this.order.items[this.currentItemIndex].detail[i].panelFields = UtilsService.flattenArray(details);
      });
    } else if (mainForms && mainForms.some(form => !form || form.invalid)) {
      let paginatorErrorIndex;
      paginatorErrorIndex = mainForms.findIndex(form => !form || form.invalid);
      if (!isNaN(paginatorErrorIndex)) {
        setTimeout(() => {
          this.page = paginatorErrorIndex + 1;
          this.formIndex = paginatorErrorIndex;
        });
      }
      this.notificationHandlerService.printErrorNotification('Bitte korrigieren Sie die markierten Fehler');
      this.hasErrors = true;
    } else {
      this.notificationHandlerService.clearNotification();
      this.hasErrors = false;
    }
  }

  trackForms(index) {
    return `${this.currentItemIndex}${index}`;
  }

  back() {
    if (this.readonly) {
      this.tab.select('tab3');
    } else {
      this.tab.select('tab2');
    }
  }

  next() {
    if (this.readonly) {
      if (this.billingAccountNo) {
        this.submitting = true;
        this.order.billingAccountNo = this.billingAccountNo;
        this.orderService.setFnOrderRequest(this.order);
        this.dataEntryService.submitOrder()
          .then(response => {
            this.orderService.setOrderResponse(response);
            this.orderService.disableTabsFrom(1);
            this.orderService.enabledTabs[5] = true;
            setTimeout(() => {
              this.tab.select('tab5');
            });
          })
          .catch(error => {
            this.notificationHandlerService.printErrorNotification(`Error: ${error}`);
            this.submitting = false;
          });
      } else {
        this.setErrorMessage('Bitte wählen Sie ein Rechnungskonto.');
      }
    } else {
      this.save();
      this.orderService.setSharedForms(this.mainForms);
      if (!this.hasErrors) {
        const formValidation = forms => {
          return !forms.length || forms.some(form => {
            return !form || form.invalid;
          });
        };

        this.hasErrors = this.mainForms.some(formValidation);
        if (this.hasErrors) {
          let productErrorIdx = this.mainForms.findIndex(formValidation);

          if (productErrorIdx !== this.currentItemIndex) {
            console.log('productErrorIdx ' + productErrorIdx);
            console.log('currentItemIndex ' + this.currentItemIndex);
            console.log('salesProductId ' + this.order.items[productErrorIdx].productBundle.salesProductId);
            this.loadPanels(this.order.items[productErrorIdx].productBundle.salesProductId, productErrorIdx);
          }
          this.notificationHandlerService.printErrorNotification('Bitte korrigieren Sie die markierten Fehler');
        } else {
          this.orderService.disableTabsFrom(4);
          setTimeout(() => this.tab.select('tab4'));
        }
      }
    }
  }

  getBillingDetails() {
    if (this.readonly) {
      this.isBillDetailsLoading = true;
      this.dataEntryService.getBillingDetails().then(data => {
          this.billingDetails = data;
          this.isBillDetailsLoading = false;
        },
        error => {
          console.log('error', error);
        });
    }
  }

  onRowSelect() {
    if (this.billSelected) {
      this.billingDetails.forEach(row => row.selected = false);
      this.billSelected.selected = true;
      this.rowData = this.billSelected;
      this.billingAccountNo = this.billSelected.accountNo;
    }
  }

  setErrorMessage(message: string) {
    this.notificationHandlerService.printErrorNotification(message);
  }
}
