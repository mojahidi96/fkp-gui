import {Injectable} from '@angular/core';
import {FormControl, Validators} from '@angular/forms';
import {Column} from '../sncr-components/sncr-datatable/column';
import {CustomValidators} from '../sncr-components/sncr-controls/custom-validators';
import {BanSubConfig} from './ban-sub.config';
import {UtilsService} from '../sncr-components/sncr-commons/utils.service';

/**
 * The below class is used for validations wrt both BAN and SUBSCRIBER flows
 * These changes are kept in common as we have common address field validations for both the flows along with Bulk edit
 * Service is being injected into the respective modules for both the flows
 */

@Injectable()
export class BanSubValidatorsService {
  flowType = '';
  pattern: any;

  /**
   *
   * @param {Column} col column argument required for the respective flow with iterated column object
   * @param {string} flowType 'ban' | 'sub'
   * @param {string} sanitization pattern retrieved from server for regex validations
   * @param {any[]} countries array from DRB bundle from the server
   * @returns {any[]} validators array which is used to set to the respective form control
   */
  buildValidators(col: Column, flowType: string, pattern: any, countries: any[], simTypes?: any[]): any[] {
    this.flowType = flowType;
    this.pattern = pattern;
    let validators = [];
    let colType = '';
    col.defaultSelectLabel = 'DATATABLE-SELECTION_TITLE';
    switch (col.field) {
      case BanSubConfig.fieldControlNames[this.flowType].paymentMethod: {
        col.requiredInForm = true;
        validators.push([this.addPaymethodValidations(col)]);
      }

        break;
      // Payment fields are required when PAYMENT TYPE is DIRECT
      // Always make them required otherwise they will be disabled for CASH
      case BanSubConfig.fieldControlNames[this.flowType].bankAccOwnership:
        validators.push([CustomValidators.requiredWithTrim, Validators.maxLength(32),
        CustomValidators.sanitization(this.pattern)]);
        break;

      case BanSubConfig.fieldControlNames[this.flowType].iban:
        validators.push([CustomValidators.requiredWithTrim, Validators.maxLength(34)]);
        break;

      case BanSubConfig.fieldControlNames[this.flowType].bic:
        validators.push([CustomValidators.requiredWithTrim, Validators.minLength(8),
        Validators.maxLength(11)]);
        break;

      case BanSubConfig.fieldControlNames[this.flowType].bankCode:
        validators.push([CustomValidators.sanitization(this.pattern), Validators.maxLength(8)]);
        break;


      case BanSubConfig.fieldControlNames[this.flowType].bankAccountNo:
        validators.push([CustomValidators.sanitization(this.pattern), Validators.maxLength(20)]);
        break;

      // For PERSONAL name format enable below fields
      // firstName and title
      // For BUISINESS name format disable below fields
      // firstName and title
      case BanSubConfig.fieldControlNames[this.flowType].nameFormat:
        colType = 'select';
        this.setEditInfoOptions(BanSubConfig.nameFormatOptions, col, colType);
        validators.push([Validators.required, this.addNameFormatValidations(col)]);
        break;

      // with latest change validations needs to be added for this field
      case BanSubConfig.fieldControlNames[this.flowType].salutation:
        colType = 'select';
        this.setEditInfoOptions(BanSubConfig.salutationOptions, col, colType);
        validators.push([Validators.required]);
        break;

      case BanSubConfig.fieldControlNames[this.flowType].firstName:
        validators.push([Validators.maxLength(32), CustomValidators.sanitization(this.pattern)]);
        break;

      case BanSubConfig.fieldControlNames[this.flowType].name1:
        validators.push([Validators.maxLength(30), CustomValidators.sanitization(this.pattern)]);
        break;

      case BanSubConfig.fieldControlNames[this.flowType].name2:
        validators.push([Validators.maxLength(30), CustomValidators.sanitization(this.pattern)]);
        break;

      case BanSubConfig.fieldControlNames[this.flowType].name3:
        validators.push([Validators.maxLength(30), CustomValidators.sanitization(this.pattern)]);
        break;

      // For REGULAR address format enable below fields
      // street and houseNo
      // else for POBOX address format
      // POBOX is required and keep it enabled
      case BanSubConfig.fieldControlNames[this.flowType].addressFormat:
        colType = 'select';
        this.setEditInfoOptions(BanSubConfig.addressFormatOptions, col, colType);
        validators.push([Validators.required, this.addAddrFormatValidations(col)]);
        break;

      case BanSubConfig.fieldControlNames[this.flowType].street:
        validators.push([CustomValidators.requiredWithTrim, Validators.maxLength(40),
        CustomValidators.sanitization(this.pattern)]);
        break;

      case BanSubConfig.fieldControlNames[this.flowType].houseNo:
        validators.push([Validators.maxLength(10), CustomValidators.sanitization(this.pattern),
        CustomValidators.validateHouseNumber]);
        break;

      case BanSubConfig.fieldControlNames[this.flowType].poBox:
        validators.push([CustomValidators.requiredWithTrim, CustomValidators.sanitization(this.pattern), Validators.maxLength(10)]);
        break;

      case BanSubConfig.fieldControlNames[this.flowType].country:
        colType = 'select';
        this.setEditInfoOptions(countries, col, colType);
        // based on country selection update the postalCode validations
        validators.push([Validators.required, this.addCountryValidations(col)]);
        break;

      case BanSubConfig.fieldControlNames[this.flowType].city:
        if (this.flowType === BanSubConfig.FL_TYPE_BAN) {
          validators.push([CustomValidators.requiredWithTrim, Validators.maxLength(40), CustomValidators.sanitization(this.pattern),
          CustomValidators.validateCity]);
        } else {
          validators.push([CustomValidators.requiredWithTrim, Validators.maxLength(40), CustomValidators.sanitization(this.pattern)]);
        }
        break;

      case BanSubConfig.fieldControlNames[this.flowType].nameContact:
        validators.push([CustomValidators.sanitization(this.pattern), Validators.maxLength(40)]);
        break;

      case BanSubConfig.fieldControlNames[this.flowType].fax:
        validators.push([Validators.maxLength(20), CustomValidators.sanitization(this.pattern)]);
        break;

      case BanSubConfig.fieldControlNames[this.flowType].phone:
        validators.push([Validators.maxLength(20), CustomValidators.sanitization(this.pattern)]);
        break;

      case BanSubConfig.fieldControlNames[this.flowType].email:
        validators.push([CustomValidators.sanitization(this.pattern), Validators.maxLength(150)]);
        break;

      case BanSubConfig.fieldControlNames[this.flowType].internalCustId:
        validators.push([Validators.maxLength(15), CustomValidators.validInternalCustId, CustomValidators.sanitization(this.pattern)]);
        break;

      case BanSubConfig.fieldControlNames[this.flowType].title:
        colType = 'select';
        this.setEditInfoOptions(BanSubConfig.titleOptions, col, colType);
        break;

      case BanSubConfig.fieldControlNames[this.flowType].passwordResetInd:
      case BanSubConfig.fieldControlNames[this.flowType].smsInd:
        colType = 'boolean';
        this.setEditInfoOptions(null, col, colType);
        validators.push([this.addPasswordResetValidations(col)]);
        break;

      case BanSubConfig.fieldControlNames[this.flowType].password:
        col.type = 'password';
        validators.push([Validators.maxLength(20), CustomValidators.sanitization(this.pattern),
        this.addPasswordResetValidations(col)]);
        break;

      case BanSubConfig.fieldControlNames[this.flowType].simType:
        colType = 'select';
        col.defaultSelectLabel = 'SIM_TYPE-DATATABLE-SELECTION_TITLE';
        this.setEditInfoOptions(this.getSimTypes(simTypes, BanSubConfig.SIM_OPTION_TYPES.ACT_TYPE), col, colType);
        validators.push([Validators.required]);
        col.editInfo.hideSelectionTitle = true;
        break;
      case BanSubConfig.fieldControlNames[this.flowType].ultracardSimType1:
        colType = 'select';
        col.defaultSelectLabel = 'SIM_TYPE-DATATABLE-SELECTION_TITLE';
        this.setEditInfoOptions(this.getSimTypes(simTypes, BanSubConfig.SIM_OPTION_TYPES.UC_TYPE), col, colType);
        validators.push([this.addDisabledFieldValidation(col, 'ultracardSimType1')]);
        break;
      case BanSubConfig.fieldControlNames[this.flowType].ultracardSimType2:
        colType = 'select';
        col.defaultSelectLabel = 'SIM_TYPE-DATATABLE-SELECTION_TITLE';
        this.setEditInfoOptions(this.getSimTypes(simTypes, BanSubConfig.SIM_OPTION_TYPES.UC_TYPE), col, colType);
        validators.push([this.addDisabledFieldValidation(col, 'ultracardSimType2')]);
        break;

      case BanSubConfig.fieldControlNames[this.flowType].simSerialNo:
        validators.push([CustomValidators.onlyNumbersWithLimit]);
        break;

      case BanSubConfig.fieldControlNames[this.flowType].ultracardSimSerialNo1:
        validators.push([CustomValidators.onlyNumbersWithLimit,
          this.addDisabledFieldValidation(col, 'ultracardSimSerialNo1')]);
        break;

      case BanSubConfig.fieldControlNames[this.flowType].ultracardSimSerialNo2:
        validators.push([CustomValidators.onlyNumbersWithLimit,
          this.addDisabledFieldValidation(col, 'ultracardSimSerialNo2')]);
        break;

      case BanSubConfig.fieldControlNames[this.flowType].dep:
        colType = 'boolean';
        this.setEditInfoOptions(null, col, colType);
        validators.push([this.addDisabledFieldValidation(col, 'dep')]);
        break;

      default:
        validators.push([CustomValidators.sanitization(this.pattern)]);
        break;
    }
    return validators;
  }

  /*addConditionalValidations(col: Column) {
    let fieldGroups = [];
    return (control: FormControl) => {
      if (control.parent) {
        const groupControls = control.parent.controls;
        fieldGroups = [
          groupControls[BanSubConfig.fieldControlNames[this.flowType].nameFormat],
          groupControls[BanSubConfig.fieldControlNames[this.sflowType].title],
          groupControls[BanSubConfig.fieldControlNames[this.flowType].firstName],
          groupControls[BanSubConfig.fieldControlNames[this.flowType].salutation],
          groupControls[BanSubConfig.fieldControlNames[this.flowType].addressFormat],
          groupControls[BanSubConfig.fieldControlNames[this.flowType].poBox],
          groupControls[BanSubConfig.fieldControlNames[this.flowType].street],
          groupControls[BanSubConfig.fieldControlNames[this.flowType].houseNo],
          groupControls[BanSubConfig.fieldControlNames[this.flowType].name1],
          groupControls[BanSubConfig.fieldControlNames[this.flowType].country],
          groupControls[BanSubConfig.fieldControlNames[this.flowType].postalCode]];


        const [nameFormat, title,
          firstName, salutation, addrFormat, poBox, street, houseNo, name1, country, postalCode] = fieldGroups;


        // common conditional validations must be added which are
        // common to both ban and subscriber
        // this.addNameFormatValidations(nameFormat, title, firstName);
        // this.addAddrFormatValidations(addrFormat, street, houseNo, poBox);
        // this.addSalutationValidations(salutation, name1, firstName, title, nameFormat);
        // this.addCountryValidations(country, postalCode);

        return null;
      }
    };
  }*/

  addPasswordResetValidations(col: Column) {
    let fieldGroups = [];
    return (control: FormControl) => {
      if (control.parent) {
        const groupControls = control.parent.controls;
        fieldGroups = [
          groupControls[BanSubConfig.fieldControlNames[this.flowType].passwordResetInd],
          groupControls[BanSubConfig.fieldControlNames[this.flowType].password],
          groupControls[BanSubConfig.fieldControlNames[this.flowType].smsInd]
        ];

        const [pswReset, psw, smsInd] = fieldGroups;

        /**
         * whenever password reset is true then password field should be disabled
         */
        if (UtilsService.notNull(pswReset) && (pswReset.value || pswReset.value === 'true')) {
          this.disableFields([psw]);
        } else {
          this.enableFields([psw]);
        }

        /**
         * whenever password reset is true and password is null then disable sms indicator
         */
        if ((UtilsService.notNull(pswReset) && (pswReset.value || pswReset.value === 'true'))
          || (UtilsService.notNull(psw.value) && psw.value !== '')) {
          this.enableFields([smsInd]);
        } else {
          this.disableFields([smsInd]);
        }

        return null;
      }
    };
  }

  addCountryValidations(col) {
    let fieldGroups = [];
    return (control: FormControl) => {
      if (control.parent) {
        const groupControls = control.parent.controls;
        fieldGroups = [];

        fieldGroups = [
          groupControls[BanSubConfig.fieldControlNames[this.flowType].country],
          groupControls[BanSubConfig.fieldControlNames[this.flowType].postalCode]];


        const [country, postalCode] = fieldGroups;

        let minLength = 1;
        let maxLegnth = 10;
        if (country && country.value === BanSubConfig.defaultCountry) {
          minLength = 5;
          maxLegnth = 5;
          this.setValidators(postalCode, [
            CustomValidators.requiredWithTrim,
            CustomValidators.sanitization(this.pattern),
            Validators.maxLength(maxLegnth),
            Validators.minLength(minLength)
          ]);
        } else {
          this.setValidators(postalCode, [
            CustomValidators.sanitization(this.pattern),
            Validators.maxLength(maxLegnth),
            Validators.minLength(minLength)
          ]);
        }
        return null;
      }
    };

  }


  addAddrFormatValidations(col: Column) {
    let fieldGroups = [];
    return (control: FormControl) => {
      if (control.parent) {
        const groupControls = control.parent.controls;
        fieldGroups = [
          groupControls[BanSubConfig.fieldControlNames[this.flowType].addressFormat],
          groupControls[BanSubConfig.fieldControlNames[this.flowType].poBox],
          groupControls[BanSubConfig.fieldControlNames[this.flowType].street],
          groupControls[BanSubConfig.fieldControlNames[this.flowType].houseNo]];


        const [addrFormat, poBox, street, houseNo] = fieldGroups;


        /* if (this.flowType === BanSubConfig.FL_TYPE_BAN && addrFormat && addrFormat.value) {
           // For ban assuming there is only address format which is REGULAR
           addrFormat.disable();
         }*/
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


  addPaymethodValidations(col: Column) {
    let fieldGroups = [];
    return (control: FormControl) => {
      if (control.parent) {
        const groupControls = control.parent.controls;
        fieldGroups = [groupControls[BanSubConfig.fieldControlNames[this.flowType].paymentMethod],
        groupControls[BanSubConfig.fieldControlNames[this.flowType].bankAccOwnership],
        groupControls[BanSubConfig.fieldControlNames[this.flowType].iban],
        groupControls[BanSubConfig.fieldControlNames[this.flowType].bic]];


        const [paymentMethod, bankAccOwnership, iban, bic] = fieldGroups;

        if (paymentMethod && paymentMethod.value === BanSubConfig.DIRECT) {
          this.enableFields([bankAccOwnership, iban, bic]);
        } else if (paymentMethod && paymentMethod.value === BanSubConfig.CASH) {
          this.disableFields([bankAccOwnership, iban, bic]);
        }
        return null;
      }
    };
  }


  addNameFormatValidations(col: Column) {
    let fieldGroups = [];
    return (control: FormControl) => {
      if (control.parent) {
        const groupControls = control.parent.controls;
        fieldGroups = [
          groupControls[BanSubConfig.fieldControlNames[this.flowType].nameFormat],
          groupControls[BanSubConfig.fieldControlNames[this.flowType].title],
          groupControls[BanSubConfig.fieldControlNames[this.flowType].firstName],
          groupControls[BanSubConfig.fieldControlNames[this.flowType].salutation],
          groupControls[BanSubConfig.fieldControlNames[this.flowType].name1]];


        const [nameFormat, title,
          firstName, salutation, name1] = fieldGroups;


        // if nameFormat is personal then only add salutation validations
        if (nameFormat && nameFormat.value === BanSubConfig.personal) {
          this.enableFields([title, firstName, salutation]);
          if (name1) {
            this.setValidators(name1, [CustomValidators.sanitization(this.pattern), Validators.maxLength(30),
            CustomValidators.requiredWithTrim]);
          }
          if (firstName) {
            this.setValidators(firstName, [Validators.maxLength(32), CustomValidators.sanitization(this.pattern),
            CustomValidators.requiredWithTrim]);
          }

        } else if (nameFormat && nameFormat.value === BanSubConfig.business) {
          // Name format is business then disable the "title" and "firstName"
          this.disableFields([title, firstName]);
          this.enableFields([salutation]);
          if (name1) {
            this.setValidators(name1, [CustomValidators.sanitization(this.pattern), Validators.maxLength(30),
            CustomValidators.requiredWithTrim]);
          }
          // first name is mandatory only when name format is P
          if (firstName) {
            this.setValidators(firstName, [Validators.maxLength(32), CustomValidators.sanitization(this.pattern)]);
          }
        } else {
          this.disableFields([title, firstName, salutation]);
        }
        return null;
      }
    };
  }

  addDisabledFieldValidation(col: Column, fieldName: string) {
    let fieldGroups = [];
    let disableCol = col.colDisabled !== undefined ? col.colDisabled : true;
    return (control: FormControl) => {
      if (control.parent) {
        const groupControls = control.parent.controls;
        fieldGroups = [groupControls[BanSubConfig.fieldControlNames[this.flowType][fieldName]]];
        const [groups] = fieldGroups;
        if (disableCol) {
          this.disableFields([groups]);
        } else {
          this.enableFields([groups]);
        }
      }
    };
  }


  setValidators(field: any, validations: any[]) {
    if (UtilsService.notNull(field)) {
      field.setValidators(Validators.compose(validations));
      field.updateValueAndValidity();
    }

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

  resetFields(fields: FormControl[]) {
    fields.forEach(field => {
      if (field) {
        field.reset();
      }
    });
  }


  resetNameValidators(name1, firstName) {
    if (name1) {
      this.setValidators(name1, [CustomValidators.sanitization(this.pattern), Validators.maxLength(30)]);
    }
    if (firstName) {
      this.setValidators(firstName, [Validators.maxLength(32), CustomValidators.sanitization(this.pattern)]);
    }
  }


  setEditInfoOptions(options: any[], col: Column, type: string) {
    let tempObj = {
      editInfo: {
        type: '',
        options: [],
        validators: []
      }
    };
    if (type === 'select') {
      tempObj.editInfo.type = 'select';
      tempObj.editInfo.options = options;
      col.type = 'select';
      col.editInfo = tempObj.editInfo;
    } else if (type === 'boolean') {
      col.type = 'boolean';
    }
  }

  msisdnValidators(col: Column, flowType: string, pattern: any, msisdnList: any[]): any {
    let validators = [];
    this.flowType = flowType;
    this.pattern = pattern;
    let colType = 'select';
    this.setEditInfoOptions(msisdnList, col, colType);
    validators.push([this.addMsisdnValidations(col, msisdnList.length)]);
    return validators;

  }
  addMsisdnValidations(col: Column, msisdnSize: any) {
    let fieldGroups = [];
    return (control: FormControl) => {
      if (control.parent) {
        const groupControls = control.parent.controls;
        fieldGroups = [groupControls[BanSubConfig.fieldControlNames[this.flowType].msisdn]];
        const [msisdn] = fieldGroups;
        if (msisdnSize) {
          this.enableFields([msisdn]);
        } else {
          this.disableFields([msisdn]); 
        }
        return null;
      }
    };
  }

  public getSimTypes(simTypes: any[], optionType: string) {
    const options: {text: string; description: string, value: string}[] = [];
    let validSimTypes = [];
    const validBundle = simTypes.find(sType => Object.keys(sType)[0].includes(`Valid.SimTypeCodes.${optionType}`));
    if (validBundle) {
      validSimTypes.push(...validBundle[Object.keys(validBundle)[0]].split(',').map(vType =>  vType = `SimType.${optionType}.${vType}`));
    }
    simTypes.forEach( type => {
      const sim = Object.keys(type)[0];
      if (sim.includes(optionType) && validSimTypes.includes(sim)) {
        const simType = type[sim];
        options.push({text: simType, description: simType, value: sim});
      }
    });
    return options;
  }
}
