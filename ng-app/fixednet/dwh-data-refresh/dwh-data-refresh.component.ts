import {Component, OnInit, ViewChild} from '@angular/core';
import {FnShop} from '../common/fn-shop';
import {DwhDataRefreshService} from './dwh-data-refresh.service';
import {NotificationHandlerService} from '../../sncr-components/sncr-notification/notification-handler.service';
import {Router} from '@angular/router';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DwhDataRefreshConfig} from './dwh-data-refresh.config';
import {FnUserDetails} from '../common/fn-user-details';
import {FixedNetService} from '../fixednet.service';
import {CreateEditShop} from '../common/create-edit-shop/create-edit-shop';
import {CustomValidators} from '../../sncr-components/sncr-controls/custom-validators';
import {SncrDatatableComponent} from '../../sncr-components/sncr-datatable/sncr-datatable.component';

@Component({
  selector: 'dwh-data-refresh',
  templateUrl: 'dwh-data-refresh.component.html',
  styleUrls: ['dwh-data-refresh.component.scss']
})
export class DwhDataRefreshComponent extends CreateEditShop implements OnInit {
  flow: string;
  cols: Array<any> = [];
  selected = [];
  dwhRefreshData: Array<FnShop> = [];
  dwhRefreshDataCopy: Array<FnShop> = [];
  loading = false;
  ngbRef: NgbModalRef;
  onboardForm: FormGroup;
  fnShop: FnShop;
  onBoarding = false;
  modalError = false;
  selectedCopy = [];
  notify: NotificationHandlerService = new NotificationHandlerService();
  fnUser: FnUserDetails = new FnUserDetails();
  lastValidcustomerHierarchy: string;
  lastValidcustomerNumber: string;
  @ViewChild('onboarding') dataTableComponent: SncrDatatableComponent;

  constructor(private dwhDataRefreshService: DwhDataRefreshService, private router: Router, private modalService: NgbModal,
              private formBuilder: FormBuilder, private fixedNetService: FixedNetService) {
    super(fixedNetService);
  }

  ngOnInit(): void {
    this.lastValidcustomerHierarchy = '';
    this.lastValidcustomerNumber = '';
    this.flow = location.hash.split('/')[1];
    this.notify.clearNotification();
    this.loading = true;
    this.cols = [
      {title: 'Kundennummer', field: 'fnCustomerNumber', show: true, sortable: true},
      {title: 'Kundenname', field: 'customerName', show: true, sortable: true},
      {title: 'Top-Level Kunde', field: 'fnRootCustomerNumber', show: true, sortable: true},
      {title: 'Top-Level Name', field: 'rootCustomerName', show: true, sortable: true},
      {title: 'Status', field: 'status', show: true, sortable: true},
      {title: 'Letzter Refresh', field: 'lastRefreshEpoachTime', show: true, sortable: true, type: 'date'}
    ];

    this.fnUser = this.fixedNetService.getFnUser();

    this.dwhDataRefreshService.getDwhRefreshList(this.flow).then(data => {
        this.loading = false;
        this.dwhRefreshData = data;
      },
      error => {
        this.notify.printErrorNotification(error);
      }
    );

    this.fnShop = new FnShop;
    this.createForm();
  }

  validateNumberInputs(fieldName: string) {
    if (this.onboardForm.get(fieldName).errors && !(this.onboardForm.get(fieldName).errors.required 
    && !this.onboardForm.get(fieldName).pristine)) {
      this.onboardForm.setValue({customerHierarchy: this.lastValidcustomerHierarchy, customerNumber: this.lastValidcustomerNumber});
    } else {
      if (fieldName === 'customerNumber') {
        this.lastValidcustomerNumber = this.onboardForm.get(fieldName).value;
      } else {
        this.lastValidcustomerHierarchy = this.onboardForm.get(fieldName).value;
      }
    }
  }

  cancelRefreshChanges() {
    this.router.navigate(['/fixednet/home']);
  }

  openOnboardModal(content) {
    this.ngbRef = this.modalService.open(content, {backdrop: 'static'});
  }


  cancelRefreshDisable(): boolean {
    return (!this.selected.some(refreshData => {
      // The customers which are already requested or ones with FAILURE status  should be able to cancel the refresh
      return refreshData.status.toLowerCase() === DwhDataRefreshConfig.REQUESTED.toLowerCase() ||
        refreshData.status.toLowerCase() === DwhDataRefreshConfig.FAILURE.toLowerCase();
    }) || (this.fnUser && this.fnUser.isReadOnlyUser));
  }

  submitRefreshDisable(): boolean {
    return (!this.selected.some(refreshData => {
      // The customers which are already complete or ones with FAILURE status should be able to again refresh
      return refreshData.status.toLowerCase() === DwhDataRefreshConfig.COMPLETE.toLowerCase() ||
        refreshData.status.toLowerCase() === DwhDataRefreshConfig.FAILURE.toLowerCase();
    }) || (this.fnUser && this.fnUser.isReadOnlyUser));
  }

  saveOnboardCustomer(form) {
    if (form.valid && this.fnUser && !this.fnUser.isReadOnlyUser) {
      this.dataTableComponent.resetAllFilters();
      this.dataTableComponent.resetAdvancedFilter();
      let customerData = form.value;
      if (customerData.customerHierarchy.trim()) {
        this.loading = true;
        this.onBoarding = true;
        this.dwhRefreshDataCopy = this.dwhRefreshData;
        this.dwhRefreshData = [];
        this.fnShop.fnRootCustomerNumber = customerData.customerHierarchy.trim();
        this.fnShop.fnCustomerNumber = customerData.customerNumber ? customerData.customerNumber.trim() : null;
        if (this.fnShop.fnCustomerNumber && this.fnShop.fnRootCustomerNumber === this.fnShop.fnCustomerNumber) {
          // if the hierarchy number and customer number is equal then set number as null
          this.fnShop.fnCustomerNumber = null;
        }
        this.fnShop.status = 'REQUESTED';

        this.dwhDataRefreshService.onBoardCustomerForRefresh(this.fnShop, this.flow).then(data => {
            if (data.fullRefresh) {
              this.modalError = true;
              this.dwhRefreshData = this.dwhRefreshDataCopy;
              this.setErrorMessageWithTimeout(DwhDataRefreshConfig.REFRESH_FAILURE);
            } else {
              this.dwhRefreshDataCopy.push(data);
              if (data.status) {
                data.status = data.status === 'REQUESTED' ? DwhDataRefreshConfig.REQUESTED : '';
              }
              this.dwhRefreshData = this.dwhRefreshDataCopy;
              this.ngbRef.close('save done');
              this.notify.printSuccessNotification('Datenaktualisierung wurde angefordert.');
              this.lastValidcustomerHierarchy = '';
              this.lastValidcustomerNumber = '';
              this.createForm();
            }
            this.loading = false;
            this.onBoarding = false;
            // this.notify.clearNotification();
          }
        ).catch(error => {
            this.dwhRefreshData = this.dwhRefreshDataCopy;
            this.loading = false;
            this.onBoarding = false;
            this.modalError = true;
            this.setErrorMessageWithTimeout(DwhDataRefreshConfig.REFRESH_FAILURE);
          }
        );
      }
    }
  }

  disableSaveButton(): boolean {
    if (!this.onboardForm.controls['customerHierarchy'].value || (this.fnUser && this.fnUser.isReadOnlyUser)) {
      return true;
    }

    return false;
  }

  createForm() {
    this.onboardForm = this.formBuilder.group({
      customerHierarchy: ['', [Validators.required, Validators.pattern('^[0-9]+$'), CustomValidators.sanitization(this.patternMap),
        Validators.maxLength(20)]],
      customerNumber: ['', [Validators.pattern('^[0-9]+$'), CustomValidators.sanitization(this.patternMap), Validators.maxLength(20)]]
    });
  }

  cancelRefresh(): void {
    this.selectedCopy = [...this.selected.filter(customer => {
      if (customer.status) {
        return customer.status.toLowerCase() === DwhDataRefreshConfig.REQUESTED.toLowerCase() ||
          customer.status.toLowerCase() === DwhDataRefreshConfig.FAILURE.toLowerCase();
      }
    })];

    if (this.selectedCopy.length > 0) {
      this.refresh('cancel');
    }
  }

  submitRefresh(): void {
    this.selectedCopy = [...this.selected.filter(customer => {
      if (customer.status) {
        return customer.status.toLowerCase() === DwhDataRefreshConfig.COMPLETE.toLowerCase() ||
          customer.status.toLowerCase() === DwhDataRefreshConfig.FAILURE.toLowerCase();
      }
    })];

    if (this.selectedCopy.length > 0) {
      this.refresh('submit');
    }
  }


  setErrorMessageWithTimeout(message: string) {
    setTimeout(() => this.notify.printErrorNotification(message));
  }

  hideContent() {
    return this.loading && !this.onBoarding;
  }

  refresh(type: 'submit' | 'cancel') {
    this.loading = true;
    if (type === 'submit') {
      this.dwhDataRefreshService.refreshAction(this.selectedCopy, this.flow, 'refresh').then(data => {
        this.printSuccess(data)
      }, error => {
        this.printError(error)
      })
    } else {
      this.dwhDataRefreshService.refreshAction(this.selectedCopy, this.flow, 'cancel').then(data => {
        this.printSuccess(data)
      }, error => {
        this.printError(error)
      })
    }
  }

  printError(error) {
    this.loading = false;
    this.notify.printErrorNotification(error);
  }

  printSuccess(data) {
    this.loading = false;
    this.dwhRefreshData = [...data];
    this.selected = [];
    this.notify.printSuccessNotification('Status der Aktualisierung wurde geändert.');
  }
}
