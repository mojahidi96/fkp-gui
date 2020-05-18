import {Directive, forwardRef} from '@angular/core';
import {NG_VALIDATORS, Validator} from '@angular/forms';
import {AbstractRequiredDirective} from './abstract-required.directive';

/**
 * Directive to be used with {@link CheckGroupComponent} and {@link SncrCheckboxComponent}.
 *
 * This validation will make all the checkboxes inside the group to be required.
 */
@Directive({
  selector: '[allRequired]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => AllRequiredDirective),
      multi: true
    }
  ]
})
export class AllRequiredDirective extends AbstractRequiredDirective implements Validator {
  /**
   * @internal
   */
  validationName = 'allRequired';

  /**
   * @internal
   */
  requiredCheck(checkedLength: number): boolean {
    return checkedLength !== this.sncrCheckboxes.length;
  }
}