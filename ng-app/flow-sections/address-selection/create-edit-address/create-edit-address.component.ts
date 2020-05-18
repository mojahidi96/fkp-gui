import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output, ChangeDetectorRef} from '@angular/core';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AddressActions, AddressConstants} from '../address-constants';
import {CustomValidators} from '../../../sncr-components/sncr-controls/custom-validators';
import {BanSubConfig} from '../../../ban-sub-common/ban-sub.config';
import {UtilsService} from '../../../sncr-components/sncr-commons/utils.service';
import {Language} from 'angular-l10n';
import {Address} from './address';
import {CreateEditAddressService} from './create-edit-address.service';

@Component({
  selector: 'create-edit-address',
  templateUrl: 'create-edit-address.component.html',
  styleUrls: ['create-edit-address.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateEditAddressComponent implements OnInit {

  @Input() addressSelectionType: string;
  @Input() countries = [];
  @Input() pattern: any;
  @Input() address: any;
  @Input() selectedAction: string;
  @Input() isTechfundEnabled = false;
  @Input() hasSammel = false;
  @Input() showSubtitle = true;
  @Input() editDebitorNumber = false;
  @Input() forceTechfund = false;
  @Input() debitorExistUrl = '/buyflow/rest/debitor/';
  @Input() btnStyle = 'strong';
  @Language() lang: string;
  @Input() disableOnceClicked = false;

  @Output() output = new EventEmitter();

  saveForm: FormGroup;
  commonConstants: any;
  showValidation = false;
  validDetbitorNumber = true;
  defaultDebitorNumber = false;

  actions = AddressActions;


  constructor(private createEditAddressService: CreateEditAddressService,
              private formBuilder: FormBuilder,
              private cd: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.commonConstants = AddressConstants;
    this.address = {...(new Address()), ...this.address};
    this.createForm();
  }

  createForm() {
    const isEdit = this.selectedAction === this.actions.EDIT;

    let nameGroup = {
      street1: [{value: this.address.street1, disabled: isEdit && this.addressSelectionType === 'DEBITOR'},
        [CustomValidators.requiredWithTrim, Validators.maxLength(32), CustomValidators.sanitization(this.pattern)]],
      street2: [this.address.street2,
        [Validators.maxLength(30), CustomValidators.sanitization(this.pattern)]],
      street3: [this.address.street3,
        [Validators.maxLength(30), CustomValidators.sanitization(this.pattern)]]
    };

    let addressGroup = {
      streetName: [this.address.streetName, [CustomValidators.requiredWithTrim, Validators.maxLength(40),
        CustomValidators.sanitization(this.pattern)]],
      houseNumber: [this.address.houseNumber, [Validators.maxLength(9), CustomValidators.sanitization(this.pattern),
        CustomValidators.validateHouseNumber]],
      postalCode: [this.address.postalCode, [Validators.required, CustomValidators.sanitization(this.pattern),
        Validators.minLength(5), Validators.maxLength(10), CustomValidators.onlyNumbers]],
      city: [this.address.city, [Validators.required, CustomValidators.sanitization(this.pattern),
        Validators.maxLength(30)]],
      countryCode: [this.address.countryCode, [Validators.required, CustomValidators.sanitization(this.pattern)]],
      country: [this.address.country, [Validators.required, CustomValidators.sanitization(this.pattern)]]
    };

    if (this.addressSelectionType.toLowerCase() === 'debitor') {
      nameGroup = Object.assign(nameGroup,
        {
          street4: [this.address.street4,
            [Validators.maxLength(30), CustomValidators.sanitization(this.pattern)]]
        });
      addressGroup = Object.assign(addressGroup,
        {
          techFund: [(this.address.debitorType && this.address.debitorType !== 'D') ? this.address.debitorType : '',
            [this.addDebitorValidation()]],
          debitorNumber: [(this.address.debitorNumber && this.address.debitorNumber !== '000000') ? this.address.debitorNumber : '',
            [this.addDebitorValidation()]],
          streetType: [this.address.streetType ? this.address.streetType : 'Straße, Hausnummer',
            [Validators.required, this.addAddrFormatValidations()]],
          poBox: [this.address.poBox,
            [CustomValidators.requiredWithTrim, CustomValidators.sanitization(this.pattern), Validators.maxLength(10)]]
        });
    }
    let groups;
    if (isEdit && this.addressSelectionType.toLowerCase() === 'debitor') {
      groups = nameGroup;
    } else {
      groups = {...nameGroup, ...addressGroup};
    }

    this.saveForm = this.formBuilder.group(groups);
    if (this.saveForm.controls['countryCode']) {
      this.saveForm.controls.countryCode.valueChanges.subscribe( value => {
        let country = this.countries.find(obj => obj.value === value);
        this.saveForm.controls.country.setValue(country.text);
      });
    }
  }


  getKey(key: string, withoutPrefix = false) {
    return withoutPrefix ? key : this.addressSelectionType + key;
  }

  addAddrFormatValidations() {
    let fieldGroups = [];
    return (control: FormControl) => {
      if (control.parent) {
        const groupControls = control.parent.controls;
        fieldGroups = [
          groupControls['streetType'],
          groupControls['poBox'],
          groupControls['streetName'],
          groupControls['houseNumber']];


        const [addrFormat, poBox, street, houseNo] = fieldGroups;

        if (addrFormat && addrFormat.value === BanSubConfig.Regular) {
          this.enableFields([street, houseNo]);
          this.disableFields([poBox]);
        } else if (addrFormat && addrFormat.value === BanSubConfig.PoBox) {
          this.enableFields([poBox]);
          this.disableFields([street, houseNo]);
        } else {
          this.disableFields([street, houseNo, poBox]);
        }
        return null;
      }
    };
  }

  addDebitorValidation() {
    let fieldGroups = [];
    return (control: FormControl) => {
      if (control.parent) {
        const groupControls = control.parent.controls;
        const [techFund, debitorNumber] = [groupControls['techFund'], groupControls['debitorNumber']];

        if (this.isTechfundEnabled) {
          if (techFund.value) {
            this.enableFields([debitorNumber]);
            this.setValidators(debitorNumber, [Validators.required, CustomValidators.onlyNumbers,
              Validators.maxLength(6), Validators.minLength(6)]);
          } else {
            this.disableFields([debitorNumber]);
          }
        } else if (this.editDebitorNumber) {
          this.enableFields([debitorNumber]);
          this.setValidators(debitorNumber, [Validators.required, CustomValidators.onlyNumbers,
            Validators.maxLength(10), Validators.minLength(6)]);
        }
        return null;
      }
    };
  }

  disableFields(fields: FormControl[]) {
    fields.forEach(field => {
      if (field && !field.disabled) {
        field.disable();
      }
    });
  }

  enableFields(fields: FormControl[]) {
    fields.forEach(field => {
      if (field && !field.enabled) {
        field.enable();
      }
    });
  }

  setValidators(field: any, validations: any[]) {
    if (UtilsService.notNull(field)) {
      field.setValidators(Validators.compose(validations));
      field.updateValueAndValidity();
    }
  }

  isEmptyOrDisabled(control: AbstractControl, checkDisabled = true) {
    return (checkDisabled && control.disabled) || UtilsService.isEmpty(control.value);
  }

  saveAddressForm() {
    if (this.saveForm.valid) {
      if ((this.saveForm.controls.techFund && this.saveForm.controls.techFund.value) || this.editDebitorNumber) {
        let type = this.saveForm.controls.techFund  && this.saveForm.controls.techFund.value ? 'T' : 'D';
        if (this.saveForm.controls.debitorNumber.value === '000000') {
          this.defaultDebitorNumber = true;
        } else {
          this.defaultDebitorNumber = false;
          this.createEditAddressService.isDebitorNumberValid(
            this.saveForm.controls.debitorNumber.value, this.debitorExistUrl).subscribe(res => {
            this.validDetbitorNumber = res === 0;
            if (this.validDetbitorNumber) {
              this.output.emit({value: this.saveForm.value, action: this.selectedAction, type: type});
            } else {
              this.cd.detectChanges();
            }
          });
        }
      } else {
        this.output.emit({value: this.saveForm.value, action: this.selectedAction});
      }
    }
  }
}
