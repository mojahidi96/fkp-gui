import {Component, Injector, forwardRef, Input} from '@angular/core';
import {ControlAbstractComponent} from '../common/control-abstract.component';
import {NG_VALUE_ACCESSOR} from '@angular/forms';

/**
 * It inherits all properties from {@link ControlAbstractComponent}.
 *
 * Component to group {@link SncrCheckboxComponent} and {@link RadioComponent}.
 * This component is specially useful for validations over checkbox groups with the following directives:
 * - {@link AllRequiredDirective}
 * - {@link MaxRequiredDirective}
 * - {@link MinRequiredDirective}
 *
 * ### Example
 * ``` html
 * <sncr-check-group name="radio-group" [(ngModel)]="radioGroup">
 *   <legend>Radio group</legend>
 *   <sncr-radio value="1">1</sncr-radio>
 *   <sncr-radio value="2">2</sncr-radio>
 *   <sncr-radio value="3">3</sncr-radio>
 * </sncr-check-group>
 *
 * <sncr-check-group allRequired [(ngModel)]="checkboxGroup" name="checkbox-group">
 *   <legend>Checkbox group</legend>
 *   <sncr-checkbox [(ngModel)]="check2" name="check2">
 *     Checkbox 2.1
 *   </sncr-checkbox>
 *   <sncr-checkbox [(ngModel)]="check3" name="check3">
 *     Checkbox 2.2
 *   </sncr-checkbox>
 *   <sncr-checkbox [(ngModel)]="check4" name="check4">
 *     Checkbox 2.3
 *   </sncr-checkbox>
 * </sncr-check-group>
 * ```
 */
@Component({
  selector: 'sncr-check-group',
  templateUrl: 'check-group.component.html',
  styleUrls: ['../common/control-abstract.component.scss', 'check-group.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CheckGroupComponent),
      multi: true
    }
  ]
})
export class CheckGroupComponent extends ControlAbstractComponent {

  /**
   * Whether the elements in the group should be shown inline or not.
   */
  @Input() inline = false;

  /**
   * @internal
   */
  constructor(injector: Injector) {
    super(injector);
  }

  /**
   * @internal
   */
  updateModel(name: string, value: any) {
    let model = this.model ? JSON.parse(JSON.stringify(this.model)) : {};
    if (value) {
      model[name] = value;
    } else {
      delete model[name];
    }
    this.model = Object.keys(model).length ? model : null;
  }
}
