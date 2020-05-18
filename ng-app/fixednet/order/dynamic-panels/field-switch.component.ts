import {
  AfterContentInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {Field} from './panel';
import {FormGroup} from '@angular/forms';
import {Subscription} from 'rxjs';
import {DynamicSharedService} from './dynamic-shared.service';
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';
import {filter} from 'rxjs/operators';
import {UtilsService} from '../../../sncr-components/sncr-commons/utils.service';

@Component({
  selector: 'field-switch',
  templateUrl: 'field-switch.component.html',
  styleUrls: ['field-switch.component.scss']
})
export class FieldSwitchComponent implements OnInit, AfterContentInit, OnDestroy {

  @ViewChild('tableField', {static: true}) tableField;

  @Input() showValidation: boolean;
  @Input() field: Field;
  @Input() readonly: boolean;
  @Input() form: FormGroup;
  @Output() formChange = new EventEmitter<FormGroup>();

  private form$: Subscription;
  private formChanged$: Subscription;

  constructor(private elementRef: ElementRef, private dynamicSharedService: DynamicSharedService) {

  }

  ngOnInit(): void {
    if (this.field.type === 'table') {
      this.field.cols.forEach(col => {
        col.show = true;
        col.sortable = false;
        col.filter = false;
        col.bodyTemplate = this.tableField;
      });
    } else if (this.field.type === 'radio') {
      /**
       * Fix for radio buttons not emitting the change event:
       * https://github.com/angular/angular/issues/13792
       */
      const control = this.form.controls[this.field.fieldId];
      control.valueChanges.subscribe(e => {
        control.setValue(e, {emitEvent: false});
      });
    }

    if (!this.readonly && this.field.disabled) {
      this.formChanged$ = this.dynamicSharedService.formChanged
        .pipe(filter((formChanged: FormGroup) => formChanged === this.form))
        .subscribe((form: FormGroup) => {
          const formControl = this.elementRef.nativeElement.querySelector('.sncr-control');
          if (formControl) {
            if (this.dynamicSharedService.expressionCheck(form, this.field.disabled)) {
              if (!formControl.disabled) {
                formControl.disabled = true;
                this.form.controls[this.field.fieldId].reset();
                this.setDefaultValue();
              }
            } else if (formControl.disabled) {
              formControl.disabled = false;
            }
          }
        });
    }

    this.form$ = this.form.valueChanges.subscribe(() => {
      this.formChange.emit(this.form);

      if (!this.readonly && this.field.type === 'table') {
        this.dynamicSharedService.formChanged.emit(this.form);
      }
    });
  }

  ngAfterContentInit(): void {
    this.setDefaultValue();

    if (!this.readonly && this.field.disabled) {
      setTimeout(() => {
        const formControl = this.elementRef.nativeElement.querySelector('.sncr-control');
        if (formControl) {
          formControl.disabled = this.dynamicSharedService.expressionCheck(this.form, this.field.disabled);
        }
      });
    }
  }

  ngOnDestroy(): void {
    if (this.form$) {
      this.form$.unsubscribe();
    }

    if (this.formChanged$) {
      this.formChanged$.unsubscribe();
    }
  }

  applyFieldClass(context: any) {
    return context.row[context.col.field].type !== 'radio';
  }

  isHidden(option: Field, field: Field) {
    const hidden = !this.dynamicSharedService.shouldFieldShow(this.form, option);
    const formField = this.form.controls[field.fieldId];

    if (hidden && formField.value === option['value']) {
      formField.setValue(field.defaultValue || '');
    }

    return hidden;
  }

  private setDefaultValue() {
    if (this.field.type === 'select' && !this.form.controls[this.field.fieldId].value) {
      setTimeout(() => {
        const select = this.elementRef.nativeElement.querySelector('select');
        select.value = '';
      });
    }
  }

  getMinDate(minDate: string): NgbDateStruct {
    if (Number.isInteger(parseInt(minDate, 10))) {
      let date = new Date();
      let lastDay = new Date(date.getUTCFullYear(), date.getMonth() + 1, 0).getDate();
      let day = date.getUTCDate() + parseInt(minDate, 10);
      let month = day > lastDay ? date.getUTCMonth() + 2 : date.getUTCMonth() + 1;
      return {
        day: day > lastDay ? 1 : day,
        month: month > 12 ? 1 : month,
        year: month > 12 ? date.getUTCFullYear() + 1 : date.getUTCFullYear()
      };
    }
  }
}
