/**
 * Created by srao0004 on 7/10/2017.
 */
import {AbstractControl} from '@angular/forms';
import {UtilsService} from '../../sncr-components/sncr-commons/utils.service';
export const sanitizationValidation = (control: AbstractControl): {[key: string]: boolean} => {
  let value = control['value'];
  if (value !== '' && UtilsService.notNull(value)) {
    const pattern = /^[äöüÄÖÜßa-zA-Z0-9 . /\- ! # & '() + , : _]*$/;
    if (value.match(pattern)) {
      return null;
    } else {
      return {'SOC_SANITIZE-ERROR-INVALID_CHARACTER': true};
    }
  }
};