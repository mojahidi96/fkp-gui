import {Directive, forwardRef, Input} from '@angular/core';
import {NG_VALIDATORS, Validator} from '@angular/forms';
import {AbstractRequiredDirective} from './abstract-required.directive';

/**
 * Directive to be used with {@link CheckGroupComponent} and {@link SncrCheckboxComponent}.
 *
 * This validation will validate a minimum of checkboxes to be selected.
 */
@Directive({
  selector: '[minRequired]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => MinRequiredDirective),
      multi: true
    }
  ]
})
export class MinRequiredDirective extends AbstractRequiredDirective implements Validator {
  /**
   * Minimum number of checkboxes that can be selected.
   */
  @Input() minRequired: number;

  /**
   * @internal
   */
  validationName = 'minRequired';

  /**
   * @internal
   */
  requiredCheck(checkedLength: number): boolean {
    return checkedLength < this.minRequired;
  }
}