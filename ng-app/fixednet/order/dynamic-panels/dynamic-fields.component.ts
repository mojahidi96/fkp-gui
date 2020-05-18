import {Component, Input, OnInit} from '@angular/core';
import {Field} from './panel';
import {FormGroup} from '@angular/forms';
import {DynamicSharedService} from './dynamic-shared.service';

@Component({
  selector: 'dynamic-fields',
  templateUrl: 'dynamic-fields.component.html',
  styleUrls: ['dynamic-fields.component.scss']
})
export class DynamicFieldsComponent implements OnInit {

  @Input() rows: Field[][];
  @Input() panelForm: FormGroup;
  @Input() readonly: boolean;
  @Input() showValidation: boolean;

  constructor(private dynamicSharedService: DynamicSharedService) {

  }

  ngOnInit(): void {
    if (this.readonly) {
      setTimeout(() => this.panelForm.disable());
    } else {
      this.panelForm.enable();
    }
  }

  isRowHidden(row: Field[]) {
    return row.every(f => {
      return f.hidden && this.expressionCheck(f.hidden);
    });
  }

  expressionCheck(exp: string) {
    return this.dynamicSharedService.expressionCheck(this.panelForm, exp);
  }

  shouldFieldShow(field: Field) {
    const show = this.dynamicSharedService.shouldFieldShow(this.panelForm, field);
    const fieldControl = this.panelForm.controls[field.fieldId];
    let disabledFieldIds = ['17', '18', '19', '20', '21'];

    if (fieldControl) {
      if (show && fieldControl.disabled && !this.readonly) {
        fieldControl.enable();
      } else if (!show && fieldControl.enabled) {
        fieldControl.disable();
      }
      if ((disabledFieldIds.includes(field.fieldId.toString())) && fieldControl.disabled) {
        fieldControl.disable();
      }
    }

    return show;
  }

  private getColClass(field: Field) {
    return field.width ? 'col-sm-' + field.width : 'col-sm-4';
  }
}