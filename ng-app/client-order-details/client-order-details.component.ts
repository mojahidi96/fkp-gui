import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {UtilsService} from '../sncr-components/sncr-commons/utils.service';
import {AbstractControl, FormBuilder, FormGroup, ValidatorFn} from '@angular/forms';
import {TimeoutService} from '../app/timeout/timeout.service';
import {CONSTANTS} from '../soc-management/constants';
import {ClientOrderDetailsService} from './client-order-details.service';
import {Language} from 'angular-l10n';
import {Cart} from '../shopping-cart/Cart';

@Component({
  selector: 'client-order-details',
  templateUrl: 'client-order-details.component.html',
  exportAs: 'clientOrderDetails',
  styleUrls: ['client-order-details.component.scss']
})
export class ClientOrderDetailsComponent implements OnInit {

  @Input() customerNumber: string;
  @Input() clientOrderId: string;
  @Input() custIntNote: string;
  @Input() translationSupported: boolean;
  @Input() prefilledCart = new Cart();

  @Language() lang: string;

  saveForm: FormGroup;
  constants: CONSTANTS;
  enterPrisePartner = false;

  orderProcessing = false;

  buttonAdd = false;
  buttonDelete = false;

  isReadOnly: boolean;

  voipValidate = false;
  voidList: Array<any> = [];

  constructor(private clientOrderDetailsService: ClientOrderDetailsService,
              private formBuilder: FormBuilder,
              private timeOutService: TimeoutService) {

  }

  ngOnInit(): void {
    this.createForm();
    this.constants = new CONSTANTS;
    this.clientOrderDetailsService.getUserRole().subscribe(enterprisePartner => {
      this.enterPrisePartner = enterprisePartner;
      if (this.enterPrisePartner) {
        this.getVoidListByUser();
        this.saveForm.controls['voidNumber'].setValidators(this.getCustomMessageForVoid());
      }
      this.isReadOnly = this.timeOutService.isReadOnlyUser;
    });
  }

  createForm() {
    let group: any = {};
    this.saveForm = this.formBuilder.group({
      custOrderNumber: [this.prefilledCart.customerOrderNumber ? this.prefilledCart.customerOrderNumber : '', this.getCustomMessage()],
      custIntNote: [this.prefilledCart.clientOrderId ? this.prefilledCart.clientOrderId : '', this.getCustomMessage()],
      voidNumber: [this.prefilledCart.voNumber ? this.prefilledCart.voNumber : '']
    });
  }

  /**
   * Methods to display the list of voids per user
   */
  getVoidListByUser() {
    this.clientOrderDetailsService.getVoids().then((data) => {
      this.getVoids(data);
    }).catch((ex) => {
      console.error('exception in order', ex);
    });
  }

  /**
   * SNCR-INPUT looks for object while selecting the autocomplete
   * so converting array to object array
   * @param list
   */
  getVoids(list) {
    list.forEach(g => {
      this.voidList.push({data: g});
    });
  }

  /**
   * Create VOID per user Max of 5
   */
  createVoid() {
    if (UtilsService.notNull(this.saveForm.controls['voidNumber'].value)) {
      this.buttonAdd = false;
      this.clientOrderDetailsService.addVoid(this.saveForm.controls['voidNumber'].value)
        .then((data) => {
          this.voidList.push({data: this.saveForm.controls['voidNumber'].value});
          this.buttonDelete = true;
        })
        .catch((ex => {
          console.error('exception  for creating the void number', ex);
        }));
    }
  }

  /**
   * ON key press check for void array in array
   */
  checkForVoid(event) {
    if (this.voidList.length < 5) {
      if (!this.voidList.find(v => v.data === event)) {
        this.buttonAdd = true;
        this.buttonDelete = false;
      } else {
        this.buttonAdd = false;
        this.buttonDelete = true;
      }
    } else if (this.voidList.length === 5
      && this.voidList.find(v => v.data === event)) {
      this.buttonAdd = false;
      this.buttonDelete = true;
    } else {
      this.disableVoidButtons();
    }
  }

  /**
   * function to disable the button
   */
  disableVoidButtons() {
    this.buttonAdd = false;
    this.buttonDelete = false;
  }

  /**
   * Delete Void Per User
   */
  deleteVoid() {
    if (UtilsService.notNull(this.saveForm.controls['voidNumber'].value) && this.voidList.length > 0) {
      this.buttonDelete = false;
      this.clientOrderDetailsService.deleteVoid(this.saveForm.controls['voidNumber'].value)
        .then((data) => {
          let index: number = this.voidList.findIndex(v => v.data === this.saveForm.controls['voidNumber'].value);
          if (index !== -1) {
            this.voidList.splice(index, 1);
          }
          this.saveForm.controls['voidNumber'].setValue('');
        })
        .catch((ex => {
          console.error('exception  for deleting the void number', ex);
        }));
    }
  }

  /**
   * Method for checking the regex expression
   */
  getValidVOIDPattern() {
    const pattern = /^[0-9a-zA-Z]+$/;
    if (this.saveForm.controls['voidNumber'].value !== ''
      && (!pattern.test(this.saveForm.controls['voidNumber'].value)
        || (this.saveForm.controls['voidNumber'].value.length !== 8))) {
      this.disableVoidButtons();
      this.voipValidate = true;
      return true;
    } else {
      this.voipValidate = false;
      return false;
    }
  }

  checkIfEmpty() {
    if (this.saveForm.controls['voidNumber'].value === '') {
      this.voipValidate = true;
      return false;
    } else {
      this.getValidVOIDPattern();
    }
  }

  /**
   * Validates the form with required validation
   * @returns {boolean}
   */
  public isFormInValid() {
    if (this.saveForm.valid) {
      if (this.enterPrisePartner) {
        return this.getInputPatternValidation(this.saveForm.controls['custOrderNumber'].value)
          || this.getInputPatternValidation(this.saveForm.controls['custIntNote'].value)
          || this.getValidVOIDPattern()
          || (this.saveForm.controls['voidNumber'].value === '')
          || (this.saveForm.controls['voidNumber'].value.length !== 8);
      } else {
        return this.getInputPatternValidation(this.saveForm.controls['custOrderNumber'].value)
          || this.getInputPatternValidation(this.saveForm.controls['custIntNote'].value);
      }
    } else {
      if (this.enterPrisePartner) {
        this.checkIfEmpty();
      }
    }
  }

  /**
   * Populates the method with required fields for order placement
   * @param clientOrderDetail Order details sent to server for order submission.
   */
  public populateClientOrderDetails(clientOrderDetail: {}) {
    if (UtilsService.notNull(this.saveForm.controls['custOrderNumber'].value)) {
      clientOrderDetail['customerNumber'] = this.saveForm.controls['custOrderNumber'].value;
    }
    if (UtilsService.notNull(this.saveForm.controls['custIntNote'].value)) {
      clientOrderDetail['clientOrderId'] = this.saveForm.controls['custIntNote'].value;
    }
    if (UtilsService.notNull(this.saveForm.controls['voidNumber'].value)) {
      clientOrderDetail['voId'] = this.saveForm.controls['voidNumber'].value;
    }
    return clientOrderDetail;
  }

  /**
   * Method for checking the regex expression
   */
  getInputPatternValidation(eventValue) {
    const pattern = /^[äöüÄÖÜßa-zA-Z0-9\.\-\s]*$/;
    if (eventValue !== '' && !pattern.test(eventValue)) {
      return true;
    } else {
      return false;
    }
  }

  getCustomMessage(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      let value = control['value'];
      if (value !== '' && UtilsService.notNull(value)) {
        const pattern = /^[äöüÄÖÜßa-zA-Z0-9\.\-\s]*$/;
        if (value.match(pattern)) {
          return null;
        } else {
          return {inValidInputCharacters: true};
        }
      }
    };
  }

  getCustomMessageForVoid(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      let value = control['value'];
      if (value !== '' && UtilsService.notNull(value)) {
        const pattern = /^[0-9a-zA-Z]+$/;
        this.voipValidate = false;
        if (value.length === 8 && value.match(pattern)) {
          return null;
        } else {
          this.voipValidate = true;
          return {invalidVOID: true};
        }
      } 
    };
  }
}