import {Component, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output, SimpleChanges} from '@angular/core';
import {Field, Panel} from './panel';
import {AbstractControl, FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Subscription} from 'rxjs';
import {CustomValidators} from '../../../sncr-components/sncr-controls/custom-validators';
import {UtilsService} from '../../../sncr-components/sncr-commons/utils.service';
import {DynamicSharedService} from './dynamic-shared.service';
import {FixedNetService} from '../../fixednet.service';
import {debounceTime} from 'rxjs/operators';

@Component({
  selector: 'dynamic-panels',
  templateUrl: 'dynamic-panels.component.html',
  styleUrls: ['dynamic-panels.component.scss'],
  exportAs: 'dynamicPanels'
})
export class DynamicPanelsComponent implements OnInit, OnDestroy, OnChanges {
  @Input() panels: Panel[];
  @Input() readonly: boolean;
  @Input() mainForm: FormGroup;
  @Input() showValidation: boolean;
  @Input() location = {};
  @Output() mainFormChange = new EventEmitter<FormGroup>();

  @Output() onSave = new EventEmitter();

  activeIds = [];
  validPanelsClass: string[] = [];
  dynamicRequiredFields: AbstractControl[] = [];
  dynamicShownHiddenFields: {fieldControl: AbstractControl, field: Field}[] = [];
  patternMap: any;

  private changeSubscription: Subscription;

  constructor(private formBuilder: FormBuilder, private dynamicSharedService: DynamicSharedService,
              private fixedNetService: FixedNetService) {

  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['panels']) {
      this.setActiveIds();
    }
  }

  ngOnInit(): void {
    this.patternMap = this.fixedNetService.getPattern();
    if (!this.mainForm) {
      this.mainForm = this.formBuilder.group({
        panels: this.formBuilder.array(this.generatePanelFormGroups())
      });
      this.dynamicSharedService.allForms = this.mainForm.controls['panels']['controls'];
      this.panels.forEach((panel, i) => {
        this.validPanelsClass[i] = this.getValidClass(i);
      });

      setTimeout(() => this.mainFormChange.emit(this.mainForm), 0);
    }
    this.changeSubscription = this.mainForm.valueChanges
      .pipe(
        debounceTime(300)
      )
      .subscribe(() => {
        this.dynamicRequiredFields.forEach(fieldControl => {
          fieldControl.updateValueAndValidity({emitEvent: false});
        });

        this.dynamicShownHiddenFields.forEach(({fieldControl, field}) => {
          const show = this.dynamicSharedService.shouldFieldShow(this.dynamicSharedService.allForms, field);
          if (show) {
            fieldControl.enable();
          } else {
            fieldControl.disable();
          }
          fieldControl.updateValueAndValidity({emitEvent: false});
        });

        this.panels.forEach((panel, i) => {
          this.validPanelsClass[i] = this.getValidClass(i);
        });

        this.mainFormChange.emit(this.mainForm);
      });
  }

  ngOnDestroy(): void {
    if (this.changeSubscription) {
      this.changeSubscription.unsubscribe();
    }
  }

  getValidClass(index) {
    const currentForm = this.mainForm.controls['panels']['controls'][index];
    return currentForm && currentForm.invalid ? 'fa-times' : 'fa-check';
  }

  submit() {
    this.onSave.emit(this.mainForm);
  }

  isHidden(panel: Panel, index: number) {
    const currentForm: FormGroup = this.mainForm.controls['panels']['controls'][index];
    const hidden = this.dynamicSharedService.expressionCheck(this.mainForm.controls['panels']['controls'], panel.hidden);

    if (!this.readonly) {
      if (hidden && currentForm.enabled) {
        setTimeout(() => {
          currentForm.disable();
        }, 0);
      } else if (!hidden && currentForm.disabled) {
        setTimeout(() => {
          currentForm.enable();
        }, 0);
      }
    }

    return hidden;
  }

  private generatePanelFormGroups(): FormGroup[] {
    return this.panels.map(panel => {
      let controls = {};
      if (panel && panel.hasOwnProperty('defaultExpanded')) {
        if (panel.defaultExpanded) {
          this.activeIds.push(panel.id);
        }
      }
      panel.contents.forEach((fields: Field[]) => {
        fields.forEach((field: Field) => {
          if (field.type === 'table') {
            Object.keys(field.rows[0])
              .filter(k => field.rows[0][k].required)
              .forEach(k => {
                const col = field.cols.find(fieldCol => fieldCol.field === k);
                col.required = true;
              });

            field.rows.forEach(row => {
              Object.keys(row).forEach(fieldId => {
                const rowField = row[fieldId];
                this.createControl(controls, rowField);
              });
            });
          } else if (field.type !== 'label') {
            this.createControl(controls, field);
          }
        });
      });
      const group = this.formBuilder.group(controls);
      if (this.readonly) {
        Object.keys(group.controls).forEach(k => {
          group.controls[k].disable();
        });
        group.disable();
      } else {
        Object.keys(group.controls).forEach(k => {
          let field: Field;
          panel.contents.forEach((fields: Field[]) => {
            field = field || fields.find(f => f.fieldId === k);
          });

          if (field) {
            const fieldControl = group.controls[k];
            const show = this.dynamicSharedService.shouldFieldShow(group, field);
            if (show && fieldControl.disabled) {
              fieldControl.enable();
            } else if (!show && fieldControl.enabled) {
              fieldControl.disable();
            }

            const required = UtilsService.notNull(field.required) ? field.required.toString().trim() : '';
            if (required !== '' && required !== 'false' && required !== 'true') {
              this.dynamicRequiredFields.push(fieldControl);
            }

            if (field.show || field.hidden) {
              this.dynamicShownHiddenFields.push({fieldControl, field});
            }
          }
        });
      }

      return group;
    });
  }


  private createControl(controls, field) {
    if (controls[field.fieldId] && controls[field.fieldId][0] !== '') {
      return;
    }
    controls[field.fieldId] = [field.defaultValue || '', this.buildValidators(field)];
  }

  private buildValidators(field: Field): any[] {
    let validators = [];

    // apply sanitization to each of the fields which are editable
    validators.push(CustomValidators.sanitization(this.patternMap));
    if (field.required === 'true') {
      if (field.type === 'text') {
        validators.push(CustomValidators.requiredWithTrim);
      } else {
        validators.push(Validators.required);
      }
    } else if (field.required !== '' && field.required !== 'false') {
      validators.push((control: FormControl) => {
        const isRequired = this.dynamicSharedService.expressionCheck([], field.required);
        return isRequired && CustomValidators.requiredWithTrim(control);
      });
    }

    if (field.validation) {
      Object.keys(field.validation).forEach(key => {
        const validator = Validators[key] || CustomValidators[key],
          value = field.validation[key];

        if (validator) {
          if (UtilsService.notNull(value) && value !== true && value !== 'true') {
            validators.push(validator(value));
          } else {
            validators.push(validator);
          }
        }


        if (key === 'fieldLengthValidation' && UtilsService.notNull(field.validation[key])) {
          let fieldValidations = JSON.parse(field.validation[key].replace(/'/g, '"'));
          fieldValidations.forEach(parameters => {
            validators.push(this.fieldsLengthCheck(parameters));
          });
        }
        if (key === 'minDate' && field.validation[key]) {
          field.minDate = field.validation[key];
        }
        if (key === 'readonlyAndPrepopulate' && field.validation[key]) {
          validators.push(this.readonlyAndPrepopulate(field));
        }
        if (key === 'startWith') {
          validators.push(CustomValidators.checkStartWith(field.validation[key]));
        }
        if (key === 'areaCodeValidate') {
          validators.push(CustomValidators.validateAreaCode);
        }
      });
    }
    return validators;
  }


  fieldsLengthCheck({min, max, fieldId1, fieldId2}) {
    let fieldLabels = [];
    this.panels.forEach(panel => {
      return panel.contents.forEach(fields => {
        return fields.forEach(field => {
          if ([fieldId1, fieldId2].some(id => id === field.fieldId)) {
            fieldLabels.push(field.label);
          }
        });
      });
    });

    let fieldGroups;


    return (control: FormControl) => {
      if (control.parent) {
        if (!fieldGroups) {
          const groupControls = control.parent.controls;
          fieldGroups = [groupControls[fieldId1], groupControls[fieldId2]];
        }

        const [field1, field2] = fieldGroups;
        let result = '';

        if (field1 && field2) {
          const errorKey = `lengthMismatch${fieldId1}${fieldId2}`;
          let error = {};
          result = `${field1.value}${field2.value}`;

          if (result && (result.length < min || result.length > max)) {
            error[errorKey] = {
              min: min, max: max, fields: fieldLabels
            };
          } else {
            error = null;
          }

          setTimeout(() => {
            const otherField = field1 === control ? field2 : field1,
              hasError = otherField.hasError(errorKey);
            if ((hasError && !error) || (!hasError && error)) {
              otherField.updateValueAndValidity();
            }
          }, 0);

          return error;
        }
      }
    };
  }


  setActiveIds() {
    this.panels.forEach(panel => {
      if (panel && panel.hasOwnProperty('defaultExpanded')) {
        if (panel.defaultExpanded) {
          this.activeIds.push(panel.id);
        }
      }
    });
  }


  readonlyAndPrepopulate(field: Field) {
    return (control: FormControl) => {
      if (!UtilsService.isEmpty(control)) {
        switch (field.fieldId) {
          // Vorname
          case '17':
            this.setValAndDisable(control, 'cName');
            break;
          // Straße
          case '18':
            this.setValAndDisable(control, 'street');
            break;
          // Nr.
          case '19':
            this.setValAndDisable(control, 'houseNumber');
            break;
          // PLZ
          case '20':
            this.setValAndDisable(control, 'postCode');
            break;
          // Ort
          case '21':
            this.setValAndDisable(control, 'city');
            break;
        }
      }
      return null;
    };
  };


  setValAndDisable(control: FormControl, key: string) {
    if (UtilsService.notNull(control)) {
      if (this.location && key && !control.value) {
        control.setValue(this.location[key], {onlySelf: true, emitEvent: false});
      }
      if (!control.disabled) {
        control.disable({onlySelf: true, emitEvent: false});
      }
    }
  }
}
