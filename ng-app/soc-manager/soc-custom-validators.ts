/**
 * Created by srao0004 on 6/14/2017.
 */
import {AbstractControl} from '@angular/forms';
export const SocCustomValidator = (control: AbstractControl): {[key: string]: boolean} => {
  if (control.value && control.value.trim() === '') {
    return {required: true};
  }
  return null;
};

