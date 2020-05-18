import { ContentChildren, QueryList, Directive } from '@angular/core';
import {Validator, AbstractControl, Validators} from '@angular/forms';
import {SncrCheckboxComponent} from './sncr-checkbox.component';

/**
 * Abstract class to be extended by checkbox required directives
 */
@Directive()
export abstract class AbstractRequiredDirective implements Validator {
  /**
   * @internal
   */
  @ContentChildren(SncrCheckboxComponent) sncrCheckboxes: QueryList<SncrCheckboxComponent>;

  /**
   * @internal
   */
  abstract validationName: string;

  /**
   * @internal
   */
  abstract requiredCheck(checkedLength: number): boolean;

  /**
   * @internal
   */
  validate(c: AbstractControl): {[key: string]: any} {
    if (this.sncrCheckboxes.length) {
      const checked = this.sncrCheckboxes.filter(checkbox => {
        return Validators.requiredTrue(checkbox.ngControl.control) === null;
      });

      if (this.requiredCheck(checked.length)) {
        const err = {};
        err[this.validationName] = {
          actualLength: checked.length,
          requiredLength: this[this.validationName]
        };
        return err;
      }
    }

    return null;
  }
}