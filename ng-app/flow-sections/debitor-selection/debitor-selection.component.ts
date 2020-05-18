import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, TemplateRef, ViewChild} from '@angular/core';
import {AddressActions, AddressConstants, ShipmentActions} from '../address-selection/address-constants';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {Store} from '@ngxs/store';
import {TimeoutService} from '../../app/timeout/timeout.service';
import {UtilsService} from '../../sncr-components/sncr-commons/utils.service';
import {DebitorSelectionService} from './debitor-selection.service';
import {Debitor, SelectionType} from '../address-selection/address';
import {finalize} from 'rxjs/operators';
import {DebitorConstants} from './debitor-constants';
import {SncrDatatableComponent} from '../../sncr-components/sncr-datatable/sncr-datatable.component';

@Component({
  selector: 'debitor-selection',
  templateUrl: './debitor-selection.component.html',
  styleUrls: ['./debitor-selection.component.scss']
})
export class DebitorSelectionComponent implements OnInit, OnChanges {
  @Input() addressSelectionType: string;
  @Input() isSocChanged: boolean;
  @Input() countries = [];
  @Input() pattern: any;
  @Input() flowType: string;
  @Output() debitorSetting = new EventEmitter();
  @Input() isSammelDChanged: boolean;
  @Input() debitorSelected = '';

  @Output() onSelection = new EventEmitter();
  @Output() nextSelection = new EventEmitter();

  @ViewChild('editOrDelete', {static: true}) editOrDelete: TemplateRef<any>;
  @ViewChild('standard', {static: true}) standard: TemplateRef<any>;
  @ViewChild('fullAddress', {static: true}) fullAddress: TemplateRef<any>;
  @ViewChild('fullName', {static: true}) fullName: TemplateRef<any>;
  @ViewChild('techFund', {static: true}) techFund: TemplateRef<any>;
  @ViewChild('debitorNumberTemp', {static: true}) debitorNumberTemp: TemplateRef<any>;
  @ViewChild('deletecontent') deleteContent: TemplateRef<any>;
  @ViewChild('debitorTable') debitorTable: SncrDatatableComponent;

  @Input() set reload(reload: boolean) {
    if (reload && this.componentLoaded) {
      this.ngOnInit();
    }
  }

  pleaseSelectAddress: boolean;
  selectedAction: string = AddressActions.SELECT;
  actions = AddressActions;
  selectedAddress: any;
  defaultAddress: any;
  addressType = 'DEBITOR';
  showValidation = false;
  selectedRow: any;
  deletedRow: any;
  selectedShipmentAction: any;
  private modalRef: NgbModalRef;
  sammelDebitors = [];
  isTechfundEnabled = false;
  newAddress = false;
  newAddressDetails: any;
  debitorAddressList = [];
  processing = true;
  cols = [];
  adressAction = new Debitor();
  continueOnDefault: boolean;
  url: string;
  disableOnceClicked = false;
  hideDebitorDetails = 'N';
  hideNewDebitor = 'N';
  componentLoaded = false;

  constructor(private store: Store, private modalService: NgbModal,
              private timeoutService: TimeoutService, private debitorSelectionService: DebitorSelectionService) {
  }

  ngOnInit() {
    this.componentLoaded = true;
    this.selectedShipmentAction = ShipmentActions.SAVED;
    if (this.timeoutService.topBar) {
      this.isTechfundEnabled = this.timeoutService.topBar.techfundEnabled;
    }
    if (this.flowType === 'OM') {
      this.url = DebitorConstants.get_urls['OM_DEBITOR'];
    } else {
      this.url = DebitorConstants.get_urls['DEFAULT'];
    }

    this.continueOnDefault = true;
    this.loadDebitors();
    this.selectedAction = this.actions.SELECT;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isSammelDChanged'] && !(changes['isSammelDChanged'].firstChange)) {
      this.hideDebitorDetails = 'N';
      this.hideNewDebitor = 'N';
      this.loadDebitors();
    }
  }

  getKey(key: string, withoutPrefix = false) {
    return withoutPrefix ? key : this.addressSelectionType + key;
  }

  loadDebitors() {
    if (this.debitorTable) {
      this.debitorTable.resetAdvancedFilter();
    }
    this.debitorSelectionService.getAvailableAddressList(this.url)
      .subscribe(value => {
        this.debitorSetting.emit(value);
        this.hideNewDebitor = value.hideNewDebitor;
        this.hideDebitorDetails = value.hideDebitorDetails;
        if (UtilsService.notNull(value.debitors) && value.debitors.length) {
          this.sammelDebitors = value.debitors.filter(adr => adr.debitorType === 'S').map(rec => {
            return {'debitorNumber': rec.debitorNumber, 'debitorId': rec.debitorId}
          });
          if (this.sammelDebitors.length > 0) {
            this.isTechfundEnabled = false;
            if (this.debitorSelected === '') {
              this.debitorSelected = this.sammelDebitors[0].debitorId;
            }
            this.addressType = 'SHIPMENT';
            this.hideNewDebitor = 'N';
            this.hideDebitorDetails = 'N';
            this.debitorSelectionService.getAvailableShipmetList().subscribe(val => {
              this.patchAddress(val);
            });
            this.debitorSelectionService.getDeliveryCountries().subscribe(deliveryCountries => {
              if (UtilsService.notNull(deliveryCountries)) {
                this.countries = Object.keys(deliveryCountries).map(key => {
                  return {text: deliveryCountries[key], value: key.split('-')[1]}
                });
              }
            });
          } else {
            this.patchAddress(value.debitors);
          }
        } else {
          this.cols = this.setColsDetails();
          this.processing = false;
        }
      });
  }

  patchAddress(data: any) {
    data.forEach(item => {
      item.fullName = this.adressAction.generateFullName(item);
      item.fullAddress = this.adressAction.generateFullAddress(item);
      if (item.default) {
        this.defaultAddress = item;
      }
    });
    this.cols = this.flowType === 'OM' ? this.setOMColsDetails() : this.setColsDetails();
    this.debitorAddressList = [...data];
    if (this.newAddress && UtilsService.notNull(this.newAddressDetails)) {
      this.debitorAddressList = [this.newAddressDetails, ...this.debitorAddressList];
    }
    this.processing = false;
    if (this.defaultAddress && this.defaultAddress.addressId && !(this.sammelDebitors.length > 0) && this.continueOnDefault) {
      this.selectedAddress = this.defaultAddress;
      this.selectedAddress.selectionType = SelectionType.existing;
      this.continueToNextSelection();
    }
  }

  setColsDetails() {
    const addressConstants = AddressConstants;
    let reqColms = this.sammelDebitors.length > 0 ? 'sammelColumns' : 'debitorColumns';
    let cols = addressConstants.columns[reqColms];
    let colCount = 1;
    cols[cols.length - colCount++].bodyTemplate = this.editOrDelete;
    if (reqColms === 'debitorColumns') {
      cols[cols.length - colCount++].bodyTemplate = this.standard;
      cols[cols.length - colCount++].bodyTemplate = this.techFund;
    }
    cols[cols.length - colCount++].bodyTemplate = this.fullAddress;
    cols[cols.length - colCount++].bodyTemplate = this.fullName;
    if (reqColms === 'debitorColumns') {
      cols[cols.length - colCount].bodyTemplate = this.debitorNumberTemp;
    }
    return cols;
  }

  getFullNamePart1(item): string {
    if (this.hideDebitorDetails === 'N') {
      return (item.street1 ? item.street1 : '') + (item.street2 ? ' ' + item.street2 : '');
    } else {
      return item.street1 ? item.street1 : '';
    }
  }

  checkIfSammelExists() {
    return this.addressSelectionType = 'DEBITOR';
  }

  createAddress() {
    this.selectedRow = [];
    this.selectedAction = this.actions.ADD;
  }

  onAddressSelect(event) {
    if (!event.data.readOnly && !event.originalEvent.target.className.includes('preventRowClick') && !this.disableOnceClicked) {
      this.disableOnceClicked = true;
      this.selectedAddress = {...(event.data)};
      this.selectedAddress.selectionType = SelectionType.existing;
      if (!this.sammelDebitors && this.addressSelectionType === 'SHIPMENT') {
        this.selectedAddress.selectionOption = this.selectedShipmentAction;
      } else {
        this.setSammelDebitor();
      }
      this.selectedAddress.fullName = this.adressAction.generateFullName(this.selectedAddress);
      this.selectedAddress.fullAddress = this.adressAction.generateFullAddress(this.selectedAddress);
      this.continueToNextSelection();
    }
  }

  saveForm(event) {
    if (event.action !== this.actions.CANCEL) {
      this.disableOnceClicked = true;
    }
    if (event.action === this.selectedAction) {
      if (this.selectedAction === this.actions.EDIT) {
        if (this.sammelDebitors.length > 0) {
          this.editShipment(event);
        } else {
          this.editDebitor(event);
        }

      }
      this.selectedAddress = Object.assign(new Debitor(),
        this.selectedAction === this.actions.EDIT ? this.selectedRow : event.value);

      // set debitor type for new debitor
      if (this.selectedAddress.techFund) {
        this.selectedAddress.debitorType = 'T';
      } else if (!this.selectedAddress.debitorNumber) {
        this.selectedAddress.debitorType = 'D';
        this.selectedAddress.debitorNumber = '';
      }


      if (this.sammelDebitors.length > 0) {
        this.setSammelDebitor();
      }

      this.selectedAddress.fullName = this.adressAction.generateFullName(this.selectedAddress);
      this.selectedAddress.fullAddress = this.adressAction.generateFullAddress(this.selectedAddress);
      this.selectedAddress.selectionType = SelectionType.new;
      if (this.selectedAction === this.actions.ADD) {
        this.selectedAddress.newAddress = true;
        this.selectedAddress.color = 'new';
        this.selectedAddress.debitorNumber = this.selectedAddress.debitorNumber ? this.selectedAddress.debitorNumber : '000000';
        this.debitorAddressList = [this.selectedAddress, ...this.debitorAddressList];
        this.newAddress = true;
        this.newAddressDetails = this.selectedAddress;
      }
      this.continueToNextSelection();
    }
    this.selectedAction = this.actions.SELECT;
  }

  setSammelDebitor() {
    if (UtilsService.notNull(this.debitorSelected) && UtilsService.notNull(this.sammelDebitors) && this.sammelDebitors.length) {
      this.selectedAddress.debitorType = 'S';
      let debitor = this.sammelDebitors.find(deb => deb.debitorId === this.debitorSelected);
      if (debitor) {
        this.selectedAddress.debitorNumber = debitor.debitorNumber;
        this.selectedAddress.debitorId = debitor.debitorId;
      }
    }
  }

  continueToNextSelection() {
    if (this.selectedAddress) {
      this.pleaseSelectAddress = false;
      if (this.sammelDebitors.length > 0) {
        this.setSammelDebitor();
      }
      if (this.sammelDebitors.length > 0 && (this.selectedAction === this.actions.ADD || this.selectedAction === this.actions.EDIT)) {
        this.debitorSelectionService.updateAddress(this.selectedAddress).subscribe(val => {
          if (this.selectedAddress.newAddress) {
            this.selectedAddress.selectionOption = 'T';
            this.selectedAddress.addressId = val.addressId;
          }
          this.saveAddressAndContinue();
        });
      } else if (this.flowType === 'OM') {
        this.disableOnceClicked = false;
        this.nextSelection.emit({value: this.selectedAddress});
      } else {
        this.saveAddressAndContinue();
      }
    } else {
      this.pleaseSelectAddress = true;
    }
  }

  editDebitor(event) {
    this.selectedRow.street2 = event.value['street2'];
    this.selectedRow.street3 = event.value['street3'];
    this.selectedRow.street4 = event.value['street4'];
    this.selectedRow.isModified = true;
    this.selectedRow.modified = true;
    this.selectedRow.fullName = this.adressAction.generateFullName(this.selectedRow);
  }

  editShipment(event) {
    this.selectedRow.street1 = event.value['street1'];
    this.selectedRow.street2 = event.value['street2'];
    this.selectedRow.street3 = event.value['street3'];
    this.selectedRow.streetName = event.value['streetName'];
    this.selectedRow.houseNumber = event.value['houseNumber'];
    this.selectedRow.postalCode = event.value['postalCode'];
    this.selectedRow.city = event.value['city'];
    this.selectedRow.country = event.value['country'];
    this.selectedRow.fullName = this.adressAction.generateFullName(this.selectedRow);
    this.selectedRow.fullAddress = this.adressAction.generateFullAddress(this.selectedRow);
  }

  deletePopUpModel(row) {
    this.disableOnceClicked = false;
    this.deletedRow = row;
    this.modalRef = this.modalService.open(this.deleteContent);
  }

  deleteAddress() {
    this.disableOnceClicked = true;
    this.debitorSelectionService.deleteShipmentAddress(this.deletedRow).subscribe(() => {
      this.continueOnDefault = false;
      this.disableOnceClicked = false;
      this.loadDebitors();
    });
    this.modalRef.close();
  }

  editAddress(row) {
    this.selectedRow = row;
    this.selectedAction = this.actions.EDIT;
    this.checkIfSammelExists();
  }


  setDefaultAddress(row) {
    let makeDebitorDefault = !(this.defaultAddress && row.debitorId === this.defaultAddress.debitorId);
    this.defaultAddress = row;

    this.processing = true;
    this.debitorSelectionService.defaultAddress(this.defaultAddress, makeDebitorDefault)
      .pipe(finalize(() => this.processing = false)).subscribe(() => {
      if (!makeDebitorDefault) {
        delete this.defaultAddress;
      }
      this.continueOnDefault = false;
      this.loadDebitors();
    });
  }

  saveAddressAndContinue() {
    const saveDebitorAddress = {
      selectedAddress: new Debitor()
    };
    saveDebitorAddress.selectedAddress = this.selectedAddress;
    this.debitorSelectionService.saveAddress(saveDebitorAddress).subscribe(() => {
      this.disableOnceClicked = false;
      this.nextSelection.emit({selectedAddress: this.selectedAddress, addressType: 'DEBITOR'});
    });
  }

  /**
   * Set the Order Manager debitor selection table columns
   * @returns any
   */
  setOMColsDetails() {
    const addressConstants = AddressConstants;
    let reqColms = 'omDebitorColumns';
    let cols = addressConstants.columns[reqColms];
    let colCount = 1;
    cols[cols.length - colCount++].bodyTemplate = this.techFund;
    cols[cols.length - colCount++].bodyTemplate = this.fullAddress;
    cols[cols.length - colCount++].bodyTemplate = this.fullName;
    cols[cols.length - colCount].bodyTemplate = this.debitorNumberTemp;
    return cols;
  }

}


