import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges
} from '@angular/core';
import {Column} from './column';
import {AbstractControl, FormGroup} from '@angular/forms';
import {BanSubConfig} from '../../ban-sub-common/ban-sub.config';
import {UtilsService} from '../sncr-commons/utils.service';
import {BanUpdateInfoService} from '../../ban-update-info/ban-update-info.service';
import {Language} from 'angular-l10n';

@Component({
  selector: 'sncr-editable',
  templateUrl: 'sncr-editable.component.html',
  styleUrls: ['sncr-editable.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class SncrEditableComponent implements OnInit, OnChanges {

  @Input() column: Column;
  @Input() form: FormGroup;
  @Input() dirty: boolean;
  @Input() invalid: boolean;
  @Input() lazy: boolean;
  @Input() flowId: string;
  @Input() disabled: boolean; // Only for change detection purposes
  @Input() flowType = '';
  @Output() paymentFieldsChanges = new EventEmitter();

  @Language() lang;

  selectedName: string;
  search: string;
  type: string;

  private originalValue: any;
  private showValidation: boolean;
  private payFieldsValidationInProgress = false;


  constructor(private banUpdateInfoService: BanUpdateInfoService, private cdr: ChangeDetectorRef) { }

  ngOnInit(): void {
    this.type = (this.column.editInfo && this.column.editInfo.type) || this.column.type;

    const field = this.form.controls[this.column.field];
    field.valueChanges.subscribe(val => {
      if (this.originalValue === val && field.dirty) {
        field.markAsPristine();
      }
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    const formChange = changes['form'],
      columnChange = changes['column'];

    if (formChange && formChange.isFirstChange() && columnChange && columnChange.isFirstChange()) {
      const currentField = this.form.controls[this.column.field];
      this.originalValue = UtilsService.notNull(currentField.value) ? currentField.value : '';
      currentField.setValue(this.originalValue, {onlySelf: true, emitEvent: false});
    }

    if (changes['dirty'] || changes['invalid']) {
      this.showValidation = this.dirty && this.invalid;
    }
  }

  isRequired(): boolean {
    if (this.column.editInfo && this.column.editInfo.required) {
      return this.column.editInfo.required;
    } else {
      return false;
    }
  }

  updateSel(e, c) {
    console.log(e);
    this.selectedName = e.text;
    this.form.controls[c].setValue(e.value);
  }

  getFilterList(list) {
    return list.filter((v) => {
      if (this.search && list.length > 0) {
        return v.text.toLowerCase().includes(this.search.toLowerCase());
      } else {
        return list;
      }
    });
  }

  onBlur(field) {
    if (field && (BanSubConfig.IBAN === field || BanSubConfig.BIC === field) && this.flowId === '1') {
      this.setFocussedFields(false);
      let fieldControl: AbstractControl = this.form.get(field);
      let fieldControlCopy: AbstractControl = this.form.get(field + '_copy');
      fieldControlCopy.patchValue(fieldControl.value);
      let maskedVal = UtilsService.maskAllButLastFour(fieldControl.value);
      fieldControl.patchValue(maskedVal);

      if (fieldControl.touched) {
        let obj = {};
        obj[field] = fieldControlCopy ? fieldControlCopy.value : '';
        this.banUpdateInfoService.validatePaymentFields(Object.assign({}, obj)).subscribe(res => {
          this.payFieldsValidationInProgress = false;
          this.setValidationInProgress(this.payFieldsValidationInProgress);
          fieldControl.markAsTouched();
          fieldControl.markAsDirty();
          if (!res.isValid) {
            fieldControl.setErrors(BanSubConfig.payFieldsErrorObj[field]);
          } else {
            fieldControl.setErrors(null);
          }
          this.cdr.markForCheck();
        });
      }
    }
  }

  onFocus(field) {
    if (field && (BanSubConfig.IBAN === field || BanSubConfig.BIC === field) && this.flowId === '1') {
      let fieldControl: AbstractControl = this.form.get(field);
      let fieldControlCopy: AbstractControl = this.form.get(field + '_copy');
      let errors = fieldControl.errors;
      fieldControl.patchValue(fieldControlCopy.value);
      this.setFocussedFields(true);

      this.payFieldsValidationInProgress = true;
      this.setValidationInProgress(this.payFieldsValidationInProgress);

      if (JSON.stringify(errors) !== '{}') {
        fieldControl.setErrors(errors);
      }
    }
  }

  setFocussedFields(payFieldsFocussed) {
    this.banUpdateInfoService.sendPayFieldsFocussed(payFieldsFocussed);
  }

  setValidationInProgress(inProgress) {
    this.banUpdateInfoService.sendPayFieldsValidationInProgress(inProgress);
  }
}
