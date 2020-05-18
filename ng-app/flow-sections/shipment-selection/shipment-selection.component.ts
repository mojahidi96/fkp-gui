import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, TemplateRef, ViewChild} from '@angular/core';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {ShipmentSelectionService} from './shipment-selection.service';
import {UtilsService} from '../../sncr-components/sncr-commons/utils.service';
import {SelectionType, Shipment} from '../address-selection/address';
import {AddressActions, AddressConstants, ShipmentActions} from '../address-selection/address-constants';
import {finalize} from 'rxjs/operators';
import {Language} from 'angular-l10n';

@Component({
  selector: 'shipment-selection',
  templateUrl: './shipment-selection.component.html',
  styleUrls: ['./shipment-selection.component.scss']
})
export class ShipmentSelectionComponent implements OnInit, OnChanges {
  @Input() addressSelectionType: string;
  @Input() pattern: any;
  @Input() showOnlyDebitorsList = false;
  @Input() debitorAddress: any;
  @Input() isDebitorChanged: any;
  @Input() selectedShipmentAction: any;
  @Input() prefilled = false;
  @Output() onSelection = new EventEmitter();
  @Output() nextSelection = new EventEmitter();
  @ViewChild('editOrDelete', {static: true}) editOrDelete: TemplateRef<any>;
  @ViewChild('standard', {static: true}) standard: TemplateRef<any>;
  @ViewChild('fullAddress', {static: true}) fullAddress: TemplateRef<any>;
  @ViewChild('fullName', {static: true}) fullName: TemplateRef<any>;
  @ViewChild('deletecontent') deleteContent: TemplateRef<any>;
  @Language() lang;


  shipmentAddressList: any[];
  countries = [];
  cols: any[];
  defaultAddress: any;
  continueOnDefault: boolean;
  adressAction = new Shipment();
  selectedAction: string = AddressActions.SELECT;
  actions = AddressActions;
  selectedAddress: any;
  saveSelectedAddress: any;
  commonConstants = AddressConstants;
  showValidation = false;
  selectedRow: any;
  deletedRow: any;
  processing: any;
  modalRef: NgbModalRef;
  newAddress = false;
  shipmentActions = ShipmentActions;
  disableOnceClicked = false;
  componentLoaded = false;

  constructor(private modalService: NgbModal,
              private shipmentService: ShipmentSelectionService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['debitorAddress']) {
      if (!this.prefilled && UtilsService.notNull(this.selectedShipmentAction) ||
        (!changes['debitorAddress'].firstChange && this.selectedShipmentAction !== this.shipmentActions.SAVED)) {
        this.selectedShipmentAction = this.shipmentActions.SAVED;
        this.ngOnInit();
      }
    }
  }

  ngOnInit() {
    this.componentLoaded = true;
    this.shipmentActions = ShipmentActions;
    if (!this.selectedShipmentAction) {
      this.selectedShipmentAction = this.shipmentActions.SAVED;
    }
    this.processing = true;
    this.cols = this.setColsDetails();
    this.continueOnDefault = true;
    this.loadShipMentAddress();
  }

  loadShipMentAddress() {
    this.shipmentService.getAvailableAddressList().subscribe(value => {
      if (UtilsService.notNull(value) && value.length) {
        this.patchAddress(value);
      } else {
        this.shipmentAddressList = [];
        this.processing = false;
      }
    });
    this.shipmentService.getDeliveryCountries().subscribe(deliveryCountries => {
      if (UtilsService.notNull(deliveryCountries)) {
        this.countries = Object.keys(deliveryCountries).map(key => {
          return {text: deliveryCountries[key], value: key.split('-')[1]}
        });
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
    this.shipmentAddressList = [...data];
    this.processing = false;
    if (this.defaultAddress && this.defaultAddress.addressId && this.continueOnDefault) {
      this.selectedAddress = this.defaultAddress;
      this.selectedAddress.selectionType = SelectionType.existing;
      this.selectedAddress.selectionOption = this.selectedShipmentAction;
      if (this.selectedShipmentAction && this.selectedShipmentAction === 'T') {
        this.continueToNextSelection();
      }
    }
  }

  setColsDetails() {
    const addressConstants = AddressConstants;
    let cols = addressConstants.columns[this.addressSelectionType.toLocaleLowerCase() + 'Columns'];
    let colCount = 1;
    cols[cols.length - colCount++].bodyTemplate = this.editOrDelete;
    cols[cols.length - colCount++].bodyTemplate = this.standard;
    cols[cols.length - colCount++].bodyTemplate = this.fullAddress;
    cols[cols.length - colCount].bodyTemplate = this.fullName;
    return cols;
  }

  getKey(key: string, withoutPrefix = false) {
    return withoutPrefix ? key : this.addressSelectionType + key;
  }

  saveForm(event) {
    if (event.action !== this.actions.CANCEL) {
      this.disableOnceClicked = true;
    }
    if (event.action === this.selectedAction) {
      if (this.selectedAction === this.actions.EDIT) {
        this.editShipment(event);
      }
      this.selectedAddress = Object.assign(new Shipment(),
        this.selectedAction === this.actions.EDIT ? this.selectedRow : event.value);
      this.selectedAddress.selectionOption = this.selectedShipmentAction;

      this.selectedAddress.fullName = this.adressAction.generateFullName(this.selectedAddress);
      this.selectedAddress.fullAddress = this.adressAction.generateFullAddress(this.selectedAddress);
      this.selectedAddress.selectionType = SelectionType.new;
      this.continueToNextSelection();
    }
    this.newAddress = event.action === this.actions.ADD;
    this.selectedAction = this.actions.SELECT;
  }

  continueToNextSelection() {
    if (this.selectedShipmentAction !== this.shipmentActions.SAVED) {
      this.selectedAddress = new Shipment();
      this.selectedAddress.selectionOption = this.selectedShipmentAction;
      this.selectedAddress.selectedDescription = this.commonConstants.shipmentKeyType[this.selectedShipmentAction];
      this.saveAddressAndContinue();
    } else if (this.selectedAddress && this.selectedShipmentAction === this.shipmentActions.SAVED) {
      if (this.selectedAction === this.actions.ADD || this.selectedAction === this.actions.EDIT) {
        if (this.selectedAction === this.actions.ADD) {
          this.selectedAddress.newAddress = true;
          this.selectedAddress.color = 'new';
          this.selectedAddress.debitorNumber = this.selectedAddress.debitorNumber ? this.selectedAddress.debitorNumber : '000000';
          this.shipmentAddressList = [this.selectedAddress, ...this.shipmentAddressList];
        }
        const action = {
          selectedAddress: this.selectedAddress,
        };
        this.shipmentService.updateAddress(action).subscribe(val => {
          if (this.selectedAddress.newAddress) {
            this.selectedAddress.selectionOption = 'T';
            this.selectedAddress.addressId = val.addressId;
          }
          this.saveAddressAndContinue();
        });
      } else if (this.selectedShipmentAction === 'T') {
        this.saveAddressAndContinue();
      }
    }
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


  setDefaultAddress(row) {
    let makeDebitorDefault = !(this.defaultAddress && row.addressId === this.defaultAddress.addressId);
    this.defaultAddress = row;
    this.processing = true;
    this.shipmentService.defaultAddress(this.defaultAddress, makeDebitorDefault)
      .pipe(finalize(() => this.processing = false)).subscribe(() => {
      if (!makeDebitorDefault) {
        delete this.defaultAddress;
      }
      this.continueOnDefault = false;
      this.loadShipMentAddress();
    });
  }

  deletePopUpModel(row) {
    this.disableOnceClicked = false;
    this.deletedRow = row;
    this.modalRef = this.modalService.open(this.deleteContent);
  }

  deleteAddress() {
    this.disableOnceClicked = true;
    this.shipmentService.deleteAddress(this.deletedRow).subscribe(() => {
      this.continueOnDefault = false;
      this.disableOnceClicked = false;
      this.loadShipMentAddress();
      this.modalRef.close();
    });
  }

  editAddress(row) {
    this.selectedRow = row;
    this.selectedAction = this.actions.EDIT;
  }

  createAddress() {
    this.selectedRow = [];
    this.selectedAction = this.actions.ADD;
  }

  continueToNext(action: any) {
    this.selectedAction = this.actions.SELECT;
    this.selectedShipmentAction = action;
    if (this.selectedShipmentAction === this.shipmentActions.SAVED) {
      delete this.selectedAddress;
    } else {
      this.continueToNextSelection();
    }
  }

  disableDebitorAddresse(): boolean {
    return (this.debitorAddress.country === 'Deutschland')
      && (this.debitorAddress.street4 === '' || !UtilsService.notNull(this.debitorAddress.street4));
  }

  onAddressSelect(event) {
    if (!event.data.readOnly && !event.originalEvent.target.className.includes('preventRowClick') && !this.disableOnceClicked) {
      this.disableOnceClicked = true;
      this.selectedAddress = {...(event.data)};
      this.selectedAddress.selectionType = SelectionType.existing;
      this.selectedAddress.selectionOption = this.selectedShipmentAction;
      this.selectedAddress.fullName = this.adressAction.generateFullName(this.selectedAddress);
      this.selectedAddress.fullAddress = this.adressAction.generateFullAddress(this.selectedAddress);
      this.continueToNextSelection();
    }
  }

  saveAddressAndContinue() {
    this.saveSelectedAddress = new Shipment();
    this.saveSelectedAddress.selectionOption = this.selectedShipmentAction;
    if (this.saveSelectedAddress.selectionOption && this.selectedShipmentAction === this.shipmentActions.SAVED) {
      this.saveSelectedAddress.addressId = this.selectedAddress.addressId
    }
    this.shipmentService.saveAddress(this.saveSelectedAddress).subscribe(val => {
      this.disableOnceClicked = false;
      this.nextSelection.emit({
        selectedShipAddress: this.selectedAddress,
        addressType: 'SHIPMENT'
      });
    });
  }
}
