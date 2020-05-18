import {Directive, forwardRef, Input} from '@angular/core';
import {NG_VALIDATORS, Validator} from '@angular/forms';
import {AbstractRequiredDirective} from './abstract-required.directive';

/**
 * Directive to be used with {@link CheckGroupComponent} and {@link SncrCheckboxComponent}.
 *
 * This validation will validate a maximum of checkboxes to be selected.
 */
@Directive({
  selector: '[maxRequired]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => MaxRequiredDirective),
      multi: true
    }
  ]
})
export class MaxRequiredDirective extends AbstractRequiredDirective implements Validator {
  /**
   * Maximum number of checkboxes that can be selected.
   */
  @Input() maxRequired: number;

  /**
   * @internal
   */
  validationName = 'maxRequired';

  /**
   * @internal
   */
  requiredCheck(checkedLength: number): boolean {
    return checkedLength > this.maxRequired;
  }
}