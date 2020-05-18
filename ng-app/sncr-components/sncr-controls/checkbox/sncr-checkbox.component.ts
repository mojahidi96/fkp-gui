import {Component, Injector, forwardRef, Optional, Host, Input} from '@angular/core';
import {ControlAbstractComponent} from '../common/control-abstract.component';
import {NG_VALUE_ACCESSOR, AbstractControl, Validators, NG_VALIDATORS, Validator} from '@angular/forms';
import {CheckGroupComponent} from '../check-group/check-group.component';

/**
 * Component to create checkbox controls.
 * It inherits all the properties from {@link ControlAbstractComponent}
 *
 * If the component is declared inside {@link CheckGroupComponent}, the model will be bind to the group model too,
 * taking the name of the checkbox as a property:
 * ### Example
 * ``` html
 * <sncr-check-group [(ngModel)]="group">
 *   <sncr-checkbox name="check1" checked></sncr-checkbox>
 *   <sncr-checkbox name="check2" checked></sncr-checkbox>
 * </sncr-check-group>
 *
 * The group object would be:
 * {
 *   check1: true,
 *   check2: true
 * }
 * ```
 */
@Component({
  selector: 'sncr-checkbox',
  templateUrl: 'sncr-checkbox.component.html',
  styleUrls: ['sncr-checkbox.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => SncrCheckboxComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => SncrCheckboxComponent),
      multi: true
    }
  ]
})
export class SncrCheckboxComponent extends ControlAbstractComponent implements Validator {

  /**
   * Whether the checkbox is checked or not.
   */
  @Input() checked: boolean;

  /**
   * @internal
   */
  get inline() {
    return this.checkGroup && this.checkGroup.inline;
  }

  /**
   * @internal
   */
  constructor(injector: Injector, @Optional() @Host() private checkGroup: CheckGroupComponent) {
    super(injector);
  }

  /**
   * @internal
   */
  onChange(): void {
    if (this.checkGroup) {
      this.checkGroup.updateModel(this.name, this.ngControl.value);
    }
  }

  /**
   * @internal
   */
  validate(c: AbstractControl): {[key: string]: any} {
    if (Object.keys(c).length) {
      return this.required ? Validators.requiredTrue(c) : null;
    }
  }
}
