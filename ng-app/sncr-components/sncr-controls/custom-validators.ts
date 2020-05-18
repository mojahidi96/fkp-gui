import {FormControl, ValidationErrors, FormGroup} from '@angular/forms';
import {UtilsService} from '../sncr-commons/utils.service';

export class CustomValidators {

  static requiredWithTrim(control: FormControl): ValidationErrors | null {
    const isRequired = !UtilsService.notNull(control.value) || (control.value || '').trim().length === 0;
    return isRequired ? {'required': true} : null;
  }

  static email(control: FormControl): ValidationErrors | null {
    const EMAIL_REGEXP =
      /^(?=.{1,254}$)(?=.{1,64}@)[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+(\.[-!#$%&'*+/0-9=?A-Z^_`a-z{|}~]+)*@[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?(\.[A-Za-z0-9]([A-Za-z0-9-]{0,61}[A-Za-z0-9])?)*$/; // tslint:disable-line:max-line-length
    return control.value && control.value.trim() !== '' && !EMAIL_REGEXP.test(control.value) ? {'email': true} : null;
  }

  static onlyNumbers(control: FormControl): ValidationErrors | null {
    const NUMBER_REGEXP = /^\d+$/;
    return control.value && !NUMBER_REGEXP.test(control.value) ? {'onlyNumbers': true} : null;
  }

  static onlyCharacters(control: FormControl): ValidationErrors | null {
    const CHARACTERS_REGEX = /^[äéöüÄÉÖÜßa-zA-Z\s]+$/;
    return control.value !== '' && !CHARACTERS_REGEX.test(control.value) ? {'onlyCharacters': true} : null;
  }

  static onlyCharactersAndNumbers(control: FormControl): ValidationErrors | null {
    const CHARACTERS_NUM_REGEX = /^[äéöüÄÖÜß\w]+$/;
    return control.value !== '' && !CHARACTERS_NUM_REGEX.test(control.value) ? {'onlyCharactersAndNumbers': true} : null;
  }

  static onlyNumbersWithLimit(control: FormControl): ValidationErrors | null {
     const NUMBER_REGEX = /^[0-9]{14}$/;
     return (control.value && !NUMBER_REGEX.test(control.value)) ? {'onlyNumbersWithLimit': true} : null;
  }

  static phone(control: FormControl): ValidationErrors | null {
    const PHONE_REGEX = /^\d{10}$/;
    return control.value !== '' && !PHONE_REGEX.test(control.value) ? {'phone': true} : null;
  }

  static sanitization = (patternMap: any) => {
    let pattern;
    let sqlKeyWords;
    if (UtilsService.notNull(patternMap)) {
      pattern = patternMap['pattern'] ? new RegExp(patternMap['pattern']) : null;
      sqlKeyWords = patternMap['sqlKeyWords'] ? patternMap['sqlKeyWords'].split(',') : null;
    }
    return (control: FormControl): ValidationErrors | null => {
      if (control.value && UtilsService.notNull(pattern) && sqlKeyWords.length) {
        if (!pattern.test(control.value) || sqlKeyWords.some(keyWord => typeof control.value === 'string'
          && control.value.trim().toUpperCase().startsWith(keyWord))) {
          return {'sanitizationError': true};
        }
        return null;
      }
      return null;
    };
  }

  static validInternalCustId(control: FormControl): ValidationErrors | null {
    const TAB_REGEX = /\t/;
    const NEXTLINE_REGEX = /\n/;
    const RET_CARRIAGE_REGEX = /\r/;

    return (TAB_REGEX.test(control.value) || NEXTLINE_REGEX.test(control.value) || RET_CARRIAGE_REGEX.test(control.value)) ?
      {'invalidInternalCustId': true} : null;
  }

  static validateHouseNumber(control: FormControl): ValidationErrors | null {
    const HOUSE_NO_REGEX = /^[a-zA-Z0-9-]+$/;
    return (control.value && !HOUSE_NO_REGEX.test(control.value) ? {'invalidHouseNumber': true} : null);
  }

  static bankAccOwnershipValidate = () => {
    const PATTERN = new RegExp(`-qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM1234567890
    \u00C4\u00E4\u00D6\u00F6\u00DC\u00FC\u00DF\u00E8\u00C9\u002D`);
    return (control: FormControl): ValidationErrors | null => {
      return control.value !== '' && !PATTERN.test(control.value) ? {'invalidBkAccOwnership': true} : null;
    };
  }

  static validateCity(control: FormControl): ValidationErrors | null {
    let validChars = '-qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM\u00C4\u00E4\u00D6\u00F6\u00DC\u00FC\u00DF\u00E8\u00C9 ';
    let inputCharArr = control.value ? control.value.split('') : [];
    if (inputCharArr.length && inputCharArr.every(curChar => validChars.includes(curChar))) {
      return null;
    }
    return {'invalidCity': true};
  }

  static checkStartWith = (startWith: any) => {
    if (UtilsService.notNull(startWith)) {
      return (control: FormControl): ValidationErrors | null => {
        if (control.value && !(control.value.trim().startsWith(startWith))) {
          return {'invalidStart': {'requiredStart': startWith}}
        }
        return null;
      }
    }
  };

  static validateAreaCode(control: FormControl): ValidationErrors | null {
    let AREA_CODE_REGEX = /^0[0-9]{2,5}$/;
    return (control.value && !AREA_CODE_REGEX.test(control.value) ? {'invalidAreaCode': true} : null);
  }

  static validateActivationSubs(subsCount: any): ValidationErrors | null {
    let SUBS_NO_REGEX =  /^([1-9]|[1-9][0-9]|[1][0-9][0-9]|20[0-0])$/;
    return (!SUBS_NO_REGEX.test(subsCount) ? {'invalidSubsNo': true} : null);
  }

  static isDuplicateExists = (form: FormGroup, fields: string [])  => {
    return (control: FormControl): ValidationErrors | null => {
      if (control.value && control.dirty) {  
        let count = 0;
        for ( let i in fields) {
          if (form.get(fields[i]).value === control.value) {
            if (++count > 1) {
              return {'duplicateSerialNo': true};
            }
          }
        }
      }
      return null;
    };
  };
}
