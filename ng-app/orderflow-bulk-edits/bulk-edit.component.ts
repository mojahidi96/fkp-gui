import {Component, EventEmitter, Inject, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {BulkEditRequest} from './bulk-edit.config';
import {AbstractControl, FormBuilder, FormGroup, Validators} from '@angular/forms';
import {BulkEditService} from './bulk-edit.service';
import {SncrFlowSectionComponent} from '../sncr-components/sncr-flow/sncr-flow-section.component';
import {NotificationHandlerService} from '../sncr-components/sncr-notification/notification-handler.service';
import {Column} from '../sncr-components/sncr-datatable/column';
import {ActivatedRoute} from '@angular/router';
import {BanSubConfig} from '../ban-sub-common/ban-sub.config';
import {BanSubValidatorsService} from '../ban-sub-common/ban-sub-validators.service';
import {UtilsService} from '../sncr-components/sncr-commons/utils.service';
import {Language, TranslationService} from 'angular-l10n';
import {CustomValidators} from '../sncr-components/sncr-controls/custom-validators';

@Component({
  selector: 'bulk-edit',
  templateUrl: 'bulk-edit.component.html',
  styleUrls: ['bulk-edit.component.scss']
})
export class BulkEditComponent implements OnChanges {

  @Input() flowType = 'subsNo';
  @Input() managementFlow: SncrFlowSectionComponent;
  @Input() selectCount = 0;
  @Input() countries = [];
  @Input() pattern = '';
  @Input() configId = '';
  @Input() isChanged = false;
  @Input() cols: Column[] = [];
  @Input() continueLabel = 'MANAGE_DETAILS-CONTINUE_TO_ORDER_OVERVIEW';
  @Input() isPreQueryEligible = false;
  @Input() simTypes = [];
  @Input() msisdn = [];
  @Input() isWifiSocSelected = false;
  @Input() data = [];

  @Language() lang;
  @Output() simSelection = new EventEmitter();
  @Output() formSubmit = new EventEmitter();

  isRSD = false;
  translations: any = {};
  bulkEditForm: FormGroup;
  bulkEditConfig = BanSubConfig;
  fieldControlNames: any = {};
  alertNotify: NotificationHandlerService = new NotificationHandlerService();
  oldValues = [];

  group = {};
  editedData: BulkEditRequest[] = [];
  deletedFormMap: Map<string, string>;
  titleDelete = false;
  name2Delete = false;
  name3Delete = false;
  faxDelete = false;
  phoneDelete = false;
  emailDelete = false;
  nameContactDelete = false;
  intCustIdDelete = false;
  passwordDelete = false;
  showValidation = false;
  columns: Column[] = [];
  paymentCheckbox = false;
  processing = false;
  paymentCheckboxField = 'paymentCheckbox';
  isRsdLoaded = false;
  private editedRows = [];

  enablePreQuery = false;
  selectedSim: string;
  formReset = true;
  ultraCardOptions = [];
  simCardOptions = [];
  ACT_SUBS_ADD_FIELDS = ['9', '10', '11', '12', '13', '16', '17', '18', '19', '20', '42', '43', '44', '45', '46', '47', '48'];
  flag = false;
  constructor(private formBuilder: FormBuilder, private bulkEditService: BulkEditService,
              @Inject('NotificationHandlerFactory') private notificationHandlerFactory,
              private route: ActivatedRoute, private banSubValidatorsService: BanSubValidatorsService,
              public translation: TranslationService) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isChanged']) {
      this.flag = false;
      this.selectedSim = 'NEW_SIM';
      this.columns = [];
      this.alertNotify.clearNotification();
      this.bulkEditConfig = BanSubConfig;
      this.translations = BanSubConfig.translations[this.flowType];
      this.fieldControlNames = BanSubConfig.fieldControlNames[this.flowType];
      this.columns = this.cols.map(col => Object.assign({}, col));

      if (this.managementFlow.prefilled) {
        this.managementFlow.prefilled = false;
      } else if (changes['selectCount']) {
        this.managementFlow.model = {};
      }
      if (this.isPreQueryEligible) {
        this.getSubsDetailsPrequery();
      }
      if (this.flowType === BanSubConfig.FL_TYPE_SUB) {
        this.bulkEditService.getShopSpclCond().then(data => {
          this.isRSD = data;
          this.getFormandData();
          this.isRsdLoaded = true;
        });
      } else {
        this.getFormandData();
      }
    }
    this.getSimTypes();
  }

  getSubsDetailsPrequery() {
    this.bulkEditService.getSubsDetailsPrequery()
      .subscribe((response: boolean) => {
          this.enablePreQuery = response;
        }
      );
  }

  getFormandData() {
    this.createForm();
    this.resetDeleteFields();
    this.deletedFormMap = new Map();

    if (this.selectCount === 1) {
      this.bulkEditService.getOldValues(BanSubConfig.configIds[this.flowType].configId).then(res => {
        if (res) {
          this.oldValues = this.buildConcatData(JSON.parse(res.rows), this.data);
          if (this.flowType === BanSubConfig.FL_TYPE_ACT_SUB) {
            this.oldValues[0]['99'] = '';
          }
          this.editedRows = res.editedRows ? res.editedRows : [];
          this.prepopulateForm();
        }
      });
    }
  }

  createForm() {
    let group = {};
    this.setColumnDefn(group);
    if (JSON.stringify(group) !== '{}') {
      this.bulkEditForm = this.formBuilder.group(group);
      if (this.flowType === BanSubConfig.FL_TYPE_ACT_SUB) {
        this.updateSimValidators();
      }
    }
  }

  setColumnDefn(group: any) {
    this.columns.filter(col => (!col.nonEditable || BanSubConfig.readonly_for_singleEdit[this.flowType].includes(col.field)))
      .forEach(col => {
        if (this.flowType === BanSubConfig.FL_TYPE_BAN && (col.field === BanSubConfig.IBAN || col.field === BanSubConfig.BIC)) {
          // for ban maintain a copy of fields iban & bic since they are masked
          group[col.field] = [''];
          group[col.field + '_copy'] = [''];
        } else {
          group[col.field] = [''];
        }
        let validators = [];
        if (BanSubConfig.fieldControlNames[this.flowType].msisdn === col.field) {
          validators = this.banSubValidatorsService.msisdnValidators(col, this.flowType, this.pattern, this.msisdn);
        } else {
          validators = this.banSubValidatorsService.buildValidators(col, this.flowType, this.pattern, this.countries, this.simTypes);
        }
        if (validators && validators.length) {
          group[col.field].push(...validators);
        }
      });
  }

  prepopulateForm() {
    // always for single selection there will be only one row expected
    // Pls take the 0th object
    if (this.oldValues && this.oldValues.length) {
      let oldDataObject = this.oldValues[0];
      if (this.editedRows.length) {
        oldDataObject = {...this.prepopulateEditedData({...oldDataObject}, this.editedRows)};
      }
      if (oldDataObject && JSON.stringify(oldDataObject) !== '{}') {
        Object.keys(oldDataObject).forEach(key => {
          let obj = {};
          if (this.flowType === BanSubConfig.FL_TYPE_BAN
            && (key === BanSubConfig.IBAN || key === BanSubConfig.BIC)) {
            let fieldVal = oldDataObject[key];
            let masked = UtilsService.maskAllButLastFour(fieldVal);
            obj[key] = masked;
            obj[key + '_copy'] = fieldVal;
            this.bulkEditForm.patchValue(obj);
          } else {
            if (this.flowType === BanSubConfig.FL_TYPE_SUB
              && (key === this.fieldControlNames.smsInd || key === this.fieldControlNames.passwordResetInd)) {
              oldDataObject[key] = (oldDataObject[key] === 'true');
            }
            obj[key] = oldDataObject[key];
            this.bulkEditForm.patchValue(obj);
          }
        });
      }
    }
  }


  saveBulkEditForm() {
    this.processing = true; 
    this.flag = true;
    if (this.flowType === BanSubConfig.FL_TYPE_BAN) {
      let ibanControl = this.bulkEditForm.get(this.fieldControlNames.iban);
      let bicControl = this.bulkEditForm.get(this.fieldControlNames.bic);
      let ibanControlCopy = this.bulkEditForm.get(this.fieldControlNames.iban + '_copy');
      let bicControlCopy = this.bulkEditForm.get(this.fieldControlNames.bic + '_copy');
      let ibanPromise;
      let bicPromise;
      let ibanValid = true;
      let bicValid = true;

      if (ibanControl && ibanControl.touched && ibanControl.value && ibanControlCopy) {
        ibanPromise = this.payFieldsAPIHandling(this.fieldControlNames.iban, ibanControlCopy);
      }

      if (bicControl && bicControl.touched && bicControl.value && bicControlCopy) {
        bicPromise = this.payFieldsAPIHandling(this.fieldControlNames.bic, bicControlCopy);
      }

      Promise.all([ibanPromise, bicPromise]).then(res => {
        this.processing = false;
        const [ibanValidation, bicValidation] = res;

        if (ibanValidation && !ibanValidation.isValid) {
          ibanValid = false;
          ibanControl.setErrors({'invalidIban': true});
        }

        if (bicValidation && !bicValidation.isValid) {
          bicValid = false;
          bicControl.setErrors({'invalidBic': true});
        }

        if (ibanValid && bicValid) {
          this.processBulkEditData();
        }
      }).catch(error => this.processing = false);
    } else {
      this.processBulkEditData();
    }
  }


  processBulkEditData() {
    if (this.bulkEditForm && this.bulkEditForm.valid) {
      this.editedData = [];

      if (JSON.stringify(this.bulkEditForm.value) !== '{}') {
        // for single selection with oldvalues
        // populate the old values
        let formVal = this.bulkEditForm.controls;
        if (this.oldValues && this.oldValues.length && this.selectCount === 1) {
          let oldValObj = this.oldValues[0];
          Object.keys(formVal).forEach(key => {
            // check whether oldValue and newValue are same/diff
            if ((UtilsService.notNull(formVal[key].value) || (typeof(formVal[key].value) === 'boolean'
              && UtilsService.notNull(formVal[key].value)))
            ) {

              let val = this.getFieldValue(formVal, key, formVal[key].value);

              if (oldValObj[key] !== val) {
                let keyId = this.flowType === BanSubConfig.FL_TYPE_ACT_SUB ? 2 : this.flowType;
                let id = oldValObj[keyId];
                let newValue = val;
                let oldVal = oldValObj[key];
                let fieldTitle = BanSubConfig.fieldTitles[this.flowType][key];
                let ban = oldValObj.hasOwnProperty(BanSubConfig.FL_TYPE_BAN) ?
                  oldValObj[BanSubConfig.FL_TYPE_BAN] : null;

                this.setEditedData(id, newValue, oldVal, fieldTitle, ban, key, val, formVal);
              }
            }
          });
        } else {
          Object.keys(formVal).forEach(key => {
            // check whether oldValue and newValue are same/diff
            if ((UtilsService.notNull(formVal[key].value) || (typeof(formVal[key].value) === 'boolean'
              && UtilsService.notNull(formVal[key].value)))
            ) {
              let val = this.getFieldValue(formVal, key, formVal[key].value);

              let id = null;
              let newValue = val;
              let oldVal = null;
              let fieldTitle = BanSubConfig.fieldTitles[this.flowType][key];
              let ban = null;

              if (newValue) {
                // if newValue is not empty then only send it to the review
                this.setEditedData(id, newValue, oldVal, fieldTitle, ban, key, val, formVal);
              }
            }
          });

        }
      }

      // considering the delete checkbox controls
      // have those fields added to edited data where delete is set as true
      if (this.deletedFormMap.size) {
        let deletedFields = Array.from(this.deletedFormMap.keys());
        deletedFields.forEach(key => {
          // new values is always empty for delete enabled
          this.populateEditedData(null, key, null, null, BanSubConfig.fieldTitles[this.flowType][key], null);
        });
      }

      if (this.editedData && this.editedData.length) {
        if (this.flowType === BanSubConfig.FL_TYPE_SUB) {
          this.bulkEditService.persistEditedData(this.editedData, this.configId).then(res => {
            this.navigateToReview();
          });
        } else  if (this.flowType === BanSubConfig.FL_TYPE_ACT_SUB) {
          this.saveActSubsData();
        } else {
          this.navigateToReview();
        }
      } else if (this.flowType === BanSubConfig.FL_TYPE_ACT_SUB) {
        this.saveActSubsData();
      } else {
        this.alertNotify.printErrorNotification(this.translation.translate('MANAGE_DETAILS-NO_CHANGE_INFO'));
        this.processing = false;
      }
    } else {
      this.FormErrors();
      this.processing = false;
    }
  }

  saveActSubsData() {
    this.bulkEditService.updateActSubsDetails([this.isAddEdited(this.bulkEditForm.value)], this.selectedSim).subscribe( (response: any) => {
      this.managementFlow.model['data'] = this.bulkEditForm.value;
      if (UtilsService.isEmpty(this.managementFlow.model['selectedSim'])) {
        this.managementFlow.model['selectedSim'] = this.selectedSim;
      }
      this.formSubmit.emit([this.isAddEdited(Object.assign({}, this.bulkEditForm.value))]);
      this.processing = false;
      this.alertNotify.clearNotification();
    });
  }

  isAddEdited(sub) {
    sub['isAddEdited'] = this.ACT_SUBS_ADD_FIELDS.filter(idx => sub[idx]).
      some(field => sub[field] !== this.oldValues[0][field] ) ? 'Y' : 'N';
    return sub;
  }

  navigateToReview() {
    this.processing = false;
    this.alertNotify.clearNotification();
    this.managementFlow.model.selectCount = this.editedData.length;
    this.isChanged = !this.isChanged;
    this.managementFlow.model.hasChanged = this.isChanged;
    this.managementFlow.model.editedData = this.editedData;
    this.managementFlow.next(this.managementFlow.model);
  }

  populateEditedData(id, field, newValue, oldValue, fieldTitle, ban) {
    if (oldValue !== newValue) {
      let obj: BulkEditRequest = new BulkEditRequest();
      obj.id = id;
      obj.field = field;
      obj.oldValue = oldValue;
      obj.newValue = newValue;
      obj.fieldTitle = fieldTitle;

      // ban is shown as separate field in subscriber flow
      if (this.flowType === BanSubConfig.FL_TYPE_SUB && ban) {
        obj.ban = ban;
      }
      this.editedData.push(obj);
    }
  }

  deleteFieldControls(fieldName: string) {
    let field = this.bulkEditForm.get(fieldName);
    if (field) {
      field.patchValue('');
    }
    if (!this.deletedFormMap.has(fieldName)) {
      // if checkbox is checked then set the fieldval as empty
      this.deletedFormMap.set(fieldName, '');
    } else {
      // if checkbox is not checked then remove it from the map is it exists
      this.deletedFormMap.delete(fieldName);
    }
  }

  resetDeleteFields() {
    this.titleDelete = false;
    this.name2Delete = false;
    this.name3Delete = false;
    this.faxDelete = false;
    this.phoneDelete = false;
    this.emailDelete = false;
    this.nameContactDelete = false;
    this.intCustIdDelete = false;
    this.passwordDelete = false;
    this.showValidation = false;
  }


  payFieldsAPIHandling(payField: string, control: AbstractControl) {
    let field = payField;
    let obj = {};
    obj[field] = control.value;
    this.processing = true;
    return this.bulkEditService.validatePaymentFields(Object.assign({}, obj));
  }

  FormErrors() {
    this.alertNotify.printErrorNotification(`<p class="alertTitle">` + this.translation.translate('MANAGE_DETAILS-ERROR_TITLE') + `</p>
        <p>` + this.translation.translate('MANAGE_DETAILS-ERROR_DESCRIPTION') + `</p>`);
  }


  onBlur(fieldControlName) {
    let fieldControl: AbstractControl = this.bulkEditForm.get(fieldControlName);
    let fieldControlCopy: AbstractControl = this.bulkEditForm.get(fieldControlName + '_copy');
    fieldControlCopy.patchValue(fieldControl.value);
    let maskedVal = UtilsService.maskAllButLastFour(fieldControl.value);
    fieldControl.patchValue(maskedVal);
  }

  // Remove Error popup for unique items
  simSerialNoExists(field) {
    if (field && (BanSubConfig.SIM_SERIAL_NOS.indexOf(field) > -1) && this.flowType === BanSubConfig.FL_TYPE_ACT_SUB) {
      BanSubConfig.SIM_SERIAL_NOS.forEach(fld => {
        if (field !== fld && UtilsService.notNull(this.bulkEditForm.get(fld).errors)
          && UtilsService.notNull(this.bulkEditForm.get(fld).errors['duplicateSerialNo'])) {
          this.bulkEditForm.get(fld).patchValue(this.bulkEditForm.get(fld).value);
        }
      });
      this.bulkEditForm.updateValueAndValidity({onlySelf: true});
    }
  }

  onFocus(fieldControlName) {
    let fieldControl: AbstractControl = this.bulkEditForm.get(fieldControlName);
    let fieldControlCopy: AbstractControl = this.bulkEditForm.get(fieldControlName + '_copy');
    fieldControl.patchValue(fieldControlCopy.value);
  }


  getFieldValue(formVal, key, val) {
    let value = val;
    if (typeof val === 'string') {
      if (this.flowType === BanSubConfig.FL_TYPE_BAN && (key === BanSubConfig.IBAN || key === BanSubConfig.BIC)) {
        value = formVal[key + '_copy'].value ? formVal[key + '_copy'].value.trim() : '';
      } else if (BanSubConfig.formControlCopies[this.flowType].includes(key) && formVal[key].disabled) {
        // if disabled for special cases then make it to empty
        value = '';
      } else {
        value = formVal[key].value.trim();
      }
    }
    return value;
  }


  setEditedData(id, newValue, oldVal, fieldTitle, ban, key, val, formVal) {
    if (this.flowType === BanSubConfig.FL_TYPE_BAN) {
      if (![this.fieldControlNames.addressFormat, BanSubConfig.IBAN + '_copy', BanSubConfig.BIC + '_copy'].includes(key)) {
        this.populateEditedData(id, key,
          newValue, oldVal,
          fieldTitle,
          ban);
      }
    } else {
      if ((this.flowType === BanSubConfig.FL_TYPE_SUB || this.flowType === BanSubConfig.FL_TYPE_ACT_SUB)
          && typeof(formVal[key].value) === 'boolean') {
        newValue = this.getSubscriberBoolVal(val);
        oldVal = this.getSubscriberBoolVal(oldVal);
      }
      this.populateEditedData(id, key,
        newValue, oldVal,
        fieldTitle, ban);
    }
  }

  getSubscriberBoolVal(val) {
    if ((typeof val === 'boolean' && val) || (typeof val !== 'boolean' && UtilsService.notNull(val) && val === 'true')) {
      return 'Ja';
    } else if ((typeof val === 'boolean' && !val) || (typeof val !== 'boolean' && UtilsService.notNull(val) && val === 'false')
      || !val) {
      return 'Nein';
    }
    return null;
  }


  prepopulateEditedData(oldDataObj: any, editedRows: any[]): any {
    let keys = Object.keys({...oldDataObj});

    editedRows.forEach(edited => {
      keys.forEach(key => {
        if (keys.includes(edited.field) && edited.field === key && UtilsService.notNull(edited.newValue)
          && ((typeof(edited.newValue) === 'boolean' && edited.newValue.toString() !== oldDataObj[key])
            || (typeof(edited.newValue) !== 'boolean' && edited.newValue !== oldDataObj[key]))) {
          // the value is changed so set it with the new value and if type is boolean then ignore type and check
          oldDataObj[key] = edited.newValue;
        } else if (!keys.includes(edited.field) && edited.newValue) {
          // add that key with modified data
          oldDataObj[edited.field] = edited.newValue;
        }
      });
    });
    return {...oldDataObj};
  }

  showInputs(fieldName: string): boolean {
    if (this.isPreQueryEligible && UtilsService.notNull(this.bulkEditConfig)) {
      let fieldId = this.bulkEditConfig.fieldControlNames[this.flowType][fieldName];
      return this.bulkEditConfig.hideCols[this.selectedSim].indexOf(fieldId) <= -1;
    }
    return true;
  }

  setSimSelection() {
    this.formReset = false;
    this.simSelection.emit(this.selectedSim);
    this.bulkEditForm.reset(this.oldValues[0], {onlySelf: true});
    setTimeout(() => {
      this.formReset = true;
    }, 0);
    this.editedData = [];
    this.updateSimValidators();
    this.alertNotify.clearNotification();
  }

  getSimTypes() {
    this.simCardOptions = this.banSubValidatorsService.getSimTypes(this.simTypes, BanSubConfig.SIM_OPTION_TYPES.ACT_TYPE);
    this.ultraCardOptions = this.banSubValidatorsService.getSimTypes(this.simTypes, BanSubConfig.SIM_OPTION_TYPES.UC_TYPE);
    if (this.flowType === BanSubConfig.FL_TYPE_ACT_SUB && this.flag) {
      this.bulkEditForm.valueChanges.subscribe(val => {
        this.managementFlow.model['data'] = val;
      });
    }
  }

  updateSimValidators() {
    if (this.selectedSim === 'NEW_SIM') {
      this.bulkEditForm.get('7').setValidators([]);
      this.bulkEditForm.get('7').disable();
    } else {
      this.bulkEditForm.get('7').enable();
      this.bulkEditForm.get('7').setValidators([Validators.required,
        CustomValidators.onlyNumbersWithLimit,
        CustomValidators.isDuplicateExists(this.bulkEditForm, BanSubConfig.SIM_SERIAL_NOS),
        CustomValidators.sanitization(this.pattern)]);
      this.bulkEditForm.get('29').setValidators([CustomValidators.onlyNumbersWithLimit,
        CustomValidators.isDuplicateExists(this.bulkEditForm, BanSubConfig.SIM_SERIAL_NOS)]);
      this.bulkEditForm.get('30').setValidators([CustomValidators.onlyNumbersWithLimit,
        CustomValidators.isDuplicateExists(this.bulkEditForm, BanSubConfig.SIM_SERIAL_NOS)]);
      if (this.isWifiSocSelected) {
        this.bulkEditForm.get('29').disable();
        this.bulkEditForm.get('30').disable();
      } else {
        this.bulkEditForm.get('29').enable();
        this.bulkEditForm.get('30').enable();
      }
    }
    this.bulkEditForm.get('7').updateValueAndValidity();
    this.bulkEditForm.get('29').updateValueAndValidity();
    this.bulkEditForm.get('30').updateValueAndValidity();
  }
  private buildConcatData(res, data) {
    if (data.length) {
     for (let i = 0; i < res.length; i++) {
        Object.keys(data[i]).forEach( key => {
          res[i][key] = data[i][key];
        })
      }
    }
    return res;
   }
}
