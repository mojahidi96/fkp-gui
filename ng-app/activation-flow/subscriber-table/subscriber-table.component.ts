import { Component, EventEmitter, Inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { SubUpdateInfoService } from '../../subscriber-update-info/sub-update-info.service';
import { BanSubValidatorsService } from '../../ban-sub-common/ban-sub-validators.service';
import { Language, TranslationService } from 'angular-l10n';
import { NotificationHandlerService } from '../../sncr-components/sncr-notification/notification-handler.service';
import { Column } from '../../sncr-components/sncr-datatable/column';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidationMessagesService } from '../../sncr-components/sncr-controls/validation-messages/sncr-validation-messages.service';
import { BanSubConfig } from '../../ban-sub-common/ban-sub.config';
import { CustomValidators } from '../../sncr-components/sncr-controls/custom-validators';
import { SncrPaginatorComponent } from '../../sncr-components/sncr-datatable/sncr-paginator.component';
import { UtilsService } from '../../sncr-components/sncr-commons/utils.service';
import { LazyParams } from '../../sncr-components/sncr-datatable/lazy-params';
import { SncrDatatableService } from '../../sncr-components/sncr-datatable/sncr-datatable.service';
import {SncrFlowSectionComponent} from '../../sncr-components/sncr-flow/sncr-flow-section.component';


@Component({
  selector: 'subscriber-table',
  templateUrl: 'subscriber-table.component.html',
  styleUrls: ['subscriber-table.component.scss']
})
export class SubscriberTableComponent implements OnInit {

  @Input() flowType = '';
  @Input() flowSection: SncrFlowSectionComponent;
  @Input() isPreQueryEligible = false;
  @Input() isWifiSocSelected = false;
  @Input() totalRecords: any;
  @Input() countries = [];
  @Input() msisdn = [];
  @Input() simTypes = [];
  @Input() pattern = '';
  @Input() columns: Column[] = [];
  @Input() data: any[] = [];
  @Input() continueLabel;
  @Input() configId = '';
  @Input() selectedSim = 'NEW_SIM';
  @Input() hideSubsTable = false;

  @Output() simSelection = new EventEmitter();
  @Output() formSubmit = new EventEmitter();

  @ViewChild('paginator1', { static: true }) paginator: SncrPaginatorComponent;

  @Language() lang;

  rowsPerPageOptions = [5, 10, 20, 40, 80];
  first = 0;
  rows = 10;
  currentPage = 0;
  displayData: AbstractControl[];
  ACT_SUBS_ADD_FIELDS = ['9', '10', '11', '12', '13', '16', '17', '18', '19', '20', '42', '43', '44', '45', '46', '47', '48'];

  alertNotify: NotificationHandlerService = new NotificationHandlerService();
  enablePreQuery = false;
  processing = false;
  loading = false;
  manageCols = [];

  subscriberForm: FormGroup;

  constructor(private subUpdateInfoService: SubUpdateInfoService,
              @Inject('NotificationHandlerFactory') private notificationHandlerFactory,
              private fb: FormBuilder,
              private banSubValidatorsService: BanSubValidatorsService,
              private datatableService: SncrDatatableService,
              private validationMessagesService: ValidationMessagesService,
              public translation: TranslationService) {
  }

  ngOnInit(): void {
    this.subscriberForm = this.fb.group({
      subscribers: this.fb.array([])
    });
    if (this.columns && this.columns.length) {
      this.columns = this.processColumns(this.columns);
    }
    this.getSubscriberList();
  }
  
  getSubscriberList() {
    this.loading = true;
    this.getSubsDetailsPrequery();
    let lazyParams = new LazyParams();
    lazyParams.configId = this.configId;
    lazyParams.first = 0;
    lazyParams.rows = this.totalRecords;
    this.datatableService.getData$({ url: '/buyflow/rest/table/custom', lazyParams: lazyParams, selections: [] })
    .subscribe(data => {
      this.data = this.buildConcatData(JSON.parse(data.rows), this.data);
      this.getSubscribers();
      this.resetColumns();
      this.loading = false;
    }, error => {
      this.loading = false;
    });
  }

  resetColumns(radioChange?: boolean) {
    if (this.isPreQueryEligible) {
      this.columns.forEach(col => {
        col.show = BanSubConfig.hideCols[this.selectedSim].indexOf(col.field) <= -1;
      });
      this.manageCols = this.columns.filter(col => col.show);
    }
    if (radioChange) {
      this.simSelection.emit(this.selectedSim);
      setTimeout(() => {
        this.getFormData.reset(this.data, {onlySelf: true});
        this.getFormData.controls.forEach(fg => {
          if (this.selectedSim === 'NEW_SIM') {
            fg.get('7').disable();
          } else {
            fg.get('7').enable();
          }
          this.resetValidation(fg, BanSubConfig.fieldControlNames[this.flowType].addressFormat);
          this.resetValidation(fg, BanSubConfig.fieldControlNames[this.flowType].nameFormat);
        });
        this.paginator.changePage(0);
        this.getFormData.updateValueAndValidity({onlySelf: true});
        this.flowSection.model['data'] = this.getFormData.value;
      }, 0);
    }
  }

  getSubscribers() {
    const control = <FormArray>this.subscriberForm.get('subscribers');
    for (const sub of this.data) {
      sub['99'] = '';
      const grp = this.fb.group({
        99: [{value: sub['99'], disabled: this.msisdn.length === 0}],
        2: [sub[2]],
        8: [sub['8'], Validators.required],
        32: [{value: sub['32'], disabled: this.isWifiSocSelected}],
        34: [{value: sub['34'], disabled: this.isWifiSocSelected}],
        7: [{ value: sub['7'], disabled: this.selectedSim === 'NEW_SIM' },
          [Validators.required, CustomValidators.onlyNumbersWithLimit, CustomValidators.sanitization(this.pattern)]],
        29: [{value: sub['29'], disabled: this.isWifiSocSelected},
          [CustomValidators.onlyNumbersWithLimit, CustomValidators.sanitization(this.pattern)]],
        30: [{value: sub['30'], disabled: this.isWifiSocSelected},
          [CustomValidators.onlyNumbersWithLimit, CustomValidators.sanitization(this.pattern)]],
        28: [sub['28'], [Validators.maxLength(15), CustomValidators.validInternalCustId,
          CustomValidators.sanitization(this.pattern)]],
        47: [sub['47'], [Validators.required]],
        43: [{ value: sub['43'], disabled: sub['47'] === ''}, [Validators.required]],
        44: [{ value: sub['44'], disabled: sub['47'] === BanSubConfig.business || sub['47'] === ''},
          [Validators.maxLength(32), CustomValidators.sanitization(this.pattern)]],
        45: [{ value: sub['45'], disabled: sub['47'] === BanSubConfig.business || sub['47'] === ''},
          [Validators.maxLength(32), CustomValidators.sanitization(this.pattern)]],
        9: [sub['9'], [Validators.maxLength(30), CustomValidators.sanitization(this.pattern)]],
        10: [sub['10'], [Validators.maxLength(30), CustomValidators.sanitization(this.pattern)]],
        11: [sub['11'], [Validators.maxLength(30), CustomValidators.sanitization(this.pattern)]],
        46: [sub['46'], [Validators.required]],
        12: [{ value: sub['12'], disabled: sub['46'] === BanSubConfig.PoBox || sub['46'] === ''},
          [Validators.maxLength(40), CustomValidators.requiredWithTrim, CustomValidators.sanitization(this.pattern)]],
        13: [{ value: sub['13'], disabled: sub['46'] === BanSubConfig.PoBox || sub['46'] === ''},
          [Validators.maxLength(10), CustomValidators.validateHouseNumber, CustomValidators.sanitization(this.pattern)]],
        14: [{ value: sub['14'], disabled: sub['46'] === BanSubConfig.Regular || sub['46'] === ''},
          [CustomValidators.requiredWithTrim, CustomValidators.sanitization(this.pattern), Validators.maxLength(10)]],
        17: [sub['17'], [Validators.required, CustomValidators.sanitization(this.pattern)]],
        16: [sub['16'], [CustomValidators.requiredWithTrim, Validators.maxLength(40),
          CustomValidators.sanitization(this.pattern)]],
        42: [sub['42'], [Validators.required]],
        18: [sub['18'], [CustomValidators.sanitization(this.pattern), Validators.maxLength(40)]],
        19: [sub['19'], [Validators.maxLength(20), CustomValidators.sanitization(this.pattern)]],
        20: [sub['20'], [Validators.maxLength(20), CustomValidators.sanitization(this.pattern)]],
        48: [sub['48'], [CustomValidators.sanitization(this.pattern), Validators.maxLength(150)]],
        53: [sub['53'], [Validators.maxLength(20), CustomValidators.sanitization(this.pattern)]],
        61: [{ value: sub['61'], disabled: !sub['61'] }]
      });
      // adding FormGroups to FormArray
      control.push(grp);
    }
    this.displayData = this.getFormData.controls.slice(this.first, this.rows);
  }

  get getFormData(): FormArray {
    return <FormArray>this.subscriberForm.get('subscribers');
  }

  getSubsDetailsPrequery() {
    this.subUpdateInfoService.getSubsDetailsPrequery()
      .subscribe((response: boolean) => {
          this.enablePreQuery = response;
        }
      );
  }

  persistSubscriber() {
    this.processing = true;
    let formDirty = true;
    if (this.selectedSim !== 'NEW_SIM') {
      this.getFormData.controls.forEach(fg => {
        fg.markAsDirty();
      });
    } else {
      formDirty = this.getFormData.controls.some(fg => fg.dirty && fg.invalid );
    }
    if (!this.getFormData.invalid || !formDirty) {
      this.updateActSubsPreQuery();
    } else {
      const errorPageIndex = this.selectedSim !== 'NEW_SIM' ? this.getFormData.controls.findIndex(fg => fg.invalid === true)
                    : this.getFormData.controls.findIndex(fg => fg.dirty && fg.invalid);
      let page = errorPageIndex / this.rows;
      this.paginator.changePage(Math.floor(page));
      this.processing = false;
    }
  }

  private updateActSubsPreQuery(): void {
    let subs = this.isAddressEdited([...this.subscriberForm.get('subscribers').value].map(item => ({...item})));
    this.subUpdateInfoService.updateActSubsDetails(subs, this.selectedSim).subscribe(() => {
      this.flowSection.model['data'] = this.getFormData.value;
      if (UtilsService.isEmpty(this.flowSection.model['selectedSim'])) {
        this.flowSection.model['selectedSim'] = this.selectedSim;
      }
      this.formSubmit.emit(subs);
      this.processing = false;
    });
  }

  private isAddressEdited(subs) {
    subs.forEach((sub, index) => { 
      sub['isAddEdited'] = this.ACT_SUBS_ADD_FIELDS.filter(idx => sub[idx]).
        some(field => sub[field] !== this.data[index][field] ) ? 'Y' : 'N';
    });
    return subs;
  }

  onPageChange(event) {
    this.first = event.first;
    this.rows = event.rows;
    this.currentPage = event.page;
    setTimeout(() => {
      this.displayData = this.getFormData.controls.slice(this.first, this.first + this.rows);
    }, 0);
  }

  protected getErrors(group: AbstractControl, field: string) {
    return this.validationMessagesService.buildMessages(group.get(field).errors);
  }

  processColumns(tempCols): any[] {
    tempCols.forEach(col => {
      if (BanSubConfig.fieldWidth[this.flowType][col.field]) {
        col.width = BanSubConfig.fieldWidth[this.flowType][col.field];
      }

      if (col.field === BanSubConfig.fieldControlNames[this.flowType].msisdn) {
        col.type = 'select-lazy';
        col.assignAll = true;
        col.infoTitle = 'ACT_SELECTALL_MSISDN';
      }

      if (col.field === BanSubConfig.fieldControlNames[this.flowType].simType) {
        col.type = 'select';
        col.hideSelectionTitle = true;
        col.options = this.banSubValidatorsService.getSimTypes(this.simTypes, BanSubConfig.SIM_OPTION_TYPES.ACT_TYPE);
      }

      if (col.field === BanSubConfig.fieldControlNames[this.flowType].ultracardSimType1
              || col.field === BanSubConfig.fieldControlNames[this.flowType].ultracardSimType2) {
        col.type = 'select';
        col.defaultSelectLabel = 'SIM_TYPE-DATATABLE-SELECTION_TITLE';
        col.options = this.banSubValidatorsService.getSimTypes(this.simTypes, BanSubConfig.SIM_OPTION_TYPES.UC_TYPE);
      }

      if (col.field === BanSubConfig.fieldControlNames[this.flowType].nameFormat) {
        col.type = 'select';
        col.options = BanSubConfig.nameFormatOptions;
      }

      if (col.field === BanSubConfig.fieldControlNames[this.flowType].salutation) {
        col.type = 'select';
        col.options = BanSubConfig.salutationOptions;
      }

      if (col.field === BanSubConfig.fieldControlNames[this.flowType].title) {
        col.type = 'select';
        col.options = BanSubConfig.titleOptions;
      }

      if (col.field === BanSubConfig.fieldControlNames[this.flowType].addressFormat) {
        col.type = 'select';
        col.options = BanSubConfig.addressFormatOptions;
      }

      if (col.field === BanSubConfig.fieldControlNames[this.flowType].country) {
        col.type = 'select';
        col.options = this.countries;
      }

      if (col.field === BanSubConfig.fieldControlNames[this.flowType].dep) {
        col.type = 'checkbox';
      }

      if (col.field === BanSubConfig.fieldControlNames[this.flowType].password) {
        col.type = 'password';
      }
    });
    return tempCols;
  }

  getAvailableOptions(group: AbstractControl, field: string): any[] {
    if (field === BanSubConfig.fieldControlNames[this.flowType].msisdn) {
      let reservedMsisdn = [...this.msisdn];
      this.getFormData.controls.forEach( fg => {
        if (fg.get(field).value !== '' && fg.get(field).value !== group.get(field).value) {
          let index = reservedMsisdn.findIndex(m => m.value === fg.get(field).value);
          reservedMsisdn.splice(index, 1);
        }
      });
      return [...reservedMsisdn];
    }
  }

  resetValidation(group: AbstractControl, field: string, valueChange?: boolean ) {
    if (field === BanSubConfig.fieldControlNames[this.flowType].country
        || field === BanSubConfig.fieldControlNames[this.flowType].postalCode) {
      let minLength = 1;
      let maxLegnth = 10;
      if (group.get('42').value === BanSubConfig.defaultCountry) {
        minLength = 5;
        maxLegnth = 5;
        group.get('17').setValidators([
          CustomValidators.requiredWithTrim,
          CustomValidators.sanitization(this.pattern),
          Validators.maxLength(maxLegnth),
          Validators.minLength(minLength)
        ]);
      } else {
        group.get('17').setValidators([
          CustomValidators.sanitization(this.pattern),
          Validators.maxLength(maxLegnth),
          Validators.minLength(minLength)
        ]);
      }
      group.get('17').updateValueAndValidity();
    }

    if (field === BanSubConfig.fieldControlNames[this.flowType].addressFormat) {
      if (group.get(field).value === BanSubConfig.Regular) {
        this.enableFields(group, ['12', '13']);
        this.disableFields(group, ['14']);
      } else if (group.get(field).value === BanSubConfig.PoBox) {
        this.enableFields(group, ['14']);
        this.disableFields(group, ['12', '13']);
      } else {
        this.disableFields(group, ['12', '13', '14']);
      }
    }

    if (field === BanSubConfig.fieldControlNames[this.flowType].nameFormat) {
      if (group.get(field).value === BanSubConfig.personal) {
        this.enableFields(group, ['43', '44', '45']);
        group.get('9').setValidators([CustomValidators.sanitization(this.pattern), Validators.maxLength(30),
          CustomValidators.requiredWithTrim]);
        group.get('45').setValidators([Validators.maxLength(32), CustomValidators.sanitization(this.pattern),
          CustomValidators.requiredWithTrim]);
        group.get('9').updateValueAndValidity();
        group.get('45').updateValueAndValidity();
      } else if (group.get(field).value === BanSubConfig.business) {
        this.enableFields(group, ['43']);
        this.disableFields(group, ['44', '45']);
        group.get('9').setValidators([CustomValidators.sanitization(this.pattern), Validators.maxLength(30),
          CustomValidators.requiredWithTrim]);
        group.get('45').setValidators([Validators.maxLength(32), CustomValidators.sanitization(this.pattern)]);
        group.get('9').updateValueAndValidity();
        group.get('45').updateValueAndValidity();
      } else {
        this.disableFields(group, ['43', '44', '45']);
      }
    }

    if (BanSubConfig.formControlUnique[this.flowType].includes(field)) {
      const currentValue = group.get(field).value;
      let fgList = [];
      if (currentValue !== '') {
        fgList = this.getFormData.controls.filter(fg => {
          return fg.get('7').value === currentValue
            || fg.get('29').value === currentValue
            || fg.get('30').value === currentValue;
        });
      }
      if (fgList.length > 1) {
        if (group.get(field).errors === null) {
          group.get(field).setErrors({ 'numberAlreadyUsed': true });
        }
      } else if (fgList.length === 1) {
        let i = 0;
        i = i + (fgList[0].get('7').value === currentValue ? 1 : 0);
        i = i + (fgList[0].get('29').value === currentValue ? 1 : 0);
        i = i + (fgList[0].get('30').value === currentValue ? 1 : 0);
        if (i === 1) {
          this.removeErrors(group.get(field), 'numberAlreadyUsed');
        } else {
          group.get(field).setErrors({ 'numberAlreadyUsed': true });
        }
      } else {
        this.removeErrors(group.get(field), 'numberAlreadyUsed');
      }
    }
    if (valueChange) {
      this.flowSection.model['data'] = this.getFormData.value;
    }
  }

  removeErrors(group: AbstractControl, key: string) {
     if (UtilsService.notNull(group.errors)) {
       delete group.errors[key];
     }
  }

  disableFields(formGroup: AbstractControl, fields: string[]) {
    fields.forEach(field => {
      if (formGroup.get(field)) {
        formGroup.get(field).disable();
      }
    });
  }

  enableFields(formGroup: AbstractControl, fields: string[]) {
    fields.forEach(field => {
      if (formGroup.get(field)) {
        formGroup.get(field).enable();
      }
    });
  }

  assignToAll(field: string) {
    if (field === BanSubConfig.fieldControlNames[this.flowType].msisdn
          &&  this.msisdn.length > 0) {
      this.msisdn.forEach((m, i) => {
        if (i <= this.getFormData.controls.length) {
          this.getFormData.controls[i].get(field).patchValue(m.value);
          this.getFormData.controls[i].get(field).updateValueAndValidity();
        }
      });
      this.flowSection.model['data'] = this.getFormData.value;
    }
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