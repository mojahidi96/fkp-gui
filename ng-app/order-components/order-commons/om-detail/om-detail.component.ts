import {Component, Input, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {Language} from 'angular-l10n';
import {AddressActions} from '../../../flow-sections/address-selection/address-constants';
import {Address} from '../../../flow-sections/address-selection/create-edit-address/address';
import {NgbModalConfig, NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {OmDetailService} from './om-detail.service';
import {finalize} from 'rxjs/internal/operators';
import {DEBITOR_SELECTION_OPTION, DebitorAddress} from '../../../flow-sections/debitor-selection/debitor-address';
import {UtilsService} from '../../../sncr-components/sncr-commons/utils.service';

@Component({
  selector: 'om-detail',
  templateUrl: 'om-detail.component.html',
  styleUrls: ['om-detail.component.scss']
})
export class OmDetailComponent implements OnInit {

  @Input() countries;
  @Input() orderDetail;
  @Input() readonly: boolean;
  @Input() pattern: any;

  @ViewChild('editDebitorModal') editDebitorModal: TemplateRef<any>;

  @Language() lang;

  addressEditAction = AddressActions.EDIT;
  addressAddAction = AddressActions.ADD;
  dataLoading = true;
  deliveryCountries = [];
  newDebitorAddress: Partial<Address> = {};
  billingAddress: Partial<Address> = {};
  cpds = [];
  shippingAddress: Partial<Address> = {};
  debitorModalRef: NgbModalRef;
  editingBilling = false;
  editingVoid = false;
  loadingBilling = false;
  loadingShipping = false;
  loadingVoid = false;
  manualInput = 'debitor';
  newCPD = '';
  techFundStatus = '';
  newDebitorNumber: string;
  newVoId: string;
  tabSelected = 1;
  isDebitorEditable = false;
  addNewCPD = false;
  saveCPDnum = false;
  debitorNumberExist = false;
  debitorExistUrl = '/portal/rest/om/';
  isTabEnabled = true;
  pattren: any;
  billname2: string;
  billname3: string;
  billname4: string;

  techFundStatusVal = [
    {key: 'APPROVED', value: 'OM_TECHF-APP'},
    {key: 'REJECTINVALID', value: 'OM_TECHF-REJ'},
    {key: 'REJECTINSUFFICIENTFUND', value: 'OM_TECHF-REJFUND'}
  ];

  debitorStates = ['21', '22'];
  @Input() isEditable;
  private isInvalidCpd = false;
  private deleteCpd = false;


  constructor(config: NgbModalConfig,
              private ngbModal: NgbModal,
              private omDetailService: OmDetailService) {
    config.backdrop = 'static';
    config.keyboard = false;
  }

  ngOnInit(): void {
    this.newVoId = this.orderDetail.voId;
    this.orderDetail.techFund = this.debitorStates.includes(this.orderDetail.debitorState)  || this.orderDetail.debitorType === 'T';
    if (this.orderDetail.debitorType === 'T' || this.orderDetail.techFund) {
      this.newDebitorAddress.debitorType = 'T';
    }
    if (this.orderDetail.techFund) {
      this.orderDetail.debitorType = 'T';
    }
    this.isEditable = this.orderDetail.orderState !== '3';
    this.omDetailService.getBillingAddress().subscribe(response => {
      this.billingAddress = response;
      this.billname2 = this.billingAddress.street2;
      this.billname3 = this.billingAddress.street3;
      this.billname4 = this.billingAddress.street4;
    });
    this.omDetailService.getShippingAddress().subscribe(response => {
      this.shippingAddress = response;
    });

    this.omDetailService.getDeliveryCountries().subscribe(deliveryCountries => {
      if (UtilsService.notNull(deliveryCountries)) {
        this.deliveryCountries = Object.keys(deliveryCountries).map(key => {
          return {text: deliveryCountries[key], value: key.split('-')[1]}
        });
      }
    });
    this.isDebitorAddressEditable();
    this.isTabEnabled = this.orderDetail.debitorNumber === '000000' ||
      (this.orderDetail.techFund && this.orderDetail.debitorState === '21');
  }

  openDebitorModal() {
    this.tabSelected = (this.orderDetail.debitorNumber === '000000' || (this.orderDetail.debitorType === 'T' &&
      this.orderDetail.debitorState === '21')) ? 1 : 2;
    this.newDebitorNumber = '';
    this.resetDebitorPanel();
    this.getCpdNumbers();
    this.debitorModalRef = this.ngbModal.open(this.editDebitorModal);
  }

  billingOutput(event) {
    if (event.action !== AddressActions.CANCEL) {
      this.loadingBilling = true;
      this.billingAddress = event.value;
      this.billingAddress.billingAddress = true;
      this.omDetailService.saveAddress(this.billingAddress).subscribe(response => {
        if (response) {
          this.editingBilling = false;
          this.loadingBilling = false;
        }
      }, error => {
        console.error('error while updating billing-address');
        this.editingBilling = false;
        this.loadingBilling = false;
      });
    } else {
      this.editingBilling = false;
    }
  }

  saveVoId() {
    if (this.orderDetail.voId !== this.newVoId && this.newVoId !== '') {
      this.loadingVoid = true;
      this.omDetailService.updateVoId(this.newVoId).subscribe(response => {
        if (response) {
          this.orderDetail.voId = this.newVoId;
          this.loadingVoid = false;
          this.editingVoid = false;
        }
      }, error => {
        console.error('error while updating VO-ID number');
        this.loadingVoid = false;
        this.editingVoid = false;
      });
    } else {
      this.editingVoid = false;
    }
  }

  manualAdd() {
    this.debitorNumberExist = false;
    if (!this.addNewCPD) {
      let debitorAddress = new DebitorAddress();
      debitorAddress.debitorNumber = this.orderDetail.techFund ? this.orderDetail.debitorNumber : (this.manualInput === 'debitor') ?
        this.newDebitorNumber : this.newCPD;
      debitorAddress.debitorType = this.orderDetail.techFund ? 'T' : (this.manualInput === 'debitor') ? 'D' : 'C';
      debitorAddress.selectionOption = DEBITOR_SELECTION_OPTION.STANDARD;
      if (debitorAddress.debitorType === 'T') {
        debitorAddress.techFundStatus = this.techFundStatus;
      }
      if (!(this.manualInput === 'debitor' && this.newDebitorNumber === '000000')) {
        if (this.manualInput === 'debitor') {
          this.omDetailService.isDebitorNumberValid(debitorAddress.debitorNumber).subscribe(res => {
            if (res !== 0) {
              this.debitorNumberExist = true;
            } else {
              this.saveDebitorNumber(debitorAddress);
            }
          });
        } else {
          this.saveDebitorNumber(debitorAddress);
        }
      }
    } else {
      this.saveCPDnum = true;
    }
  }

  newDebitorOutput(event) {
    if (event.action !== AddressActions.CANCEL) {
      this.newDebitorAddress = event.value;
      let debitorAddress = new DebitorAddress();
      debitorAddress = event.value;
      if (event.type && event.type === 'T') {
        debitorAddress.debitorType = 'T';
      } else {
        debitorAddress.debitorType = 'D';
      }
      debitorAddress.selectionOption = DEBITOR_SELECTION_OPTION.NEW;
      this.omDetailService.saveDebitorNumber(debitorAddress).subscribe((response) => {
          this.isDebitorAddressEditable();
          this.orderDetail.debitorNumber = debitorAddress.debitorNumber;
          this.billingAddress = this.newDebitorAddress;
          this.newDebitorAddress = {};
          if (this.orderDetail.techFund) {
            this.newDebitorAddress.debitorType = 'T';
          }
          if (response !== null) {
            this.orderDetail.debitorState = response;
          }
        },
        error => {
          console.error('Error on addding debitor number');
        });
      this.orderDetail.debitorNumber = event.value.debitorNumber;
      this.debitorModalRef.close();
    } else {
      this.debitorModalRef.close();
    }
  }

  debitorSelection({data}) {
    this.billingAddress = data;
    this.orderDetail.debitorNumber = data.debitorNumber;
    this.debitorModalRef.close();
  }

  getCpdNumbers(): any {
    this.omDetailService.getCpdNumbers().pipe(finalize(() => this.dataLoading = false)).subscribe(val => {
      this.cpds = val.map(element => {
        if (element['oneTimeDebitor'] !== '000000') {
          element.data = element['oneTimeDebitor'];
        }
        return element;
      });
    });
  }

  nextSection(event: any) {
    let debitorAddress = new DebitorAddress();
    debitorAddress = event.value;
    debitorAddress.selectionOption = DEBITOR_SELECTION_OPTION.EXIST;
    this.omDetailService.saveDebitorNumber(debitorAddress).subscribe((response) => {
        this.isDebitorAddressEditable();
        this.orderDetail.debitorNumber = debitorAddress.debitorNumber;
        this.billingAddress = event.value;
        if (response !== null) {
          this.orderDetail.debitorState = response;
        }
      },
      error => {
        console.error('Error on addding debitor number');
      });
    this.debitorModalRef.close();
  }

  resetDebitorPanel() {
    this.techFundStatus = '';
    this.newCPD = '';
    this.manualInput = 'debitor';
    this.saveCPDnum = false;
    this.isInvalidCpd = false;
    this.debitorNumberExist = false;
  }

  isDebitorAddressEditable() {
    this.omDetailService.isDebitorEditable().subscribe(debEditable => {
      this.isDebitorEditable = debEditable;
    });
  }

  editVoid(event: boolean): void {
    if (event) {
      this.editingVoid = true;
    } else {
      this.editingVoid = false;
      this.newVoId = this.orderDetail.voId;
    }
  }

  checkNewCpd(newCPd) {
    this.isInvalidCpd = false;
    if (this.manualInput === 'cpd') {
      this.addNewCPD = !this.cpds.some(cpd => cpd.data === newCPd.value);
      this.deleteCpd = newCPd.value === '000000' || !this.addNewCPD;
    }
  }

  saveOneTimeDebitor() {
    this.omDetailService.saveCpdNumber(this.newCPD).subscribe(() => {
      this.cpds.push({oneTimeDebitor: this.newCPD, data: this.newCPD});
      this.addNewCPD = false;
      this.saveCPDnum = false;
      this.deleteCpd = true;
    });
  }

  deleteCpdNumber() {
    if (this.newCPD !== '000000') {
      this.omDetailService.deleteCpdNumber(this.newCPD).subscribe((response) => {
        if (response) {
          this.getCpdNumbers();
          this.resetDebitorPanel();
          this.manualInput = 'cpd';
        }
      });
    } else {
      this.isInvalidCpd = true;
      this.deleteCpd = false;
      this.addNewCPD = false;
    }
  }

  saveDebitorNumber(debitorAddress: DebitorAddress) {
    this.omDetailService.saveDebitorNumber(debitorAddress).subscribe((response) => {
        if (response != null) {
          this.orderDetail.debitorNumber = debitorAddress.debitorNumber;
          this.isDebitorAddressEditable();
          this.isTabEnabled = debitorAddress.debitorNumber === '000000' ||
            (debitorAddress.debitorType === 'T' && response === '21');
          this.orderDetail.debitorState = response;
        }
        this.resetDebitorPanel();
        this.debitorModalRef.close();
        this.saveCPDnum = false;
      },
      error => {
        console.error('Error on addding debitor number');
      });
  }

  onTabChanged($event) {
    this.newCPD = '';
    this.newDebitorNumber = '';
  }
}
