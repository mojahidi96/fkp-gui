/**
 * Created by srao0004 on 05-July-18.
 */
import {ChangeDetectorRef, Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild} from '@angular/core';
import {FnOrderDetails} from '../../common/fn-order-details';
import {Field, Panel} from '../../order/dynamic-panels/panel';
import {FnUserDetails} from '../../common/fn-user-details';
import {ActivatedRoute} from '@angular/router';
import {FixedNetService} from '../../fixednet.service';
import {OrderDetailsService} from './order-details.service';
import {OrderService} from '../../order/order.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NotificationHandlerService} from '../../../sncr-components/sncr-notification/notification-handler.service';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {CustomValidators} from '../../../sncr-components/sncr-controls/custom-validators';
import {Subscription} from 'rxjs';
import {finalize} from 'rxjs/operators';


@Component({
  selector: 'order-detail',
  templateUrl: 'order-details.component.html',
  styleUrls: ['order-details.component.scss']
})

export class OrderDetailsComponent implements OnInit, OnDestroy {

  @Input() transactionId: string;
  @Output() backButton = new EventEmitter();
  @ViewChild('customerInfo', {static: true}) customerInfo;
  @ViewChild('createdDateTime', {static: true}) createdDateTime;
  @ViewChild('code', {static: true}) code;
  @ViewChild('msgContentModal') msgContentModal: NgbModal;

  order: FnOrderDetails;
  orderDetails: any = {};
  location: any = {};
  noContactDetails: boolean;
  panels: Panel[];
  fnUser: FnUserDetails = new FnUserDetails();
  manageOrders = [];
  submitting: boolean;
  loading: boolean;
  orderStatusForm: FormGroup;
  columns = [];
  history = [];
  loadHistory: boolean;
  toggle: boolean;
  toggleState: boolean;
  eligibilityFailed = false;
  showValidation = false;
  private patternMap: any;
  private routeSubscription: Subscription;
  private statusSubscription: Subscription;

  constructor(private fixednetService: FixedNetService, private orderDetailsService: OrderDetailsService,
              public alertNotify: NotificationHandlerService,
              private orderService: OrderService, private route: ActivatedRoute, private fb: FormBuilder,
              private cd: ChangeDetectorRef, private modalService: NgbModal) {
    this.order = new FnOrderDetails();
    this.location = {};
  }

  ngOnInit(): void {
    this.loading = true;
    this.getOrderDetails();
    this.columns = [
      {title: 'OM-OD-COL_TIME', field: 'lastRefreshedEpoch', sortable: true, type: 'date', show: true, bodyTemplate: this.createdDateTime},
      {title: 'OM-OD-COL_USERNAME', field: 'userName', sortable: true, type: 'text', show: true},
      {title: 'OM-OD-COL_CATEGORY', field: 'categoryName', sortable: true, type: 'text', show: true},
      {title: 'OM-OD-COL_STATE', field: 'stateName', sortable: true, type: 'text', show: true},
      {title: 'OM-OD-COL_COMMENTS', field: 'transComment', sortable: true, type: 'text', show: true, bodyTemplate: this.customerInfo},
      {title: 'OM-OD-COL_RESONCODE', field: 'reasonCode', sortable: true, type: 'text', show: true, bodyTemplate: this.code},
    ];
    this.fnUser = this.fixednetService.getFnUser();

    this.routeSubscription = this.route.data.subscribe((data: { pattern: any }) => {
      this.patternMap = data.pattern ? data.pattern : '';
    });

    this.createForm();
    if (this.fnUser && !this.fnUser.isReadOnlyUser) {
      this.getOrderLockedAndEligibility();
    }
    this.statusSubscription = this.orderStatusForm.get('status').valueChanges.subscribe(val => {
      if (val) {
        this.orderStatusForm.get('message').enable({onlySelf: true, emitEvent: false});
      } else {
        this.disableMessage();
      }
    });
  }

  getOrderLockedAndEligibility() {
    this.orderDetailsService.getOrderLockedStatus(this.transactionId).subscribe((res: any) => {
      // If an order is not locked then only make the eligibility API call
      if (res && (!res.locked || res.locked === 'false')) {
        this.getOrderEligibleStatus();
      } else {
        // show the message order is locked by some other user
        this.alertNotify.printErrorNotification(`OM-LOCKED_HOVER_MSG`, {lockedUser: res.username});
        this.cd.markForCheck();
      }
    });
  }

  getOrderEligibleStatus() {
    this.orderDetailsService.getOrderEligiableStatus(this.transactionId).subscribe(eligbleStatus => {
      this.manageOrders = eligbleStatus;
      this.cd.markForCheck();
    });
  }

  createForm() {
    this.orderStatusForm = this.fb.group({
      status: ['', Validators.required],
      message: ['', [Validators.maxLength(4000), CustomValidators.sanitization(this.patternMap)]]
    });
    this.disableMessage();
  }

  disableMessage() {
    this.orderStatusForm.get('message').disable({onlySelf: true, emitEvent: false});
  }

  getOrderDetails() {
    Promise
      .all([
        this.orderDetailsService.getPanels(this.transactionId),
        this.orderDetailsService.getOrderDetail(this.transactionId)
      ])
      .then(([panels, data]) => {
          this.loading = false;
          this.orderDetails = data;
          this.order.orderNumber = data.cartDetails.orderNumber;
          this.location = data.cartDetails.location;
          this.noContactDetails = (this.orderDetails.email === '' && this.orderDetails.fax === '' && this.orderDetails.houseNumber === ''
            && this.orderDetails.mobile === '' && this.orderDetails.name === '' && this.orderDetails.phone === '');
          this.panels = this.orderService.parsePanels(panels);
          this.panels.forEach(panel => {
            panel.contents.forEach(row => {
              row.forEach(field => {
                if (field.type === 'table') {
                  const radio = Object.keys(field.rows[0]).find(k => {
                    return field.rows[0][k].type === 'radio';
                  });
                  const selectedRow = data.cartDetails.details.panelFields
                    .find(f => f.fieldId === field.rows[0][radio].fieldId);
                  const fields = field.rows.find(r => r[radio].values[0].value === selectedRow.fieldValue);

                  Object.keys(fields).forEach(key => {
                    let f = fields[key];
                    const splitId = f.fieldId.split('-');
                    if (splitId.length) {
                      f.fieldId = splitId[splitId.length - 1];
                    }
                    this.setDefaultValues(data, f);
                  });
                } else {
                  this.setDefaultValues(data, field);
                }
              });
            });
          });
          this.cd.detectChanges();
        },
        error => {
          console.log('error', error);
        });
  }

  submitOrder() {
    this.showValidation = true;
    if (this.orderStatusForm && this.orderStatusForm.valid) {
      this.submitting = true;
      this.orderDetailsService.submitOrder(this.transactionId, this.orderStatusForm.controls)
        .pipe(finalize(() => this.submitting = false))
        .subscribe(res => {
          if (res && res.success) {
            this.backButton.emit(false);
          } else if (res && res.eligibilityFailed) {
            this.eligibilityFailed = true;
            this.openModal();
          } else {
            this.alertNotify.printErrorNotification(`<p><b>OM_OD_ERROR</b></p>`);
          }
        });
    } else {
      this.alertNotify.printErrorNotification('OM-FORM_ERROR_MSG');
    }
  }

  backbuttonClicked() {
    this.backButton.emit(false);
  }

  private setDefaultValues(data, field: Field) {
    const defaultValue = data.cartDetails.details.panelFields
      .find(f => f.fieldId === field.fieldId);
    if (defaultValue) {
      field.defaultValue = defaultValue.fieldValue === 'false' ? false : defaultValue.fieldValue;
    }
  }

  panelChange(event: any): void {
    this.toggle = !this.toggle;
    if (this.history.length === 0) {
      this.loadHistory = true;
      this.orderDetailsService.getOrderStatusHistory(this.transactionId).then(history => {
        this.loadHistory = false;
        this.history = history;
        this.detectChanges();
      });
    } else {
      this.detectChanges();
    }
  }

  detectChanges() {
    setTimeout(() => this.cd.detectChanges());
  }

  toggleAcc(event): void {
    this.toggleState = !this.toggleState;
  }

  cancelOrder() {
    this.orderDetailsService.unlockAnOrder(this.transactionId).subscribe(() => this.backbuttonClicked());
  }

  openModal() {
    this.modalService.open(this.msgContentModal, {backdrop: 'static', keyboard: false});
  }

  closeModal() {
    // reload the page whenever user clicks ok after he saw the message
    window.location.reload();
  }

  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
    this.statusSubscription.unsubscribe();
  }
}
